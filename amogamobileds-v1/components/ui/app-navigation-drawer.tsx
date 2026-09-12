import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Command,
  Home,
  Mail,
  MessageSquare,
  Folder,
  Calendar,
  CheckSquare,
  Bell,
  X,
  ChevronRight,
  User as UserIcon,
  Palette,
  Settings,
  Sliders,
  LogOut,
  MapPin,
  Map,
  LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';
import {
  AppMenuItemJson,
  app_menu_json,
  convertMenuJsonToNavItems,
  resolveMenuIcon,
  NavigationItem,
  AppProfileMenuItemJson,
  app_profile_menu_json,
} from './app-navigation-sidebar';

export interface DrawerMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  pageUrl?: string;
  pageName?: string;
}

export const DEFAULT_DRAWER_ITEMS: DrawerMenuItem[] = convertMenuJsonToNavItems(app_menu_json, 'mobile');

export interface AppNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeId?: string;
  onSelect: (id: string, item?: DrawerMenuItem | AppMenuItemJson) => void;
  items?: DrawerMenuItem[];
  menuJson?: AppMenuItemJson[];
  profileMenuItems?: AppProfileMenuItemJson[];
  profileMenuJson?: AppProfileMenuItemJson[];
  onProfileMenuSelect?: (id: string, item: AppProfileMenuItemJson) => void;
  workspaceName?: string;
  workspaceSubtitle?: string;
  userName?: string;
  userSubtitle?: string;
  userInitials?: string;
  onProfilePress?: () => void;
  onMapPress?: () => void;
  onThemePress?: () => void;
  onPreferencesPress?: () => void;
  onPreferencePress?: () => void;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
  onSignOut?: () => void;
  primaryColor?: string;
}

export function AppNavigationDrawer({
  isOpen,
  onClose,
  activeId = 'home',
  onSelect,
  items,
  menuJson,
  profileMenuItems,
  profileMenuJson,
  onProfileMenuSelect,
  workspaceName = 'Amoga App',
  workspaceSubtitle = 'Workspace',
  userName = 'Mohammed Aman',
  userSubtitle = 'My Account',
  userInitials = 'MA',
  onProfilePress,
  onMapPress,
  onThemePress,
  onPreferencesPress,
  onPreferencePress,
  onSettingsPress,
  onNotificationsPress,
  onSignOut,
  primaryColor,
}: AppNavigationDrawerProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  // Dynamically resolve drawer menu items
  const drawerItems = useMemo(() => {
    if (items && items.length > 0) return items;
    if (menuJson && menuJson.length > 0) return convertMenuJsonToNavItems(menuJson, 'mobile');
    return DEFAULT_DRAWER_ITEMS;
  }, [items, menuJson]);

  // Dynamically resolve profile menu items
  const profileList = useMemo(() => {
    if (profileMenuItems && profileMenuItems.length > 0) return profileMenuItems;
    if (profileMenuJson && profileMenuJson.length > 0) return profileMenuJson;
    return app_profile_menu_json;
  }, [profileMenuItems, profileMenuJson]);

  const drawerWidth = Math.min(screenWidth * 0.82, 320);
  const [mounted, setMounted] = React.useState(isOpen);

  const translateX = useSharedValue(-drawerWidth);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      translateX.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(1, { duration: 280 });
    } else if (mounted) {
      translateX.value = withTiming(
        -drawerWidth,
        { duration: 240, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(setMounted)(false);
          }
        }
      );
      backdropOpacity.value = withTiming(0, { duration: 240 });
    }
  }, [isOpen, drawerWidth]);

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(backdropOpacity.value, [0, 1], [0, 0.5]),
  }));

  if (!mounted && !isOpen) return null;

  const bg = isDark ? '#111115' : '#ffffff';
  const itemHoverBg = isDark ? '#1e1e24' : '#f8fafc';
  const activeBg = primaryColor && primaryColor !== '#18181b' && primaryColor !== '#000000'
    ? primaryColor
    : '#7c3aed';
  const activeTextColor = isDark ? '#e9d5ff' : (primaryColor && primaryColor !== '#18181b' ? primaryColor : '#6d28d9');
  const inactiveTextColor = isDark ? '#e4e4e7' : '#1e293b';
  const mutedText = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#27272a' : '#f1f5f9';

  return (
    <>
      <Modal
        visible={mounted}
        transparent
        animationType="none"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          {/* Backdrop */}
          <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
            <Pressable style={styles.backdropPressable} onPress={onClose} />
          </Animated.View>

          {/* Drawer Panel */}
          <Animated.View
            style={[
              styles.drawerContainer,
              {
                width: drawerWidth,
                backgroundColor: bg,
                paddingTop: Math.max(insets.top, 20),
                paddingBottom: Math.max(insets.bottom, 16),
              },
              animatedDrawerStyle,
            ]}
          >
            {/* Header: Workspace branding & Close X */}
            <View style={styles.drawerHeader}>
              <View style={styles.headerLeft}>
                <View style={[styles.headerLogo, { backgroundColor: isDark ? '#27272a' : '#18181b' }]}>
                  <Command size={18} color="#ffffff" strokeWidth={2.4} />
                </View>
                <View style={styles.headerTitles}>
                  <Text
                    style={[
                      styles.workspaceTitle,
                      { color: isDark ? '#ffffff' : '#0f172a' },
                    ]}
                    numberOfLines={1}
                  >
                    {workspaceName}
                  </Text>
                  <Text style={[styles.workspaceSub, { color: mutedText }]}>
                    {workspaceSubtitle}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
              >
                <X size={18} color={isDark ? '#e4e4e7' : '#475569'} />
              </TouchableOpacity>
            </View>

            {/* Section Label: MENU */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: mutedText }]}>MENU</Text>
            </View>

            {/* Navigation Items List */}
            <ScrollView
              style={styles.itemsScroll}
              contentContainerStyle={styles.itemsScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {drawerItems.map((item) => {
                const isActive =
                  activeId?.toLowerCase() === item.id.toLowerCase() ||
                  activeId?.toLowerCase() === item.label.toLowerCase() ||
                  activeId?.toLowerCase() === (item.pageName || '').toLowerCase();
                const IconComp = item.icon;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelect(item.id, item);
                      onClose();
                    }}
                    style={[
                      styles.menuItemRow,
                      isActive && {
                        backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <View style={styles.itemLeft}>
                      <View style={styles.iconBox}>
                        <IconComp
                          size={18}
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
                          styles.itemLabel,
                          {
                            color: isActive
                              ? isDark
                                ? '#ffffff'
                                : '#0f172a'
                              : isDark
                              ? '#e4e4e7'
                              : '#1e293b',
                            fontWeight: isActive ? '600' : '500',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {/* Active right indicator */}
                    {isActive && (
                      <View
                        style={[
                          styles.activeDot,
                          { backgroundColor: isDark ? '#ffffff' : '#0f172a' },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Bottom Profile / Account Section */}
            <View
              style={[
                styles.drawerFooter,
                { borderTopColor: borderColor },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsProfileMenuOpen(true);
                }}
                style={styles.profileRow}
                accessibilityRole="button"
                accessibilityLabel="User Account"
              >
                <View style={styles.profileLeft}>
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

                  <View style={styles.profileInfo}>
                    <Text
                      style={[
                        styles.profileName,
                        { color: colors.foreground },
                      ]}
                      numberOfLines={1}
                    >
                      {userName}
                    </Text>
                    <Text style={[styles.profileSub, { color: mutedText }]}>
                      {userSubtitle}
                    </Text>
                  </View>
                </View>

                <ChevronRight
                  size={18}
                  color={mutedText}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Profile Popover Modal */}
      <Modal
        visible={isProfileMenuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsProfileMenuOpen(false)}
      >
        <View style={styles.profileModalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsProfileMenuOpen(false)}
          />
          <View
            style={[
              styles.profilePopCard,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: colors.border,
                bottom: Math.max(insets.bottom, 16) + 70,
              },
            ]}
          >
            {/* Top User Header */}
            <View style={styles.popHeader}>
              <View
                style={[
                  styles.popAvatar,
                  {
                    backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                    borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.popAvatarText,
                    { color: isDark ? '#e4e4e7' : '#1e293b' },
                  ]}
                >
                  {userInitials}
                </Text>
              </View>
              <View style={styles.popInfo}>
                <Text
                  style={[styles.popUserName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  style={[styles.popUserSub, { color: mutedText }]}
                  numberOfLines={1}
                >
                  {userSubtitle}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.popDivider,
                { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
              ]}
            />

            {/* Menu Options from JSON */}
            <View style={styles.popItemsList}>
              {profileList.map((item) => {
                const IconComponent = resolveMenuIcon(item.icon);
                const itemColor = item.isDanger
                  ? '#ef4444'
                  : item.id === 'theme'
                  ? colors.primary
                  : item.color || mutedText;

                return (
                  <React.Fragment key={item.id}>
                    {item.hasDividerBefore && (
                      <View
                        style={[
                          styles.popDivider,
                          { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
                        ]}
                      />
                    )}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setIsProfileMenuOpen(false);
                        onClose();
                        if (item.id === 'profile') onProfilePress?.();
                        else if (item.id === 'map') onMapPress?.();
                        else if (item.id === 'theme') onThemePress?.();
                        else if (item.id === 'preferences') (onPreferencesPress || onPreferencePress)?.();
                        else if (item.id === 'settings') onSettingsPress?.();
                        else if (item.id === 'notifications') onNotificationsPress?.();
                        else if (item.id === 'signout' || item.isDanger) onSignOut?.();
                        onProfileMenuSelect?.(item.id, item);
                      }}
                      style={[styles.popItem, item.isDanger && { marginTop: 2 }]}
                    >
                      <IconComponent
                        size={18}
                        color={itemColor}
                        strokeWidth={item.id === 'theme' || item.id === 'preferences' ? 2 : 1.9}
                      />
                      <Text
                        style={[
                          styles.popItemText,
                          { color: item.isDanger ? '#ef4444' : colors.foreground },
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
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  backdropPressable: {
    flex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 100,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitles: {
    flex: 1,
  },
  workspaceTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  workspaceSub: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  closeButton: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    fontFamily: 'Open Sans',
    textTransform: 'uppercase',
  },
  itemsScroll: {
    flex: 1,
  },
  itemsScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 4,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 14,
    fontFamily: 'Open Sans',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  drawerFooter: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  profileSub: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 16,
    position: 'relative',
  },
  profilePopCard: {
    position: 'absolute',
    left: 16,
    width: 250,
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
  popHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
  },
  popAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  popInfo: {
    flex: 1,
  },
  popUserName: {
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  popUserSub: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  popDivider: {
    height: 1,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  popItemsList: {
    gap: 2,
  },
  popItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 12,
  },
  popItemText: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
});
