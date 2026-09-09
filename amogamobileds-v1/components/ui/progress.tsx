import { View } from './view';
import { useColor } from '../../hooks/useColor';
import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function Progress({
  value,
  max = 100,
  height = 8,
  color,
  backgroundColor,
  style,
}: ProgressProps) {
  const primary = useColor('primary');
  const border = useColor('border');

  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = (clampedValue / max) * 100;

  const progress = useSharedValue(percentage);

  useEffect(() => {
    progress.value = withTiming(percentage, { duration: 400 });
  }, [percentage, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View
      style={[
        {
          width: '100%',
          height,
          borderRadius: height / 2,
          backgroundColor: backgroundColor || border + '50',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            borderRadius: height / 2,
            backgroundColor: color || primary,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
