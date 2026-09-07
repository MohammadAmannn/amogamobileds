import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/providers/theme-provider'

export interface TypingIndicatorProps {
  label?: string
  avatarUrl?: string
  style?: any
}

export function TypingIndicator({
  label = 'Typing...',
  avatarUrl,
  style,
}: TypingIndicatorProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.bubblePill,
          {
            backgroundColor: isDark ? '#27272a' : '#f1f5f9',
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: isDark ? '#a5b4fc' : '#4f46e5' },
          ]}
        />
        <View
          style={[
            styles.dot,
            styles.dotDelay1,
            { backgroundColor: isDark ? '#a5b4fc' : '#4f46e5' },
          ]}
        />
        <View
          style={[
            styles.dot,
            styles.dotDelay2,
            { backgroundColor: isDark ? '#a5b4fc' : '#4f46e5' },
          ]}
        />
      </View>

      {label ? (
        <Text style={[styles.labelText, { color: colors.mutedForeground }]}>
          {label}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bubblePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.9,
  },
  dotDelay1: {
    opacity: 0.6,
  },
  dotDelay2: {
    opacity: 0.35,
  },
  labelText: {
    fontSize: 11,
    fontStyle: 'italic',
    fontFamily: 'Open Sans',
  },
})
