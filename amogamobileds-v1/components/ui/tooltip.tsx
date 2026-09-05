import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import React, { useState } from 'react';
import { Pressable, ViewStyle } from 'react-native';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  style?: ViewStyle;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  style,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const card = useColor('card');
  const border = useColor('border');
  const textColor = useColor('text');

  return (
    <View style={[{ position: 'relative', alignItems: 'center' }, style]}>
      <Pressable
        onPress={() => setVisible(!visible)}
        onHoverIn={() => setVisible(true)}
        onHoverOut={() => setVisible(false)}
      >
        {children}
      </Pressable>

      {visible && (
        <View
          style={{
            position: 'absolute',
            ...(position === 'top' ? { bottom: '100%', marginBottom: 8 } : { top: '100%', marginTop: 8 }),
            backgroundColor: card,
            borderColor: border,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
            zIndex: 1000,
            minWidth: 80,
            alignItems: 'center',
          }}
        >
          {typeof content === 'string' ? (
            <Text style={{ fontSize: 12, fontWeight: '500', color: textColor, textAlign: 'center' }}>
              {content}
            </Text>
          ) : (
            content
          )}
        </View>
      )}
    </View>
  );
}
