import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ComponentBadge({
  category,
  badgeText,
}: {
  category?: string;
  badgeText?: string;
}) {
  const text = badgeText || category || 'COMPONENT';
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
});
