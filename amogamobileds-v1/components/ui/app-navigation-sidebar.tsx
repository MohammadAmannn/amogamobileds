import React, { useState } from 'react';
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
  LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
}

export const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'files', label: 'Files', icon: Folder },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'notification', label: 'Notification', icon: Bell },
];

export interface AppNavigationSidebarProps {
  items?: NavigationItem[];
  activeId: string;
  onSelect: (id: string) => void;
  userInitials?: string;
  userName?: string;
  userSubtitle?: string;
  onProfilePress?: () => void;
  onThemePress?: () => void;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
  onSignOut?: () => void;
  onLogoPress?: () => void;
  primaryColor?: string;
  style?: any;
}

export function AppNavigationSidebar({
  items = DEFAULT_NAV_ITEMS,
  activeId = 'chat',
  onSelect,
  userInitials = 'MA',
  userName = 'Mohammed Aman',
  userSubtitle = 'Account',
  onProfilePress,
  onThemePress,
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
          style={[styles.logoBadge, { backgroundColor: activeColor, shadowColor: activeColor }]}
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
        {items.map((item) => {
          const isActive = activeId === item.id;
          const IconComp = item.icon;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => onSelect(item.id)}
              style={[
                styles.navItemBtn,
                isActive && {
                  backgroundColor: `${activeColor}1a`,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={item.label}
            >
              {/* Active Indicator Bar on left/right */}
              {isActive && (
                <View
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: activeColor },
                  ]}
                />
              )}

              <View style={styles.iconWrapper}>
                <IconComp
                  size={20}
                  color={isActive ? activeColor : inactiveColor}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </View>

              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isActive ? activeColor : inactiveColor,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Profile Section */}
      <View
        style={[
          styles.bottomProfileSection,
          { borderTopColor: isDark ? '#1f1f23' : '#f1f5f9' },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsDropupOpen(!isDropupOpen)}
          style={[
            styles.profileAvatar,
            {
              backgroundColor: isDark ? '#27272a' : '#f1f5f9',
              borderColor: isDark ? '#3f3f46' : '#e2e8f0',
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="User Profile Menu"
        >
          <Text
            style={[
              styles.avatarText,
              { color: isDark ? '#e4e4e7' : '#1e293b' },
            ]}
          >
            {userInitials}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Dropup Popover (Screenshot 2) */}
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

            {/* Menu Options */}
            <View style={styles.menuItemsList}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsDropupOpen(false);
                  onProfilePress?.();
                }}
                style={styles.dropupItem}
              >
                <UserIcon size={17} color={popoverMuted} strokeWidth={1.9} />
                <Text style={[styles.dropupItemText, { color: popoverText }]}>
                  My Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsDropupOpen(false);
                  onThemePress?.();
                }}
                style={styles.dropupItem}
              >
                <Palette size={17} color={activeColor} strokeWidth={2} />
                <Text style={[styles.dropupItemText, { color: popoverText }]}>
                  Theme Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsDropupOpen(false);
                  onSettingsPress?.();
                }}
                style={styles.dropupItem}
              >
                <Settings size={17} color={popoverMuted} strokeWidth={1.9} />
                <Text style={[styles.dropupItemText, { color: popoverText }]}>
                  Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsDropupOpen(false);
                  onNotificationsPress?.();
                }}
                style={styles.dropupItem}
              >
                <Bell size={17} color={popoverMuted} strokeWidth={1.9} />
                <Text style={[styles.dropupItemText, { color: popoverText }]}>
                  Notifications
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
                ]}
              />

              {/* Sign Out Option */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsDropupOpen(false);
                  onSignOut?.();
                }}
                style={[styles.dropupItem, styles.signOutItem]}
              >
                <LogOut size={17} color="#ef4444" strokeWidth={1.9} />
                <Text style={[styles.dropupItemText, { color: '#ef4444' }]}>
                  Sign out
                </Text>
              </TouchableOpacity>
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
  navItemBtn: {
    width: 58,
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  activeIndicator: {
    position: 'absolute',
    left: -7,
    top: 10,
    bottom: 10,
    width: 3.5,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconWrapper: {
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    letterSpacing: 0.1,
    textAlign: 'center',
    fontFamily: 'Open Sans',
  },
  bottomProfileSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  profileAvatar: {
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
