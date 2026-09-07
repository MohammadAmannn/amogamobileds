import React, { useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Bell,
  Flag,
  MoreVertical,
  CornerUpLeft,
  CornerUpRight,
  Pin,
  Star,
  Heart,
  Archive,
  Trash2,
  ChevronRight,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

export interface ChatHeaderProps {
  title?: string
  subtitle?: string
  avatarUrl?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  isGroup?: boolean
  memberCount?: number
  actions?: React.ReactNode
  showDefaultActions?: boolean
  onAvatarClick?: () => void
  onNotificationClick?: () => void
  onFlagClick?: () => void
  onReply?: () => void
  onForward?: () => void
  onPin?: () => void
  onStar?: () => void
  onFavorite?: () => void
  onArchive?: () => void
  onActionThis?: () => void
  onDelete?: () => void
  style?: any
}

export function ChatHeader({
  title = 'Mohammed Aman',
  subtitle = 'Last seen today at 04:58 PM',
  avatarUrl,
  status = 'online',
  isGroup = false,
  memberCount,
  actions,
  showDefaultActions = true,
  onAvatarClick,
  onNotificationClick,
  onFlagClick,
  onReply,
  onForward,
  onPin,
  onStar,
  onFavorite,
  onArchive,
  onActionThis,
  onDelete,
  style,
}: ChatHeaderProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return '#10b981'
      case 'away':
        return '#f59e0b'
      case 'busy':
        return '#ef4444'
      default:
        return '#94a3b8'
    }
  }

  const initials =
    title
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MA'

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        style,
      ]}
    >
      {/* Left Column: Avatar + Info */}
      <View style={styles.leftInfo}>
        <Pressable
          onPress={onAvatarClick}
          style={styles.avatarWrapper}
          accessibilityRole="button"
          accessibilityLabel="User avatar"
        >
          <View
            style={[
              styles.avatarBox,
              {
                backgroundColor: isDark
                  ? 'rgba(99, 102, 241, 0.2)'
                  : '#e0e7ff',
                borderColor: colors.border,
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
          {!isGroup && (
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getStatusColor(),
                  borderColor: colors.background,
                },
              ]}
            />
          )}
        </Pressable>

        <View style={styles.titleInfo}>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[styles.subtitle, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {subtitle
              ? subtitle
              : isGroup
              ? `${memberCount || 0} members`
              : status}
          </Text>
        </View>
      </View>

      {/* Right Column: Actions */}
      <View style={styles.rightActions}>
        {actions ? (
          actions
        ) : showDefaultActions ? (
          <View style={styles.actionIconsRow}>
            {/* Outline Bell Icon in Amber (Act on this) */}
            <Pressable
              onPress={onNotificationClick}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && { backgroundColor: colors.secondary },
              ]}
              hitSlop={6}
              accessibilityLabel="Act on this"
            >
              <Bell size={16} color="#f59e0b" strokeWidth={2} />
            </Pressable>

            {/* Quick Flag Action */}
            <Pressable
              onPress={onFlagClick}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && { backgroundColor: colors.secondary },
              ]}
              hitSlop={6}
              accessibilityLabel="Flag"
            >
              <Flag size={16} color={colors.mutedForeground} strokeWidth={2} />
            </Pressable>

            {/* 3-Dot More Options Menu */}
            <Pressable
              onPress={() => setIsMenuOpen(true)}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && { backgroundColor: colors.secondary },
              ]}
              hitSlop={6}
              accessibilityLabel="More options"
            >
              <MoreVertical
                size={16}
                color={colors.mutedForeground}
                strokeWidth={2}
              />
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setIsMenuOpen(false)}
        >
          <View
            style={[
              styles.menuCard,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                setIsMenuOpen(false)
                onReply?.()
              }}
              style={styles.menuOption}
            >
              <CornerUpLeft size={15} color="#3b82f6" />
              <Text style={[styles.menuOptionText, { color: colors.foreground }]}>
                Reply
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsMenuOpen(false)
                onForward?.()
              }}
              style={styles.menuOption}
            >
              <CornerUpRight size={15} color="#0284c7" />
              <Text style={[styles.menuOptionText, { color: colors.foreground }]}>
                Forward
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsMenuOpen(false)
                onPin?.()
              }}
              style={styles.menuOption}
            >
              <Pin size={15} color="#9333ea" />
              <Text style={[styles.menuOptionText, { color: colors.foreground }]}>
                Pin Message
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsMenuOpen(false)
                onStar?.()
              }}
              style={styles.menuOption}
            >
              <Star size={15} color="#f59e0b" />
              <Text style={[styles.menuOptionText, { color: colors.foreground }]}>
                Star
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsMenuOpen(false)
                onFavorite?.()
              }}
              style={styles.menuOption}
            >
              <Heart size={15} color="#f43f5e" />
              <Text style={[styles.menuOptionText, { color: colors.foreground }]}>
                Favorite
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsMenuOpen(false)
                onArchive?.()
              }}
              style={styles.menuOption}
            >
              <Archive size={15} color="#6366f1" />
              <Text style={[styles.menuOptionText, { color: colors.foreground }]}>
                Archive
              </Text>
            </Pressable>

            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

            <Pressable
              onPress={() => {
                setIsMenuOpen(false)
                onActionThis?.()
              }}
              style={styles.menuOption}
            >
              <Bell size={15} color="#f59e0b" />
              <Text style={[styles.menuOptionText, { color: colors.foreground, flex: 1 }]}>
                Action This
              </Text>
              <ChevronRight size={13} color={colors.mutedForeground} />
            </Pressable>

            <Pressable
              onPress={() => {
                setIsMenuOpen(false)
                onDelete?.()
              }}
              style={styles.menuOption}
            >
              <Trash2 size={15} color="#ef4444" />
              <Text style={[styles.menuOptionText, { color: '#ef4444', flex: 1 }]}>
                Delete
              </Text>
              <ChevronRight size={13} color="#f87171" />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  statusDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  titleInfo: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  menuCard: {
    width: 210,
    borderRadius: 14,
    borderWidth: 1,
    padding: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
    gap: 2,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  menuOptionText: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  menuDivider: {
    height: 1,
    marginVertical: 4,
  },
})
