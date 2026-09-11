import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {
  X,
  Search,
  Check,
  RotateCcw,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import { colorThemes } from '../../theme/color-themes';

export interface ThemeOption {
  name: string;
  label: string;
  category?: 'tweakcn' | 'accent' | 'palette';
  preview: string;
  colors: string[];
}

export interface ThemeSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appearanceMode?: 'light' | 'dark' | 'system';
  activeMode?: 'light' | 'dark' | 'system';
  onModeChange?: (mode: 'light' | 'dark' | 'system') => void;
  onSelectMode?: (mode: 'light' | 'dark' | 'system') => void;
  currentColorTheme?: string;
  activeTheme?: string;
  onColorThemeChange?: (name: string) => void;
  onSelectTheme?: (name: string) => void;
  onResetTheme?: () => void;
  availableThemes?: ThemeOption[];
}

// Mini UI Mockup Components matching Screenshot 1
function SystemMockup() {
  return (
    <View style={styles.mockupContainer}>
      {/* Left Half: Light */}
      <View style={[styles.mockupHalf, { backgroundColor: '#d4d4d8' }]}>
        <View style={styles.mockupSidebar}>
          <View style={[styles.mockupCircle, { backgroundColor: '#ffffff' }]} />
          <View style={[styles.mockupLine, { backgroundColor: '#ffffff' }]} />
          <View style={[styles.mockupLine, { backgroundColor: '#ffffff' }]} />
        </View>
        <View style={[styles.mockupChartArea, { backgroundColor: '#e4e4e7' }]}>
          <View style={[styles.mockupBar, { height: 10, backgroundColor: '#a1a1aa' }]} />
          <View style={[styles.mockupBar, { height: 18, backgroundColor: '#a1a1aa' }]} />
        </View>
      </View>
      {/* Right Half: Dark */}
      <View style={[styles.mockupHalf, { backgroundColor: '#1e2238' }]}>
        <View style={styles.mockupChartArea}>
          <View style={[styles.mockupBar, { height: 14, backgroundColor: '#3b82f6' }]} />
          <View style={[styles.mockupBar, { height: 22, backgroundColor: '#3b82f6' }]} />
        </View>
      </View>
    </View>
  );
}

function LightMockup({ isActive }: { isActive: boolean }) {
  return (
    <View style={[styles.mockupContainer, { backgroundColor: '#f1f5f9' }]}>
      <View style={[styles.mockupSidebar, { backgroundColor: '#e2e8f0' }]}>
        <View style={[styles.mockupCircle, { backgroundColor: '#ffffff' }]} />
        <View style={[styles.mockupLine, { backgroundColor: '#ffffff' }]} />
        <View style={[styles.mockupLine, { backgroundColor: '#ffffff' }]} />
      </View>
      <View style={styles.mockupChartArea}>
        <View style={[styles.mockupBar, { height: 10, backgroundColor: '#cbd5e1' }]} />
        <View style={[styles.mockupBar, { height: 20, backgroundColor: '#cbd5e1' }]} />
        <View style={[styles.mockupBar, { height: 14, backgroundColor: '#cbd5e1' }]} />
      </View>
      {isActive && (
        <View style={styles.mockupActiveCheck}>
          <Check size={11} color="#ffffff" strokeWidth={3} />
        </View>
      )}
    </View>
  );
}

function DarkMockup({ isActive }: { isActive: boolean }) {
  return (
    <View style={[styles.mockupContainer, { backgroundColor: '#0b1120' }]}>
      <View style={[styles.mockupSidebar, { backgroundColor: '#1e293b' }]}>
        <View style={[styles.mockupCircle, { backgroundColor: '#38bdf8' }]} />
        <View style={[styles.mockupLine, { backgroundColor: '#64748b' }]} />
        <View style={[styles.mockupLine, { backgroundColor: '#64748b' }]} />
      </View>
      <View style={styles.mockupChartArea}>
        <View style={[styles.mockupBar, { height: 12, backgroundColor: '#2563eb' }]} />
        <View style={[styles.mockupBar, { height: 22, backgroundColor: '#2563eb' }]} />
        <View style={[styles.mockupBar, { height: 16, backgroundColor: '#2563eb' }]} />
      </View>
      {isActive && (
        <View style={styles.mockupActiveCheck}>
          <Check size={11} color="#ffffff" strokeWidth={3} />
        </View>
      )}
    </View>
  );
}

export interface ThemeSettingsViewProps {
  onClose?: () => void;
  appearanceMode?: 'light' | 'dark' | 'system';
  activeMode?: 'light' | 'dark' | 'system';
  onModeChange?: (mode: 'light' | 'dark' | 'system') => void;
  onSelectMode?: (mode: 'light' | 'dark' | 'system') => void;
  currentColorTheme?: string;
  activeTheme?: string;
  onColorThemeChange?: (name: string) => void;
  onSelectTheme?: (name: string) => void;
  onResetTheme?: () => void;
  availableThemes?: ThemeOption[];
  showHeader?: boolean;
}

export function ThemeSettingsView({
  onClose,
  appearanceMode,
  activeMode,
  onModeChange,
  onSelectMode,
  currentColorTheme,
  activeTheme,
  onColorThemeChange,
  onSelectTheme,
  onResetTheme,
  availableThemes = colorThemes,
  showHeader = true,
}: ThemeSettingsViewProps) {
  const { colors, resolvedMode, mode, setMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const currentMode = appearanceMode || activeMode || mode || 'light';
  const handleModeChange = onModeChange || onSelectMode || ((m: 'light' | 'dark' | 'system') => setMode(m));

  const currentThemeName = currentColorTheme || activeTheme || 'zinc';
  const handleThemeChange = onColorThemeChange || onSelectTheme;

  const themesToUse = availableThemes && availableThemes.length > 0 ? availableThemes : (colorThemes || []);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) return themesToUse;
    const q = searchQuery.toLowerCase().trim();
    return (themesToUse || []).filter(
      (t) =>
        t &&
        ((t.label && t.label.toLowerCase().includes(q)) ||
          (t.name && t.name.toLowerCase().includes(q)))
    );
  }, [themesToUse, searchQuery]);

  const bg = isDark ? '#0f172a' : '#ffffff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <View style={[styles.viewContainer, { backgroundColor: bg }]}>
      {showHeader && (
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <View style={styles.headerTitles}>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>
              Theme Settings
            </Text>
            <Text style={[styles.headerSub, { color: textMuted }]}>
              Customize the look and feel of your dashboard.
            </Text>
          </View>

          {onClose && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close theme settings"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color={textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Body Scroll Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Section 1: Appearance Mode (Theme) */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: textMuted }]}>
            Theme
          </Text>

          <View style={styles.appearanceGrid}>
            {/* System */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleModeChange('system')}
              style={[
                styles.appearanceCard,
                {
                  borderColor: currentMode === 'system' ? '#0284c7' : borderColor,
                  borderWidth: currentMode === 'system' ? 2 : 1,
                },
              ]}
            >
              <SystemMockup />
              <Text
                style={[
                  styles.appearanceLabel,
                  {
                    color: textPrimary,
                    fontWeight: currentMode === 'system' ? '700' : '500',
                  },
                ]}
              >
                System
              </Text>
            </TouchableOpacity>

            {/* Light */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleModeChange('light')}
              style={[
                styles.appearanceCard,
                {
                  borderColor: currentMode === 'light' ? '#0284c7' : borderColor,
                  borderWidth: currentMode === 'light' ? 2 : 1,
                },
              ]}
            >
              <LightMockup isActive={currentMode === 'light'} />
              <Text
                style={[
                  styles.appearanceLabel,
                  {
                    color: textPrimary,
                    fontWeight: currentMode === 'light' ? '700' : '500',
                  },
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>

            {/* Dark */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleModeChange('dark')}
              style={[
                styles.appearanceCard,
                {
                  borderColor: currentMode === 'dark' ? '#0284c7' : borderColor,
                  borderWidth: currentMode === 'dark' ? 2 : 1,
                },
              ]}
            >
              <DarkMockup isActive={currentMode === 'dark'} />
              <Text
                style={[
                  styles.appearanceLabel,
                  {
                    color: textPrimary,
                    fontWeight: currentMode === 'dark' ? '700' : '500',
                  },
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Color Theme */}
        <View style={styles.section}>
          <View style={styles.colorThemeHeaderRow}>
            <Text style={[styles.sectionHeading, { color: textMuted }]}>
              Color Theme
            </Text>
            {onResetTheme && (
              <TouchableOpacity
                onPress={onResetTheme}
                hitSlop={6}
                style={styles.refreshIconBtn}
                accessibilityLabel="Reset theme"
              >
                <RotateCcw size={14} color={textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: borderColor,
              },
            ]}
          >
            <Search size={16} color={textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search themes..."
              placeholderTextColor={textMuted}
              style={[
                styles.searchInput,
                {
                  color: textPrimary,
                },
              ]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={14} color={textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.availableCountText, { color: textMuted }]}>
            {filteredThemes.length} available themes
          </Text>

          {/* Themes List */}
          <View style={styles.themesList}>
            {filteredThemes.map((theme) => {
              const isActive = currentThemeName.toLowerCase() === theme.name.toLowerCase();
              const primaryColor = theme.colors?.[0] || '#7c3aed';

              return (
                <TouchableOpacity
                  key={theme.name}
                  activeOpacity={0.75}
                  onPress={() => handleThemeChange?.(theme.name)}
                  style={[
                    styles.themeRow,
                    isActive && styles.themeRowActive,
                    {
                      backgroundColor: isActive
                        ? isDark
                          ? '#1e293b'
                          : '#f1f5f9'
                        : isDark
                        ? 'transparent'
                        : '#ffffff',
                    },
                  ]}
                >
                  <View style={styles.dotsRow}>
                    {(theme.colors || []).slice(0, 4).map((dotColor, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.swatchDot,
                          { backgroundColor: dotColor },
                        ]}
                      />
                    ))}
                  </View>

                  <Text
                    style={[
                      styles.themeRowLabel,
                      {
                        color: textPrimary,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {theme.label}
                  </Text>

                  {isActive && (
                    <View style={styles.themeRowCheck}>
                      <Check size={16} color={primaryColor} strokeWidth={2.5} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer Reset Button */}
      {onResetTheme && (
        <View style={[styles.footer, { borderTopColor: borderColor }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onResetTheme}
            style={styles.resetButtonFull}
            accessibilityRole="button"
            accessibilityLabel="Reset Theme"
          >
            <Text style={styles.resetButtonText}>Reset to Default Theme</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export function ThemeSettingsDrawer({
  isOpen,
  onClose,
  appearanceMode,
  activeMode,
  onModeChange,
  onSelectMode,
  currentColorTheme,
  activeTheme,
  onColorThemeChange,
  onSelectTheme,
  onResetTheme,
  availableThemes = colorThemes,
}: ThemeSettingsDrawerProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  if (!isOpen) return null;

  const bg = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Drawer Panel */}
        <Pressable
          onPress={(e) => e.stopPropagation?.()}
          style={[
            styles.drawerPanel,
            isDesktop ? styles.desktopDrawer : styles.mobileDrawer,
            {
              backgroundColor: bg,
              borderLeftColor: borderColor,
            },
          ]}
        >
          <ThemeSettingsView
            onClose={onClose}
            appearanceMode={appearanceMode}
            activeMode={activeMode}
            onModeChange={onModeChange}
            onSelectMode={onSelectMode}
            currentColorTheme={currentColorTheme}
            activeTheme={activeTheme}
            onColorThemeChange={onColorThemeChange}
            onSelectTheme={onSelectTheme}
            onResetTheme={onResetTheme}
            availableThemes={availableThemes}
            showHeader={true}
          />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      } as any,
    }),
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  drawerPanel: {
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
  },
  desktopDrawer: {
    width: 380,
    borderLeftWidth: 1,
  },
  mobileDrawer: {
    width: '90%',
    maxWidth: 380,
    borderLeftWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitles: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    marginTop: 4,
    lineHeight: 18,
  },
  closeBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
    height: '100%',
    ...Platform.select({
      web: {
        overflowY: 'auto',
      } as any,
    }),
  },
  scrollContent: {
    padding: 24,
    gap: 24,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 960,
  },
  section: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  appearanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    maxWidth: 680,
  },
  appearanceCard: {
    flex: 1,
    minWidth: 140,
    maxWidth: 220,
    borderRadius: 10,
    padding: 3,
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
  },
  appearanceLabel: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  mockupContainer: {
    width: '100%',
    height: 64,
    borderRadius: 7,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
  },
  mockupHalf: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
  },
  mockupSidebar: {
    width: '38%',
    height: '100%',
    padding: 5,
    gap: 3,
  },
  mockupCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  mockupLine: {
    width: '90%',
    height: 3,
    borderRadius: 1.5,
  },
  mockupChartArea: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
    paddingBottom: 6,
  },
  mockupBar: {
    width: 4,
    borderRadius: 2,
  },
  mockupActiveCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorThemeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refreshIconBtn: {
    padding: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
    maxWidth: 680,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Open Sans',
    paddingVertical: 4,
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  availableCountText: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
    marginTop: -2,
  },
  themesList: {
    gap: 4,
    maxWidth: 680,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 12,
  },
  themeRowActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swatchDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeRowLabel: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: 'Open Sans',
  },
  themeRowCheck: {
    marginLeft: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  resetButtonFull: {
    width: '100%',
    height: 46,
    backgroundColor: '#e11d48',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
});
