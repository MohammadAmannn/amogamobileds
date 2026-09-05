import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import React, { useState } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (val: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  style?: ViewStyle;
}

const THUMB_SIZE = 24;

export function Slider({
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  showValue = false,
  style,
}: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(240);
  const [displayValue, setDisplayValue] = useState(value);

  const primary = useColor('primary');
  const border = useColor('border');
  const textColor = useColor('text');

  const fraction = (value - min) / (max - min);
  const offset = useSharedValue(fraction * (trackWidth - THUMB_SIZE));

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== trackWidth) {
      setTrackWidth(width);
      offset.value = fraction * (width - THUMB_SIZE);
    }
  };

  const handleUpdate = (newOffset: number) => {
    const maxOffset = trackWidth - THUMB_SIZE;
    const clampedOffset = Math.max(0, Math.min(maxOffset, newOffset));
    const ratio = clampedOffset / maxOffset;
    let rawVal = min + ratio * (max - min);
    if (step > 0) {
      rawVal = Math.round(rawVal / step) * step;
    }
    const clampedVal = Math.min(max, Math.max(min, rawVal));
    setDisplayValue(clampedVal);
    onValueChange?.(clampedVal);
  };

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((e) => {
      offset.value = Math.max(
        0,
        Math.min(trackWidth - THUMB_SIZE, e.x - THUMB_SIZE / 2)
      );
      runOnJS(handleUpdate)(offset.value);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const activeTrackStyle = useAnimatedStyle(() => ({
    width: offset.value + THUMB_SIZE / 2,
  }));

  return (
    <View style={[{ width: '100%', gap: 6 }, style]}>
      {showValue && (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: textColor }}>
            {displayValue}
          </Text>
        </View>
      )}

      <GestureDetector gesture={panGesture}>
        <View
          onLayout={onLayout}
          style={{
            height: 36,
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Background Track */}
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: border,
              width: '100%',
            }}
          />

          {/* Active Highlight Track */}
          <Animated.View
            style={[
              {
                height: 6,
                borderRadius: 3,
                backgroundColor: primary,
                position: 'absolute',
                left: 0,
              },
              activeTrackStyle,
            ]}
          />

          {/* Draggable Thumb Knob */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE / 2,
                backgroundColor: '#ffffff',
                borderWidth: 2,
                borderColor: primary,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
                elevation: 4,
              },
              thumbStyle,
            ]}
          />
        </View>
      </GestureDetector>
    </View>
  );
}
