import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import {
  ChevronsUpDown,
  User as UserIcon,
  Bell,
  MessageCircle,
  CreditCard,
  ShoppingBag,
  Palette,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'expo-router';

interface NavUserProps {
  onOpenThemeSettings: () => void;
  isDark?: boolean;
  compact?: boolean;
  placement?: 'top' | 'bottom';
}

const initialsOf = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U';

export function NavUser({
  onOpenThemeSettings,
  isDark = false,
  compact = false,
  placement = compact ? 'bottom' : 'top',
}: NavUserProps) {
  const { user, profile, signOut } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Compute display properties from authenticated session/profile
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || 'user@amoga.io';
  const initials = initialsOf(displayName);

  const bg = isDark ? '#141721' : '#ffffff';
  const border = isDark ? '#232734' : '#e4e4e7';
  const text = isDark ? '#f4f4f5' : '#09090b';
  const muted = isDark ? '#a1a1aa' : '#71717a';
  const itemHover = isDark ? '#1e2230' : '#f4f4f5';
  const avatarBg = isDark ? '#272a38' : '#f1f5f9';
  const avatarText = isDark ? '#f4f4f5' : '#09090b';

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      setIsOpen(false);
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Could not sign out', (error as Error).message);
      setSigningOut(false);
    }
  };

  const handleNavigateSettings = () => {
    setIsOpen(false);
    router.push('/(tabs)/settings');
  };

  return (
    <View style={[styles.container, compact && { width: 'auto' }]}>
      {/* Root-Level Portal Modal to guarantee 100% top layer with zero sibling overlap */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            position: 'relative',
          }}
          onPress={() => setIsOpen(false)}
        >
          {/* Floating Popover Menu */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.popover,
              placement === 'bottom'
                ? { top: 56, right: 16, left: 'auto', bottom: 'auto' as any }
                : { bottom: 58, left: 16, right: 'auto', top: 'auto' as any },
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
                  {initials}
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.userNameText, { color: text }]} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={[styles.userEmailText, { color: muted }]} numberOfLines={1}>
                  {email}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: border }]} />

            {/* Menu Section 1 */}
            <View style={{ gap: 2 }}>
              <TouchableOpacity
                onPress={handleNavigateSettings}
                activeOpacity={0.7}
                style={[styles.menuItem]}
              >
                <UserIcon size={15} color={muted} />
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
                onPress={handleNavigateSettings}
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
              onPress={handleSignOut}
              disabled={signingOut}
              activeOpacity={0.7}
              style={[styles.menuItem]}
            >
              {signingOut ? (
                <ActivityIndicator size="small" color="#ef4444" style={{ width: 15, height: 15 }} />
              ) : (
                <LogOut size={15} color="#ef4444" />
              )}
              <Text style={[styles.menuItemText, { color: '#ef4444', fontWeight: '500' }]}>
                {signingOut ? 'Signing out...' : 'Sign out'}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Trigger Button */}
      {compact ? (
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.7}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: isOpen ? '#3b82f6' : border,
            backgroundColor: isOpen ? itemHover : avatarBg,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
              web: {
                cursor: 'pointer',
              } as any,
            }),
          }}
          accessibilityLabel="User profile menu"
        >
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: text }}>
            {initials}
          </Text>
        </TouchableOpacity>
      ) : (
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
              {initials}
            </Text>
          </View>

          <Text style={[styles.triggerName, { color: text }]} numberOfLines={1}>
            {displayName}
          </Text>

          <ChevronsUpDown size={15} color={muted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 1000,
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
    width: 250,
    borderRadius: 14,
    borderWidth: 1,
    padding: 6,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 50,
    zIndex: 999999,
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
      } as any,
    }),
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
