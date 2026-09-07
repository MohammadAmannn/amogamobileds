import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Bell, Check, Info, AlertTriangle, X } from 'lucide-react-native';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const mockNotificationsData: NotificationItem[] = [
  {
    id: '1',
    title: 'Design System Updated',
    message: 'New component variants and theme palettes are now available.',
    time: '5m ago',
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Build Successful',
    message: 'All package dependencies passed validation checks.',
    time: '1h ago',
    read: true,
    type: 'success',
  },
  {
    id: '3',
    title: 'Theme Synchronization',
    message: 'Dark and light modes have been synchronized with system settings.',
    time: '2h ago',
    read: true,
    type: 'info',
  },
];

export function NotificationCardItem({
  notification,
  isSelected,
  onSelect,
}: {
  notification: NotificationItem;
  isSelected?: boolean;
  onSelect?: (notif: NotificationItem) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onSelect?.(notification)}
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          borderColor: isSelected ? '#8b5cf6' : '#e4e4e7',
          backgroundColor: notification.read ? '#ffffff' : '#f5f3ff',
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Bell size={14} color="#8b5cf6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>{notification.time}</Text>
        </View>
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.message}>{notification.message}</Text>
    </TouchableOpacity>
  );
}

export function CompleteNotificationPage() {
  return (
    <ScrollView style={styles.pageContainer} contentContainerStyle={{ gap: 10, padding: 16 }}>
      <Text style={styles.pageTitle}>Notifications</Text>
      {mockNotificationsData.map((notif) => (
        <NotificationCardItem key={notif.id} notification={notif} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#09090b',
  },
  time: {
    fontSize: 11,
    color: '#71717a',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8b5cf6',
  },
  message: {
    fontSize: 12,
    color: '#52525b',
    lineHeight: 16,
  },
  pageContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#09090b',
  },
});
