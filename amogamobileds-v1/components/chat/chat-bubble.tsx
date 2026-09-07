import React from 'react'
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Eye,
  Download,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

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
  title?: string
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
  onAttachmentPreview,
  onAttachmentClick,
  onLocationClick,
  style,
}: ChatBubbleProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

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
        return <CheckCheck size={13} color="#0ea5e9" strokeWidth={2.4} />
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

  const fileAttachments = attachments.filter((att) => att.type !== 'image')
  const imageAttachments = attachments.filter((att) => att.type === 'image')

  return (
    <View style={[styles.container, style]}>
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

        {/* Document / PDF Attachment Card (Matching Screenshot) */}
        {fileAttachments.map((att, idx) => (
          <View
            key={att.id || idx}
            style={[
              styles.docCard,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? colors.border : '#e2e8f0',
              },
            ]}
          >
            {/* Orange Document Icon */}
            <View
              style={[
                styles.docIconBox,
                {
                  backgroundColor: isDark
                    ? 'rgba(245, 158, 11, 0.15)'
                    : '#fef3c7',
                },
              ]}
            >
              <FileText size={20} color="#d97706" strokeWidth={2} />
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
                {att.type?.toUpperCase() || 'PDF'}
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
              <Pressable
                onPress={() => onAttachmentPreview?.(att)}
                hitSlop={6}
                style={styles.docActionBtn}
              >
                <Eye size={16} color={colors.mutedForeground} />
              </Pressable>
              <Pressable
                onPress={() => onAttachmentClick?.(att)}
                hitSlop={6}
                style={styles.docActionBtn}
              >
                <Download size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Image Attachments */}
        {imageAttachments.map((att, idx) => (
          <Pressable
            key={att.id || idx}
            onPress={() => onAttachmentPreview?.(att)}
            style={styles.imageCard}
          >
            <Image
              source={{ uri: att.url }}
              style={styles.attachmentImage}
              resizeMode="cover"
            />
          </Pressable>
        ))}

        {/* Plain Text Message (No background bubble) */}
        {content ? (
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
    </View>
  )
}

const styles = StyleSheet.create({
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
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
  },
  attachmentImage: {
    width: 220,
    height: 140,
    borderRadius: 12,
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
})
