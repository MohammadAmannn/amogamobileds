import React from 'react'
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Users, MoreHorizontal } from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

export interface ChatCardItemProps {
  id: string
  title: string
  badgeLabel?: string
  lastMessage?: string
  time?: string | Date
  membersCount?: number
  onlineCount?: number
  unreadCount?: number
  isActive?: boolean
  isGroup?: boolean
  onClick?: () => void
  onPress?: () => void
  onMoreClick?: () => void
}

export function ChatCardItem({
  id,
  title,
  badgeLabel = 'Chat',
  lastMessage,
  time,
  membersCount = 2,
  onlineCount = 0,
  unreadCount = 0,
  isActive = false,
  isGroup = false,
  onClick,
  onPress,
  onMoreClick,
}: ChatCardItemProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const formattedTime =
    time instanceof Date
      ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : time

  const handlePress = () => {
    if (onClick) onClick()
    if (onPress) onPress()
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        isActive
          ? {
              backgroundColor: isDark
                ? 'rgba(99, 102, 241, 0.16)'
                : '#eef2ff',
              borderColor: isDark
                ? 'rgba(99, 102, 241, 0.4)'
                : 'rgba(199, 210, 254, 0.8)',
            }
          : {
              backgroundColor: pressed
                ? isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.03)'
                : 'transparent',
              borderColor: 'transparent',
            },
        unreadCount > 0 &&
          !isActive && {
            backgroundColor: isDark
              ? 'rgba(99, 102, 241, 0.08)'
              : 'rgba(99, 102, 241, 0.04)',
          },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      {/* Active Left Indicator Bar */}
      {isActive && (
        <View
          style={[
            styles.indicatorBar,
            { backgroundColor: isDark ? '#818cf8' : '#4f46e5' },
          ]}
        />
      )}

      {/* Row 1: Name, Badge, Timestamp */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Text
            style={[
              styles.titleText,
              {
                color: colors.foreground,
                fontWeight: isActive ? '500' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {badgeLabel ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isDark
                    ? 'rgba(16, 185, 129, 0.18)'
                    : 'rgba(16, 185, 129, 0.12)',
                  borderColor: isDark
                    ? 'rgba(16, 185, 129, 0.35)'
                    : 'rgba(167, 243, 208, 0.8)',
                },
              ]}
            >
              <Text style={styles.badgeEmoji}>💬</Text>
              <Text
                style={[
                  styles.badgeText,
                  { color: isDark ? '#34d399' : '#059669' },
                ]}
              >
                {badgeLabel}
              </Text>
            </View>
          ) : null}
        </View>

        {formattedTime ? (
          <Text
            style={[styles.timeText, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {formattedTime}
          </Text>
        ) : null}
      </View>

      {/* Row 2: Members Count */}
      <View style={styles.membersRow}>
        <Users
          size={13}
          color={colors.mutedForeground}
          strokeWidth={1.8}
        />
        <Text
          style={[styles.membersText, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {membersCount} Members • {onlineCount} Online
        </Text>
      </View>

      {/* Row 3: Last Message Snippet */}
      {lastMessage ? (
        <Text
          style={[styles.lastMessageText, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {lastMessage}
        </Text>
      ) : null}

      {/* Optional More button */}
      {onMoreClick ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation()
            onMoreClick()
          }}
          hitSlop={6}
          style={styles.moreButton}
        >
          <MoreHorizontal size={14} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    flexDirection: 'column',
    gap: 4,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  indicatorBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3.5,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  titleText: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeEmoji: {
    fontSize: 9,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  membersText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  lastMessageText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    marginTop: 2,
    lineHeight: 16,
  },
  moreButton: {
    position: 'absolute',
    top: 10,
    right: 8,
    padding: 4,
    borderRadius: 4,
  },
})
