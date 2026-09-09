import { Text } from '../ui/text';
import { View } from '../ui/view';
import { useColor } from '../../hooks/useColor';
import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

export interface PieChartSlice {
  label: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieChartSlice[];
  size?: number;
  donut?: boolean;
  innerRadius?: number;
  centerLabel?: string;
  centerValue?: string;
  showLegend?: boolean;
  style?: ViewStyle;
}

export function PieChart({
  data,
  size = 220,
  donut = true,
  innerRadius = 55,
  centerLabel,
  centerValue,
  showLegend = true,
  style,
}: PieChartProps) {
  const textColor = useColor('text');
  const textMuted = useColor('textMuted');
  const card = useColor('card');

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = size / 2 - 10;
  const center = size / 2;

  // Compute angles
  let accumulatedAngle = -90; // Start at top 12 o'clock

  const slices = data.map((slice) => {
    const angle = (slice.value / total) * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    let path = '';
    if (donut) {
      const ix1 = center + innerRadius * Math.cos(startRad);
      const iy1 = center + innerRadius * Math.sin(startRad);
      const ix2 = center + innerRadius * Math.cos(endRad);
      const iy2 = center + innerRadius * Math.sin(endRad);

      path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    } else {
      path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    return {
      ...slice,
      path,
      percentage: Math.round((slice.value / total) * 100),
    };
  });

  return (
    <View style={[{ alignItems: 'center', gap: 16 }, style]}>
      <View style={{ position: 'relative', width: size, height: size }}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((slice, index) => (
              <Path
                key={index}
                d={slice.path}
                fill={slice.color}
                stroke={card}
                strokeWidth={2}
              />
            ))}
          </G>
        </Svg>

        {/* Donut Center text */}
        {donut && (centerLabel || centerValue) && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {centerValue && (
              <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>
                {centerValue}
              </Text>
            )}
            {centerLabel && (
              <Text style={{ fontSize: 11, color: textMuted }}>
                {centerLabel}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Legend */}
      {showLegend && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            maxWidth: 300,
          }}
        >
          {slices.map((slice, index) => (
            <View
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: slice.color,
                }}
              />
              <Text style={{ fontSize: 12, color: textMuted }}>
                {slice.label} ({slice.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
