import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Eye,
  Code2,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
} from 'lucide-react-native';
import { ComponentItem } from '@/components/design-system/registry';
import { DeviceConfig, DeviceType, ViewMode } from './types';
import { DeviceSelector } from './DeviceSelector.web';

interface PreviewToolbarProps {
  component: ComponentItem;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  deviceType: DeviceType;
  onChangeDeviceType: (type: DeviceType) => void;
  selectedDevice: DeviceConfig;
  onSelectDevice: (device: DeviceConfig) => void;
  simulatorTheme: 'light' | 'dark';
  onToggleSimulatorTheme: () => void;
  scale: number;
  onChangeScale: (scale: number) => void;
  onOpenFullscreen: () => void;
  onOpenThemeSettings?: () => void;
  isDark?: boolean;
}

export function PreviewToolbar({
  component,
  viewMode,
  onChangeViewMode,
  deviceType,
  onChangeDeviceType,
  selectedDevice,
  onSelectDevice,
  simulatorTheme,
  onToggleSimulatorTheme,
  scale,
  onChangeScale,
  onOpenFullscreen,
  onOpenThemeSettings,
  isDark = false,
}: PreviewToolbarProps) {
  const bg = isDark ? '#14171f' : '#ffffff';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const text = isDark ? '#f4f4f5' : '#09090b';
  const muted = isDark ? '#a1a1aa' : '#71717a';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: bg,
        borderBottomWidth: 1,
        borderBottomColor: border,
        zIndex: 40,
        flexWrap: 'nowrap',
        gap: 10,
        minHeight: 52,
      }}
    >
      {/* Left: Component title and Tag badge */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 100 }}>
        <Text
          style={{ fontSize: 15, fontWeight: '500', color: text }}
          numberOfLines={1}
        >
          {component.name}
        </Text>
        <View
          style={{
            paddingHorizontal: 7,
            paddingVertical: 2,
            borderRadius: 6,
            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
          }}
        >
          <Text style={{ fontSize: 9.5, fontWeight: '500', color: '#8b5cf6', letterSpacing: 0.5 }}>
            {component.tag}
          </Text>
        </View>
      </View>

      {/* Center: Modes & Device Type */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* View Mode Segmented Control: Preview | Code */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#1f222a' : '#f4f4f5',
            borderRadius: 8,
            padding: 3,
            borderWidth: 1,
            borderColor: border,
          }}
        >
          <TouchableOpacity
            onPress={() => onChangeViewMode('preview')}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: viewMode === 'preview' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
            }}
          >
            <Eye size={13} color={viewMode === 'preview' ? text : muted} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: viewMode === 'preview' ? text : muted,
              }}
            >
              Preview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChangeViewMode('code')}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: viewMode === 'code' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
            }}
          >
            <Code2 size={13} color={viewMode === 'code' ? text : muted} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: viewMode === 'code' ? text : muted,
              }}
            >
              Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* Device Type: Desktop | Tablet | Mobile */}
        {viewMode === 'preview' && (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: isDark ? '#1f222a' : '#f4f4f5',
              borderRadius: 8,
              padding: 3,
              borderWidth: 1,
              borderColor: border,
            }}
          >
            <TouchableOpacity
              onPress={() => onChangeDeviceType('desktop')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: deviceType === 'desktop' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
              }}
            >
              <Monitor size={13} color={deviceType === 'desktop' ? text : muted} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: deviceType === 'desktop' ? text : muted }}>
                Desktop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChangeDeviceType('tablet')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: deviceType === 'tablet' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
              }}
            >
              <Tablet size={13} color={deviceType === 'tablet' ? text : muted} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: deviceType === 'tablet' ? text : muted }}>
                Tablet
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChangeDeviceType('mobile')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: deviceType === 'mobile' ? (isDark ? '#27272a' : '#ffffff') : 'transparent',
              }}
            >
              <Smartphone size={13} color={deviceType === 'mobile' ? text : muted} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: deviceType === 'mobile' ? text : muted }}>
                Mobile
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Right: Device Dropdown + Theme + Zoom + Fullscreen */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {/* Device Dropdown when in mobile or tablet mode */}
        {viewMode === 'preview' && deviceType !== 'desktop' && (
          <DeviceSelector
            selectedDevice={selectedDevice}
            onSelectDevice={onSelectDevice}
            isDark={isDark}
          />
        )}

        {/* Tweakcn Theme Settings Drawer Trigger */}
        {onOpenThemeSettings && (
          <TouchableOpacity
            onPress={onOpenThemeSettings}
            activeOpacity={0.7}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 7,
              backgroundColor: isDark ? '#1f222a' : '#ffffff',
              borderWidth: 1,
              borderColor: border,
            }}
          >
            <Palette size={15} color={muted} />
          </TouchableOpacity>
        )}

        {/* Simulator Theme Toggle */}
        <TouchableOpacity
          onPress={onToggleSimulatorTheme}
          activeOpacity={0.7}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 7,
            backgroundColor: isDark ? '#1f222a' : '#ffffff',
            borderWidth: 1,
            borderColor: border,
          }}
        >
          {simulatorTheme === 'dark' ? (
            <Sun size={15} color="#eab308" />
          ) : (
            <Moon size={15} color={muted} />
          )}
        </TouchableOpacity>

        {/* Zoom controls */}
        {viewMode === 'preview' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#1f222a' : '#ffffff',
              borderRadius: 7,
              borderWidth: 1,
              borderColor: border,
              height: 32,
              paddingHorizontal: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => onChangeScale(Math.max(0.4, Number((scale - 0.05).toFixed(2))))}
              style={{ padding: 4 }}
            >
              <ZoomOut size={13} color={muted} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '500',
                color: text,
                minWidth: 36,
                textAlign: 'center',
              }}
            >
              {Math.round(scale * 100)}%
            </Text>
            <TouchableOpacity
              onPress={() => onChangeScale(Math.min(1.2, Number((scale + 0.05).toFixed(2))))}
              style={{ padding: 4 }}
            >
              <ZoomIn size={13} color={muted} />
            </TouchableOpacity>
            {scale !== 0.72 && (
              <TouchableOpacity
                onPress={() => onChangeScale(0.72)}
                style={{ padding: 4 }}
              >
                <RotateCcw size={12} color={muted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Fullscreen Button */}
        <TouchableOpacity
          onPress={onOpenFullscreen}
          activeOpacity={0.7}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 7,
            backgroundColor: isDark ? '#1f222a' : '#ffffff',
            borderWidth: 1,
            borderColor: border,
          }}
        >
          <Maximize2 size={14} color={muted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
