import React, { FC } from 'react';
import { StyleSheet, View, Text, StyleProp, TextStyle } from 'react-native';
import { differenceInDays, format, sub, startOfDay } from 'date-fns';
import { YAxis } from 'react-native-svg-charts';

import { text, colors } from 'theme';
import { DailyStatsData } from 'services/api';

import { BarChartContent } from 'components/atoms/bar-chart-content';

export interface TrendChartProps {
  hint?: string;
  yesterday?: string;
  data: DailyStatsData;
  intervalsCount?: number;
  primaryColor?: string;
  backgroundColor?: string;
  chartType?: 'bar';
}

function formatLabel(value: number) {
  if (value > 1000000) {
    const millions = parseFloat((value / 1000000).toFixed(1));
    return `${millions}m`;
  }

  if (value > 1000) {
    const thousands = parseFloat((value / 1000).toFixed(1));
    return `${thousands}k`;
  }

  if (value % 1 !== 0) {
    return '';
  }

  return value;
}

function getXAxisDates(axisData: Date[], intervalsCount: number) {
  const lastDay = axisData[axisData.length - 1];
  const totalDays = differenceInDays(startOfDay(lastDay), startOfDay(axisData[0])) + 1;

  const interval = Math.ceil(totalDays / intervalsCount);
  const axisDates = Array(intervalsCount)
    .fill('')
    .map((_, index) => {
      const daysBeforeLast = interval * (intervalsCount - index - 1);
      const date = sub(lastDay, {
        days: daysBeforeLast
      });
      return date;
    });
  return axisDates;
}

export const TrendChart: FC<TrendChartProps> = ({
  data,
  hint,
  yesterday,
  intervalsCount = 5,
  primaryColor = colors.activeRed,
  backgroundColor = colors.white
}) => {
  const axisData: Date[] = data.map(([x, _]) => new Date(x));
  const chartData: number[] = data.map(([_, y]) => y);
  const xAxisDates = getXAxisDates(axisData, intervalsCount);

  const last = data[data.length - 1];
  const labelString = `${last[1]} ${yesterday}`;
  // ensure we're not showing ticks for non-whole numbers
  const ticksToShow = Math.max(...chartData) >= 5 ? 3 : 2;

  // Give y axis label text enough space to not get cropped
  const contentInset = { top: 6, bottom: 6 };

  return (
    <>
      <View style={styles.chartingRow} accessible accessibilityHint={hint} accessibilityLabel={labelString}>
        <YAxis
          style={styles.yAxis}
          data={chartData}
          numberOfTicks={ticksToShow}
          contentInset={contentInset}
          svg={{ fontSize: 12, fill: colors.text }}
          formatLabel={formatLabel}
          min={0}
        />
        <View style={styles.chartingCol}>
          <BarChartContent
            chartData={chartData}
            contentInset={contentInset}
            style={styles.chart}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            ticksToShow={ticksToShow}
          />
          <View style={styles.xAxis}>
            {xAxisDates.map((date, index) => {
              const dayNum = format(date, 'd');
              const month = format(date, 'MMM');

              const previousDate = index ? xAxisDates[index - 1] : sub(new Date(data[0][0]), { days: 1 });

              const daysWidth = differenceInDays(startOfDay(date), startOfDay(previousDate));

              const dateStyles = [styles.date] as StyleProp<TextStyle>;

              return (
                <View key={`axis-${dayNum}-${month}`} style={[styles.xAxisPositioner, { flex: daysWidth }]}>
                  <View style={styles.xAxisLabel}>
                    <Text numberOfLines={1} style={dateStyles}>
                      {dayNum}
                    </Text>
                    <Text numberOfLines={1} style={dateStyles}>
                      {month}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chartingRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white
  },
  yAxis: {
    height: 144,
    paddingRight: 4
  },
  chartingCol: {
    flex: 1,
    flexDirection: 'column'
  },
  chart: {
    flex: 1,
    height: 144
  },
  xAxis: {
    height: 36,
    marginTop: -6,
    paddingTop: 4,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.dot
  },
  xAxisPositioner: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  xAxisLabel: {},
  date: {
    textAlign: 'center',
    ...text.xsmallBold
  },
  leftAlign: {
    textAlign: 'left'
  },
  rightAlign: {
    textAlign: 'right'
  }
});
