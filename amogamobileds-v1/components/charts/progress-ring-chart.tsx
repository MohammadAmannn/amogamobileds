import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export interface ProgressRingData {
  label: string;
  value: number; // 0 to 100
  color: string;
}

export interface ProgressRingChartProps {
  data: ProgressRingData[];
  size?: number;
  strokeWidth?: number;
  ringSpacing?: number;
  showLegend?: boolean;
  style?: ViewStyle;
}

export function ProgressRingChart({
  data,
  size = 200,
  strokeWidth = 14,
  ringSpacing = 6,
  showLegend = true,
  style,
}: ProgressRingChartProps) {
  const border = useColor('border');
  const textMuted = useColor('textMuted');
  const center = size / 2;

  const rings = data.map((ring, index) => {
    const radius = center - (strokeWidth / 2) - index * (strokeWidth + ringSpacing);
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(ring.value, 0), 100) / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return {
      ...ring,
      radius,
      circumference,
      strokeDashoffset,
    };
  });

  return (
    <View style={[{ alignItems: 'center', gap: 16 }, style]}>
      <Svg width={size} height={size}>
        <G rotation='-90' origin={`${center}, ${center}`}>
          {rings.map((ring, index) => (
            <React.Fragment key={index}>
              {/* Background track circle */}
              <Circle
                cx={center}
                cy={center}
                r={ring.radius}
                stroke={border}
                strokeWidth={strokeWidth}
                strokeOpacity={0.4}
                fill='none'
              />
              {/* Active animated stroke circle */}
              <Circle
                cx={center}
                cy={center}
                r={ring.radius}
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${ring.circumference} ${ring.circumference}`}
                strokeDashoffset={ring.strokeDashoffset}
                strokeLinecap='round'
                fill='none'
              />
            </React.Fragment>
          ))}
        </G>
      </Svg>

      {showLegend && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {data.map((ring, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: ring.color }} />
              <Text style={{ fontSize: 12, color: textMuted }}>
                {ring.label} ({ring.value}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
