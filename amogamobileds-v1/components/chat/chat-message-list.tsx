import React, { useRef, useEffect } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Keyboard,
  Platform,
} from 'react-native'
import { useTheme } from '../../providers/theme-provider'

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
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 60)
      return () => clearTimeout(timer)
    }
  }, [children, autoScrollToBottom])

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        if (autoScrollToBottom) {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }, 80)
        }
      }
    )
    return () => {
      showSub.remove()
    }
  }, [autoScrollToBottom])

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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          onContentSizeChange={() => {
            if (autoScrollToBottom) {
              scrollViewRef.current?.scrollToEnd({ animated: false })
            }
          }}
          onLayout={() => {
            if (autoScrollToBottom) {
              scrollViewRef.current?.scrollToEnd({ animated: false })
            }
          }}
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
