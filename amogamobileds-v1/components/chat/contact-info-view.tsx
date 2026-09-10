import React, { useState, useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { ChatMessage, Conversation } from '../../lib/database.types';

export interface ContactInfoViewProps {
  onClose: () => void;
  conversation: (Conversation & { otherMember?: any; is_group?: boolean; title?: string; participant_count?: number }) | null;
  messages: ChatMessage[];
  onOpenMedia?: (url: string, name?: string) => void;
  onOpenDoc?: (url: string, name?: string) => void;
  style?: any;
}

type TabType = 'media' | 'docs' | 'audio' | 'links';

const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export function ContactInfoView({
  onClose,
  conversation,
  messages,
  onOpenMedia,
  onOpenDoc,
  style,
}: ContactInfoViewProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('media');
  const [isMuted, setIsMuted] = useState(false);

  const title =
    conversation?.is_group
      ? conversation.title || 'Group Chat'
      : conversation?.otherMember?.name || conversation?.otherMember?.email?.split('@')[0] || 'Chat';

  const email =
    conversation?.otherMember?.email || '';

  const subtitle =
    conversation?.is_group
      ? `${conversation.participant_count || 2} members`
      : email || (conversation?.otherMember?.online ? 'Online' : 'Offline');

  const initials =
    title
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'A';

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
        /\.(jpg|jpeg|png|webp|gif)$/i.test(fileNameOrMsg) ||
        (url && /\.(jpg|jpeg|png|webp|gif)$/i.test(url));

      const isVideo =
        msg.message_type === 'video' ||
        /\.(mp4|mov|webm)$/i.test(fileNameOrMsg) ||
        (url && /\.(mp4|mov|webm)$/i.test(url));

      const isAudio =
        msg.message_type === 'audio' ||
        /\.(mp3|m4a|wav|aac|ogg)$/i.test(fileNameOrMsg) ||
        (url && /\.(mp3|m4a|wav|aac|ogg)$/i.test(url));

      const isDoc =
        msg.message_type === 'document' ||
        msg.message_type === 'file' ||
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip)$/i.test(fileNameOrMsg);

      if (url && (isImage || isVideo)) {
        media.push({
          id: msg.id,
          url,
          name: msg.file_name || 'Photo',
          isVideo,
          createdAt: msg.created_at,
        });
      } else if (isAudio) {
        audio.push({
          id: msg.id,
          url,
          name: msg.file_name || 'Voice Message',
          size: msg.file_size,
          createdAt: msg.created_at,
        });
      } else if (isDoc) {
        docs.push({
          id: msg.id,
          url,
          name: msg.file_name || 'Document',
          size: msg.file_size,
          createdAt: msg.created_at,
        });
      }

      // Check for links
      if (msg.message) {
        const foundUrls = msg.message.match(URL_REGEX);
        if (foundUrls) {
          foundUrls.forEach((u) => {
            try {
              const parsed = new URL(u);
              links.push({
                id: `${msg.id}-${u}`,
                url: u,
                domain: parsed.hostname.replace('www.', ''),
                text: msg.message,
                createdAt: msg.created_at,
              });
            } catch {
              links.push({
                id: `${msg.id}-${u}`,
                url: u,
                domain: u,
                text: msg.message,
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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      {/* Top Header Bar matching Screenshot */}
      <View
        style={[
          styles.topBar,
          {
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          style={[
            styles.closeBtn,
            {
              backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back to chat"
        >
          <X size={17} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.topBarTitle, { color: colors.foreground }]}>
          {conversation?.is_group ? 'Group Info' : 'Contact Info'}
        </Text>

        <View style={{ width: 34 }} />
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
              backgroundColor: isDark ? colors.card : '#f8fafc',
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor: `${colors.primary}18`,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: colors.primary },
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

          {/* Quick Action Buttons Row matching Screenshot */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <BellOff size={18} color="#ef4444" />
              ) : (
                <Bell size={18} color={colors.primary} />
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
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {}}
            >
              <Phone size={18} color="#10b981" />
              <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                Audio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {}}
            >
              <Video size={18} color="#3b82f6" />
              <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                Video
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
              onPress={onClose}
            >
              <Search size={18} color="#f59e0b" />
              <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Media / Docs / Audio / Links Tabs Bar */}
        <View
          style={[
            styles.tabsContainer,
            {
              backgroundColor: isDark ? colors.card : '#f8fafc',
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.tabsHeader}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'media' && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ],
              ]}
              onPress={() => setActiveTab('media')}
            >
              <ImageIcon
                size={15}
                color={activeTab === 'media' ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 'media' ? colors.primary : colors.mutedForeground,
                    fontWeight: activeTab === 'media' ? '700' : '500',
                  },
                ]}
              >
                Media {mediaItems.length > 0 ? `(${mediaItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'docs' && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ],
              ]}
              onPress={() => setActiveTab('docs')}
            >
              <FileText
                size={15}
                color={activeTab === 'docs' ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 'docs' ? colors.primary : colors.mutedForeground,
                    fontWeight: activeTab === 'docs' ? '700' : '500',
                  },
                ]}
              >
                Docs {docItems.length > 0 ? `(${docItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'audio' && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ],
              ]}
              onPress={() => setActiveTab('audio')}
            >
              <Music
                size={15}
                color={activeTab === 'audio' ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 'audio' ? colors.primary : colors.mutedForeground,
                    fontWeight: activeTab === 'audio' ? '700' : '500',
                  },
                ]}
              >
                Audio {audioItems.length > 0 ? `(${audioItems.length})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'links' && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? '#27272a' : '#ffffff' },
                ],
              ]}
              onPress={() => setActiveTab('links')}
            >
              <LinkIcon
                size={15}
                color={activeTab === 'links' ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 'links' ? colors.primary : colors.mutedForeground,
                    fontWeight: activeTab === 'links' ? '700' : '500',
                  },
                ]}
              >
                Links {linkItems.length > 0 ? `(${linkItems.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content Panes */}
        <View style={styles.tabContentArea}>
          {/* TAB 1: MEDIA */}
          {activeTab === 'media' && (
            mediaItems.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <ImageIcon size={36} color={colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                  No photos or videos shared yet
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                  Media files shared in this chat will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.mediaGrid}>
                {mediaItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => onOpenMedia?.(item.url, item.name)}
                    style={[styles.mediaThumbWrap, { borderColor: colors.border }]}
                  >
                    <ExpoImage
                      source={{ uri: item.url }}
                      style={styles.mediaThumb}
                      contentFit="cover"
                      transition={200}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}

          {/* TAB 2: DOCS */}
          {activeTab === 'docs' && (
            docItems.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <FileText size={36} color={colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                  No documents shared yet
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                  PDFs and documents shared will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {docItems.map((doc) => (
                  <TouchableOpacity
                    key={doc.id}
                    activeOpacity={0.7}
                    onPress={() => doc.url && onOpenDoc?.(doc.url, doc.name)}
                    style={[
                      styles.listItem,
                      {
                        backgroundColor: isDark ? colors.card : '#f8fafc',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.listIconBox,
                        { backgroundColor: `${colors.primary}18` },
                      ]}
                    >
                      <FileText size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.listItemTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {doc.name}
                      </Text>
                      {doc.size ? (
                        <Text
                          style={[styles.listItemSub, { color: colors.mutedForeground }]}
                        >
                          {formatFileSize(doc.size)}
                        </Text>
                      ) : null}
                    </View>
                    {doc.url && (
                      <Download size={16} color={colors.mutedForeground} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}

          {/* TAB 3: AUDIO */}
          {activeTab === 'audio' && (
            audioItems.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <Music size={36} color={colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                  No voice messages or audio
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                  Voice recordings will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {audioItems.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.listItem,
                      {
                        backgroundColor: isDark ? colors.card : '#f8fafc',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.listIconBox,
                        { backgroundColor: `${colors.primary}18` },
                      ]}
                    >
                      <Music size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.listItemTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )
          )}

          {/* TAB 4: LINKS */}
          {activeTab === 'links' && (
            linkItems.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <LinkIcon size={36} color={colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                  No shared links yet
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedForeground }]}>
                  Links shared in this conversation will be listed here.
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {linkItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => handleOpenLink(item.url)}
                    style={[
                      styles.listItem,
                      {
                        backgroundColor: isDark ? colors.card : '#f8fafc',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.listIconBox,
                        { backgroundColor: `${colors.primary}18` },
                      ]}
                    >
                      <LinkIcon size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.listItemTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {item.domain}
                      </Text>
                      <Text
                        style={[styles.listItemSub, { color: colors.primary }]}
                        numberOfLines={1}
                      >
                        {item.url}
                      </Text>
                    </View>
                    <ExternalLink size={15} color={colors.mutedForeground} />
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    display: 'flex' as any,
    flexDirection: 'column',
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
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  scrollContent: {
    padding: 18,
    gap: 16,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  profileHero: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    marginBottom: 4,
  },
  profileSub: {
    fontSize: 13,
    fontFamily: 'Open Sans',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionBtn: {
    width: 68,
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  tabsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
  },
  tabsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  tabItemActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
  },
  tabContentArea: {
    paddingVertical: 12,
  },
  emptyStateWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  emptyStateSub: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaThumbWrap: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
  },
  mediaThumb: {
    width: '100%',
    height: '100%',
  },
  itemsList: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  listIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  listItemSub: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
});
