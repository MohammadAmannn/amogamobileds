import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Wifi, Signal, X } from 'lucide-react-native';
import { DeviceConfig } from './types';

interface DeviceFrameProps {
  device: DeviceConfig;
  scale?: number;
  simulatorTheme?: 'light' | 'dark';
  title?: string;
  onClose?: () => void;
  showTopBar?: boolean;
  children: React.ReactNode;
}

export function DeviceFrame({
  device,
  scale = 0.78,
  simulatorTheme = 'light',
  title,
  onClose,
  showTopBar = true,
  children,
}: DeviceFrameProps) {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formatted = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}`;
      setTimeStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isDark = simulatorTheme === 'dark';
  const screenBg = isDark ? '#09090b' : '#ffffff';
  const statusColor = isDark ? '#f4f4f5' : '#09090b';

  const totalWidth = device.width + device.bezel * 2;
  const totalHeight = device.height + device.bezel * 2;

  return (
    <View
      style={{
        width: totalWidth * scale,
        height: totalHeight * scale,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: totalWidth,
          height: totalHeight,
          transform: [{ scale }],
          transformOrigin: 'center center',
          backgroundColor: '#1c1d22',
          borderRadius: device.borderRadius + device.bezel,
          padding: device.bezel,
          position: 'relative',
          ...Platform.select({
            web: {
              boxShadow:
                '0 25px 60px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12) inset, 0 10px 20px -5px rgba(0,0,0,0.3)',
            } as any,
          }),
        }}
      >
        {/* Hardware side buttons - Volume & Power */}
        <View
          style={{
            position: 'absolute',
            left: -3,
            top: 110,
            width: 3,
            height: 48,
            backgroundColor: '#2e3036',
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: -3,
            top: 170,
            width: 3,
            height: 48,
            backgroundColor: '#2e3036',
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: -3,
            top: 140,
            width: 3,
            height: 64,
            backgroundColor: '#2e3036',
            borderTopRightRadius: 2,
            borderBottomRightRadius: 2,
          }}
        />

        {/* Screen Display Area */}
        <View
          style={{
            width: device.width,
            height: device.height,
            backgroundColor: screenBg,
            borderRadius: device.borderRadius,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Status Bar */}
          <View
            style={{
              height: device.notchType === 'island' ? 44 : 36,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 22,
              zIndex: 30,
            }}
          >
            {/* Clock */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: statusColor,
                fontFamily:
                  device.platform === 'ios'
                    ? '-apple-system, SF Pro Text, sans-serif'
                    : 'Roboto, sans-serif',
                letterSpacing: -0.2,
              }}
            >
              {timeStr}
            </Text>

            {/* Dynamic Island or Punch Hole */}
            {device.notchType === 'island' && (
              <View
                style={{
                  position: 'absolute',
                  left: device.width / 2 - (device.islandWidth || 120) / 2,
                  top: 10,
                  width: device.islandWidth || 120,
                  height: device.islandHeight || 30,
                  backgroundColor: '#000000',
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#0f172a',
                    borderWidth: 1,
                    borderColor: '#1e293b',
                  }}
                />
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: '#0284c7',
                    opacity: 0.8,
                  }}
                />
              </View>
            )}

            {device.notchType === 'punch-hole' && (
              <View
                style={{
                  position: 'absolute',
                  left: device.width / 2 - 6,
                  top: 10,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#000000',
                  borderWidth: 1,
                  borderColor: '#334155',
                }}
              />
            )}

            {/* Signal, Wifi, Battery */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Signal size={13} color={statusColor} />
              <Wifi size={13} color={statusColor} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 11,
                    borderRadius: 3.5,
                    borderWidth: 1.5,
                    borderColor: statusColor,
                    padding: 1.5,
                  }}
                >
                  <View
                    style={{
                      width: '75%',
                      height: '100%',
                      backgroundColor: statusColor,
                      borderRadius: 1.5,
                    }}
                  />
                </View>
                <View
                  style={{
                    width: 1.5,
                    height: 4,
                    backgroundColor: statusColor,
                    borderTopRightRadius: 1,
                    borderBottomRightRadius: 1,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Interactive Screen Scroll Area */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {/* Common Page Header Top Bar with Title and Right X Button */}
            {showTopBar && title && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 12,
                  marginBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? '#27272a' : '#f1f5f9',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans_600SemiBold, OpenSans_500Medium, var(--font-open-sans), "Open Sans", sans-serif',
                    fontSize: 18,
                    fontWeight: '700',
                    color: isDark ? '#f4f4f5' : '#09090b',
                    letterSpacing: -0.3,
                  }}
                >
                  {title}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  accessibilityLabel="Close"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} color={isDark ? '#a1a1aa' : '#71717a'} />
                </TouchableOpacity>
              </View>
            )}

            {children}
          </ScrollView>

          {/* Home Indicator */}
          {device.homeBar && (
            <View
              style={{
                height: 20,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30,
              }}
            >
              {device.platform === 'ios' ? (
                <View
                  style={{
                    width: 134,
                    height: 4.5,
                    borderRadius: 3,
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                    opacity: 0.75,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 72,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                    opacity: 0.5,
                  }}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
