import { Text } from '../ui/text';
import { View } from '../ui/view';
import { useColor } from '../../hooks/useColor';
import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  width?: number;
  barColor?: string;
  barRadius?: number;
  showGrid?: boolean;
  showValues?: boolean;
  style?: ViewStyle;
}

export function BarChart({
  data,
  height = 200,
  width = 300,
  barColor,
  barRadius = 6,
  showGrid = true,
  showValues = true,
  style,
}: BarChartProps) {
  const primary = useColor('primary');
  const border = useColor('border');
  const textMuted = useColor('textMuted');

  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingLeft = 30;
  const paddingRight = 15;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;

  const maxValue = Math.max(...data.map((d) => d.value), 10);
  const barWidth = Math.min(36, (chartWidth / data.length) * 0.65);
  const barSpacing = chartWidth / data.length;

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

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = paddingLeft + index * barSpacing + (barSpacing - barWidth) / 2;
          const y = paddingTop + chartHeight - barHeight;
          const fill = item.color || barColor || primary;

          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={barRadius}
                fill={fill}
              />
              {showValues && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fill={textMuted}
                  fontSize={11}
                  fontWeight='600'
                  textAnchor='middle'
                >
                  {item.value}
                </SvgText>
              )}
              {/* X Axis Label */}
              <SvgText
                x={x + barWidth / 2}
                y={height - 8}
                fill={textMuted}
                fontSize={11}
                fontWeight='500'
                textAnchor='middle'
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
