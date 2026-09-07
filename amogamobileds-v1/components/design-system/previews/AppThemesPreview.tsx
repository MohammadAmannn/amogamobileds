import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  TextInput,
} from 'react-native';
import {
  Palette,
  Check,
  Sparkles,
  Search,
  Sliders,
  Sun,
  Moon,
  Zap,
  RotateCcw,
} from 'lucide-react-native';
import { useColorTheme } from '@/providers/color-theme-provider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export function AppThemesPreview() {
  const { colorTheme, setColorTheme, resetColorTheme, currentTheme, colorThemes } = useColorTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tweakcn' | 'palette'>('all');
  const [demoSwitch, setDemoSwitch] = useState(true);

  const numColumns = width >= 900 ? 3 : width >= 500 ? 2 : 1;

  const filteredThemes = colorThemes.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || (t.category || 'palette') === selectedCategory;
    const matchesSearch = !searchQuery || t.label.toLowerCase().includes(searchQuery.toLowerCase()) || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const tweakcnCount = colorThemes.filter((t) => t.category === 'tweakcn').length;
  const paletteCount = colorThemes.filter((t) => t.category !== 'tweakcn').length;

  const activePrimary = currentTheme?.preview || '#8b5cf6';
  const bg = isDark ? '#090a0f' : '#f8fafc';
  const cardBg = isDark ? '#12151e' : '#ffffff';
  const border = isDark ? '#1e2433' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Banner */}
      <View style={[styles.bannerCard, { backgroundColor: cardBg, borderColor: border }]}>
        <View style={styles.bannerHeader}>
          <View style={[styles.bannerIconBox, { backgroundColor: activePrimary + '20', borderColor: activePrimary + '40' }]}>
            <Palette size={22} color={activePrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[styles.bannerTitle, { color: text }]}>Tweakcn & Color Themes</Text>
              <Badge style={{ backgroundColor: activePrimary + '25', borderColor: activePrimary + '50' }}>
                <Text style={{ color: activePrimary, fontSize: 11, fontWeight: '700' }}>
                  {currentTheme?.label || 'Catppuccin'}
                </Text>
              </Badge>
            </View>
            <Text style={[styles.bannerSubtitle, { color: muted }]}>
              Select any theme below to instantly apply color tokens to the entire workspace and simulator.
            </Text>
          </View>

          <Pressable
            onPress={resetColorTheme}
            style={[styles.resetBtn, { backgroundColor: isDark ? '#1e2433' : '#f1f5f9', borderColor: border }]}
          >
            <RotateCcw size={14} color={muted} />
            <Text style={{ fontSize: 12, color: muted, fontWeight: '500' }}>Reset</Text>
          </Pressable>
        </View>

        {/* Live Active Theme Swatch & Widget Preview */}
        <View style={[styles.livePreviewBar, { backgroundColor: isDark ? '#0e1017' : '#f1f5f9', borderColor: border }]}>
          <View style={styles.swatchesRow}>
            <Text style={{ fontSize: 11.5, fontWeight: '600', color: muted }}>Active Swatches:</Text>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              {(currentTheme?.colors || []).map((c, idx) => (
                <View key={idx} style={[styles.activeDot, { backgroundColor: c }]} />
              ))}
            </View>
          </View>

          {/* Interactive Component Demo using Active Theme */}
          <View style={styles.liveControlsRow}>
            <Button
              size="sm"
              style={{ backgroundColor: activePrimary }}
            >
              <Sparkles size={13} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>Primary Button</Text>
            </Button>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Switch value={demoSwitch} onValueChange={setDemoSwitch} />
              <Text style={{ fontSize: 12, color: text }}>Switch</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category Tabs & Search Filter */}
      <View style={styles.filterSection}>
        <View style={styles.tabsRow}>
          {[
            { id: 'all', label: `All (${colorThemes.length})` },
            { id: 'tweakcn', label: `Tweakcn (${tweakcnCount})` },
            { id: 'palette', label: `Color Palettes (${paletteCount})` },
          ].map((tab) => {
            const isTabActive = selectedCategory === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setSelectedCategory(tab.id as any)}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: isTabActive ? (isDark ? '#2a2f42' : '#e0e7ff') : (isDark ? '#141722' : '#f1f5f9'),
                    borderColor: isTabActive ? activePrimary : border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    {
                      color: isTabActive ? (isDark ? '#e0e7ff' : '#4338ca') : muted,
                      fontWeight: isTabActive ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.searchBox, { backgroundColor: cardBg, borderColor: border }]}>
          <Search size={14} color={muted} />
          <TextInput
            placeholder="Search themes..."
            placeholderTextColor={muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: text }]}
          />
        </View>
      </View>

      {/* Grid of Theme Cards */}
      <View style={styles.grid}>
        {filteredThemes.map((t, index) => {
          const isActive = colorTheme === t.name;
          return (
            <Pressable
              key={`${t.name}-${t.category || 'palette'}-${index}`}
              onPress={() => setColorTheme(t.name)}
              style={({ pressed }) => [
                styles.themeCard,
                {
                  width: numColumns === 3 ? '31.8%' : numColumns === 2 ? '48.5%' : '100%',
                  backgroundColor: isActive ? (isDark ? '#191f30' : '#eef2ff') : cardBg,
                  borderColor: isActive ? (t.preview || activePrimary) : border,
                  borderWidth: isActive ? 2 : 1,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.cardTopRow}>
                {/* 5-Dot Palette Preview */}
                <View style={styles.dotsGroup}>
                  {t.colors.slice(0, 5).map((color, i) => (
                    <View
                      key={i}
                      style={[
                        styles.paletteDot,
                        {
                          backgroundColor: color,
                          transform: [{ scale: i === 0 ? 1.15 : 1 }],
                        },
                      ]}
                    />
                  ))}
                </View>

                {isActive && (
                  <View style={[styles.activeCheck, { backgroundColor: t.preview || activePrimary }]}>
                    <Check size={11} color="#ffffff" strokeWidth={3} />
                  </View>
                )}
              </View>

              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={[styles.themeCardTitle, { color: isActive ? (isDark ? '#93c5fd' : '#1e40af') : text }]}>
                    {t.label}
                  </Text>
                  <Text style={[styles.themeCategoryTag, { color: muted }]}>
                    {t.category === 'tweakcn' ? '✨ Tweakcn Custom' : '🎨 Base Palette'}
                  </Text>
                </View>

                {/* Color Preview Pill */}
                <View
                  style={[
                    styles.primaryPreviewPill,
                    { backgroundColor: t.preview, borderColor: 'rgba(0,0,0,0.15)' },
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  bannerCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bannerSubtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  livePreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  swatchesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  liveControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterSection: {
    gap: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  tabChipText: {
    fontSize: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeCard: {
    padding: 12,
    borderRadius: 12,
    gap: 10,
    cursor: 'pointer' as any,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  paletteDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  activeCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeCardTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  themeCategoryTag: {
    fontSize: 10,
    marginTop: 2,
  },
  primaryPreviewPill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default AppThemesPreview;
