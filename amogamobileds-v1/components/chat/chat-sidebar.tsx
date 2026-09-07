import React from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Search, MessageSquare, Plus } from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

export interface ChatSidebarTab {
  id: string
  label: string
  count?: number
}

export interface ChatSidebarProps {
  title?: string
  searchValue?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  tabs?: ChatSidebarTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  sectionLabel?: string
  sectionCount?: number
  actions?: React.ReactNode
  onNewChat?: () => void
  children?: React.ReactNode
  footer?: React.ReactNode
  style?: any
}

export function ChatSidebar({
  title = 'Chats',
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  tabs = [
    { id: 'chats', label: 'Chats' },
    { id: 'contact', label: 'Contact' },
    { id: 'groups', label: 'Groups' },
    { id: 'folder', label: 'Folder' },
  ],
  activeTab = 'chats',
  onTabChange,
  sectionLabel = 'CHATS',
  sectionCount = 2,
  actions,
  onNewChat,
  children,
  footer,
  style,
}: ChatSidebarProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {/* 1. Top Subtabs (Chats, Contact, Groups, Folder) with Active Underline */}
      <View
        style={[
          styles.tabsRow,
          { borderBottomColor: isDark ? colors.border : '#f1f5f9' },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id
            const activeTextColor = isDark ? '#a5b4fc' : '#4f46e5'
            const inactiveTextColor = colors.mutedForeground

            return (
              <Pressable
                key={tab.id}
                onPress={() => onTabChange?.(tab.id)}
                style={styles.tabBtn}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isSelected ? activeTextColor : inactiveTextColor,
                      fontWeight: isSelected ? '500' : '400',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
                {isSelected && (
                  <View
                    style={[
                      styles.activeIndicator,
                      { backgroundColor: isDark ? '#818cf8' : '#4f46e5' },
                    ]}
                  />
                )}
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {/* 2. Rounded Search Bar */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchWrapper,
            {
              backgroundColor: isDark ? colors.card : colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Search
            size={14}
            color={colors.mutedForeground}
            strokeWidth={2}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* 3. Category Section Divider (💬 CHATS ─────────── 2) */}
      <View style={styles.sectionHeader}>
        <MessageSquare
          size={14}
          color={isDark ? '#34d399' : '#059669'}
          strokeWidth={2.2}
        />
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.mutedForeground },
          ]}
        >
          {sectionLabel}
        </Text>
        <View
          style={[
            styles.sectionDivider,
            { backgroundColor: isDark ? colors.border : '#e2e8f0' },
          ]}
        />
        {typeof sectionCount === 'number' && (
          <Text
            style={[styles.sectionCount, { color: colors.mutedForeground }]}
          >
            {sectionCount}
          </Text>
        )}
      </View>

      {/* 4. Scrollable Conversations List */}
      <ScrollView
        style={styles.listScrollView}
        contentContainerStyle={styles.listScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {/* Optional Footer */}
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.border,
              backgroundColor: isDark ? colors.card : '#f8fafc',
            },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabsRow: {
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  tabBtn: {
    position: 'relative',
    paddingBottom: 8,
    paddingHorizontal: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    borderRadius: 9999,
  },
  searchSection: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchWrapper: {
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    padding: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.8,
    fontFamily: 'Open Sans',
    textTransform: 'uppercase',
  },
  sectionDivider: {
    flex: 1,
    height: 1,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
  },
  listScrollView: {
    flex: 1,
  },
  listScrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
  },
})
