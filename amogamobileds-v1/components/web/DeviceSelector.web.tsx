import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown, Check, Smartphone, Tablet } from 'lucide-react-native';
import { DeviceConfig } from './types';
import { DEVICES } from './devices';

interface DeviceSelectorProps {
  selectedDevice: DeviceConfig;
  onSelectDevice: (device: DeviceConfig) => void;
  isDark?: boolean;
}

export function DeviceSelector({
  selectedDevice,
  onSelectDevice,
  isDark = false,
}: DeviceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const iosDevices = DEVICES.filter((d) => d.platform === 'ios');
  const androidDevices = DEVICES.filter((d) => d.platform === 'android');

  const bg = isDark ? '#18181b' : '#ffffff';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const text = isDark ? '#f4f4f5' : '#09090b';
  const muted = isDark ? '#a1a1aa' : '#71717a';
  const activeItemBg = isDark ? '#27272a' : '#f4f4f5';

  return (
    <View style={{ position: 'relative', zIndex: 1000 }}>
      {/* Invisible backdrop to close on outside click */}
      {isOpen && (
        <TouchableOpacity
          style={{
            position: 'fixed' as any,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        />
      )}

      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          height: 32,
          paddingHorizontal: 10,
          borderRadius: 7,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: isOpen ? '#8b5cf6' : border,
          zIndex: 10000,
        }}
      >
        {selectedDevice.type === 'tablet' ? (
          <Tablet size={14} color={muted} />
        ) : (
          <Smartphone size={14} color={muted} />
        )}
        <Text style={{ fontSize: 12.5, fontWeight: '600', color: text }}>
          {selectedDevice.name}
        </Text>
        <ChevronDown size={13} color={muted} />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {isOpen && (
        <View
          style={{
            position: 'absolute',
            top: 38,
            right: 0,
            width: 250,
            maxHeight: 380,
            backgroundColor: bg,
            borderWidth: 1,
            borderColor: border,
            borderRadius: 10,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 100,
            zIndex: 10001,
            padding: 6,
          }}
        >
          <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={true}>
            {/* iOS Group */}
            <Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                fontSize: 10.5,
                fontWeight: '700',
                color: muted,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
              }}
            >
              Apple iOS & iPadOS
            </Text>
            {iosDevices.map((device) => {
              const isSelected = device.id === selectedDevice.id;
              return (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => {
                    onSelectDevice(device);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 6,
                    backgroundColor: isSelected ? activeItemBg : 'transparent',
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 12.5,
                        fontWeight: isSelected ? '700' : '500',
                        color: text,
                      }}
                    >
                      {device.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: muted }}>
                      {device.width} × {device.height}
                    </Text>
                  </View>
                  {isSelected && <Check size={14} color="#10b981" />}
                </TouchableOpacity>
              );
            })}

            <View style={{ height: 1, backgroundColor: border, marginVertical: 6 }} />

            {/* Android Group */}
            <Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                fontSize: 10.5,
                fontWeight: '700',
                color: muted,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
              }}
            >
              Google Android
            </Text>
            {androidDevices.map((device) => {
              const isSelected = device.id === selectedDevice.id;
              return (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => {
                    onSelectDevice(device);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 6,
                    backgroundColor: isSelected ? activeItemBg : 'transparent',
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 12.5,
                        fontWeight: isSelected ? '700' : '500',
                        color: text,
                      }}
                    >
                      {device.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: muted }}>
                      {device.width} × {device.height}
                    </Text>
                  </View>
                  {isSelected && <Check size={14} color="#10b981" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
