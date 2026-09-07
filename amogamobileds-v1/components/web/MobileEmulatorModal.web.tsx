import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {
  X,
  Smartphone,
  Sun,
  Moon,
  RotateCw,
} from 'lucide-react-native';
import { ComponentItem } from '@/components/design-system/registry';
import { DeviceConfig } from './types';
import { DEVICES, DEFAULT_MOBILE_DEVICE } from './devices';
import { DeviceFrame } from './DeviceFrame.web';
import { useColorTheme } from '@/providers/color-theme-provider';

interface MobileEmulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: ComponentItem | null;
  isDark?: boolean;
}

export function MobileEmulatorModal({
  isOpen,
  onClose,
  component,
  isDark = false,
}: MobileEmulatorModalProps) {
  const { height: windowHeight } = useWindowDimensions();
  const { currentTheme } = useColorTheme();
  const activeAccent = currentTheme?.preview || (isDark ? '#818cf8' : '#4f46e5');

  const [selectedDevice, setSelectedDevice] = useState<DeviceConfig>(DEFAULT_MOBILE_DEVICE);
  const [simulatorTheme, setSimulatorTheme] = useState<'light' | 'dark'>(isDark ? 'dark' : 'light');
  const [deviceListOpen, setDeviceListOpen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Sync simulator theme with system/current theme when modal opens
  useEffect(() => {
    if (isOpen) {
      setSimulatorTheme(isDark ? 'dark' : 'light');
    }
  }, [isOpen, isDark]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (typeof window !== 'undefined' && isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Compute adaptive device scale so the phone frame fits inside the modal perfectly
  const deviceScale = useMemo(() => {
    const totalDeviceHeight = selectedDevice.height + selectedDevice.bezel * 2;
    // Available height inside modal = windowHeight * 0.82 - header/controls (~140px)
    const availableHeight = Math.max(380, (windowHeight || 800) * 0.82 - 140);
    const computed = Number((availableHeight / totalDeviceHeight).toFixed(2));
    return Math.min(0.85, Math.max(0.48, computed));
  }, [windowHeight, selectedDevice]);

  if (!isOpen || !component) return null;

  const PreviewComponent = component.Preview;

  // Colors
  const modalBg = isDark ? '#11131a' : '#ffffff';
  const modalBorder = isDark ? '#232733' : '#e4e4e7';
  const textColor = isDark ? '#f4f4f5' : '#09090b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const headerBg = isDark ? '#11131a' : '#ffffff';
  const toolbarBtnBg = isDark ? '#1a1d27' : '#f4f4f6';
  const toolbarBtnBorder = isDark ? '#282d3d' : '#e2e8f0';

  const mobileDevices = DEVICES.filter((d) => d.type === 'mobile');

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop overlay */}
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 20,
          ...Platform.select({
            web: {
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            } as any,
          }),
        }}
      >
        {/* Clickable Backdrop Dismiss Layer */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal Dialog Card */}
        <View
          style={{
            width: '100%',
            maxWidth: 520,
            maxHeight: Math.min(880, windowHeight - 40),
            backgroundColor: modalBg,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: modalBorder,
            overflow: 'hidden',
            zIndex: 10,
            ...Platform.select({
              web: {
                boxShadow:
                  '0 25px 60px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              } as any,
            }),
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header (Matching Screenshot 1) */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 22,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: modalBorder,
              backgroundColor: headerBg,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: textColor,
                    letterSpacing: -0.3,
                  }}
                >
                  Live Preview
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: mutedColor,
                    marginTop: 4,
                    lineHeight: 18,
                  }}
                >
                  See how your {component.name.toLowerCase()} configurations look on a mobile mockup preview.
                </Text>
              </View>

              {/* Close Button (Circular X with subtle border) */}
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: isDark ? '#333846' : '#cbd5e1',
                  backgroundColor: isDark ? '#1a1d27' : '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -2,
                }}
                accessibilityLabel="Close live preview"
              >
                <X size={16} color={mutedColor} />
              </TouchableOpacity>
            </View>

            {/* Sub-toolbar: Device selector chip & Simulator theme toggle */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 14,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: isDark ? '#1e222e' : '#f1f5f9',
              }}
            >
              {/* Device Selector Pill */}
              <View style={{ position: 'relative' }}>
                <TouchableOpacity
                  onPress={() => setDeviceListOpen(!deviceListOpen)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 14,
                    backgroundColor: toolbarBtnBg,
                    borderWidth: 1,
                    borderColor: toolbarBtnBorder,
                  }}
                >
                  <Smartphone size={13} color={activeAccent} />
                  <Text
                    style={{
                      fontSize: 11.5,
                      fontWeight: '600',
                      color: textColor,
                    }}
                  >
                    {selectedDevice.name}
                  </Text>
                </TouchableOpacity>

                {/* Device Dropdown Menu */}
                {deviceListOpen && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 34,
                      left: 0,
                      width: 200,
                      backgroundColor: isDark ? '#181b24' : '#ffffff',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: modalBorder,
                      padding: 6,
                      zIndex: 100,
                      ...Platform.select({
                        web: {
                          boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                        } as any,
                      }),
                    }}
                  >
                    {mobileDevices.map((d) => {
                      const isSel = d.id === selectedDevice.id;
                      return (
                        <TouchableOpacity
                          key={d.id}
                          onPress={() => {
                            setSelectedDevice(d);
                            setDeviceListOpen(false);
                          }}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 7,
                            borderRadius: 8,
                            backgroundColor: isSel
                              ? (isDark ? activeAccent + '30' : activeAccent + '15')
                              : 'transparent',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: isSel ? '600' : '400',
                              color: isSel ? activeAccent : textColor,
                            }}
                          >
                            {d.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Action Controls: Refresh Preview + Theme Toggle */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setRenderKey((k) => k + 1)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingHorizontal: 9,
                    paddingVertical: 5,
                    borderRadius: 14,
                    backgroundColor: toolbarBtnBg,
                    borderWidth: 1,
                    borderColor: toolbarBtnBorder,
                  }}
                  accessibilityLabel="Reset component state"
                >
                  <RotateCw size={12} color={mutedColor} />
                  <Text style={{ fontSize: 11, color: mutedColor }}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setSimulatorTheme(simulatorTheme === 'dark' ? 'light' : 'dark')
                  }
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 14,
                    backgroundColor: toolbarBtnBg,
                    borderWidth: 1,
                    borderColor: toolbarBtnBorder,
                  }}
                >
                  {simulatorTheme === 'dark' ? (
                    <>
                      <Moon size={12} color="#a855f7" />
                      <Text style={{ fontSize: 11, fontWeight: '500', color: textColor }}>
                        Dark
                      </Text>
                    </>
                  ) : (
                    <>
                      <Sun size={12} color="#f59e0b" />
                      <Text style={{ fontSize: 11, fontWeight: '500', color: textColor }}>
                        Light
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Modal Body: Mobile Simulator Frame (Centered) */}
          <ScrollView
            style={{ flex: 1, backgroundColor: isDark ? '#0a0c10' : '#f1f3f7' }}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 28,
              paddingHorizontal: 16,
              minHeight: '100%',
            }}
            showsVerticalScrollIndicator={true}
          >
            <DeviceFrame
              key={`${selectedDevice.id}-${renderKey}`}
              device={selectedDevice}
              scale={deviceScale}
              simulatorTheme={simulatorTheme}
            >
              <PreviewComponent />
            </DeviceFrame>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
