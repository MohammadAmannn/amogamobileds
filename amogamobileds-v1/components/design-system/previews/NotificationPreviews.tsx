import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  CompleteNotificationPage,
  NotificationCardItem,
  mockNotificationsData,
  type NotificationItem,
} from '@/components/notifications'
import { useTheme } from '@/providers/theme-provider'
import type { GalleryEntry } from '../../types'

interface NotificationPreviewsProps {
  entry?: GalleryEntry
}

export function NotificationPreviews({ entry }: NotificationPreviewsProps) {
  const { colors } = useTheme()
  const entryId = entry?.id || 'complete-notification-page'

  const [cardItemState, setCardItemState] = useState<NotificationItem>(
    mockNotificationsData[0]
  )
  const [isSelected, setIsSelected] = useState(false)

  // 1. Full Layout Page Preview
  if (entryId === 'complete-notification-page') {
    return (
      <View style={[styles.fillWrapper, { backgroundColor: colors.background }]}>
        <CompleteNotificationPage />
      </View>
    )
  }

  // 2. Standalone Notification Card Item Preview
  if (entryId === 'notification-card-item') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={styles.cardItemWrapper}>
          <NotificationCardItem
            notification={cardItemState}
            isSelected={isSelected}
            onSelect={(notif: NotificationItem) => {
              setIsSelected(!isSelected)
              setCardItemState((prev: NotificationItem) => ({ ...prev, read: true }))
            }}
          />
        </View>
      </View>
    )
  }

  // Fallback to full page
  return (
    <View style={[styles.fillWrapper, { backgroundColor: colors.background }]}>
      <CompleteNotificationPage />
    </View>
  )
}

const styles = StyleSheet.create({
  fillWrapper: {
    flex: 1,
    padding: 16,
  },
  singleComponentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  cardItemWrapper: {
    width: '100%',
    maxWidth: 360,
  },
})
