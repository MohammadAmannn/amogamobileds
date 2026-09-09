import React, { useState, useMemo } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import {
  X,
  Bell,
  BellOff,
  Phone,
  Video,
  Search,
  FileText,
  Music,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
  Download,
  Eye,
  Play,
  Share2,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { ChatMessage, Conversation } from '../../lib/database.types';

export interface ChatProfileModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: (Conversation & { otherMember?: any; is_group?: boolean; title?: string; participant_count?: number }) | null;
  messages: ChatMessage[];
  onOpenMedia?: (url: string, name?: string) => void;
  onOpenDoc?: (url: string, name?: string) => void;
}


type TabType = 'media' | 'docs' | 'audio' | 'links';

const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export function ChatProfileModal({
  visible,
  onClose,
  conversation,
  messages,
  onOpenMedia,
  onOpenDoc,
}: ChatProfileModalProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('media');
  const [isMuted, setIsMuted] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  const title =
    conversation?.is_group
      ? conversation.title || 'Group Chat'
      : conversation?.otherMember?.name || conversation?.otherMember?.email?.split('@')[0] || 'Chat';

  const subtitle =
    conversation?.is_group
      ? `${conversation.participant_count || 2} members`
      : conversation?.otherMember?.online
      ? 'Online'
      : conversation?.otherMember?.email || 'Active';

  const initials =
    title
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CH';

  // Extract shared items categorized
  const { mediaItems, docItems, audioItems, linkItems } = useMemo(() => {
    const media: Array<{ id: string; url: string; name: string; isVideo?: boolean; createdAt: string }> = [];
    const docs: Array<{ id: string; url?: string; name: string; size?: number; type?: string; createdAt: string }> = [];
    const audio: Array<{ id: string; url?: string; name: string; size?: number; createdAt: string }> = [];
    const links: Array<{ id: string; url: string; domain: string; text?: string; createdAt: string }> = [];

    messages.forEach((msg) => {
      const fileNameOrMsg = msg.file_name || msg.message || '';
      const url =
        msg.file_url ||
        (msg.message && (msg.message.startsWith('http') || msg.message.startsWith('file:') || msg.message.startsWith('content:'))
          ? msg.message
          : undefined);

      const isImage =
        msg.message_type === 'image' ||
        /\.(jpg|jpeg|png|webp|gif|bmp|heic|svg)$/i.test(fileNameOrMsg) ||
        msg.mime_type?.startsWith('image/');

      const isVideo =
        msg.message_type === 'video' ||
        /\.(mp4|mov|mkv|webm|avi)$/i.test(fileNameOrMsg) ||
        msg.mime_type?.startsWith('video/');

      const isAudio =
        msg.message_type === 'audio' ||
        /\.(m4a|mp3|wav|aac|ogg|flac|opus)$/i.test(fileNameOrMsg) ||
        msg.mime_type?.startsWith('audio/');

      const isDoc =
        msg.message_type === 'file' ||
        msg.message_type === 'document' ||
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|rtf|zip|rar)$/i.test(fileNameOrMsg) ||
        (msg.mime_type && (msg.mime_type.startsWith('application/') || msg.mime_type.startsWith('text/')));

      if ((isImage || isVideo) && url) {
        media.push({
          id: msg.id,
          url,
          name: msg.file_name || (isVideo ? 'Video' : 'Photo'),
          isVideo,
          createdAt: msg.created_at,
        });
      } else if (isAudio) {
        audio.push({
          id: msg.id,
          url,
          name: msg.file_name || 'Voice Message',
          size: msg.file_size || undefined,
          createdAt: msg.created_at,
        });
      } else if (isDoc || msg.file_url) {
        docs.push({
          id: msg.id,
          url,
          name: msg.file_name || 'Document',
          size: msg.file_size || undefined,
          type: msg.message_type,
          createdAt: msg.created_at,
        });
      }

      // Check text for URLs
      if (msg.message && !url) {
        const matches = msg.message.match(URL_REGEX);
        if (matches) {
          matches.forEach((matchedUrl: string) => {
            try {

              const domain = new URL(matchedUrl).hostname.replace(/^www\./, '');
              links.push({
                id: `${msg.id}-${matchedUrl}`,
                url: matchedUrl,
                domain,
                text: msg.message || '',
                createdAt: msg.created_at,
              });
            } catch {
              links.push({
                id: `${msg.id}-${matchedUrl}`,
                url: matchedUrl,
                domain: matchedUrl,
                text: msg.message || '',
                createdAt: msg.created_at,
              });
            }

          });
        }
      }
    });

    return { mediaItems: media, docItems: docs, audioItems: audio, linkItems: links };
  }, [messages]);

  const handleOpenLink = async (url: string) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch {
      Linking.openURL(url);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? '#09090b' : '#ffffff' },
        ]}
      >
        {/* Top Header Bar */}
        <View
          style={[
            styles.topBar,
            { borderBottomColor: isDark ? '#27272a' : '#f1f5f9' },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeBtn,
              { backgroundColor: isDark ? '#18181b' : '#f1f5f9' },
            ]}
          >
            <X size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.topBarTitle, { color: colors.foreground }]}>
            {conversation?.is_group ? 'Group Info' : 'Contact Info'}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Hero Card */}
          <View
            style={[
              styles.profileHero,
              {
                backgroundColor: isDark ? '#18181b' : '#f8fafc',
                borderColor: isDark ? '#27272a' : '#e2e8f0',
              },
            ]}
          >
            <View
              style={[
                styles.avatarCircle,
                {
                  backgroundColor: isDark ? 'rgba(99, 102, 241, 0.25)' : '#e0e7ff',
                  borderColor: isDark ? '#6366f1' : '#4f46e5',
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: isDark ? '#a5b4fc' : '#4f46e5' },
                ]}
              >
                {initials}
              </Text>
            </View>

            <Text style={[styles.profileName, { color: colors.foreground }]}>
              {title}
            </Text>
            <Text style={[styles.profileSub, { color: colors.mutedForeground }]}>
              {subtitle}
            </Text>

            {/* Quick Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ]}
                onPress={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <BellOff size={18} color="#ef4444" />
                ) : (
                  <Bell size={18} color={isDark ? '#a5b4fc' : '#4f46e5'} />
                )}
                <Text
                  style={[
                    styles.actionBtnLabel,
                    { color: isMuted ? '#ef4444' : colors.foreground },
                  ]}
                >
                  {isMuted ? 'Muted' : 'Mute'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ]}
                onPress={() => {}}
              >
                <Phone size={18} color={isDark ? '#34d399' : '#059669'} />
                <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                  Audio
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ]}
                onPress={() => {}}
              >
                <Video size={18} color={isDark ? '#38bdf8' : '#0284c7'} />
                <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                  Video
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ]}
                onPress={() => {
                  onClose();
                }}
              >
                <Search size={18} color={isDark ? '#fbbf24' : '#d97706'} />
                <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Telegram-style Shared Content Tabs */}
          <View
            style={[
              styles.tabsContainer,
              {
                backgroundColor: isDark ? '#18181b' : '#f1f5f9',
                borderColor: isDark ? '#27272a' : '#e2e8f0',
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('media')}
              style={[
                styles.tabItem,
                activeTab === 'media' && {
                  backgroundColor: isDark ? '#27272a' : '#ffffff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                },
              ]}
            >
              <ImageIcon
                size={16}
                color={activeTab === 'media' ? (isDark ? '#818cf8' : '#4f46e5') : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color:
                      activeTab === 'media'
                        ? isDark
                          ? '#ffffff'
                          : '#0f172a'
                        : colors.mutedForeground,
                    fontWeight: activeTab === 'media' ? '600' : '500',
                  },
                ]}
              >
                Media {mediaItems.length > 0 ? `(${mediaItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('docs')}
              style={[
                styles.tabItem,
                activeTab === 'docs' && {
                  backgroundColor: isDark ? '#27272a' : '#ffffff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                },
              ]}
            >
              <FileText
                size={16}
                color={activeTab === 'docs' ? (isDark ? '#818cf8' : '#4f46e5') : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color:
                      activeTab === 'docs'
                        ? isDark
                          ? '#ffffff'
                          : '#0f172a'
                        : colors.mutedForeground,
                    fontWeight: activeTab === 'docs' ? '600' : '500',
                  },
                ]}
              >
                Docs {docItems.length > 0 ? `(${docItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('audio')}
              style={[
                styles.tabItem,
                activeTab === 'audio' && {
                  backgroundColor: isDark ? '#27272a' : '#ffffff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                },
              ]}
            >
              <Music
                size={16}
                color={activeTab === 'audio' ? (isDark ? '#818cf8' : '#4f46e5') : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color:
                      activeTab === 'audio'
                        ? isDark
                          ? '#ffffff'
                          : '#0f172a'
                        : colors.mutedForeground,
                    fontWeight: activeTab === 'audio' ? '600' : '500',
                  },
                ]}
              >
                Audio {audioItems.length > 0 ? `(${audioItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('links')}
              style={[
                styles.tabItem,
                activeTab === 'links' && {
                  backgroundColor: isDark ? '#27272a' : '#ffffff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                },
              ]}
            >
              <LinkIcon
                size={16}
                color={activeTab === 'links' ? (isDark ? '#818cf8' : '#4f46e5') : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color:
                      activeTab === 'links'
                        ? isDark
                          ? '#ffffff'
                          : '#0f172a'
                        : colors.mutedForeground,
                    fontWeight: activeTab === 'links' ? '600' : '500',
                  },
                ]}
              >
                Links {linkItems.length > 0 ? `(${linkItems.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Contents */}
          <View style={styles.tabContentArea}>
            {/* 1. MEDIA TAB (Photos & Videos Grid) */}
            {activeTab === 'media' && (
              <View>
                {mediaItems.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <ImageIcon size={40} color={colors.mutedForeground} />
                    <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                      No photos or videos shared yet
                    </Text>
                  </View>
                ) : (
                  <View style={styles.mediaGrid}>
                    {mediaItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.mediaGridItem,
                          { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' },
                        ]}
                        activeOpacity={0.8}
                        onPress={() => {
                          if (onOpenMedia) {
                            onOpenMedia(item.url, item.name);
                          } else {
                            setPreviewMediaUrl(item.url);
                          }
                        }}
                      >
                        <ExpoImage
                          source={{ uri: item.url }}
                          style={styles.mediaImage}
                          contentFit="cover"
                        />
                        {item.isVideo && (
                          <View style={styles.videoBadge}>
                            <Play size={12} color="#ffffff" fill="#ffffff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* 2. DOCS TAB */}
            {activeTab === 'docs' && (
              <View>
                {docItems.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <FileText size={40} color={colors.mutedForeground} />
                    <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                      No documents shared yet
                    </Text>
                  </View>
                ) : (
                  <View style={styles.listContainer}>
                    {docItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.docRow,
                          {
                            backgroundColor: isDark ? '#18181b' : '#f8fafc',
                            borderColor: isDark ? '#27272a' : '#e2e8f0',
                          },
                        ]}
                        onPress={() => {
                          if (item.url) {
                            if (onOpenDoc) onOpenDoc(item.url, item.name);
                            else Linking.openURL(item.url);
                          }
                        }}
                      >
                        <View
                          style={[
                            styles.docIconBox,
                            { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe' },
                          ]}
                        >
                          <FileText size={20} color="#2563eb" />
                        </View>
                        <View style={styles.docDetails}>
                          <Text
                            style={[styles.docItemName, { color: colors.foreground }]}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={[styles.docItemMeta, { color: colors.mutedForeground }]}
                          >
                            {item.size ? `${formatFileSize(item.size)} • ` : ''}
                            {formatDate(item.createdAt)}
                          </Text>
                        </View>
                        <Download size={16} color={colors.mutedForeground} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* 3. AUDIO TAB */}
            {activeTab === 'audio' && (
              <View>
                {audioItems.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Music size={40} color={colors.mutedForeground} />
                    <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                      No voice notes or audio shared yet
                    </Text>
                  </View>
                ) : (
                  <View style={styles.listContainer}>
                    {audioItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.docRow,
                          {
                            backgroundColor: isDark ? '#18181b' : '#f8fafc',
                            borderColor: isDark ? '#27272a' : '#e2e8f0',
                          },
                        ]}
                        onPress={() => {
                          if (item.url) Linking.openURL(item.url);
                        }}
                      >
                        <View
                          style={[
                            styles.docIconBox,
                            { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#d1fae5' },
                          ]}
                        >
                          <Music size={20} color="#059669" />
                        </View>
                        <View style={styles.docDetails}>
                          <Text
                            style={[styles.docItemName, { color: colors.foreground }]}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={[styles.docItemMeta, { color: colors.mutedForeground }]}
                          >
                            {item.size ? `${formatFileSize(item.size)} • ` : ''}
                            {formatDate(item.createdAt)}
                          </Text>
                        </View>
                        <Play size={16} color="#059669" fill="#059669" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* 4. LINKS TAB */}
            {activeTab === 'links' && (
              <View>
                {linkItems.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <LinkIcon size={40} color={colors.mutedForeground} />
                    <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                      No shared links found in this chat
                    </Text>
                  </View>
                ) : (
                  <View style={styles.listContainer}>
                    {linkItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.docRow,
                          {
                            backgroundColor: isDark ? '#18181b' : '#f8fafc',
                            borderColor: isDark ? '#27272a' : '#e2e8f0',
                          },
                        ]}
                        onPress={() => handleOpenLink(item.url)}
                      >
                        <View
                          style={[
                            styles.docIconBox,
                            { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#e0e7ff' },
                          ]}
                        >
                          <LinkIcon size={18} color="#4f46e5" />
                        </View>
                        <View style={styles.docDetails}>
                          <Text
                            style={[styles.docItemName, { color: isDark ? '#818cf8' : '#4338ca' }]}
                            numberOfLines={1}
                          >
                            {item.domain}
                          </Text>
                          <Text
                            style={[styles.docItemMeta, { color: colors.mutedForeground }]}
                            numberOfLines={1}
                          >
                            {item.url}
                          </Text>
                        </View>
                        <ExternalLink size={15} color={colors.mutedForeground} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Full Image Preview Modal */}
        {previewMediaUrl && (
          <Modal
            visible={!!previewMediaUrl}
            transparent={false}
            animationType="fade"
            onRequestClose={() => setPreviewMediaUrl(null)}
          >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
              <View style={styles.previewTopBar}>
                <TouchableOpacity
                  onPress={() => setPreviewMediaUrl(null)}
                  style={styles.previewCloseBtn}
                >
                  <X size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <View style={styles.previewImageContainer}>
                <ExpoImage
                  source={{ uri: previewMediaUrl }}
                  style={styles.previewFullImage}
                  contentFit="contain"
                />
              </View>
            </SafeAreaView>
          </Modal>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const screenWidth = Dimensions.get('window').width;
const mediaSize = (screenWidth - 48) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHero: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileSub: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    paddingTop: 8,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 4,
    maxWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
  },
  tabContentArea: {
    minHeight: 200,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaGridItem: {
    width: mediaSize,
    height: mediaSize,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    gap: 8,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  docIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docDetails: {
    flex: 1,
  },
  docItemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  docItemMeta: {
    fontSize: 12,
  },
  previewTopBar: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  previewCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewFullImage: {
    width: '100%',
    height: '100%',
  },
});
