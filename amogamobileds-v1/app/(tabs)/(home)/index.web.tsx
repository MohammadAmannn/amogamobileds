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
import { useColorScheme } from '../../../hooks/useColorScheme';
import {
  Search,
  Bell,
  X,
  LayoutGrid,
  Sparkles,
  PenTool,
  BarChart3,
  AlertCircle,
  Columns,
  Eye,
  Film,
  Database,
  Palette,
  Compass,
  MessageSquare,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  SlidersHorizontal,
  Command,
} from 'lucide-react-native';
import {
  COMPONENTS,
  ComponentItem,
  ComponentCategory,
} from '../../../components/design-system/registry';
import { DeviceConfig, DeviceType, ViewMode } from '../../../components/web/types';
import { DEFAULT_MOBILE_DEVICE, DEFAULT_TABLET_DEVICE } from '../../../components/web/devices';
import { DeviceFrame } from '../../../components/web/DeviceFrame.web';
import { PreviewToolbar } from '../../../components/web/PreviewToolbar.web';
import { CodePanel } from '../../../components/web/CodePanel.web';
import { FullscreenModal } from '../../../components/web/FullscreenModal.web';
import { useAuth } from '../../../providers/auth-provider';
import { useColorTheme } from '../../../providers/color-theme-provider';
import {
  AppNavigationSidebar,
  AppNavigationDrawer,
  ComingSoonView,
  DEFAULT_NAV_ITEMS,
  app_menu_json,
} from '../../../components/ui';

interface CategoryConfig {
  name: 'All' | ComponentCategory;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
}

const CATEGORY_ITEMS: CategoryConfig[] = [
  { name: 'All', label: 'All', Icon: LayoutGrid },
  { name: 'Primitives', label: 'Primitives', Icon: Sparkles },
  { name: 'Inputs', label: 'Inputs', Icon: PenTool },
  { name: 'Charts', label: 'Charts', Icon: BarChart3 },
  { name: 'Feedback', label: 'Feedback', Icon: AlertCircle },
  { name: 'Layout', label: 'Layout', Icon: Columns },
  { name: 'Display', label: 'Display', Icon: Eye },
  { name: 'Media', label: 'Media', Icon: Film },
  { name: 'Data', label: 'Data', Icon: Database },
  { name: 'Themes', label: 'Themes', Icon: Palette },
  { name: 'Icons', label: 'Icons', Icon: Compass },
  { name: 'Chat', label: 'Chat', Icon: MessageSquare },
  { name: 'Auth', label: 'Auth', Icon: ShieldCheck },
  { name: 'Pages', label: 'Pages', Icon: SlidersHorizontal },
];

export default function WebPlaygroundScreen() {
  const systemTheme = useColorScheme();
  const isDark = systemTheme === 'dark';
  const { currentTheme } = useColorTheme();
  const activeAccent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.preview || '#18181b';
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Screen breakpoint: Mobile viewport on web is < 768px
  const isMobileView = windowWidth < 768;

  // State
  const [activeComponent, setActiveComponent] = useState<ComponentItem>(COMPONENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ComponentCategory>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');
  const [selectedDevice, setSelectedDevice] = useState<DeviceConfig>(DEFAULT_MOBILE_DEVICE);
  const [simulatorTheme, setSimulatorTheme] = useState<'light' | 'dark'>(isDark ? 'dark' : 'light');
  const [userScale, setUserScale] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEmulatorModalOpen, setIsEmulatorModalOpen] = useState(false);
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [mainNavId, setMainNavId] = useState<string>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { user, profile, signOut } = useAuth();
  const userName = profile?.name || user?.email?.split('@')[0] || 'Mohammed Aman';
  const userInitials = useMemo(() => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'MA';
  }, [profile, user]);

  const activeNavItem = useMemo(() => {
    return (
      DEFAULT_NAV_ITEMS.find(
        (item) =>
          item.id.toLowerCase() === mainNavId.toLowerCase() ||
          item.label.toLowerCase() === mainNavId.toLowerCase()
      ) || DEFAULT_NAV_ITEMS[0]
    );
  }, [mainNavId]);

  // Compute adaptive initial scale so mobile phone simulator fits viewport comfortably on 14-inch & Mac displays
  const initialScale = useMemo(() => {
    const totalDeviceHeight = (selectedDevice?.height || 852) + (selectedDevice?.bezel || 10) * 2;
    // Available height on canvas = windowHeight - toolbar (54px) - padding/margins (46px)
    const availableHeight = Math.max(360, (windowHeight || 800) - 100);
    const computed = Number((availableHeight / totalDeviceHeight).toFixed(2));
    return Math.min(0.78, Math.max(0.48, computed));
  }, [windowHeight, selectedDevice]);

  const scale = userScale ?? initialScale;

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

  // Handle device type switch (Desktop playground)
  const handleDeviceTypeChange = (type: DeviceType) => {
    setDeviceType(type);
    if (type === 'tablet') {
      setSelectedDevice(DEFAULT_TABLET_DEVICE);
      const tabletFit = Math.min(0.55, Math.max(0.38, Number(((windowHeight - 110) / 1222).toFixed(2))));
      setUserScale(tabletFit);
    } else if (type === 'mobile') {
      setSelectedDevice(DEFAULT_MOBILE_DEVICE);
      setUserScale(null);
    } else {
      setUserScale(1);
    }
  };

  // Tag Badge Colors
  const getBadgeColors = (tag: string) => {
    switch (tag) {
      case 'BUTTON':
        return { bg: isDark ? '#3b1c54' : '#F3E8FF', text: isDark ? '#d8b4fe' : '#9333EA' };
      case 'INPUT':
      case 'OTP INPUT':
        return { bg: isDark ? '#0c3547' : '#E0F2FE', text: isDark ? '#7dd3fc' : '#0284C7' };
      case 'BADGE':
        return { bg: isDark ? '#4a1532' : '#FCE7F3', text: isDark ? '#f472b6' : '#DB2777' };
      case 'AVATAR':
        return { bg: isDark ? '#452b0d' : '#FEF3C7', text: isDark ? '#fcd34d' : '#D97706' };
      case 'CARD':
        return { bg: isDark ? '#262153' : '#EDE9FE', text: isDark ? '#a5b4fc' : '#6366F1' };
      case 'CHECKBOX':
      case 'SWITCH':
        return { bg: isDark ? '#1e293b' : '#F1F5F9', text: isDark ? '#94a3b8' : '#475569' };
      case 'TOAST':
      case 'NOTIFICATION':
        return { bg: isDark ? '#4a1532' : '#FCE7F3', text: isDark ? '#f472b6' : '#BE185D' };
      case 'SPINNER':
      case 'SKELETON':
        return { bg: isDark ? '#0e3a24' : '#DCFCE7', text: isDark ? '#86efac' : '#16A34A' };
      case 'THEMES':
      case 'TWEAKCN':
        return { bg: isDark ? '#3b1c54' : '#F3E8FF', text: isDark ? '#d8b4fe' : '#9333EA' };
      case 'ICONS':
        return { bg: isDark ? '#0c3547' : '#E0F2FE', text: isDark ? '#7dd3fc' : '#0284C7' };
      case 'CHAT':
        return { bg: isDark ? '#0e3a24' : '#DCFCE7', text: isDark ? '#86efac' : '#15803D' };
      case 'AUTH':
        return { bg: isDark ? '#1e293b' : '#EDE9FE', text: isDark ? '#c084fc' : '#7c3aed' };
      case 'PAGE':
      case 'PAGES':
        return { bg: isDark ? '#3b1c54' : '#F3E8FF', text: isDark ? '#d8b4fe' : '#9333EA' };
      default:
        return { bg: isDark ? '#1e293b' : '#F1F5F9', text: isDark ? '#94a3b8' : '#475569' };
    }
  };

  const PreviewComponent = activeComponent.Preview;

  // Open mobile emulator modal when clicking a card in mobile view
  const handleCardClick = (comp: ComponentItem) => {
    setActiveComponent(comp);
    if (isMobileView) {
      setIsEmulatorModalOpen(true);
    }
  };

  // =========================================================================
  // MOBILE VIEW ON WEB (< 768px): Responsive full design page + Emulator Modal
  // =========================================================================
  if (isMobileView) {
    return (
      <View style={{ flex: 1, backgroundColor: canvasBg }}>
        {/* Mobile Header (Matching Screenshot 2) */}
        <View
          style={{
            backgroundColor: sidebarBg,
            borderBottomWidth: 1,
            borderBottomColor: sidebarBorder,
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 10,
            zIndex: 50,
          }}
        >
          {/* Top Bar: Logo, Title, Search, Notification, Theme */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsDrawerOpen(true)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  backgroundColor: activeAccent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessibilityRole="button"
                accessibilityLabel="Open Navigation Menu"
              >
                <Command size={18} color="#ffffff" strokeWidth={2.4} />
              </TouchableOpacity>
              <Text style={{ fontSize: 17, fontWeight: '700', color: text }}>
                {mainNavId === 'home' ? 'App Settings' : activeNavItem.label}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 100 }}>
              {/* Theme customizer */}
              <TouchableOpacity
                onPress={() => setIsThemeDrawerOpen(true)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: sidebarBorder,
                  backgroundColor: isDark ? '#141721' : '#f8fafc',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.7}
              >
                <Palette size={16} color={activeAccent} />
              </TouchableOpacity>
            </View>
          </View>

        {mainNavId === 'home' ? (
          <>
            {/* Search Bar */}
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
                marginBottom: 10,
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

            {/* Category Filter Chips - Wrapped Vertically across rows */}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
                paddingVertical: 2,
              }}
            >
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
                      borderColor: isSelected ? activeAccent : sidebarBorder,
                      backgroundColor: isSelected
                        ? isDark
                          ? activeAccent + '30'
                          : activeAccent + '15'
                        : isDark
                        ? '#141721'
                        : '#f8fafc',
                    }}
                  >
                    <IconComp size={12} color={isSelected ? activeAccent : '#64748b'} />
                    <Text
                      style={{
                        color: isSelected ? activeAccent : text,
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
                        backgroundColor: isSelected
                          ? isDark
                            ? activeAccent + '40'
                            : activeAccent + '25'
                          : isDark
                          ? '#27272a'
                          : '#e2e8f0',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9.5,
                          fontWeight: '600',
                          color: isSelected ? (isDark ? '#f4f4f5' : activeAccent) : muted,
                        }}
                      >
                        {count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : null}
        </View>

        {mainNavId === 'home' ? (
          <>
            {/* Mobile View Component Cards List */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 14, paddingBottom: 90, gap: 10 }}
              showsVerticalScrollIndicator={true}
            >
              {filteredComponents.map((comp) => {
                const isCurrent = comp.id === activeComponent.id;
                const badge = getBadgeColors(comp.tag);

                return (
                  <TouchableOpacity
                    key={comp.id}
                    onPress={() => handleCardClick(comp)}
                    activeOpacity={0.7}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isCurrent ? activeAccent : cardBorder,
                      backgroundColor: cardBg,
                      borderLeftWidth: isCurrent ? 4 : 1,
                      borderLeftColor: isCurrent ? activeAccent : cardBorder,
                    }}
                  >
                    {/* Title & Tag */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color: isCurrent ? (isDark ? '#f8fafc' : activeAccent) : text,
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
                          paddingVertical: 2.5,
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

                    {/* Description */}
                    <Text
                      style={{
                        fontSize: 12.5,
                        color: muted,
                        lineHeight: 17,
                        marginBottom: 6,
                      }}
                      numberOfLines={2}
                    >
                      {comp.description}
                    </Text>

                    {/* Bottom Row: File + Live Preview Button */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                          color: muted,
                        }}
                      >
                        {comp.file}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Smartphone size={12} color={activeAccent} />
                        <Text
                          style={{
                            fontSize: 11.5,
                            fontWeight: '600',
                            color: activeAccent,
                          }}
                        >
                          Preview
                        </Text>
                        <ChevronRight size={12} color={activeAccent} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {filteredComponents.length === 0 && (
                <Text style={{ padding: 24, textAlign: 'center', color: muted, fontSize: 13 }}>
                  {`No components matching "${searchQuery}"`}
                </Text>
              )}
            </ScrollView>

            {/* Floating Action Button: Purple Preview Pill */}
            <TouchableOpacity
              onPress={() => setIsEmulatorModalOpen(true)}
              activeOpacity={0.85}
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 24,
                backgroundColor: activeAccent,
                zIndex: 50,
                ...Platform.select({
                  web: {
                    boxShadow: `0 6px 20px ${activeAccent}60`,
                    cursor: 'pointer',
                  } as any,
                }),
              }}
              accessibilityLabel="Preview in mobile emulator"
            >
              <Smartphone size={16} color="#ffffff" />
              <Text style={{ color: '#ffffff', fontSize: 13.5, fontWeight: '700' }}>
                Preview
              </Text>
            </TouchableOpacity>

            {/* Live Mobile Emulator Modal */}
            <MobileEmulatorModal
              isOpen={isEmulatorModalOpen}
              onClose={() => setIsEmulatorModalOpen(false)}
              component={activeComponent}
              isDark={isDark}
            />
          </>
        ) : (
          <View style={{ flex: 1, height: '100%' }}>
            <ComingSoonView
              title={activeNavItem.label}
              icon={activeNavItem.icon}
              onGoToChat={() => setMainNavId('home')}
            />
          </View>
        )}

        {/* Mobile Navigation Drawer */}
        <AppNavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeId={mainNavId}
          onSelect={(id) => {
            setMainNavId(id);
            setIsDrawerOpen(false);
          }}
          workspaceName="Amoga DS"
          workspaceSubtitle="Design System"
          userName={userName}
          userSubtitle="My Account"
          userInitials={userInitials}
          onThemePress={() => setIsThemeDrawerOpen(true)}
          onSignOut={signOut}
          primaryColor={activeAccent}
        />

        {/* Theme Settings Drawer */}
        <ConfigDrawer
          isOpen={isThemeDrawerOpen}
          onClose={() => setIsThemeDrawerOpen(false)}
          isDark={isDark}
        />
      </View>
    );
  }

  // =========================================================================
  // DESKTOP / TABLET PLAYGROUND VIEW (Screen width >= 768px)
  // =========================================================================
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        height: '100vh' as any,
        backgroundColor: canvasBg,
        overflow: 'hidden',
      }}
    >
      {/* ──────────────── Left Navigation Sidebar (72px) ──────────────── */}
      <AppNavigationSidebar
        activeId={mainNavId}
        onSelect={(id) => setMainNavId(id)}
        userInitials={userInitials}
        userName={userName}
        userSubtitle="Account"
        onThemePress={() => setIsThemeDrawerOpen(true)}
        onSignOut={signOut}
        onLogoPress={() => setMainNavId('home')}
        primaryColor={activeAccent}
      />

      {mainNavId === 'home' ? (
        <>
      {/* ============================================================ */}
      {/* LEFT SIDEBAR (~320px) - Independently Scrollable              */}
      {/* ============================================================ */}
      <View
        style={{
          width: 320,
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
                backgroundColor: activeAccent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 19, fontWeight: '500' }}>⌘</Text>
            </View>
            <View>
              <Text style={{ fontSize: 17, fontWeight: '500', color: text, letterSpacing: -0.2 }}>
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

        {/* Category Filter Chips - Scrollable 3-Row View */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 10 }}>
          <ScrollView
            style={{
              maxHeight: 104,
              ...Platform.select({
                web: {
                  overflowY: 'auto',
                } as any,
              }),
            }}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 6,
              paddingRight: 4,
            }}
            showsVerticalScrollIndicator={true}
          >
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
                    borderColor: isSelected ? activeAccent : sidebarBorder,
                    backgroundColor: isSelected
                      ? isDark
                        ? activeAccent + '30'
                        : activeAccent + '15'
                      : isDark
                      ? '#141721'
                      : '#f8fafc',
                  }}
                >
                  <IconComp size={12} color={isSelected ? activeAccent : '#64748b'} />
                  <Text
                    style={{
                      color: isSelected ? activeAccent : text,
                      fontSize: 11.5,
                      fontWeight: '500',
                    }}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: 1,
                      borderRadius: 8,
                      backgroundColor: isSelected
                        ? isDark
                          ? activeAccent + '40'
                          : activeAccent + '25'
                        : isDark
                        ? '#27272a'
                        : '#e2e8f0',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '500',
                        color: isSelected ? (isDark ? '#f4f4f5' : activeAccent) : muted,
                      }}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
                  borderColor: isCurrent ? activeAccent : cardBorder,
                  backgroundColor: isCurrent
                    ? isDark
                      ? activeAccent + '22'
                      : activeAccent + '10'
                    : cardBg,
                  borderLeftWidth: isCurrent ? 4 : 1,
                  borderLeftColor: isCurrent ? activeAccent : cardBorder,
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
                      fontWeight: isCurrent ? '500' : '400',
                      color: isCurrent ? (isDark ? '#f8fafc' : activeAccent) : text,
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
                        fontWeight: '500',
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
          onOpenThemeSettings={() => setIsThemeDrawerOpen(true)}
          isDark={isDark}
        />

        {/* Scrollable Canvas Area with Adaptive Fit for 14-inch & Mac Displays */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: windowHeight < 820 ? 14 : 24,
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
              title={activeComponent.name}
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
            title={activeComponent.name}
          >
            <PreviewComponent />
          </DeviceFrame>
        )}
      </FullscreenModal>
        </>
      ) : (
        /* ──────────────── Coming Soon View for Other Menu Items (Desktop) ──────────────── */
        <View style={{ flex: 1, height: '100%', backgroundColor: canvasBg }}>
          <ComingSoonView
            title={activeNavItem.label}
            icon={activeNavItem.icon}
            onGoToChat={() => setMainNavId('home')}
          />
        </View>
      )}

      {/* Tweakcn Theme Settings Drawer */}
      <ConfigDrawer
        isOpen={isThemeDrawerOpen}
        onClose={() => setIsThemeDrawerOpen(false)}
        isDark={isDark}
      />
    </View>
  );
}
