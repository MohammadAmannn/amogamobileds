import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  View,
  Text,
  useWindowDimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
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
} from 'lucide-react-native';
import {
  COMPONENTS,
  ComponentItem,
  ComponentCategory,
} from '@/components/design-system/registry';
import { ComponentPreviewModal } from '@/components/design-system/component-preview-modal';

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
];

export default function DesignSystemScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ComponentCategory>('All');
  const [activeComponent, setActiveComponent] = useState<ComponentItem | null>(null);

  // Theme-adaptive colors matching screenshot 1
  const bg = isDark ? '#0B0F19' : '#FFFFFF';
  const headerBg = isDark ? '#0B0F19' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const mutedText = isDark ? '#94A3B8' : '#64748B';
  const searchBg = isDark ? '#1E293B' : '#F8FAFC';
  const searchBorder = isDark ? '#334155' : '#E2E8F0';
  const cardBg = isDark ? '#141E33' : '#F8FAFC';
  const cardBorder = isDark ? '#1E293B' : '#F1F5F9';

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

  // Color mapping for pill badges matching screenshot 1
  const getBadgeColors = (tag: string) => {
    switch (tag) {
      case 'BUTTON':
        return { bg: '#F3E8FF', text: '#9333EA' }; // Soft purple
      case 'INPUT':
      case 'OTP INPUT':
        return { bg: '#E0F2FE', text: '#0284C7' }; // Soft sky blue
      case 'BADGE':
        return { bg: '#FCE7F3', text: '#DB2777' }; // Soft pink
      case 'AVATAR':
        return { bg: '#FEF3C7', text: '#D97706' }; // Soft amber
      case 'CARD':
        return { bg: '#EDE9FE', text: '#6366F1' }; // Soft indigo
      case 'CHECKBOX':
      case 'SWITCH':
        return { bg: '#F1F5F9', text: '#475569' }; // Soft slate gray
      case 'TOAST':
      case 'NOTIFICATION':
        return { bg: '#FCE7F3', text: '#BE185D' }; // Soft red-pink
      case 'SPINNER':
      case 'SKELETON':
        return { bg: '#DCFCE7', text: '#16A34A' }; // Soft emerald
      case 'THEME':
      case 'TYPOGRAPHY':
        return { bg: '#E0E7FF', text: '#4F46E5' }; // Soft violet
      default:
        return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* 1. Header with Proper Status Bar Safe Area Padding */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 16) + 4,
            backgroundColor: headerBg,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          {/* Emerald Green Rounded Command Logo */}
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>⌘</Text>
          </View>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            Design System
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {}}
            activeOpacity={0.7}
            accessibilityLabel="Search"
          >
            <Search size={21} color={mutedText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {}}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Bell size={21} color={mutedText} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. Search Input Bar */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: searchBg, borderColor: searchBorder },
            ]}
          >
            <Search size={17} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Search components, files..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearBtn}
                activeOpacity={0.7}
              >
                <X size={15} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 3. Category Filter Chips (Multi-row/Flex-wrap matching Screenshot 1) */}
        <View style={styles.categoriesWrapper}>
          <View style={styles.categoriesRow}>
            {CATEGORY_ITEMS.map((item) => {
              const isSelected = selectedCategory === item.name;
              const count = categoryCounts[item.name] || 0;
              const IconComp = item.Icon;

              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.chip,
                    isSelected
                      ? {
                          backgroundColor: '#DCFCE7',
                          borderColor: '#86EFAC',
                        }
                      : {
                          backgroundColor: searchBg,
                          borderColor: searchBorder,
                        },
                  ]}
                  onPress={() => setSelectedCategory(item.name)}
                  activeOpacity={0.8}
                >
                  <IconComp
                    size={13}
                    color={isSelected ? '#15803D' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: isSelected ? '#15803D' : textColor,
                        fontWeight: isSelected ? '600' : '500',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={[
                      styles.chipBadge,
                      {
                        backgroundColor: isSelected ? '#BBF7D0' : isDark ? '#334155' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipBadgeText,
                        {
                          color: isSelected ? '#166534' : mutedText,
                        },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Component Cards List (Compact, Clean, Exact Match to Screenshot 1) */}
        <View
          style={[
            styles.cardsContainer,
            isDesktop && {
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            },
          ]}
        >
          {filteredComponents.map((comp: ComponentItem, index: number) => {
            const badge = getBadgeColors(comp.tag);
            const isFirst = index === 0 && !searchQuery && selectedCategory === 'All';

            return (
              <TouchableOpacity
                key={comp.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    width: isDesktop ? '49.2%' : '100%',
                  },
                  isFirst && styles.activeCardAccent,
                ]}
                onPress={() => setActiveComponent(comp)}
                activeOpacity={0.7}
              >
                {/* Row 1: Title (left) & Badge (right) */}
                <View style={styles.cardHeaderRow}>
                  <Text
                    style={[styles.cardTitle, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {comp.name}
                  </Text>
                  <View
                    style={[
                      styles.badgePill,
                      { backgroundColor: badge.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: badge.text },
                      ]}
                    >
                      {comp.tag}
                    </Text>
                  </View>
                </View>

                {/* Row 2: Filename */}
                <Text
                  style={[styles.filenameText, { color: mutedText }]}
                  numberOfLines={1}
                >
                  {comp.file}
                </Text>
              </TouchableOpacity>
            );
          })}

          {filteredComponents.length === 0 && (
            <View style={[styles.emptyBox, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.emptyTitle, { color: textColor }]}>
                No components found
              </Text>
              <Text style={[styles.emptySub, { color: mutedText }]}>
                {`No results matching "${searchQuery}"`}
              </Text>
            </View>
          )}
        </View>

        {/* 5. Footer matching Screenshot 1 */}
  
      </ScrollView>

      {/* Interactive Modal Preview */}
      <ComponentPreviewModal
        component={activeComponent}
        visible={!!activeComponent}
        onClose={() => setActiveComponent(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 860,
        alignSelf: 'center',
      },
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#059669', // Emerald green from screenshot 1
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 860,
        alignSelf: 'center',
      },
    }),
  },
  searchContainer: {
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  categoriesWrapper: {
    marginBottom: 14,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 12.5,
  },
  chipBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
  },
  chipBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  cardsContainer: {
    gap: 8,
  },
  card: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 3,
  },
  activeCardAccent: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#6366F1', // Accent purple vertical line on first card
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 8,
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  filenameText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  emptyBox: {
    padding: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
