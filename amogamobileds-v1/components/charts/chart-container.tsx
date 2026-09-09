import { Text } from '../ui/text';
import { View } from '../ui/view';
import { useColor } from '../../hooks/useColor';
import { BORDER_RADIUS } from '../../theme/globals';
import React from 'react';
import { ViewStyle } from 'react-native';

export interface ChartContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: ViewStyle;
}

export function ChartContainer({
  title,
  description,
  children,
  footer,
  style,
}: ChartContainerProps) {
  const card = useColor('card');
  const border = useColor('border');
  const textColor = useColor('text');
  const textMuted = useColor('textMuted');

  return (
    <View
      style={[
        {
          backgroundColor: card,
          borderColor: border,
          borderWidth: 1,
          borderRadius: BORDER_RADIUS,
          padding: 20,
          gap: 16,
        },
        style,
      ]}
    >
      {(title || description) && (
        <View style={{ gap: 4 }}>
          {title && (
            <Text style={{ fontSize: 16, fontWeight: '700', color: textColor }}>
              {title}
            </Text>
          )}
          {description && (
            <Text style={{ fontSize: 13, color: textMuted }}>
              {description}
            </Text>
          )}
        </View>
      )}

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>

      {footer && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: border + '50',
            paddingTop: 12,
          }}
        >
          {footer}
        </View>
      )}
    </View>
  );
}
