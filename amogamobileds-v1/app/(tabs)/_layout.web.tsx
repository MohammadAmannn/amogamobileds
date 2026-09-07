import React from 'react';
import { Tabs } from 'expo-router';

export default function WebTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name='(home)'
        options={{
          title: 'Design System',
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
