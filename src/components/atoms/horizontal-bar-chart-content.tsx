import React, { FC } from 'react';
import { ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { Rect, G, Text as SvgText } from 'react-native-svg';
import { BarChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { colors, text } from 'theme';

interface HorizontalBarChartContentProps {
  chartData: { value: number; label: string }[];
  contentInset: { top: number; bottom: number };
  primaryColor?: string;
  cornerRoundness?: number;
  gapPercent?: number;
  style?: StyleProp<ViewStyle>;
}

interface BarChildProps {
  x: (index: number) => number;
  y: (value: number) => number;
  bandwidth: number;
  data: number[];
}

interface LabelsProps {
  y: (value: number) => number;
  bandwidth: number;
  data: number[];
}

export const HorizontalBarChartContent: FC<HorizontalBarChartContentProps> = ({
  chartData,
  contentInset,
  primaryColor = colors.orange,
  cornerRoundness = 4,
  gapPercent = 25,
  style
}) => {
  const Labels: FC<LabelsProps> = ({ y, bandwidth, data }) => (
    <>
      {data.map((value, index) => (
        <SvgText
          key={`${value}-${index}`}
          x={5}
          y={y(index) + bandwidth / 2 + 20}
          {...text.smallBold}
          fill={colors.text}
          alignmentBaseline={'middle'}
        >
          {chartData[index].label}
        </SvgText>
      ))}
    </>
  );

  const RoundedBarToppers: FC<BarChildProps> = ({ x, y, bandwidth, data }) => (
    <G>
      {data.map((value, index) =>
        value ? (
          <Rect
            y={y(index)}
            x={x(value) - cornerRoundness}
            rx={cornerRoundness}
            ry={cornerRoundness}
            height={bandwidth}
            width={cornerRoundness * 2}
            fill={primaryColor}
            key={`bar-${index}`}
          />
        ) : null
      )}
    </G>
  );

  const BarBackground: FC<BarChildProps> = ({ x, y, bandwidth, data }) => (
    <G>
      {data.map((value, index) => {
        return (
          <Rect
            y={y(index)}
            x={x(value) - cornerRoundness}
            rx={cornerRoundness}
            ry={cornerRoundness}
            height={bandwidth}
            width={x(Math.max(...data)) - x(value) + cornerRoundness * 2}
            fill={colors.background.chart}
            key={`bar-${index}`}
          />
        );
      })}
    </G>
  );

  return (
    <BarChart
      style={[style, styles.barChart]}
      data={chartData.map(d => d.value)}
      gridMin={0}
      spacingInner={gapPercent / 100}
      spacingOuter={gapPercent / 100}
      contentInset={{
        top: contentInset.top - 24 + cornerRoundness,
        bottom: contentInset.bottom - cornerRoundness,
        right: cornerRoundness
      }}
      curve={shape.curveMonotoneX}
      svg={{
        fill: primaryColor
      }}
      // @ts-ignore: this is a valid prop which isn't defined in @types/react-native-svg-charts
      horizontal={true}
    >
      {/* @ts-ignore: gets BarChildProps from BarChart parent */}
      <Labels />
      {/* @ts-ignore: gets BarChildProps from BarChart parent */}
      <BarBackground />
      {/* @ts-ignore: gets BarChildProps from BarChart parent */}
      <RoundedBarToppers />
    </BarChart>
  );
};

const styles = StyleSheet.create({
  barChart: {}
});
