import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { useColorScheme } from '../../../hooks/useColorScheme';
import initialPreferences from '../../ui/app_preference_settings.json';
import type { PreferenceItem } from '../../ui/preferences-drawer';

export type { PreferenceItem };

export function PreferencesPreview() {
  const isDark = useColorScheme() === 'dark';
  const purpleText = isDark ? '#c084fc' : '#9333ea';
  const textMuted = isDark ? '#94a3b8' : '#71717a';

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
    </View>
  );
}

