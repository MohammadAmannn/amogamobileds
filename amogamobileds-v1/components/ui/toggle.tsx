import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { CORNERS } from '@/theme/globals';
import React from 'react';
import { Pressable, ViewStyle } from 'react-native';

export interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
  style?: ViewStyle;
}

export function Toggle({
  pressed = false,
  onPressedChange,
  disabled = false,
  children,
  size = 'default',
  style,
}: ToggleProps) {
  const border = useColor('border');
  const primary = useColor('primary');
  const primaryFg = useColor('primaryForeground');
  const textColor = useColor('text');

  const paddingHorizontal = size === 'sm' ? 10 : size === 'lg' ? 18 : 14;
  const height = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onPressedChange?.(!pressed)}
      style={[
        {
          height,
          paddingHorizontal,
          borderRadius: CORNERS,
          borderWidth: 1,
          borderColor: pressed ? primary : border,
          backgroundColor: pressed ? primary : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            fontSize: size === 'sm' ? 12 : 14,
            fontWeight: '600',
            color: pressed ? primaryFg : textColor,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface ToggleGroupProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (val: any) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ToggleGroup({
  children,
  style,
}: ToggleGroupProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
