import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

export interface AreaChartDataPoint {
  label: string;
  value: number;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  height?: number;
  width?: number;
  color?: string;
  showDots?: boolean;
  style?: ViewStyle;
}

export function AreaChart({
  data,
  height = 200,
  width = 300,
  color,
  showDots = true,
  style,
}: AreaChartProps) {
  const primary = useColor('primary');
  const textMuted = useColor('textMuted');
  const card = useColor('card');

  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingLeft = 20;
  const paddingRight = 20;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;

  const maxValue = Math.max(...data.map((d) => d.value), 10);
  const stepX = chartWidth / (data.length - 1 || 1);

  const points = data.map((item, index) => {
    const x = paddingLeft + index * stepX;
    const y = paddingTop + chartHeight - (item.value / maxValue) * chartHeight;
    return { x, y, value: item.value, label: item.label };
  });

  const linePath = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${acc} L ${point.x} ${point.y}`;
  }, '');

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const baselineY = paddingTop + chartHeight;

  const areaPath = `${linePath} L ${lastPoint.x} ${baselineY} L ${firstPoint.x} ${baselineY} Z`;
  const strokeColor = color || primary;

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id='areaGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <Stop offset='0%' stopColor={strokeColor} stopOpacity='0.45' />
            <Stop offset='100%' stopColor={strokeColor} stopOpacity='0.02' />
          </LinearGradient>
        </Defs>

        {/* Gradient Area Fill */}
        <Path d={areaPath} fill='url(#areaGradient)' />

        {/* Top Boundary Line */}
        <Path
          d={linePath}
          fill='none'
          stroke={strokeColor}
          strokeWidth={3}
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        {/* Data points & X labels */}
        {points.map((point, index) => (
          <React.Fragment key={index}>
            {showDots && (
              <Circle
                cx={point.x}
                cy={point.y}
                r={4.5}
                fill={card}
                stroke={strokeColor}
                strokeWidth={2.5}
              />
            )}
            <SvgText
              x={point.x}
              y={height - 8}
              fill={textMuted}
              fontSize={11}
              fontWeight='500'
              textAnchor='middle'
            >
              {point.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}
