import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/auth-provider';
import {
  fetchUserConversations,
  fetchConversationMessages,
  sendMessage as sendChatMessage,
  uploadChatAttachment,
  deleteChatMessage,
  deleteChatMessageForMe,
  deleteChatMessageForEveryone,
  EnrichedConversation,
  getOrCreateDirectConversation,
  createGroupConversation,
} from '../lib/chat-service';
import type { ChatMessage, Profile } from '../lib/database.types';
import type { AttachmentOptionType } from '../components/chat/chat-input';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system/legacy';
import { useToast } from '../components/ui/toast';

export function useChat() {
  const { user, profile } = useAuth();
  const toast = useToast();

  const [conversations, setConversations] = useState<EnrichedConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const [uploadingFileSize, setUploadingFileSize] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState<{
    id: string;
    senderName?: string;
    content?: string;
  } | null>(null);

  const activeConvoIdRef = useRef<string | null>(null);
  activeConvoIdRef.current = activeConversationId;

  // Active conversation object
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  // 1. Load user conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConversations(true);
    const convos = await fetchUserConversations(user.id);
    setConversations(convos);
    setLoadingConversations(false);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // 2. Load messages when active conversation changes
  const loadMessages = useCallback(
    async (convoId: string) => {
      if (!user) return;
      setLoadingMessages(true);
      const msgs = await fetchConversationMessages(convoId, user.id);
      setMessages(msgs);
      setLoadingMessages(false);
    },
    [user]
  );

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, loadMessages]);

  // 3. Realtime subscription for incoming messages to current user
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`chat_messages_user:${user.id}`)
      .on<ChatMessage>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `owner_user_id=eq.${user.id}`,
        },
        (payload) => {
          const newMsg = payload.new;
          if (newMsg.conversation_id === activeConvoIdRef.current) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
          loadConversations();
        }
      )
      .on<ChatMessage>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `owner_user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedMsg = payload.new;
          if (updatedMsg.conversation_id === activeConvoIdRef.current) {
            setMessages((prev) =>
              prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadConversations]);

  // 3a. Typing indicator state & Realtime channel
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingChannelRef = useRef<any>(null);

  useEffect(() => {
    if (!activeConversationId || !user) {
      setIsOtherTyping(false);
      return;
    }

    const channel = supabase.channel(`conversation_typing:${activeConversationId}`);
    typingChannelRef.current = channel;

    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { senderId, isTyping } = payload.payload || {};
        if (senderId && senderId !== user.id) {
          if (isTyping) {
            setIsOtherTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setIsOtherTyping(false);
            }, 3000);
          } else {
            setIsOtherTyping(false);
          }
        }
      })
      .subscribe();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
      typingChannelRef.current = null;
      setIsOtherTyping(false);
    };
  }, [activeConversationId, user]);

  const sendTypingStatus = (typing: boolean) => {
    if (!typingChannelRef.current || !user || !activeConversationId) return;
    typingChannelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { senderId: user.id, isTyping: typing },
    });
  };

  // 3b. User presence (online & last_seen) heartbeat
  useEffect(() => {
    if (!user) return;

    const setPresence = async (online: boolean) => {
      try {
        await supabase
          .from('profiles')
          .update({
            online,
            last_seen: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Presence update error:', err);
      }
    };

    setPresence(true);
    const interval = setInterval(() => {
      setPresence(true);
    }, 45000); // 45s heartbeat

    return () => {
      clearInterval(interval);
      setPresence(false);
    };
  }, [user]);

  // 3c. Realtime listener on profiles table to update contact online status live
  useEffect(() => {
    if (!user) return;

    const profileChannel = supabase
      .channel('public_profiles_presence')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          const updated = payload.new as Profile;
          if (updated) {
            setConversations((prev) =>
              prev.map((c) => {
                if (c.otherMember?.id === updated.id) {
                  return {
                    ...c,
                    otherMember: {
                      ...c.otherMember,
                      online: updated.online ?? false,
                      last_seen: updated.last_seen || c.otherMember.last_seen,
                    },

                  };
                }
                return c;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [user]);

  // 4. Send text message
  const handleSendMessage = async () => {
    if (!user || !activeConversationId || !inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText('');
    const reply = replyMessage;
    setReplyMessage(null);
    setIsSending(true);

    try {
      await sendChatMessage({
        conversationId: activeConversationId,
        senderId: user.id,
        messageText: text,
        messageType: 'text',
        replyToMessageId: reply?.id,
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Message failed to send');
    } finally {
      setIsSending(false);
    }
  };

  // 5. Handle all attachment options (images, videos, documents, location, converters, scanner)
  const handleSelectAttachmentType = async (type: AttachmentOptionType) => {
    if (!user || !activeConversationId) {
      toast.info('Select a conversation first');
      return;
    }

    try {
      if (type === 'images' || type === 'image-converter') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.7,
          base64: true,
          allowsEditing: false,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          const fileName = asset.fileName || `photo_${Date.now()}.jpg`;
          const mimeType = asset.mimeType || 'image/jpeg';

          setUploadingFileName(fileName);
          setUploadingFileSize(asset.fileSize || null);
          setIsSending(true);
          const publicUrl = await uploadChatAttachment(asset.uri, fileName, mimeType, asset.base64 || undefined);
          const finalUrl = publicUrl || (asset.base64 ? `data:${mimeType};base64,${asset.base64}` : asset.uri);

          await sendChatMessage({
            conversationId: activeConversationId,
            senderId: user.id,
            messageText: fileName,
            messageType: 'image',
            fileUrl: finalUrl,
            fileName,
            fileSize: asset.fileSize,
            mimeType,
          });
          setIsSending(false);
          setUploadingFileName(null);
          setUploadingFileSize(null);
        }
      } else if (type === 'videos') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['videos'],
          quality: 0.8,
          allowsEditing: false,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          const fileName = asset.fileName || `video_${Date.now()}.mp4`;
          const mimeType = asset.mimeType || 'video/mp4';

          setUploadingFileName(fileName);
          setUploadingFileSize(asset.fileSize || null);
          setIsSending(true);
          const publicUrl = await uploadChatAttachment(asset.uri, fileName, mimeType);
          const finalUrl = publicUrl || asset.uri;

          await sendChatMessage({
            conversationId: activeConversationId,
            senderId: user.id,
            messageText: fileName,
            messageType: 'video',
            fileUrl: finalUrl,
            fileName,
            fileSize: asset.fileSize,
            mimeType,
          });
          setIsSending(false);
          setUploadingFileName(null);
          setUploadingFileSize(null);
        }
      } else if (
        type === 'documents' ||
        type === 'doc-scanner' ||
        type === 'scan-document' ||
        type === 'extract-text' ||
        type === 'doc-converter'
      ) {
        const result = await DocumentPicker.getDocumentAsync({
          type: '*/*',
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          const fileName = asset.name || 'Document.pdf';
          const mimeType = asset.mimeType || 'application/pdf';

          setUploadingFileName(fileName);
          setUploadingFileSize(asset.size || null);
          setIsSending(true);
          let base64Data: string | undefined = undefined;
          let readableUri = asset.uri;

          if (Platform.OS !== 'web' && asset.uri) {
            try {
              // On Android, DocumentPicker cache path may not be readable directly.
              // Copy the file to the app's own cache directory first.
              const ext = fileName.split('.').pop() || 'dat';
              const destPath = `${FileSystem.cacheDirectory}docpick_${Date.now()}.${ext}`;
              await FileSystem.copyAsync({ from: asset.uri, to: destPath });
              readableUri = destPath;
            } catch (copyErr) {
              console.warn('File copy notice (will try original URI):', copyErr);
              readableUri = asset.uri;
            }

            try {
              base64Data = await FileSystem.readAsStringAsync(readableUri, {
                encoding: FileSystem.EncodingType.Base64,
              });
            } catch (readErr) {
              console.warn('Document base64 read notice:', readErr);
            }
          }

          const publicUrl = await uploadChatAttachment(readableUri, fileName, mimeType, base64Data);

          // publicUrl could be:
          // 1. A Supabase HTTPS URL (best case - viewable in WebView)
          // 2. A data: URI (fallback when Supabase fails but we have base64)
          // 3. null (total failure)
          if (!publicUrl) {
            toast.error('Could not upload file. Check your Supabase storage bucket and policies.');
            setIsSending(false);
            setUploadingFileName(null);
            setUploadingFileSize(null);
            return;
          }
          const finalUrl = publicUrl;

          await sendChatMessage({
            conversationId: activeConversationId,
            senderId: user.id,
            messageText: fileName,
            messageType: type === 'extract-text' ? 'document' : 'file',
            fileUrl: finalUrl,
            fileName,
            fileSize: asset.size,
            mimeType,
          });
          setIsSending(false);
          setUploadingFileName(null);
          setUploadingFileSize(null);
        }
      } else if (type === 'location') {
        setIsSending(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          toast.info('Location permission is required to share location');
          setIsSending(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const latitude = loc.coords.latitude;
        const longitude = loc.coords.longitude;

        let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        try {
          const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (reverse && reverse.length > 0) {
            const r = reverse[0];
            const parts = [r.name, r.street, r.city, r.region, r.country].filter(Boolean);
            if (parts.length > 0) {
              address = parts.join(', ');
            }
          }
        } catch (geoErr) {
          console.log('Reverse geocode error:', geoErr);
        }

        const locationPayload = JSON.stringify({
          latitude,
          longitude,
          address,
          title: 'Shared Location',
        });

        await sendChatMessage({
          conversationId: activeConversationId,
          senderId: user.id,
          messageText: `📍 Location: ${address}`,
          messageType: 'location',
          fileUrl: locationPayload,
          fileName: 'location.json',
        });

        setIsSending(false);
      }
    } catch (err) {
      console.error('Attachment upload failed:', err);
      toast.error('Failed to process attachment');
      setIsSending(false);
      setUploadingFileName(null);
      setUploadingFileSize(null);
    }
  };

  const handleCameraClick = async () => {
    if (!user || !activeConversationId) return;

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        toast.info('Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = `camera_${Date.now()}.jpg`;
        setUploadingFileName(fileName);
        setIsSending(true);
        const publicUrl = await uploadChatAttachment(asset.uri, fileName, 'image/jpeg', asset.base64 || undefined);
        const finalUrl = publicUrl || (asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri);
        await sendChatMessage({
          conversationId: activeConversationId,
          senderId: user.id,
          messageText: fileName,
          messageType: 'image',
          fileUrl: finalUrl,
          fileName,
          mimeType: 'image/jpeg',
        });
        setIsSending(false);
        setUploadingFileName(null);
      }
    } catch (e) {
      console.error('Camera error:', e);
      setIsSending(false);
      setUploadingFileName(null);
      setUploadingFileSize(null);
    }
  };

  // Delete message: "Delete for me" vs "Delete for everyone"
  const handleDeleteMessage = async (
    messageId: string,
    mode: 'me' | 'everyone' = 'everyone'
  ) => {
    if (!user) return;
    // Optimistic removal from current user's screen
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    let ok = false;
    if (mode === 'me') {
      ok = await deleteChatMessageForMe(messageId, user.id);
    } else {
      ok = await deleteChatMessageForEveryone(messageId, user.id);
    }
    if (ok) {
      toast.success(mode === 'me' ? 'Deleted for you' : 'Deleted for everyone');
      loadConversations();
    } else {
      toast.error('Failed to delete message');
      if (activeConversationId) loadMessages(activeConversationId);
    }
  };

  // Send voice note/recording
  const sendVoiceMessage = async (uri: string, durationSeconds?: number) => {
    if (!user || !activeConversationId) return;
    setIsSending(true);
    const fileName = `voice_${Date.now()}.m4a`;
    setUploadingFileName(fileName);
    try {
      let base64Data: string | undefined = undefined;
      let readableUri = uri;
      if (Platform.OS !== 'web' && uri) {
        try {
          if (!uri.startsWith('file://') && !uri.startsWith('content://') && !uri.startsWith('data:')) {
            readableUri = `file://${uri}`;
          }
          base64Data = await FileSystem.readAsStringAsync(readableUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } catch (readErr) {
          console.warn('Voice base64 read notice:', readErr);
        }
      }

      const publicUrl = await uploadChatAttachment(readableUri, fileName, 'audio/m4a', base64Data);
      const finalUrl = publicUrl || (base64Data ? `data:audio/m4a;base64,${base64Data}` : readableUri);

      await sendChatMessage({
        conversationId: activeConversationId,
        senderId: user.id,
        messageText: durationSeconds ? `Voice note (${Math.round(durationSeconds)}s)` : 'Voice note',
        messageType: 'audio',
        fileUrl: finalUrl,
        fileName,
        mimeType: 'audio/m4a',
        duration: durationSeconds,
      });
      toast.success('Voice message sent');
    } catch (e) {
      console.error('Voice send error:', e);
      toast.error('Failed to send voice message');
    } finally {
      setIsSending(false);
      setUploadingFileName(null);
      setUploadingFileSize(null);
    }
  };

  // Forward message to any conversation
  const handleForwardMessage = async (
    targetConversationId: string,
    messageToForward: ChatMessage
  ) => {
    if (!user) return;
    setIsSending(true);
    try {
      await sendChatMessage({
        conversationId: targetConversationId,
        senderId: user.id,
        messageText: messageToForward.message || undefined,
        messageType: messageToForward.message_type as any,
        fileUrl: messageToForward.file_url || undefined,
        fileName: messageToForward.file_name || undefined,
        fileSize: messageToForward.file_size || undefined,
        mimeType: messageToForward.mime_type || undefined,
      });
      toast.success('Message forwarded');
      loadConversations();
    } catch (err) {
      console.error('Forward failed:', err);
      toast.error('Failed to forward message');
    } finally {
      setIsSending(false);
    }
  };

  // Start new direct conversation with a profile
  const startDirectChat = async (targetUserId: string) => {
    if (!user) return;
    const convoId = await getOrCreateDirectConversation(user.id, targetUserId);
    if (convoId) {
      await loadConversations();
      setActiveConversationId(convoId);
    }
  };

  // Start new group conversation
  const startGroupChat = async (groupName: string, memberUserIds: string[]) => {
    if (!user) return;
    const convoId = await createGroupConversation(user.id, groupName, memberUserIds);
    if (convoId) {
      await loadConversations();
      setActiveConversationId(convoId);
    }
  };

  return {
    user,
    profile,
    conversations,
    activeConversationId,
    activeConversation,
    setActiveConversationId,
    messages,
    loadingConversations,
    loadingMessages,
    inputText,
    setInputText,
    isSending,
    uploadingFileName,
    uploadingFileSize,
    replyMessage,
    setReplyMessage,
    handleSendMessage,
    handleSelectAttachmentType,
    handleCameraClick,
    handleDeleteMessage,
    handleForwardMessage,
    startDirectChat,
    startGroupChat,
    loadConversations,
    isOtherTyping,
    sendTypingStatus,
    sendVoiceMessage,
  };
}
