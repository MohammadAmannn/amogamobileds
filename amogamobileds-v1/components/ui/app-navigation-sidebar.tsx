import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import {
  Command,
  Home,
  Mail,
  MessageSquare,
  Folder,
  Calendar,
  CheckSquare,
  Bell,
  User as UserIcon,
  Palette,
  Settings,
  LogOut,
  Sparkles,
  FileText,
  Layers,
  Compass,
  HelpCircle,
  Sliders,
  MapPin,
  Map,
  LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import defaultMenuData from './app-menu.json';
import defaultProfileMenuData from './app-profile-menu.json';

export interface AppProfileMenuItemJson {
  id: string;
  label: string;
  icon: string;
  color?: string;
  isDanger?: boolean;
  hasDividerBefore?: boolean;
}

export const app_profile_menu_json: AppProfileMenuItemJson[] = defaultProfileMenuData as AppProfileMenuItemJson[];

export interface AppMenuItemJson {
  menu_icon: string;
  menu_title: string;
  menu_status: 'yes' | 'no' | string;
  menu_page_url: string;
  menu_page_name: string;
  web?: 'yes' | 'no' | string;
  mobile?: 'yes' | 'no' | string;
  badge?: number | string;
  id?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  pageUrl?: string;
  pageName?: string;
}

export const app_menu_json: AppMenuItemJson[] = defaultMenuData as AppMenuItemJson[];

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Home,
  Mail,
  Email: Mail,
  MessageSquare,
  Chat: MessageSquare,
  Folder,
  Files: Folder,
  Calendar,
  CheckSquare,
  Tasks: CheckSquare,
  Bell,
  Notification: Bell,
  Notifications: Bell,
  User: UserIcon,
  Palette,
  Settings,
  Sliders,
  LogOut,
  Sparkles,
  FileText,
  Layers,
  Compass,
  HelpCircle,
  Command,
  MapPin,
  Map,
};

export function resolveMenuIcon(iconName: string): LucideIcon {
  if (!iconName) return MessageSquare;
  if (ICON_REGISTRY[iconName]) return ICON_REGISTRY[iconName];
  const normalized = iconName.toLowerCase().replace(/[-_\s]/g, '');
  for (const [key, comp] of Object.entries(ICON_REGISTRY)) {
    if (key.toLowerCase() === normalized) return comp;
  }
  return MessageSquare;
}

export function convertMenuJsonToNavItems(
  jsonItems: AppMenuItemJson[] = app_menu_json,
  platform: 'web' | 'mobile' = 'web'
): NavigationItem[] {
  return jsonItems
    .filter((item) => {
      const isEnabled = item.menu_status?.toLowerCase() === 'yes';
      const platformAllowed =
        platform === 'web'
          ? item.web?.toLowerCase() !== 'no'
          : item.mobile?.toLowerCase() !== 'no';
      return isEnabled && platformAllowed;
    })
    .map((item) => {
      const generatedId =
        item.id ||
        (item.menu_page_name || item.menu_title || '')
          .toLowerCase()
          .replace(/[-_\s]+/g, '-');

      return {
        id: generatedId || 'nav-item',
        label: item.menu_title,
        icon: resolveMenuIcon(item.menu_icon),
        badge: item.badge,
        pageUrl: item.menu_page_url,
        pageName: item.menu_page_name,
      };
    });
}

export const DEFAULT_NAV_ITEMS: NavigationItem[] = convertMenuJsonToNavItems(app_menu_json, 'web');

export interface AppNavigationSidebarProps {
  items?: NavigationItem[];
  menuJson?: AppMenuItemJson[];
  profileMenuItems?: AppProfileMenuItemJson[];
  profileMenuJson?: AppProfileMenuItemJson[];
  onProfileMenuSelect?: (id: string, item: AppProfileMenuItemJson) => void;
  activeId: string;
  onSelect: (id: string, item?: NavigationItem | AppMenuItemJson) => void;
  userInitials?: string;
  userName?: string;
  userSubtitle?: string;
  onProfilePress?: () => void;
  onMapPress?: () => void;
  onThemePress?: () => void;
  onPreferencesPress?: () => void;
  onPreferencePress?: () => void;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
  onSignOut?: () => void;
  onLogoPress?: () => void;
  primaryColor?: string;
  style?: any;
}

export function AppNavigationSidebar({
  items,
  menuJson,
  profileMenuItems,
  profileMenuJson,
  onProfileMenuSelect,
  activeId = 'home',
  onSelect,
  userInitials = 'MA',
  userName = 'Mohammed Aman',
  userSubtitle = 'Account',
  onProfilePress,
  onMapPress,
  onThemePress,
  onPreferencesPress,
  onPreferencePress,
  onSettingsPress,
  onNotificationsPress,
  onSignOut,
  onLogoPress,
  primaryColor,
  style,
}: AppNavigationSidebarProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [isDropupOpen, setIsDropupOpen] = useState(false);

  // Dynamically resolve navigation items
  const navItems = useMemo(() => {
    if (items && items.length > 0) return items;
    if (menuJson && menuJson.length > 0) return convertMenuJsonToNavItems(menuJson, 'web');
    return DEFAULT_NAV_ITEMS;
  }, [items, menuJson]);

  // Dynamically resolve profile popover items
  const profileList = useMemo(() => {
    if (profileMenuItems && profileMenuItems.length > 0) return profileMenuItems;
    if (profileMenuJson && profileMenuJson.length > 0) return profileMenuJson;
    return app_profile_menu_json;
  }, [profileMenuItems, profileMenuJson]);

  const sidebarBg = colors.background;
  const borderColor = colors.border;
  const activeColor = primaryColor || colors.primary;
  const inactiveColor = colors.mutedForeground;

  const popoverBg = colors.card || colors.background;
  const popoverBorder = colors.border;
  const popoverText = colors.foreground;
  const popoverMuted = colors.mutedForeground;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: sidebarBg,
          borderRightColor: borderColor,
        },
        style,
      ]}
    >
      {/* Top App Logo Badge */}
      <View style={styles.topLogoSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onLogoPress}
          style={[styles.logoBadge, { backgroundColor: isDark ? '#27272a' : '#18181b', shadowColor: '#000000' }]}
          accessibilityRole="button"
          accessibilityLabel="Amoga Logo"
        >
          <Command size={20} color="#ffffff" strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* Navigation Menu Items */}
      <ScrollView
        style={styles.menuScrollView}
        contentContainerStyle={styles.menuScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {navItems.map((item) => {
          const isActive =
            activeId?.toLowerCase() === item.id.toLowerCase() ||
            activeId?.toLowerCase() === item.label.toLowerCase() ||
            activeId?.toLowerCase() === (item.pageName || '').toLowerCase();
          const IconComp = item.icon;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelect(item.id, item)}
              style={[
                styles.navItemButton,
                isActive && {
                  backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.iconWrap}>
                <IconComp
                  size={19}
                  color={
                    isActive
                      ? isDark
                        ? '#ffffff'
                        : '#0f172a'
                      : isDark
                      ? '#94a3b8'
                      : '#64748b'
                  }
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </View>

              <Text
                style={[
                  styles.navItemLabel,
                  {
                    color: isActive
                      ? isDark
                        ? '#ffffff'
                        : '#0f172a'
                      : isDark
                      ? '#94a3b8'
                      : '#64748b',
                    fontWeight: isActive ? '600' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>

              {item.badge !== undefined && (
                <View
                  style={[
                    styles.badgeContainer,
                    { backgroundColor: activeColor },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Profile User Button */}
      <View style={[styles.bottomSection, { borderTopColor: borderColor }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsDropupOpen(true)}
          style={styles.userButton}
          accessibilityRole="button"
          accessibilityLabel="User Account Menu"
        >
          <View
            style={[
              styles.avatarBadge,
              {
                backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                borderColor: isDark ? '#3f3f46' : '#e2e8f0',
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: isDark ? '#e4e4e7' : '#1e293b' },
              ]}
            >
              {userInitials}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Dropup / Popover Menu matching Screenshot */}
      <Modal
        visible={isDropupOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropupOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsDropupOpen(false)}
          />
          <View
            style={[
              styles.dropupCard,
              {
                backgroundColor: popoverBg,
                borderColor: popoverBorder,
              },
            ]}
          >
            {/* Top User Row */}
            <View style={styles.dropupHeader}>
              <View
                style={[
                  styles.headerAvatar,
                  {
                    backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                    borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.headerAvatarText,
                    { color: isDark ? '#e4e4e7' : '#1e293b' },
                  ]}
                >
                  {userInitials}
                </Text>
              </View>
              <View style={styles.headerInfo}>
                <Text
                  style={[styles.userName, { color: popoverText }]}
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  style={[styles.userSub, { color: popoverMuted }]}
                  numberOfLines={1}
                >
                  {userSubtitle}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
              ]}
            />

            {/* Dynamic Menu Options from JSON */}
            <View style={styles.menuItemsList}>
              {profileList.map((item) => {
                const IconComponent = resolveMenuIcon(item.icon);
                const itemColor = item.isDanger
                  ? '#ef4444'
                  : item.id === 'theme'
                  ? activeColor
                  : item.color || popoverMuted;

                return (
                  <React.Fragment key={item.id}>
                    {item.hasDividerBefore && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
                        ]}
                      />
                    )}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setIsDropupOpen(false);
                        if (item.id === 'profile') onProfilePress?.();
                        else if (item.id === 'map') onMapPress?.();
                        else if (item.id === 'theme') onThemePress?.();
                        else if (item.id === 'preferences') (onPreferencesPress || onPreferencePress)?.();
                        else if (item.id === 'settings') onSettingsPress?.();
                        else if (item.id === 'notifications') onNotificationsPress?.();
                        else if (item.id === 'signout' || item.isDanger) onSignOut?.();
                        onProfileMenuSelect?.(item.id, item);
                      }}
                      style={[styles.dropupItem, item.isDanger && styles.signOutItem]}
                    >
                      <IconComponent
                        size={17}
                        color={itemColor}
                        strokeWidth={item.id === 'theme' || item.id === 'preferences' ? 2 : 1.9}
                      />
                      <Text
                        style={[
                          styles.dropupItemText,
                          { color: item.isDanger ? '#ef4444' : popoverText },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    height: '100%',
    borderRightWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    zIndex: 20,
    ...Platform.select({
      web: {
        userSelect: 'none',
        flexShrink: 0,
      } as any,
    }),
  },
  topLogoSection: {
    alignItems: 'center',
    paddingBottom: 14,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  menuScrollView: {
    flex: 1,
    width: '100%',
  },
  menuScrollContent: {
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  navItemButton: {
    width: 58,
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  iconWrap: {
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 2,
  },
  navItemLabel: {
    fontSize: 10,
    letterSpacing: 0.1,
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  badgeContainer: {
    position: 'absolute',
    top: 4,
    right: 8,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  userButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  dropupCard: {
    position: 'absolute',
    bottom: 66,
    left: 16,
    width: 230,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 1000,
  },
  dropupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  userSub: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  divider: {
    height: 1,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  menuItemsList: {
    gap: 2,
  },
  dropupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 12,
  },
  dropupItemText: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  signOutItem: {
    marginTop: 2,
  },
});
