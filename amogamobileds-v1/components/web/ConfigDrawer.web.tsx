import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Settings,
  X,
  Search,
  Check,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Palette,
  Sparkles,
} from 'lucide-react-native';
import { useColorTheme, DEFAULT_COLOR_THEME } from '@/providers/color-theme-provider';
import { useModeContext, Mode } from '@/providers/mode-provider';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme?: (mode: 'light' | 'dark' | 'system') => void;
  currentMode?: 'light' | 'dark' | 'system';
}

export function ConfigDrawer({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
  currentMode: propMode,
}: ConfigDrawerProps) {
  const { colorTheme, setColorTheme, resetColorTheme, currentTheme, colorThemes } = useColorTheme();
  const modeContext = useModeContext();
  const currentMode = propMode || modeContext?.mode || (isDark ? 'dark' : 'light');
  const [search, setSearch] = useState('');

  const bg = isDark ? '#11131a' : '#ffffff';
  const border = isDark ? '#232734' : '#e4e4e7';
  const text = isDark ? '#f4f4f5' : '#09090b';
  const muted = isDark ? '#a1a1aa' : '#71717a';
  const cardBg = isDark ? '#181b24' : '#f8fafc';
  const cardBorder = isDark ? '#272c3d' : '#f1f5f9';
  const primary = currentTheme?.preview || (isDark ? '#cba6f7' : '#8b5cf6');

  const filteredThemes = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return colorThemes;
    return colorThemes.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
  }, [search, colorThemes]);

  const tweakcnCount = useMemo(
    () => colorThemes.filter((t) => t.category === 'tweakcn').length,
    [colorThemes]
  );

  if (!isOpen) return null;

  return (
    <View style={styles.overlayContainer}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Drawer Panel */}
      <View
        style={[
          styles.drawer,
          {
            backgroundColor: bg,
            borderColor: border,
            shadowColor: '#000000',
          },
        ]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: border }]}>
          <View style={{ gap: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Palette size={18} color={primary} />
              <Text style={[styles.title, { color: text }]}>Theme Settings</Text>
              <View
                style={{
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                  borderRadius: 12,
                  backgroundColor: isDark ? '#281f3d' : '#f3e8ff',
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '500', color: primary }}>
                  Tweakcn
                </Text>
              </View>
            </View>
            <Text style={[styles.description, { color: muted }]}>
              Customize color palettes and visual appearance
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: cardBg, borderColor: border }]}
          >
            <X size={16} color={muted} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={{ padding: 20, gap: 24 }}>
          {/* Appearance Mode */}
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.sectionTitle, { color: muted }]}>APPEARANCE</Text>
              {currentMode !== 'light' && (
                <TouchableOpacity
                  onPress={() => {
                    modeContext?.setMode('light');
                    onToggleTheme?.('light');
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                  hitSlop={6}
                >
                  <RotateCcw size={12} color={primary} />
                  <Text style={{ fontSize: 11, color: primary, fontWeight: '500' }}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[
                { key: 'light', label: 'Light', Icon: Sun },
                { key: 'dark', label: 'Dark', Icon: Moon },
                { key: 'system', label: 'System', Icon: Laptop },
              ].map((item) => {
                const isSelected = currentMode === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => {
                      modeContext?.setMode(item.key as any);
                      onToggleTheme?.(item.key as any);
                    }}
                    style={[
                      styles.modeOption,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? '#272a38'
                            : '#f4f4f5'
                          : cardBg,
                        borderColor: isSelected ? primary : border,
                      },
                    ]}
                  >
                    <item.Icon
                      size={16}
                      color={isSelected ? primary : muted}
                    />
                    <Text
                      style={[
                        styles.modeLabel,
                        { color: isSelected ? text : muted, fontWeight: isSelected ? '600' : '500' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Color Themes List */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.sectionTitle, { color: muted }]}>COLOR PALETTES</Text>
                <Text style={{ fontSize: 11, color: muted }}>({filteredThemes.length})</Text>
              </View>
              {colorTheme !== DEFAULT_COLOR_THEME && (
                <TouchableOpacity
                  onPress={resetColorTheme}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                  hitSlop={6}
                >
                  <RotateCcw size={12} color={primary} />
                  <Text style={{ fontSize: 11, color: primary, fontWeight: '500' }}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Search Input */}
            <View
              style={[
                styles.searchBox,
                { backgroundColor: cardBg, borderColor: border },
              ]}
            >
              <Search size={14} color={muted} />
              <TextInput
                placeholder="Search themes (e.g. Catppuccin, Nord, Sunset)..."
                placeholderTextColor={muted}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: text }]}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <X size={13} color={muted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Themes Grid / List */}
            <View style={{ gap: 6 }}>
              {filteredThemes.map((t, index) => {
                const isSelected = colorTheme === t.name;
                const isTweakcn = t.category === 'tweakcn';
                const themeAccent = t.preview || primary;

                return (
                  <TouchableOpacity
                    key={`${t.name}-${t.category || 'palette'}-${index}`}
                    onPress={() => setColorTheme(t.name)}
                    activeOpacity={0.7}
                    style={[
                      styles.themeRow,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? '#241f3d'
                            : '#f5f3ff'
                          : cardBg,
                        borderColor: isSelected ? themeAccent : cardBorder,
                      },
                    ]}
                  >
                    {/* 5 Color Preview Dots */}
                    <View style={styles.dotsRow}>
                      {t.colors.map((c, i) => (
                        <View
                          key={`${t.name}-dot-${i}`}
                          style={[
                            styles.colorDot,
                            {
                              backgroundColor: c,
                              borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                            },
                          ]}
                        />
                      ))}
                    </View>

                    {/* Theme Label & Tweakcn Pill */}
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                      <Text
                        style={[
                          styles.themeName,
                          {
                            color: isSelected ? (isDark ? '#e0e7ff' : '#4338ca') : text,
                            fontWeight: isSelected ? '600' : '500',
                          },
                        ]}
                      >
                        {t.label}
                      </Text>
                      {isTweakcn && (
                        <View
                          style={{
                            paddingHorizontal: 5,
                            paddingVertical: 1.5,
                            borderRadius: 4,
                            backgroundColor: isSelected
                              ? isDark
                                ? '#4c1d95'
                                : '#ede9fe'
                              : isDark
                              ? '#1f2433'
                              : '#f1f5f9',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 8.5,
                              fontWeight: '500',
                              color: isSelected ? (isDark ? '#a78bfa' : '#7c3aed') : muted,
                              letterSpacing: 0.5,
                            }}
                          >
                            TWEAKCN
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Active check icon */}
                    {isSelected && (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: themeAccent,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={12} color="#ffffff" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Footer: Destructive Red Reset Button matching Monorepo */}
        <View
          style={[
            styles.footer,
            {
              borderTopColor: border,
              backgroundColor: isDark ? '#11131a' : '#ffffff',
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              resetColorTheme();
              modeContext?.setMode('light');
              onToggleTheme?.('light');
              setSearch('');
            }}
            style={styles.resetButton}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Reset Theme Settings"
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100000,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  drawer: {
    width: 380,
    maxWidth: '90%',
    height: '100%',
    borderLeftWidth: 1,
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 30,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100001,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
    fontFamily: 'Open Sans',
  },
  description: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.6,
    fontFamily: 'Open Sans',
  },
  modeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
  },
  modeLabel: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    outlineStyle: 'none' as any,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  themeName: {
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  resetButton: {
    width: '100%',
    height: 42,
    borderRadius: 8,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Open Sans',
  },
});
