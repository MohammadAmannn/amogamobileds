import React, { useState, useEffect, useRef } from 'react'
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Animated,
  PanResponder,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image as ExpoImage } from 'expo-image'
import {
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Eye,
  Download,
  X,
  Share2,
  ExternalLink,
  Play,
  Pause,
  Mic,
  CornerUpLeft,
} from 'lucide-react-native'
import { useTheme } from '../../providers/theme-provider'
import { ChatLocationCard } from './chat-location-card'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { WebView } from 'react-native-webview'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useAudioPlayer } from 'expo-audio'

/** Standalone component so useVideoPlayer hook is called at component level (not inside .map()) */
function VideoAttachmentPlayer({ att }: { att: ChatAttachmentItem }) {
  const player = useVideoPlayer(att.url ?? null, (p) => {
    p.loop = false;
  });

  if (Platform.OS === 'web') {
    // expo-video's VideoView doesn't render on web — use a native video element
    return (
      <View style={videoStyles.videoCard}>
        {/* @ts-ignore - video is a web-only element */}
        <video
          controls
          src={att.url}
          style={{ width: 280, height: 200, borderRadius: 14, display: 'block', objectFit: 'contain', background: '#000' }}
        />
      </View>
    );
  }

  return (
    <View style={videoStyles.videoCard}>
      <VideoView
        style={videoStyles.videoPlayer}
        player={player}
        nativeControls
        allowsFullscreen
      />
    </View>
  );
}

const videoStyles = StyleSheet.create({
  videoCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 4,
    maxWidth: 300,
    backgroundColor: '#000000',
  },
  videoPlayer: {
    width: 280,
    height: 200,
    borderRadius: 14,
  },
});

const VOICE_WAVE_BARS = [
  8, 14, 22, 10, 16, 26, 18, 12, 6, 14,
  24, 28, 18, 10, 14, 20, 26, 16, 12, 8,
  16, 22, 18, 12, 10, 16, 22, 14, 8, 5,
];

function VoiceNoteBubblePlayer({
  att,
  content,
  isOwn,
}: {
  att: ChatAttachmentItem;
  content?: string;
  isOwn?: boolean;
}) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const audioUri =
    att.url ||
    (content &&
    (content.startsWith('http') ||
      content.startsWith('file:') ||
      content.startsWith('content:') ||
      content.startsWith('data:'))
      ? content
      : undefined);

  const player = useAudioPlayer(audioUri ? { uri: audioUri } : null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (player?.isLoaded) {
        const cur = player.currentTime || 0;
        const dur = player.duration || 0;
        setPosition(cur);
        if (dur > 0) setDuration(dur);

        if (cur >= dur && dur > 0) {
          player.seekTo(0);
          player.pause();
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [player]);

  if (!audioUri) return null;

  const isPlaying = player?.playing || false;
  const effectiveDuration = duration > 0 ? duration : (att.size ? Math.round(att.size / 16000) : 0);
  const progress = effectiveDuration > 0 ? Math.min(1, Math.max(0, position / effectiveDuration)) : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggle = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = (index: number) => {
    if (!player || !effectiveDuration) return;
    const target = (index / VOICE_WAVE_BARS.length) * effectiveDuration;
    player.seekTo(target);
    setPosition(target);
  };

  const accentColor = isOwn ? '#4f46e5' : (isDark ? '#38bdf8' : '#2563eb');
  const inactiveBarColor = isDark ? '#3f3f46' : '#cbd5e1';

  return (
    <View
      style={[
        voiceStyles.container,
        {
          backgroundColor: isDark ? '#1e293b' : '#f8fafc',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        },
      ]}
    >
      {/* Play / Pause Circular Button */}
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.8}
        style={[
          voiceStyles.playBtn,
          { backgroundColor: accentColor },
        ]}
      >
        {isPlaying ? (
          <View style={{ width: 12, height: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: 3.5, height: 12, backgroundColor: '#ffffff', borderRadius: 1 }} />
            <View style={{ width: 3.5, height: 12, backgroundColor: '#ffffff', borderRadius: 1 }} />
          </View>
        ) : (
          <Play size={13} color="#ffffff" fill="#ffffff" style={{ marginLeft: 2 }} />
        )}
      </TouchableOpacity>

      {/* Waveform and Duration Column */}
      <View style={voiceStyles.waveColumn}>
        <View style={voiceStyles.waveRow}>
          {VOICE_WAVE_BARS.map((h, i) => {
            const barFraction = i / VOICE_WAVE_BARS.length;
            const isFilled = barFraction <= progress;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleSeek(i)}
                hitSlop={4}
                style={voiceStyles.barTouch}
              >
                <View
                  style={[
                    voiceStyles.bar,
                    {
                      height: h,
                      backgroundColor: isFilled ? accentColor : inactiveBarColor,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Time and Mic indicator */}
        <View style={voiceStyles.bottomMeta}>
          <Text
            style={[
              voiceStyles.timeText,
              { color: isDark ? '#94a3b8' : '#64748b' },
            ]}
          >
            {isPlaying || position > 0 ? formatTime(position) : formatTime(effectiveDuration || 0)}
          </Text>
          <Text
            style={[
              voiceStyles.badgeText,
              { color: isDark ? '#64748b' : '#94a3b8' },
            ]}
          >
            Voice message
          </Text>
        </View>
      </View>
    </View>
  );
}

const voiceStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 4,
    width: 240,
    maxWidth: '100%',
    gap: 10,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  waveColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    justifyContent: 'space-between',
  },
  barTouch: {
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  bottomMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
});


export type ChatMessageStatus =
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'

export interface ChatAttachmentItem {
  id?: string
  name: string
  url?: string
  size?: number
  type?: 'image' | 'file' | 'audio' | 'video' | 'pdf' | string
  mimeType?: string
  statusText?: string
}

export interface ChatLocationItem {
  latitude: number
  longitude: number
  address?: string
  title?: string;
}

export interface ChatBubbleProps {
  id?: string
  content?: string
  isOwn?: boolean
  senderName?: string
  senderAvatar?: string
  time?: string | Date
  status?: ChatMessageStatus
  attachments?: ChatAttachmentItem[]
  location?: ChatLocationItem
  reactions?: Array<{ emoji: string; count: number }>
  replyTo?: {
    senderName?: string
    content?: string
    id?: string
  }
  isHighlighted?: boolean
  isSelected?: boolean
  onPress?: () => void
  onReply?: () => void
  onAttachmentPreview?: (attachment: ChatAttachmentItem) => void
  onAttachmentClick?: (attachment: ChatAttachmentItem) => void
  onLocationClick?: (location: ChatLocationItem) => void
  style?: any
}

export function ChatBubble({
  id,
  content,
  isOwn = false,
  senderName = 'Mohammed Aman',
  senderAvatar,
  time,
  status,
  attachments = [],
  location,
  reactions = [],
  replyTo,
  isHighlighted = false,
  isSelected = false,
  onPress,
  onReply,
  onAttachmentPreview,
  onAttachmentClick,
  onLocationClick,
  style,
}: ChatBubbleProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const translateX = useRef(new Animated.Value(0)).current

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dy) < 12
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx * 0.5, 55))
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 40 && onReply) {
          onReply()
        }
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }).start()
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      },
    })
  ).current

  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null)
  const [previewImageName, setPreviewImageName] = useState<string>('Image Preview')

  const [previewDoc, setPreviewDoc] = useState<{
    url: string
    name: string
    type?: string
  } | null>(null)
  const [docLoadError, setDocLoadError] = useState(false)

  const formattedTime =
    time instanceof Date
      ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : time

  const renderStatusIcon = () => {
    if (!status) return null
    switch (status) {
      case 'sending':
        return <Clock size={12} color={colors.mutedForeground} />
      case 'sent':
        return <Check size={12} color={colors.mutedForeground} />
      case 'delivered':
        return <CheckCheck size={13} color={colors.mutedForeground} />
      case 'read':
        return <CheckCheck size={13} color={isDark ? '#38bdf8' : '#0284c7'} strokeWidth={2.4} />
      case 'failed':
        return <AlertCircle size={12} color="#ef4444" />
      default:
        return null
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const initials =
    senderName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MA'

  const isDocumentAttachment = (att: ChatAttachmentItem) => {
    if (att.type === 'file' || att.type === 'document' || att.type === 'pdf') return true
    if (att.mimeType && (att.mimeType.startsWith('application/') || att.mimeType.startsWith('text/'))) return true
    if (att.name && /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|tar|gz|json|xml|rtf)$/i.test(att.name)) return true
    if (att.url && /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|tar|gz|json|xml|rtf)(\?.*)?$/i.test(att.url)) return true
    return false
  }

  const isVideoAttachment = (att: ChatAttachmentItem) => {
    if (isDocumentAttachment(att)) return false
    if (att.type === 'video') return true
    if (att.mimeType && att.mimeType.startsWith('video/')) return true
    if (att.name && /\.(mp4|mov|mkv|webm|avi|m4v|3gp)$/i.test(att.name)) return true
    if (att.url && /\.(mp4|mov|mkv|webm|avi|m4v|3gp)(\?.*)?$/i.test(att.url)) return true
    return false
  }

  const isAudioAttachment = (att: ChatAttachmentItem) => {
    if (isDocumentAttachment(att)) return false
    if (isVideoAttachment(att)) return false
    if (att.type === 'audio') return true
    if (att.mimeType && att.mimeType.startsWith('audio/')) return true
    if (att.name && /\.(m4a|mp3|wav|aac|ogg|flac|opus)$/i.test(att.name)) return true
    if (att.url && /\.(m4a|mp3|wav|aac|ogg|flac|opus)(\?.*)?$/i.test(att.url)) return true
    return false
  }

  const isImageAttachment = (att: ChatAttachmentItem) => {
    if (isDocumentAttachment(att)) return false
    if (isVideoAttachment(att)) return false
    if (isAudioAttachment(att)) return false
    if (att.type === 'image') return true
    if (att.mimeType && att.mimeType.startsWith('image/')) return true
    if (att.name && /\.(jpg|jpeg|png|webp|gif|bmp|heic|svg)$/i.test(att.name)) return true
    if (att.url && (/\.(jpg|jpeg|png|webp|gif|bmp|heic|svg)(\?.*)?$/i.test(att.url) || att.url.startsWith('data:image/'))) return true
    return false
  }

  const audioAttachments = attachments.filter(isAudioAttachment)
  const videoAttachments = attachments.filter(isVideoAttachment)
  const imageAttachments = attachments.filter(isImageAttachment)
  const fileAttachments = attachments.filter((att) => !isImageAttachment(att) && !isVideoAttachment(att) && !isAudioAttachment(att))

  // Avoid showing raw filename if it is already displayed as an attachment card
  const isFileNameText =
    content &&
    (attachments.length > 0 ||
      /\.(jpg|jpeg|png|webp|gif|mp4|mov|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|m4a|mp3|wav)$/i.test(content.trim()) ||
      content.startsWith('🎤 Voice note') ||
      content.startsWith('Voice note'))

  const isLocalUri = (url?: string) =>
    !!url && (url.startsWith('file:') || url.startsWith('content:') || url.startsWith('data:'))

  const handleOpenDoc = (att: ChatAttachmentItem) => {
    const docUrl = att.url || (content && (content.startsWith('http') || content.startsWith('file:') || content.startsWith('content:') || content.startsWith('data:')) ? content : undefined)
    if (!docUrl) {
      if (onAttachmentPreview) onAttachmentPreview(att)
      return
    }
    // Local file:// or content:// URIs CANNOT be loaded in WebView on Android;
    // route them through expo-sharing which uses a proper FileProvider.
    if (isLocalUri(docUrl)) {
      handleOpenOrDownload(docUrl, att.name, att.mimeType)
      return
    }
    setDocLoadError(false)
    setPreviewDoc({
      url: docUrl,
      name: att.name || 'Document',
      type: att.type || 'file',
    })
  }

  const handleOpenOrDownload = async (fileUrl?: string, fileName?: string, mimeType?: string) => {
    if (!fileUrl) return;
    try {
      if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
        // Remote URLs — open in in-app browser
        await WebBrowser.openBrowserAsync(fileUrl);
      } else if (fileUrl.startsWith('file:') || fileUrl.startsWith('content:')) {
        // Local URIs: Android blocks passing file:// via Intent.getData().
        // React Native's Share.share goes through the system share sheet (not
        // Intent.getData) so it avoids FileUriExposedException.
        await Share.share({
          title: fileName || 'Document',
          message: `Open: ${fileName || 'Document'}`,
        });
      } else if (fileUrl.startsWith('data:')) {
        await Share.share({
          title: fileName || 'Document',
          message: `${fileName || 'Document'}`,
        });
      } else {
        await Linking.openURL(fileUrl);
      }
    } catch (err) {
      console.warn('Error opening file:', err);
    }
  };

  const getDocViewerUrl = (fileUrl: string, fileName: string) => {
    // Only wrap remote HTTPS URLs with Google Docs viewer
    if (fileUrl.startsWith('https://')) {
      const isPdfOrOffice = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|csv|txt|rtf)$/i.test(fileName || fileUrl)
      if (isPdfOrOffice) {
        return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`
      }
      return fileUrl
    }
    // http:// goes direct, local URIs should never reach here (handled in handleOpenDoc)
    return fileUrl
  }

  return (
    <View style={styles.swipeContainer}>
      {/* Swipe Reply Left Icon Indicator */}
      {onReply && (
        <Animated.View
          style={[
            styles.swipeReplyBadge,
            {
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff',
              opacity: translateX.interpolate({
                inputRange: [0, 15, 40],
                outputRange: [0, 0.4, 1],
                extrapolate: 'clamp',
              }),
              transform: [
                {
                  scale: translateX.interpolate({
                    inputRange: [0, 40],
                    outputRange: [0.3, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <CornerUpLeft size={16} color={isDark ? '#a5b4fc' : '#4f46e5'} />
        </Animated.View>
      )}

      <Animated.View
        style={[{ transform: [{ translateX }] }, styles.swipeAnimatedView]}
        {...(onReply ? panResponder.panHandlers : {})}
      >
        <Pressable
          onPress={onPress}
          style={[
            styles.container,
            isSelected && {
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.08)',
              borderRadius: 12,
              paddingHorizontal: 8,
              marginHorizontal: -8,
            },
            style,
          ]}
        >
      {/* Avatar on Left */}
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
            borderColor: isDark ? '#334155' : '#e2e8f0',
          },
        ]}
      >
        <Text
          style={[
            styles.avatarText,
            { color: isDark ? '#94a3b8' : '#475569' },
          ]}
        >
          {initials}
        </Text>
      </View>

      {/* Main Column */}
      <View style={styles.mainColumn}>
        {/* Sender Name */}
        {senderName ? (
          <Text
            style={[styles.senderName, { color: colors.foreground }]}
          >
            {senderName}
          </Text>
        ) : null}

        {/* Reply Quote Banner */}
        {replyTo ? (
          <View
            style={[
              styles.replyQuote,
              {
                backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                borderLeftColor: isDark ? '#818cf8' : '#4f46e5',
              },
            ]}
          >
            <Text
              style={[
                styles.replyQuoteName,
                { color: isDark ? '#a5b4fc' : '#4f46e5' },
              ]}
            >
              {replyTo.senderName}
            </Text>
            <Text
              style={[
                styles.replyQuoteText,
                { color: colors.mutedForeground },
              ]}
              numberOfLines={1}
            >
              {replyTo.content}
            </Text>
          </View>
        ) : null}

        {/* Document / PDF / Video Attachment Card */}
        {fileAttachments.map((att, idx) => {
          const isVideo = att.type === 'video' || /\.(mp4|mov|mkv|webm|avi)$/i.test(att.name || '')
          const isXls = /\.(xls|xlsx|csv)$/i.test(att.name || '')
          const isDoc = /\.(doc|docx|rtf|txt)$/i.test(att.name || '')
          const isPdf = /\.(pdf)$/i.test(att.name || '') || att.type === 'pdf'

          return (
            <TouchableOpacity
              key={att.id || idx}
              activeOpacity={0.88}
              onPress={() => handleOpenDoc(att)}
              style={[
                styles.docCard,
                {
                  backgroundColor: isDark ? '#18181b' : '#ffffff',
                  borderColor: isDark ? colors.border : '#e2e8f0',
                },
              ]}
            >
              {/* Icon Box */}
              <View
                style={[
                  styles.docIconBox,
                  {
                    backgroundColor: isVideo
                      ? isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe'
                      : isXls
                      ? isDark ? 'rgba(16, 185, 129, 0.15)' : '#d1fae5'
                      : isDoc
                      ? isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe'
                      : isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7',
                  },
                ]}
              >
                <FileText
                  size={20}
                  color={
                    isVideo
                      ? '#2563eb'
                      : isXls
                      ? '#059669'
                      : isDoc
                      ? '#2563eb'
                      : '#d97706'
                  }
                  strokeWidth={2}
                />
              </View>

              {/* Info Column */}
              <View style={styles.docInfo}>
                <Text
                  style={[styles.docName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {att.name}
                </Text>
                <Text
                  style={[styles.docMeta, { color: colors.mutedForeground }]}
                >
                  {att.size ? `${formatFileSize(att.size)} • ` : ''}
                  {isVideo
                    ? 'VIDEO'
                    : isXls
                    ? 'EXCEL SPREADSHEET'
                    : isDoc
                    ? 'DOCUMENT'
                    : isPdf
                    ? 'PDF DOCUMENT'
                    : att.type?.toUpperCase() || 'FILE'}
                </Text>
                {att.statusText ? (
                  <Text
                    style={[
                      styles.docStatusText,
                      { color: isDark ? '#34d399' : '#059669' },
                    ]}
                  >
                    {att.statusText}
                  </Text>
                ) : null}
              </View>

              {/* Right Action Buttons */}
              <View style={styles.docActions}>
                <TouchableOpacity
                  onPress={() => handleOpenDoc(att)}
                  hitSlop={8}
                  style={styles.docActionBtn}
                >
                  <Eye size={17} color={isDark ? '#38bdf8' : '#0284c7'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (onAttachmentClick) {
                      onAttachmentClick(att);
                    } else {
                      handleOpenOrDownload(att.url, att.name);
                    }
                  }}
                  hitSlop={8}
                  style={styles.docActionBtn}
                >
                  <Download size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )
        })}

        {/* Image Attachments Preview Card */}
        {imageAttachments.map((att, idx) => {
          const imgUri = att.url || (content && (content.startsWith('http') || content.startsWith('file:') || content.startsWith('content:') || content.startsWith('data:')) ? content : undefined);
          return (
            <Pressable
              key={att.id || idx}
              onPress={() => {
                if (imgUri) {
                  setPreviewImageUri(imgUri)
                  setPreviewImageName(att.name || 'Photo')
                } else if (onAttachmentPreview) {
                  onAttachmentPreview(att)
                }
              }}
              style={[
                styles.imageCard,
                {
                  backgroundColor: isDark ? '#18181b' : '#f8fafc',
                  borderColor: isDark ? '#27272a' : '#e2e8f0',
                },
              ]}
            >
              {imgUri ? (
                <ExpoImage
                  source={{ uri: imgUri }}
                  style={styles.attachmentImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={[styles.attachmentImage, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9', alignItems: 'center', justifyContent: 'center' }]}>
                  <FileText size={32} color={colors.mutedForeground} />
                  <Text style={{ color: colors.foreground, fontSize: 12, marginTop: 6 }} numberOfLines={1}>
                    {att.name || 'Image'}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* ── Video Attachments — inline player ───────────────────────── */}
        {videoAttachments.map((att, idx) => (
          <VideoAttachmentPlayer key={att.id || `video-${idx}`} att={att} />
        ))}

        {/* ── Audio / Voice Note Attachments — inline waveform player ───── */}
        {audioAttachments.map((att, idx) => (
          <VoiceNoteBubblePlayer
            key={att.id || att.url || `audio-${idx}`}
            att={att}
            content={content}
            isOwn={isOwn}
          />
        ))}

        {/* Location Attachment Card */}
        {location ? (
          <View style={{ marginVertical: 4 }}>
            <ChatLocationCard
              title={location.title || 'Shared Location'}
              address={location.address}
              latitude={location.latitude}
              longitude={location.longitude}
              isLive={true}
              onOpenMap={() => {
                if (onLocationClick) {
                  onLocationClick(location)
                } else if (location.latitude && location.longitude) {
                  const url = Platform.select({
                    ios: `maps:0,0?q=${location.latitude},${location.longitude}`,
                    android: `geo:0,0?q=${location.latitude},${location.longitude}`,
                    default: `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
                  })
                  Linking.openURL(url)
                }
              }}
              onNavigate={() => {
                if (location.latitude && location.longitude) {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`
                  Linking.openURL(url)
                }
              }}
            />
          </View>
        ) : null}

        {/* Plain Text Message */}
        {content &&
        !attachments.some((a) => a.name === content || a.url === content) &&
        (!isFileNameText || (imageAttachments.length === 0 && fileAttachments.length === 0 && videoAttachments.length === 0 && audioAttachments.length === 0 && !location)) ? (
          <Text
            style={[styles.messageText, { color: colors.foreground }]}
          >
            {content}
          </Text>
        ) : null}

        {/* Timestamp & Status Delivery Checkmarks */}
        <View style={styles.timeStatusRow}>
          {formattedTime ? (
            <Text
              style={[styles.timeText, { color: colors.mutedForeground }]}
            >
              {formattedTime}
            </Text>
          ) : null}
          {renderStatusIcon()}
        </View>

        {/* Reactions */}
        {reactions.length > 0 ? (
          <View style={styles.reactionsRow}>
            {reactions.map((r, i) => (
              <View
                key={i}
                style={[
                  styles.reactionPill,
                  {
                    backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                    borderColor: isDark ? colors.border : '#e2e8f0',
                  },
                ]}
              >
                <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                <Text
                  style={[
                    styles.reactionCount,
                    { color: colors.foreground },
                  ]}
                >
                  {r.count}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* Full-Screen Image Viewer Modal */}
      {previewImageUri && (
        <Modal
          visible={!!previewImageUri}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setPreviewImageUri(null)}
        >
          <SafeAreaView style={[styles.imageModalRoot, { backgroundColor: isDark ? '#09090b' : '#000000' }]}>
            {/* Modal Top Bar */}
            <View style={styles.imageModalHeader}>
              <Text style={styles.imageModalTitle} numberOfLines={1}>
                {previewImageName}
              </Text>
              <TouchableOpacity
                onPress={() => setPreviewImageUri(null)}
                style={styles.imageModalCloseBtn}
                hitSlop={10}
              >
                <X size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* High-Res Image Canvas */}
            <View style={styles.imageModalCanvas}>
              <ExpoImage
                source={{ uri: previewImageUri }}
                style={styles.imageModalFullImage}
                contentFit="contain"
              />
            </View>

            {/* Modal Bottom Actions */}
            <View style={styles.imageModalFooter}>
              <TouchableOpacity
                onPress={() => handleOpenOrDownload(previewImageUri, previewImageName)}
                style={styles.imageFooterBtn}
              >
                <Download size={18} color="#ffffff" />
                <Text style={styles.imageFooterBtnText}>Save / Open</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      )}

      {/* In-App Document / File Viewer Modal (WebView Powered) */}
      {previewDoc && (
        <Modal
          visible={!!previewDoc}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setPreviewDoc(null)}
        >
          <SafeAreaView style={[styles.docModalRoot, { backgroundColor: isDark ? '#09090b' : '#f8fafc' }]}>
            {/* Modal Header */}
            <View
              style={[
                styles.docModalHeader,
                {
                  backgroundColor: isDark ? '#141418' : '#ffffff',
                  borderBottomColor: isDark ? '#27272a' : '#e2e8f0',
                },
              ]}
            >
              <View style={styles.docModalHeaderLeft}>
                <View
                  style={[
                    styles.docModalTypeBadge,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#dbeafe',
                    },
                  ]}
                >
                  <Text style={[styles.docModalTypeBadgeText, { color: isDark ? '#93c5fd' : '#1d4ed8' }]}>
                    {previewDoc.name.split('.').pop()?.toUpperCase() || 'DOC'}
                  </Text>
                </View>
                <Text
                  style={[styles.docModalTitle, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {previewDoc.name}
                </Text>
              </View>

              <View style={styles.docModalHeaderActions}>
                {/* Open in external browser / app */}
                <TouchableOpacity
                  onPress={() => handleOpenOrDownload(previewDoc.url, previewDoc.name)}
                  style={[styles.docModalIconBtn, { backgroundColor: isDark ? '#27272a' : '#f1f5f9' }]}
                  hitSlop={8}
                >
                  <ExternalLink size={18} color={colors.foreground} />
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setPreviewDoc(null)}
                  style={[styles.docModalCloseBtn, { backgroundColor: isDark ? '#27272a' : '#f1f5f9' }]}
                  hitSlop={8}
                >
                  <X size={18} color={colors.foreground} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Document Content Canvas */}
            <View style={styles.docModalBody}>
              {docLoadError ? (
                <View style={styles.docErrorWrap}>
                  <AlertCircle size={44} color="#ef4444" />
                  <Text style={[styles.docErrorTitle, { color: colors.foreground }]}>
                    Unable to display in-app preview
                  </Text>
                  <Text style={[styles.docErrorSub, { color: colors.mutedForeground }]}>
                    You can open or download this file directly using an external viewer.
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleOpenOrDownload(previewDoc.url, previewDoc.name)}
                    style={styles.docErrorBtn}
                  >
                    <ExternalLink size={16} color="#ffffff" />
                    <Text style={styles.docErrorBtnText}>Open in External Viewer</Text>
                  </TouchableOpacity>
                </View>
              ) : Platform.OS === 'web' ? (
                <iframe
                  src={getDocViewerUrl(previewDoc.url, previewDoc.name)}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title={previewDoc.name}
                />
              ) : (
                <WebView
                  source={{ uri: getDocViewerUrl(previewDoc.url, previewDoc.name) }}
                  style={styles.docWebView}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={styles.docLoadingWrap}>
                      <ActivityIndicator size="large" color="#3b82f6" />
                      <Text style={[styles.docLoadingText, { color: colors.foreground }]}>
                        Opening Document...
                      </Text>
                    </View>
                  )}
                  onError={() => setDocLoadError(true)}
                  originWhitelist={['*']}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  scalesPageToFit={true}
                />
              )}
            </View>

            {/* Footer Bar */}
            <View
              style={[
                styles.docModalFooter,
                {
                  backgroundColor: isDark ? '#141418' : '#ffffff',
                  borderTopColor: isDark ? '#27272a' : '#e2e8f0',
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleOpenOrDownload(previewDoc.url, previewDoc.name)}
                style={styles.docDownloadBtn}
              >
                <Download size={16} color="#ffffff" />
                <Text style={styles.docDownloadBtnText}>Save / Open File</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      )}
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  swipeContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  swipeAnimatedView: {
    width: '100%',
    zIndex: 1,
  },
  swipeReplyBadge: {
    position: 'absolute',
    left: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    lineHeight: 20,
  },
  replyQuote: {
    borderLeftWidth: 2,
    paddingLeft: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 4,
  },
  replyQuoteName: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  replyQuoteText: {
    fontSize: 11.5,
    fontWeight: '400',
    fontFamily: 'Open Sans',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 380,
    width: '100%',
    marginVertical: 3,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  docName: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  docMeta: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Open Sans',
  },
  docStatusText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  docActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  docActionBtn: {
    padding: 6,
  },
  imageCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 4,
    maxWidth: 280,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  attachmentImage: {
    width: 260,
    height: 320,
    borderRadius: 14,
  },
  timeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Open Sans',
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  reactionEmoji: {
    fontSize: 11,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  imageModalRoot: {
    flex: 1,
  },
  imageModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  imageModalTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    flex: 1,
    marginRight: 12,
  },
  imageModalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalCanvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalFullImage: {
    width: '100%',
    height: '100%',
  },
  imageModalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  imageFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: '#3b82f6',
  },
  imageFooterBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  docModalRoot: {
    flex: 1,
  },
  docModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  docModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    marginRight: 12,
  },
  docModalTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  docModalTypeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  docModalTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    flex: 1,
  },
  docModalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  docModalIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docModalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docModalBody: {
    flex: 1,
    position: 'relative',
  },
  docWebView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  docLoadingWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  docLoadingText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  docErrorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 12,
  },
  docErrorTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  docErrorSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Open Sans',
    maxWidth: 280,
  },
  docErrorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  docErrorBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  docModalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  docDownloadBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
})
