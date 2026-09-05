import React from 'react';
import { Icon } from '@/components/ui/icon';
import { useColor } from '@/hooks/useColor';
import { Tabs } from 'expo-router';
import { Layers, Settings } from 'lucide-react-native';

export default function WebTabsLayout() {
  const primary = useColor('primary');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
      }}
    >
      <Tabs.Screen
        name='(home)'
        options={{
          title: 'Design System',
          tabBarIcon: ({ color }) => (
            <Icon name={Layers} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon name={Settings} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='search'
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
