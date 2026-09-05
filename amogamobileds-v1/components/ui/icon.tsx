import { useColor } from '@/hooks/useColor';
import { LucideProps } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

export type Props = LucideProps & {
  lightColor?: string;
  darkColor?: string;
  name: React.ComponentType<LucideProps>;
};

export function Icon({
  lightColor,
  darkColor,
  name: IconComponent,
  color,
  size = 24,
  strokeWidth = 1.8,
  accessible = false,
  ...rest
}: Props) {
  const themedColor = useColor('icon', { light: lightColor, dark: darkColor });

  // Use provided color prop if available, otherwise use themed color
  const iconColor = color || themedColor;

  if (!IconComponent || (typeof IconComponent !== 'function' && typeof IconComponent !== 'object')) {
    return null;
  }

  try {
    const iconProps: any = {
      color: iconColor,
      size,
      strokeWidth,
      ...rest,
    };
    if (Platform.OS !== 'web' && accessible !== undefined) {
      iconProps.accessible = accessible;
    }

    return (
      <IconComponent
        {...iconProps}
      />
    );
  } catch {
    return null;
  }
}
