import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Sliders } from 'lucide-react-native';
import { useColorScheme } from '../../../hooks/useColorScheme';
import initialPreferences from '../../ui/app_preference_settings.json';
import { PreferencesDrawer, PreferenceItem } from '../../ui/preferences-drawer';

export { type PreferenceItem };

export function PreferencesPreview() {
  const isDark = useColorScheme() === 'dark';
  const purpleText = isDark ? '#c084fc' : '#9333ea';
  const textMuted = isDark ? '#94a3b8' : '#71717a';

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [preferences, setPreferences] = useState<PreferenceItem[]>(
    initialPreferences as PreferenceItem[]
  );

  const handleToggle = (id: string, value: boolean) => {
    setPreferences((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: value ? 'Yes' : 'No' } : item
      )
    );
  };

  return (
    <View style={{ width: '100%', gap: 16 }}>
      {/* Drawer Trigger Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsDrawerOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#9333ea',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          gap: 8,
        }}
      >
        <Sliders size={16} color="#ffffff" />
        <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 13.5 }}>
          Open Preferences Drawer
        </Text>
      </TouchableOpacity>

      {/* 10 Preference Switch Items */}
      <View style={{ gap: 16 }}>
        {preferences.map((item) => {
          const isEnabled = item.status === 'Yes';

          return (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 6,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#1e293b' : '#f1f5f9',
              }}
            >
              {/* Left Purple Label with Sub-caption */}
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text
                  style={{
                    fontSize: 14.5,
                    fontWeight: '600',
                    color: purpleText,
                    letterSpacing: -0.2,
                  }}
                >
                  {item.preference}
                </Text>
                {item.description ? (
                  <Text
                    style={{
                      fontSize: 12,
                      color: textMuted,
                      marginTop: 2,
                    }}
                  >
                    {item.description}
                  </Text>
                ) : null}
              </View>

              {/* Right Switch */}
              <Switch
                trackColor={{
                  false: isDark ? '#334155' : '#e4e4e7',
                  true: '#10b981',
                }}
                thumbColor="#ffffff"
                ios_backgroundColor={isDark ? '#334155' : '#e4e4e7'}
                onValueChange={(val) => handleToggle(item.id, val)}
                value={isEnabled}
              />
            </View>
          );
        })}
      </View>

      {/* Modal/Drawer Component */}
      <PreferencesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        preferences={preferences}
        onPreferenceChange={handleToggle}
        onResetPreferences={() => setPreferences(initialPreferences as PreferenceItem[])}
      />
    </View>
  );
}

