import { View } from '../ui/view';
import { useColor } from '../../hooks/useColor';
import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

export interface LineChartDataPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  height?: number;
  width?: number;
  lineColor?: string;
  dotColor?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  showDots?: boolean;
  style?: ViewStyle;
}

export function LineChart({
  data,
  height = 200,
  width = 300,
  lineColor,
  dotColor,
  strokeWidth = 3,
  showGrid = true,
  showDots = true,
  style,
}: LineChartProps) {
  const primary = useColor('primary');
  const border = useColor('border');
  const textMuted = useColor('textMuted');
  const card = useColor('card');

  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingLeft = 30;
  const paddingRight = 20;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;

  const maxValue = Math.max(...data.map((d) => d.value), 10);
  const stepX = chartWidth / (data.length - 1 || 1);

  // Generate path points
  const points = data.map((item, index) => {
    const x = paddingLeft + index * stepX;
    const y = paddingTop + chartHeight - (item.value / maxValue) * chartHeight;
    return { x, y, value: item.value, label: item.label };
  });

  const pathString = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${acc} L ${point.x} ${point.y}`;
  }, '');

  const stroke = lineColor || primary;

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Svg width={width} height={height}>
        {/* Horizontal Grid lines */}
        {showGrid &&
          [0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const gridVal = Math.round(maxValue * ratio);
            return (
              <React.Fragment key={index}>
                <Line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={border}
                  strokeDasharray='4 4'
                  strokeWidth={1}
                />
                <SvgText
                  x={paddingLeft - 6}
                  y={y + 4}
                  fill={textMuted}
                  fontSize={10}
                  textAnchor='end'
                >
                  {gridVal}
                </SvgText>
              </React.Fragment>
            );
          })}

        {/* The Line */}
        <Path
          d={pathString}
          fill='none'
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        {/* Data points & X-axis labels */}
        {points.map((point, index) => (
          <React.Fragment key={index}>
            {showDots && (
              <>
                <Circle
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  fill={card}
                  stroke={dotColor || stroke}
                  strokeWidth={2.5}
                />
              </>
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
