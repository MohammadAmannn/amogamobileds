import React from 'react';
import { View, Text, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { X, MoreVertical } from 'lucide-react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useColorTheme } from '../../providers/color-theme-provider';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  showClose?: boolean;
  showMore?: boolean;
  onMore?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export function PageHeader({
  title,
  subtitle,
  onClose,
  showClose = true,
  showMore = false,
  onMore,
  rightAction,
  style,
  titleStyle,
}: PageHeaderProps) {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();

  const textColor = isDark ? '#f4f4f5' : '#09090b';
  const mutedColor = isDark ? '#94a3b8' : '#71717a';
  const borderColor = isDark ? '#27272a' : '#f1f5f9';
  const btnBg = isDark ? '#18181b' : '#f4f4f5';

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 14,
          marginBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        style,
      ]}
    >
      {/* Left Title & Subtitle */}
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text
          style={[
            {
              fontFamily: 'OpenSans_600SemiBold, OpenSans_500Medium, var(--font-open-sans), "Open Sans", sans-serif',
              fontSize: 18,
              fontWeight: '700',
              color: textColor,
              letterSpacing: -0.3,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: 'OpenSans_400Regular, var(--font-open-sans), "Open Sans", sans-serif',
              fontSize: 12,
              color: mutedColor,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {rightAction}

        {showMore && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onMore}
            accessibilityLabel="More options"
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: btnBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MoreVertical size={18} color={mutedColor} />
          </TouchableOpacity>
        )}

        {showClose && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            accessibilityLabel="Close page"
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: btnBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} color={mutedColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
