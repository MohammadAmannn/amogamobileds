import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
} from 'react-native';
import {
  Reply,
  Forward,
  Pin,
  Star,
  Heart,
  Archive,
  Bell,
  Trash2,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Check,
} from 'lucide-react-native';
import { useColor } from '../../hooks/useColor';
import { useTheme } from '../../providers/theme-provider';

export interface ChatActionMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  iconColor: string;
  textColor?: string;
  isDestructive?: boolean;
  hasSubmenu?: boolean;
  onPress?: () => void;
}

export interface ChatActionMenuProps {
  onSelect?: (actionId: string) => void;
  isPinned?: boolean;
  isStarred?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  showTrigger?: boolean;
  isOpen?: boolean;
  isOwnMessage?: boolean;
  onClose?: () => void;
}

export function ChatActionMenu({
  onSelect,
  isPinned = false,
  isStarred = false,
  isFavorite = false,
  isArchived = false,
  showTrigger = false,
  isOpen = true,
  isOwnMessage = true,
  onClose,
}: ChatActionMenuProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [pinned, setPinned] = useState(isPinned);
  const [starred, setStarred] = useState(isStarred);
  const [favorite, setFavorite] = useState(isFavorite);
  const [archived, setArchived] = useState(isArchived);
  const [showDeleteChoices, setShowDeleteChoices] = useState(false);

  const cardBg = isDark ? '#121216' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const mutedColor = isDark ? '#a1a1aa' : '#71717a';
  const hoverBg = isDark ? '#1e1e24' : '#f4f4f5';
  const dividerColor = isDark ? '#27272a' : '#f1f5f9';

  const handleAction = (id: string) => {
    if (id === 'delete') {
      setShowDeleteChoices(true);
      return;
    }

    setActiveItem(id);
    if (id === 'pin') setPinned(!pinned);
    if (id === 'star') setStarred(!starred);
    if (id === 'favorite') setFavorite(!favorite);
    if (id === 'archive') setArchived(!archived);

    onSelect?.(id);
    setTimeout(() => setActiveItem(null), 300);
  };

  const menuItems: ChatActionMenuItem[] = [
    {
      id: 'reply',
      label: 'Reply',
      icon: Reply,
      iconColor: '#3b82f6',
    },
    {
      id: 'forward',
      label: 'Forward',
      icon: Forward,
      iconColor: '#0ea5e9',
    },
    {
      id: 'pin',
      label: pinned ? 'Unpin Message' : 'Pin Message',
      icon: Pin,
      iconColor: '#a855f7',
    },
    {
      id: 'star',
      label: starred ? 'Starred' : 'Star',
      icon: Star,
      iconColor: '#f59e0b',
    },
    {
      id: 'favorite',
      label: favorite ? 'Favorited' : 'Favorite',
      icon: Heart,
      iconColor: '#ec4899',
    },
    {
      id: 'archive',
      label: archived ? 'Unarchive' : 'Archive',
      icon: Archive,
      iconColor: '#6366f1',
    },
  ];

  const secondaryItems: ChatActionMenuItem[] = [
    {
      id: 'action-this',
      label: 'Action This',
      icon: Bell,
      iconColor: '#f59e0b',
      hasSubmenu: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      iconColor: '#ef4444',
      textColor: '#ef4444',
      isDestructive: true,
      hasSubmenu: true,
    },
  ];

  const renderItem = (item: ChatActionMenuItem) => {
    const IconComp = item.icon;
    const isItemActive = activeItem === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleAction(item.id)}
        activeOpacity={0.7}
        style={[
          styles.menuItem,
          { backgroundColor: isItemActive ? hoverBg : 'transparent' },
        ]}
      >
        <View style={styles.itemLeft}>
          <IconComp size={16} color={item.iconColor} strokeWidth={2} />
          <Text
            style={[
              styles.itemLabel,
              { color: item.textColor || textColor },
            ]}
          >
            {item.label}
          </Text>
        </View>

        {item.hasSubmenu && (
          <ChevronRight
            size={14}
            color={item.isDestructive ? '#ef4444' : mutedColor}
          />
        )}
      </TouchableOpacity>
    );
  };

  if (showDeleteChoices) {
    return (
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: cardBg,
            borderColor,
            shadowColor: isDark ? '#000000' : '#64748b',
            width: 220,
          },
        ]}
      >
        <View style={styles.submenuHeader}>
          <TouchableOpacity
            onPress={() => setShowDeleteChoices(false)}
            hitSlop={8}
            style={styles.backButton}
          >
            <ChevronLeft size={16} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.submenuTitle, { color: textColor }]}>
            Delete message?
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        <TouchableOpacity
          onPress={() => {
            setShowDeleteChoices(false);
            onSelect?.('delete-for-me');
          }}
          activeOpacity={0.7}
          style={[styles.menuItem, { paddingVertical: 10 }]}
        >
          <View style={styles.itemLeft}>
            <Trash2 size={16} color="#ef4444" strokeWidth={2} />
            <Text style={[styles.itemLabel, { color: '#ef4444' }]}>
              Delete for me
            </Text>
          </View>
        </TouchableOpacity>

        {isOwnMessage !== false && (
          <TouchableOpacity
            onPress={() => {
              setShowDeleteChoices(false);
              onSelect?.('delete-for-everyone');
            }}
            activeOpacity={0.7}
            style={[styles.menuItem, { paddingVertical: 10 }]}
          >
            <View style={styles.itemLeft}>
              <Trash2 size={16} color="#ef4444" strokeWidth={2} />
              <Text style={[styles.itemLabel, { color: '#ef4444' }]}>
                Delete for everyone
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        <TouchableOpacity
          onPress={() => setShowDeleteChoices(false)}
          activeOpacity={0.7}
          style={[styles.menuItem, { justifyContent: 'center' }]}
        >
          <Text style={[styles.itemLabel, { color: mutedColor }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardBg,
          borderColor,
          shadowColor: isDark ? '#000000' : '#64748b',
        },
      ]}
    >
      {/* Primary Actions */}
      <View style={styles.itemsGroup}>
        {menuItems.map(renderItem)}
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      {/* Secondary Actions */}
      <View style={styles.itemsGroup}>
        {secondaryItems.map(renderItem)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  submenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
  },
  backButton: {
    padding: 2,
  },
  submenuTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  itemsGroup: {
    gap: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    marginVertical: 4,
    marginHorizontal: 6,
  },
});
