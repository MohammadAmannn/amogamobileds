import React, { useRef, useEffect } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useTheme } from '@/providers/theme-provider'

export interface ChatMessageListProps {
  children?: React.ReactNode
  emptyState?: React.ReactNode
  isLoadingMore?: boolean
  autoScrollToBottom?: boolean
  style?: any
}

export function ChatMessageList({
  children,
  emptyState,
  isLoadingMore = false,
  autoScrollToBottom = true,
  style,
}: ChatMessageListProps) {
  const { colors } = useTheme()
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (autoScrollToBottom) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false })
      }, 50)
    }
  }, [children, autoScrollToBottom])

  const hasChildren = React.Children.count(children) > 0

  return (
    <View style={[styles.container, style]}>
      {isLoadingMore ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : null}

      {!hasChildren && emptyState ? (
        <View style={styles.emptyContainer}>{emptyState}</View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loaderBox: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 8,
  },
})
