import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { BORDER_RADIUS } from '@/theme/globals';
import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  style?: ViewStyle;
}

export function AccordionItem({
  title,
  children,
  defaultExpanded = false,
  style,
}: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const rotation = useSharedValue(defaultExpanded ? 180 : 0);

  const border = useColor('border');
  const card = useColor('card');
  const textColor = useColor('text');
  const textMuted = useColor('textMuted');

  const toggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    rotation.value = withTiming(nextState ? 180 : 0, { duration: 250 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      style={[
        {
          backgroundColor: card,
          borderColor: border,
          borderWidth: 1,
          borderRadius: BORDER_RADIUS,
          overflow: 'hidden',
          marginBottom: 10,
        },
        style,
      ]}
    >
      <Pressable
        onPress={toggle}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: pressed ? border + '30' : 'transparent',
        })}
      >
        <Text style={{ fontSize: 15, fontWeight: '600', color: textColor }}>
          {title}
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={18} color={textMuted} />
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 4,
            borderTopWidth: 1,
            borderTopColor: border + '50',
          }}
        >
          {typeof children === 'string' ? (
            <Text style={{ color: textMuted, fontSize: 14, lineHeight: 20 }}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
}

export interface AccordionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Accordion({ children, style }: AccordionProps) {
  return <View style={style}>{children}</View>;
}
