import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  ChevronsUpDown,
  User,
  Bell,
  MessageCircle,
  CreditCard,
  ShoppingBag,
  Palette,
  Settings,
  LogOut,
} from 'lucide-react-native';

interface NavUserProps {
  user?: {
    name: string;
    email: string;
    initials: string;
  };
  onOpenThemeSettings: () => void;
  isDark?: boolean;
}

export function NavUser({
  user = {
    name: 'Mohammed Aman',
    email: 'mohammed@amoga.io',
    initials: 'MA',
  },
  onOpenThemeSettings,
  isDark = false,
}: NavUserProps) {
  const [isOpen, setIsOpen] = useState(false);

  const bg = isDark ? '#141721' : '#ffffff';
  const border = isDark ? '#232734' : '#e4e4e7';
  const text = isDark ? '#f4f4f5' : '#09090b';
  const muted = isDark ? '#a1a1aa' : '#71717a';
  const itemHover = isDark ? '#1e2230' : '#f4f4f5';
  const avatarBg = isDark ? '#272a38' : '#f1f5f9';
  const avatarText = isDark ? '#f4f4f5' : '#09090b';

  return (
    <View style={styles.container}>
      {/* Invisible backdrop to close on outside click */}
      {isOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setIsOpen(false)}
        />
      )}

      {/* Floating Popover Menu */}
      {isOpen && (
        <View
          style={[
            styles.popover,
            {
              backgroundColor: bg,
              borderColor: border,
              shadowColor: '#000000',
            },
          ]}
        >
          {/* Top User Info Header */}
          <View style={styles.popoverHeader}>
            <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
              <Text style={[styles.avatarText, { color: avatarText }]}>
                {user.initials}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.userNameText, { color: text }]} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={[styles.userEmailText, { color: muted }]} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          {/* Menu Section 1 */}
          <View style={{ gap: 2 }}>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              activeOpacity={0.7}
              style={[styles.menuItem]}
            >
              <User size={15} color={muted} />
              <Text style={[styles.menuItemText, { color: text }]}>My Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              activeOpacity={0.7}
              style={[styles.menuItem]}
            >
              <Bell size={15} color={muted} />
              <Text style={[styles.menuItemText, { color: text }]}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              activeOpacity={0.7}
              style={[styles.menuItem]}
            >
              <MessageCircle size={15} color={muted} />
              <Text style={[styles.menuItemText, { color: text }]}>Help & Support</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          {/* Menu Section 2 */}
          <View style={{ gap: 2 }}>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              activeOpacity={0.7}
              style={[styles.menuItem]}
            >
              <CreditCard size={15} color={muted} />
              <Text style={[styles.menuItemText, { color: text }]}>Subscriptions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              activeOpacity={0.7}
              style={[styles.menuItem]}
            >
              <ShoppingBag size={15} color={muted} />
              <Text style={[styles.menuItemText, { color: text }]}>Buy Apps</Text>
            </TouchableOpacity>

            {/* Theme Settings with Colored Palette Icon */}
            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                onOpenThemeSettings();
              }}
              activeOpacity={0.7}
              style={[styles.menuItem, { backgroundColor: isDark ? '#281f3d' : '#f5f3ff' }]}
            >
              <Palette size={15} color="#3b82f6" />
              <Text style={[styles.menuItemText, { color: isDark ? '#c4b5fd' : '#4f46e5', fontWeight: '500' }]}>
                Theme Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              activeOpacity={0.7}
              style={[styles.menuItem]}
            >
              <Settings size={15} color={muted} />
              <Text style={[styles.menuItemText, { color: text }]}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          {/* Sign out */}
          <TouchableOpacity
            onPress={() => setIsOpen(false)}
            activeOpacity={0.7}
            style={[styles.menuItem]}
          >
            <LogOut size={15} color="#ef4444" />
            <Text style={[styles.menuItemText, { color: '#ef4444', fontWeight: '500' }]}>
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Trigger Card in Sidebar Footer */}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
        style={[
          styles.triggerCard,
          {
            backgroundColor: isOpen ? itemHover : 'transparent',
            borderColor: isOpen ? border : 'transparent',
          },
        ]}
      >
        <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
          <Text style={[styles.avatarText, { color: avatarText }]}>
            {user.initials}
          </Text>
        </View>

        <Text style={[styles.triggerName, { color: text }]} numberOfLines={1}>
          {user.name}
        </Text>

        <ChevronsUpDown size={15} color={muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 1000,
  },
  backdrop: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  triggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    cursor: 'pointer' as any,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  triggerName: {
    fontSize: 13.5,
    fontWeight: '500',
    flex: 1,
  },
  popover: {
    position: 'absolute',
    bottom: 52,
    left: 0,
    width: 250,
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 10001,
  },
  popoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  userNameText: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  userEmailText: {
    fontSize: 11,
  },
  divider: {
    height: 1,
    marginVertical: 5,
    marginHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
    cursor: 'pointer' as any,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
