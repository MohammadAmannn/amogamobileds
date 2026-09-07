import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MessageSquareDashed } from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

export interface ChatEmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  style?: any
}

export function ChatEmptyState({
  title = 'No conversation selected',
  description = 'Choose a chat from the sidebar or start a new conversation to begin messaging.',
  icon,
  action,
  style,
}: ChatEmptyStateProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: isDark ? colors.card : '#f1f5f9',
            borderColor: colors.border,
          },
        ]}
      >
        {icon || (
          <MessageSquareDashed
            size={32}
            color={isDark ? '#a5b4fc' : '#4f46e5'}
            strokeWidth={1.8}
          />
        )}
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>
        {description}
      </Text>
      {action ? <View style={styles.actionBox}>{action}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 300,
  },
  actionBox: {
    marginTop: 16,
  },
})
