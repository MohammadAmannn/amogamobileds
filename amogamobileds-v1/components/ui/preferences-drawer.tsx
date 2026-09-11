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
  Switch,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {
  X,
  Search,
  Sliders,
  RotateCcw,
  Bell,
  Lock,
  Moon,
  Volume2,
  Vibrate,
  CheckCircle2,
  Mail,
  Download,
  Cloud,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import initialPreferencesData from './app_preference_settings.json';

export interface PreferenceItem {
  id: string;
  preference: string;
  key: string;
  description: string;
  status: 'Yes' | 'No' | string;
  icon?: string;
}

export const DEFAULT_PREFERENCES: PreferenceItem[] = initialPreferencesData as PreferenceItem[];

const PREFERENCE_ICON_MAP: Record<string, LucideIcon> = {
  push_notifications: Bell,
  biometric_face_id_lock: Lock,
  dark_mode_sync: Moon,
  sound_effects: Volume2,
  haptic_feedback: Vibrate,
  read_receipts: CheckCircle2,
  email_notifications: Mail,
  auto_download_media: Download,
  cloud_backup: Cloud,
  two_factor_auth: ShieldCheck,
};

export interface PreferencesViewProps {
  onClose?: () => void;
  preferences?: PreferenceItem[];
  onPreferenceChange?: (id: string, value: boolean) => void;
  onResetPreferences?: () => void;
  primaryColor?: string;
  style?: any;
  showHeader?: boolean;
  title?: string;
}

/**
 * PreferencesView: Embedded full-pane view matching user screenshot exactly.
 * Renders in the right window panel with cross on top right to close.
 */
export function PreferencesView({
  onClose,
  preferences: controlledPreferences,
  onPreferenceChange,
  onResetPreferences,
  primaryColor,
  style,
  showHeader = true,
  title,
}: PreferencesViewProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [localPreferences, setLocalPreferences] = useState<PreferenceItem[]>(DEFAULT_PREFERENCES);
  const currentPreferences = controlledPreferences || localPreferences;

  const handleToggle = (id: string, val: boolean) => {
    if (onPreferenceChange) {
      onPreferenceChange(id, val);
    } else {
      setLocalPreferences((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: val ? 'Yes' : 'No' } : item
        )
      );
    }
  };

  const purpleText = isDark ? '#c084fc' : '#9333ea';
  const textMuted = isDark ? '#94a3b8' : '#71717a';
  const activeTrackColor = '#10b981';

  return (
    <View style={[styles.viewContainer, { backgroundColor: colors.background }, style]}>
      {/* Top Header Bar with Close Cross strictly on the Right */}
      {showHeader && (
        <View style={[styles.viewTopBar, { borderBottomColor: colors.border }]}>
          <Text style={[styles.viewTopBarTitle, { color: colors.foreground }]}>
            {title || 'Preferences'}
          </Text>

          {onClose && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.viewCloseBtn}
              accessibilityRole="button"
              accessibilityLabel="Close preferences"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={colors.foreground} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Preferences List matching the screenshot exactly */}
      <ScrollView
        style={styles.viewScroll}
        contentContainerStyle={styles.viewScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.viewItemsList}>
          {currentPreferences.map((item) => {
            const isEnabled = item.status?.toLowerCase() === 'yes';

            return (
              <View key={item.id} style={styles.viewItemRow}>
                {/* Left Purple Label with Subtitle */}
                <View style={styles.viewItemLeft}>
                  <Text style={[styles.viewItemTitle, { color: purpleText }]}>
                    {item.preference}
                  </Text>
                  {item.description ? (
                    <Text style={[styles.viewItemDesc, { color: textMuted }]}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>

                {/* Right Green/Grey Switch */}
                <Switch
                  trackColor={{
                    false: isDark ? '#334155' : '#e4e4e7',
                    true: activeTrackColor,
                  }}
                  thumbColor="#ffffff"
                  ios_backgroundColor={isDark ? '#334155' : '#e4e4e7'}
                  onValueChange={(val) => handleToggle(item.id, val)}
                  value={isEnabled}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export interface PreferencesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preferences?: PreferenceItem[];
  onPreferenceChange?: (id: string, value: boolean) => void;
  onResetPreferences?: () => void;
  primaryColor?: string;
}

export function PreferencesDrawer({
  isOpen,
  onClose,
  preferences: controlledPreferences,
  onPreferenceChange,
  onResetPreferences,
  primaryColor,
}: PreferencesDrawerProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [localPreferences, setLocalPreferences] = useState<PreferenceItem[]>(DEFAULT_PREFERENCES);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPreferences = controlledPreferences || localPreferences;

  const handleToggle = (id: string, val: boolean) => {
    if (onPreferenceChange) {
      onPreferenceChange(id, val);
    } else {
      setLocalPreferences((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: val ? 'Yes' : 'No' } : item
        )
      );
    }
  };

  const handleReset = () => {
    if (onResetPreferences) {
      onResetPreferences();
    } else {
      setLocalPreferences(DEFAULT_PREFERENCES);
    }
  };

  const filteredPreferences = useMemo(() => {
    if (!searchQuery.trim()) return currentPreferences;
    const q = searchQuery.toLowerCase().trim();
    return currentPreferences.filter(
      (item) =>
        item.preference.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q)
    );
  }, [currentPreferences, searchQuery]);

  if (!isOpen) return null;

  const bg = isDark ? '#0f172a' : '#ffffff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const cardBg = isDark ? '#1e293b' : '#f8fafc';
  const cardBorder = isDark ? '#334155' : '#e2e8f0';
  const activeColor = primaryColor || '#9333ea';
  const activeTrackColor = '#10b981';

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
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <View style={styles.headerTitles}>
              <View style={styles.titleRow}>
                <View style={[styles.iconBadge, { backgroundColor: `${activeColor}20` }]}>
                  <Sliders size={18} color={activeColor} strokeWidth={2.2} />
                </View>
                <Text style={[styles.headerTitle, { color: textPrimary }]}>
                  Preferences
                </Text>
              </View>
              <Text style={[styles.headerSub, { color: textMuted }]}>
                Customize notifications, security, media, and app behavior.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close preferences"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color={textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Body Scroll Area */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
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
                placeholder="Search preferences..."
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

            <View style={styles.metaRow}>
              <Text style={[styles.availableCountText, { color: textMuted }]}>
                {filteredPreferences.length} preferences configured
              </Text>
            </View>

            {/* Preference Items List */}
            <View style={styles.preferencesList}>
              {filteredPreferences.map((item) => {
                const isEnabled = item.status?.toLowerCase() === 'yes';
                const IconComp = PREFERENCE_ICON_MAP[item.key] || Sliders;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.preferenceCard,
                      {
                        backgroundColor: cardBg,
                        borderColor: cardBorder,
                      },
                    ]}
                  >
                    <View style={styles.cardLeft}>
                      <View
                        style={[
                          styles.itemIconBox,
                          {
                            backgroundColor: isEnabled
                              ? `${activeColor}22`
                              : isDark
                              ? '#334155'
                              : '#e2e8f0',
                          },
                        ]}
                      >
                        <IconComp
                          size={18}
                          color={isEnabled ? activeColor : textMuted}
                          strokeWidth={2}
                        />
                      </View>

                      <View style={styles.cardInfo}>
                        <Text
                          style={[
                            styles.preferenceTitle,
                            { color: isDark ? '#c084fc' : '#9333ea' },
                          ]}
                          numberOfLines={1}
                        >
                          {item.preference}
                        </Text>
                        {item.description ? (
                          <Text
                            style={[styles.preferenceDesc, { color: textMuted }]}
                            numberOfLines={2}
                          >
                            {item.description}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    {/* Switch */}
                    <Switch
                      trackColor={{
                        false: isDark ? '#334155' : '#cbd5e1',
                        true: activeTrackColor,
                      }}
                      thumbColor="#ffffff"
                      ios_backgroundColor={isDark ? '#334155' : '#cbd5e1'}
                      onValueChange={(val) => handleToggle(item.id, val)}
                      value={isEnabled}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom Reset Button */}
          <View style={[styles.footer, { borderTopColor: borderColor }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleReset}
              style={styles.resetButtonFull}
              accessibilityRole="button"
              accessibilityLabel="Reset Preferences"
            >
              <RotateCcw size={16} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Reset to Defaults</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}

// Convenient Alias for component naming parity
export const PreferenceSettingsDrawer = PreferencesDrawer;

const styles = StyleSheet.create({
  // PreferencesView Styles
  viewContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  viewTopBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  viewTopBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  viewCloseBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewScroll: {
    flex: 1,
  },
  viewScrollContent: {
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  viewItemsList: {
    gap: 22,
  },
  viewItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  viewItemLeft: {
    flex: 1,
    paddingRight: 20,
  },
  viewItemTitle: {
    fontSize: 15.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  viewItemDesc: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    marginTop: 3,
    lineHeight: 18,
  },

  // Drawer Styles
  modalRoot: {
    flex: 1,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableCountText: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  preferencesList: {
    gap: 12,
  },
  preferenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    letterSpacing: -0.1,
  },
  preferenceDesc: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    marginTop: 2,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  resetButtonFull: {
    width: '100%',
    height: 46,
    backgroundColor: '#9333ea',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
});
