import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
  Platform,
  Pressable,
} from 'react-native';
import {
  X,
  Smartphone,
  Sun,
  Moon,
  RotateCw,
  MoreVertical,
  Check,
  Tablet,
  CheckCircle2,
} from 'lucide-react-native';
import { ComponentItem } from '../design-system/registry';
import { DeviceConfig } from './types';
import { DEVICES, DEFAULT_MOBILE_DEVICE } from './devices';
import { DeviceFrame } from './DeviceFrame.web';
import { useColorTheme } from '../../providers/color-theme-provider';

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
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { currentTheme } = useColorTheme();
  const activeAccent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.preview || '#18181b';

  const [selectedDevice, setSelectedDevice] = useState<DeviceConfig>(DEFAULT_MOBILE_DEVICE);
  const [simulatorTheme, setSimulatorTheme] = useState<'light' | 'dark'>(isDark ? 'dark' : 'light');
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
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
        if (isDeviceMenuOpen) {
          setIsDeviceMenuOpen(false);
        } else {
          onClose();
        }
      }
    };
    if (typeof window !== 'undefined' && isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isDeviceMenuOpen, onClose]);

  // Compute adaptive device scale so the entire phone frame (top, bottom, left, right)
  // fits completely inside the viewport without clipping on any screen size (mobile, tablet, 14" laptop, Mac)
  const deviceScale = useMemo(() => {
    const totalDeviceHeight = selectedDevice.height + selectedDevice.bezel * 2;
    const totalDeviceWidth = selectedDevice.width + selectedDevice.bezel * 2;

    // Available space inside the modal viewport
    const isSmallScreen = (windowHeight || 800) < 700;
    const headerHeight = isSmallScreen ? 110 : 130;
    const availableHeight = Math.max(300, (windowHeight || 800) * (isSmallScreen ? 0.88 : 0.82) - headerHeight);
    const availableWidth = Math.max(260, Math.min(windowWidth - 36, 500) - 28);

    const scaleH = availableHeight / totalDeviceHeight;
    const scaleW = availableWidth / totalDeviceWidth;
    const computed = Number(Math.min(scaleH, scaleW).toFixed(2));

    return Math.min(0.80, Math.max(0.38, computed));
  }, [windowHeight, windowWidth, selectedDevice]);

  if (!isOpen || !component) return null;

  const PreviewComponent = component.Preview;

  // Colors
  const modalBg = isDark ? '#11131a' : '#ffffff';
  const modalBorder = isDark ? '#232734' : '#e4e4e7';
  const textColor = isDark ? '#f4f4f5' : '#09090b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const headerBg = isDark ? '#11131a' : '#ffffff';
  const toolbarBtnBg = isDark ? '#1a1d27' : '#f4f4f6';
  const toolbarBtnBorder = isDark ? '#282d3d' : '#e2e8f0';
  const popoverBg = isDark ? '#181b26' : '#ffffff';

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
          backgroundColor: 'rgba(0, 0, 0, 0.70)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: windowWidth < 480 ? 8 : 16,
          paddingVertical: windowHeight < 700 ? 8 : 16,
          ...Platform.select({
            web: {
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
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
          onPress={() => {
            if (isDeviceMenuOpen) {
              setIsDeviceMenuOpen(false);
            } else {
              onClose();
            }
          }}
        />

        {/* Modal Dialog Card */}
        <View
          style={{
            width: '100%',
            maxWidth: 540,
            maxHeight: Math.min(900, windowHeight - (windowHeight < 700 ? 16 : 32)),
            backgroundColor: modalBg,
            borderRadius: windowWidth < 480 ? 18 : 24,
            borderWidth: 1,
            borderColor: modalBorder,
            zIndex: 10,
            ...Platform.select({
              web: {
                boxShadow:
                  '0 25px 60px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              } as any,
            }),
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: windowWidth < 480 ? 16 : 22,
              paddingTop: windowWidth < 480 ? 16 : 20,
              paddingBottom: 14,
              borderBottomWidth: 1,
              borderBottomColor: modalBorder,
              backgroundColor: headerBg,
              borderTopLeftRadius: windowWidth < 480 ? 18 : 24,
              borderTopRightRadius: windowWidth < 480 ? 18 : 24,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: windowWidth < 480 ? 18 : 20,
                    fontWeight: '700',
                    color: textColor,
                    letterSpacing: -0.3,
                  }}
                >
                  Live Preview
                </Text>
                <Text
                  style={{
                    fontSize: 12.5,
                    color: mutedColor,
                    marginTop: 3,
                    lineHeight: 17,
                  }}
                  numberOfLines={2}
                >
                  See how your {component.name.toLowerCase()} configurations look on a mobile mockup preview.
                </Text>
              </View>

              {/* Close Button */}
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

            {/* Sub-toolbar: Device selector chip, 3-Dot Menu & Simulator theme toggle */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 12,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: isDark ? '#1e222e' : '#f1f5f9',
                gap: 8,
              }}
            >
              {/* Left Group: Device Selector Pill + 3-Dot Menu Button */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {/* Device Selector Pill */}
                <TouchableOpacity
                  onPress={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
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
                    borderColor: isDeviceMenuOpen ? activeAccent : toolbarBtnBorder,
                  }}
                >
                  <Smartphone size={13} color={activeAccent} />
                  <Text
                    style={{
                      fontSize: 11.5,
                      fontWeight: '600',
                      color: textColor,
                    }}
                    numberOfLines={1}
                  >
                    {selectedDevice.name}
                  </Text>
                </TouchableOpacity>

                {/* 3-Dot Menu Trigger for Device Selection */}
                <TouchableOpacity
                  onPress={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
                  activeOpacity={0.7}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isDeviceMenuOpen
                      ? isDark
                        ? activeAccent + '30'
                        : activeAccent + '15'
                      : toolbarBtnBg,
                    borderWidth: 1,
                    borderColor: isDeviceMenuOpen ? activeAccent : toolbarBtnBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  accessibilityLabel="Choose emulator device"
                >
                  <MoreVertical size={14} color={isDeviceMenuOpen ? activeAccent : mutedColor} />
                </TouchableOpacity>
              </View>

              {/* Right Group: Reset + Theme Mode Toggle */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <TouchableOpacity
                  onPress={() => setRenderKey((k) => k + 1)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 8,
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
                    paddingHorizontal: 9,
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

          {/* Device Selection 3-Dot Popover Menu Overlay */}
          {isDeviceMenuOpen && (
            <View
              style={{
                position: 'absolute',
                top: 104,
                left: 18,
                width: 250,
                maxHeight: 340,
                backgroundColor: popoverBg,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: isDark ? '#333b4e' : '#cbd5e1',
                padding: 6,
                zIndex: 9999,
                ...Platform.select({
                  web: {
                    boxShadow: '0 16px 36px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
                  } as any,
                }),
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: mutedColor,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                Select Emulator Device
              </Text>
              <ScrollView style={{ maxHeight: 270 }} showsVerticalScrollIndicator={true}>
                {DEVICES.map((d) => {
                  const isSel = d.id === selectedDevice.id;
                  const isTab = d.type === 'tablet';

                  return (
                    <TouchableOpacity
                      key={d.id}
                      onPress={() => {
                        setSelectedDevice(d);
                        setIsDeviceMenuOpen(false);
                      }}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: isSel
                          ? isDark
                            ? activeAccent + '25'
                            : activeAccent + '15'
                          : 'transparent',
                        marginBottom: 2,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                        {isTab ? (
                          <Tablet size={14} color={isSel ? activeAccent : mutedColor} />
                        ) : (
                          <Smartphone size={14} color={isSel ? activeAccent : mutedColor} />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 12.5,
                              fontWeight: isSel ? '600' : '400',
                              color: isSel ? activeAccent : textColor,
                            }}
                            numberOfLines={1}
                          >
                            {d.name}
                          </Text>
                          <Text style={{ fontSize: 10, color: mutedColor }}>
                            {d.width} × {d.height} · {d.platform.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      {isSel && <Check size={14} color={activeAccent} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Modal Body: Mobile Simulator Frame (Centered & 100% visible on all screen sizes) */}
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: isDark ? '#0a0c10' : '#f1f3f7',
              borderBottomLeftRadius: windowWidth < 480 ? 18 : 24,
              borderBottomRightRadius: windowWidth < 480 ? 18 : 24,
            }}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              paddingHorizontal: 10,
              minHeight: '100%',
            }}
            showsVerticalScrollIndicator={true}
          >
            <DeviceFrame
              key={`${selectedDevice.id}-${renderKey}`}
              device={selectedDevice}
              scale={deviceScale}
              simulatorTheme={simulatorTheme}
              title={component.name}
              onClose={onClose}
            >
              <PreviewComponent />
            </DeviceFrame>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
