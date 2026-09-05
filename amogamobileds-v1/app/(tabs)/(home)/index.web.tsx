import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Search,
  X,
  LayoutGrid,
  Sparkles,
  PenTool,
  AlertCircle,
  Columns,
  Eye,
} from 'lucide-react-native';
import {
  COMPONENTS,
  ComponentItem,
  ComponentCategory,
} from '@/components/design-system/registry';
import { DeviceConfig, DeviceType, ViewMode } from '@/components/web/types';
import { DEFAULT_MOBILE_DEVICE, DEFAULT_TABLET_DEVICE } from '@/components/web/devices';
import { DeviceFrame } from '@/components/web/DeviceFrame.web';
import { PreviewToolbar } from '@/components/web/PreviewToolbar.web';
import { CodePanel } from '@/components/web/CodePanel.web';
import { FullscreenModal } from '@/components/web/FullscreenModal.web';

interface CategoryConfig {
  name: 'All' | ComponentCategory;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
}

const CATEGORY_ITEMS: CategoryConfig[] = [
  { name: 'All', label: 'All', Icon: LayoutGrid },
  { name: 'Primitives', label: 'Primitives', Icon: Sparkles },
  { name: 'Inputs', label: 'Inputs', Icon: PenTool },
  { name: 'Feedback', label: 'Feedback', Icon: AlertCircle },
  { name: 'Layout', label: 'Layout', Icon: Columns },
  { name: 'Display', label: 'Display', Icon: Eye },
];

export default function WebPlaygroundScreen() {
  const systemTheme = useColorScheme();
  const isDark = systemTheme === 'dark';
  const { height: windowHeight } = useWindowDimensions();

  // Compute adaptive initial scale so mobile phone fits viewport comfortably
  const initialScale = useMemo(() => {
    const available = (windowHeight || 800) - 140;
    return Math.min(0.76, Math.max(0.55, Number((available / 920).toFixed(2))));
  }, [windowHeight]);

  // State
  const [activeComponent, setActiveComponent] = useState<ComponentItem>(COMPONENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ComponentCategory>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');
  const [selectedDevice, setSelectedDevice] = useState<DeviceConfig>(DEFAULT_MOBILE_DEVICE);
  const [simulatorTheme, setSimulatorTheme] = useState<'light' | 'dark'>(isDark ? 'dark' : 'light');
  const [userScale, setUserScale] = useState<number | null>(null);
  const scale = userScale ?? initialScale;
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Colors
  const sidebarBg = isDark ? '#0e1017' : '#ffffff';
  const sidebarBorder = isDark ? '#1e222e' : '#e4e4e7';
  const canvasBg = isDark ? '#07080c' : '#f4f4f6';
  const text = isDark ? '#f4f4f5' : '#09090b';
  const muted = isDark ? '#a1a1aa' : '#71717a';
  const cardBg = isDark ? '#141721' : '#f8fafc';
  const cardBorder = isDark ? '#1e222e' : '#f1f5f9';

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: COMPONENTS.length };
    COMPONENTS.forEach((comp: ComponentItem) => {
      counts[comp.category] = (counts[comp.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered components
  const filteredComponents = useMemo(() => {
    return COMPONENTS.filter((comp: ComponentItem) => {
      const matchesCategory =
        selectedCategory === 'All' || comp.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.file.toLowerCase().includes(q) ||
        comp.tag.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Handle device type switch
  const handleDeviceTypeChange = (type: DeviceType) => {
    setDeviceType(type);
    if (type === 'tablet') {
      setSelectedDevice(DEFAULT_TABLET_DEVICE);
      setUserScale(0.55);
    } else if (type === 'mobile') {
      setSelectedDevice(DEFAULT_MOBILE_DEVICE);
      setUserScale(null);
    } else {
      setUserScale(1);
    }
  };

  // Badge colors matching screenshot 1
  const getBadgeColors = (tag: string) => {
    switch (tag) {
      case 'BUTTON':
        return { bg: '#F3E8FF', text: '#9333EA' };
      case 'INPUT':
      case 'OTP INPUT':
        return { bg: '#E0F2FE', text: '#0284C7' };
      case 'BADGE':
        return { bg: '#FCE7F3', text: '#DB2777' };
      case 'AVATAR':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'CARD':
        return { bg: '#EDE9FE', text: '#6366F1' };
      case 'CHECKBOX':
      case 'SWITCH':
        return { bg: '#F1F5F9', text: '#475569' };
      case 'TOAST':
      case 'NOTIFICATION':
        return { bg: '#FCE7F3', text: '#BE185D' };
      case 'SPINNER':
      case 'SKELETON':
        return { bg: '#DCFCE7', text: '#16A34A' };
      default:
        return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const PreviewComponent = activeComponent.Preview;

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        backgroundColor: canvasBg,
        overflow: 'hidden',
      }}
    >
      {/* ============================================================ */}
      {/* LEFT SIDEBAR (~360px) - Independently Scrollable              */}
      {/* ============================================================ */}
      <View
        style={{
          width: 360,
          height: '100%',
          backgroundColor: sidebarBg,
          borderRightWidth: 1,
          borderRightColor: sidebarBorder,
          zIndex: 20,
        }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: sidebarBorder,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                backgroundColor: '#059669',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 19, fontWeight: '700' }}>⌘</Text>
            </View>
            <View>
              <Text style={{ fontSize: 17, fontWeight: '700', color: text, letterSpacing: -0.2 }}>
                Design System
              </Text>
              <Text style={{ fontSize: 11, color: muted, marginTop: 1 }}>
                Playground & Simulator
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 38,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: sidebarBorder,
              backgroundColor: isDark ? '#141721' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Search size={15} color="#94a3b8" />
            <TextInput
              placeholder="Search components, files..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                fontSize: 13,
                color: text,
                padding: 0,
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 2 }}>
                <X size={14} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter Chips */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 12 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORY_ITEMS.map((item) => {
              const isSelected = selectedCategory === item.name;
              const count = categoryCounts[item.name] || 0;
              const IconComp = item.Icon;

              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => setSelectedCategory(item.name)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingHorizontal: 9,
                    paddingVertical: 4,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isSelected ? '#86efac' : sidebarBorder,
                    backgroundColor: isSelected ? '#dcfce7' : isDark ? '#141721' : '#f8fafc',
                  }}
                >
                  <IconComp size={12} color={isSelected ? '#15803d' : '#64748b'} />
                  <Text
                    style={{
                      color: isSelected ? '#15803d' : text,
                      fontSize: 11.5,
                      fontWeight: isSelected ? '600' : '500',
                    }}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: 1,
                      borderRadius: 8,
                      backgroundColor: isSelected ? '#bbf7d0' : isDark ? '#27272a' : '#e2e8f0',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '600',
                        color: isSelected ? '#166534' : muted,
                      }}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Scrollable Component Cards List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 16, gap: 7 }}
          showsVerticalScrollIndicator={true}
        >
          {filteredComponents.map((comp) => {
            const isCurrent = comp.id === activeComponent.id;
            const badge = getBadgeColors(comp.tag);

            return (
              <TouchableOpacity
                key={comp.id}
                onPress={() => setActiveComponent(comp)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 9,
                  borderWidth: 1,
                  borderColor: isCurrent ? '#8b5cf6' : cardBorder,
                  backgroundColor: isCurrent
                    ? (isDark ? '#1c1833' : '#f5f3ff')
                    : cardBg,
                  borderLeftWidth: isCurrent ? 4 : 1,
                  borderLeftColor: isCurrent ? '#6366f1' : cardBorder,
                }}
              >
                {/* Line 1: Title & Tag */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13.5,
                      fontWeight: isCurrent ? '700' : '600',
                      color: isCurrent ? (isDark ? '#e0e7ff' : '#4338ca') : text,
                      flex: 1,
                      paddingRight: 8,
                    }}
                    numberOfLines={1}
                  >
                    {comp.name}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderRadius: 10,
                      backgroundColor: badge.bg,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9.5,
                        fontWeight: '700',
                        color: badge.text,
                        letterSpacing: 0.4,
                      }}
                    >
                      {comp.tag}
                    </Text>
                  </View>
                </View>

                {/* Line 2: File */}
                <Text
                  style={{
                    fontSize: 11.5,
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    color: muted,
                  }}
                >
                  {comp.file}
                </Text>
              </TouchableOpacity>
            );
          })}

          {filteredComponents.length === 0 && (
            <Text style={{ padding: 24, textAlign: 'center', color: muted, fontSize: 13 }}>
              {`No components matching "${searchQuery}"`}
            </Text>
          )}
        </ScrollView>

        {/* Footer */}
        <View
          style={{
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: sidebarBorder,
            alignItems: 'center',
          }}
        >
         
        </View>
      </View>

      {/* ============================================================ */}
      {/* MAIN PLAYGROUND & SIMULATOR AREA                            */}
      {/* ============================================================ */}
      <View
        style={{
          flex: 1,
          height: '100%',
          backgroundColor: canvasBg,
        }}
      >
        {/* Sticky Professional Toolbar */}
        <PreviewToolbar
          component={activeComponent}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          deviceType={deviceType}
          onChangeDeviceType={handleDeviceTypeChange}
          selectedDevice={selectedDevice}
          onSelectDevice={setSelectedDevice}
          simulatorTheme={simulatorTheme}
          onToggleSimulatorTheme={() =>
            setSimulatorTheme(simulatorTheme === 'dark' ? 'light' : 'dark')
          }
          scale={scale}
          onChangeScale={setUserScale}
          onOpenFullscreen={() => setIsFullscreen(true)}
          isDark={isDark}
        />

        {/* Scrollable Canvas Area with Proper Fit */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: 'center',
            paddingVertical: 28,
            paddingHorizontal: 16,
            minHeight: '100%',
          }}
          showsVerticalScrollIndicator={true}
        >
          {/* 1. CODE VIEW */}
          {viewMode === 'code' && (
            <CodePanel component={activeComponent} isDark={isDark} />
          )}

          {/* 2. DESKTOP CANVAS VIEW */}
          {viewMode === 'preview' && deviceType === 'desktop' && (
            <View
              style={{
                width: '100%',
                maxWidth: 960,
                backgroundColor: simulatorTheme === 'dark' ? '#09090b' : '#ffffff',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: sidebarBorder,
                overflow: 'hidden',
              }}
            >
              {/* Desktop Window Titlebar */}
              <View
                style={{
                  height: 36,
                  backgroundColor: simulatorTheme === 'dark' ? '#18181b' : '#f4f4f5',
                  borderBottomWidth: 1,
                  borderBottomColor: sidebarBorder,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444' }} />
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#f59e0b' }} />
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981' }} />
                </View>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 11.5,
                    color: muted,
                    fontWeight: '500',
                  }}
                >
                  Desktop Preview — {activeComponent.name}
                </Text>
              </View>

              {/* Component Canvas */}
              <View style={{ padding: 28 }}>
                <PreviewComponent />
              </View>
            </View>
          )}

          {/* 3. MOBILE & TABLET DEVICE SIMULATOR */}
          {viewMode === 'preview' && deviceType !== 'desktop' && (
            <DeviceFrame
              device={selectedDevice}
              scale={scale}
              simulatorTheme={simulatorTheme}
            >
              <PreviewComponent />
            </DeviceFrame>
          )}
        </ScrollView>
      </View>

      {/* Fullscreen Modal View */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        title={activeComponent.name}
        isDark={isDark}
      >
        {deviceType === 'desktop' ? (
          <View
            style={{
              width: '100%',
              maxWidth: 960,
              backgroundColor: simulatorTheme === 'dark' ? '#09090b' : '#ffffff',
              borderRadius: 14,
              borderWidth: 1,
              borderColor: sidebarBorder,
              padding: 32,
            }}
          >
            <PreviewComponent />
          </View>
        ) : (
          <DeviceFrame
            device={selectedDevice}
            scale={scale}
            simulatorTheme={simulatorTheme}
          >
            <PreviewComponent />
          </DeviceFrame>
        )}
      </FullscreenModal>
    </View>
  );
}
