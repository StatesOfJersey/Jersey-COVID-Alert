import React, { FC } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { sub, startOfDay, isAfter } from 'date-fns';

import { DailyStatsData } from 'services/api';

import { Card } from 'components/atoms/card';
import { TabButtons } from 'components/atoms/tab-buttons';
import { Spacing } from 'components/atoms/spacing';
import { TrendChart, TrendChartProps } from 'components/molecules/trend-chart';
import { text } from 'theme';
import { useApplication } from 'providers/context';

interface TrendChartCardProps extends TrendChartProps {
  data: DailyStatsData;
  title?: string;
}

function extractLatest(data: DailyStatsData): Date {
  const [lastTimestamp] = data[data.length - 1];

  return lastTimestamp;
}

export const TrendChartCard: FC<TrendChartCardProps> = ({ data, title, ...areaChartProps }) => {
  const { chartsTabIndex, setContext } = useApplication();

  const setSelectedIndex = (index: number) => {
    setContext({ chartsTabIndex: index });
  };

  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const tabLabels = [
    t('confirmedChart:ranges:default'),
    t('confirmedChart:ranges:months'),
    t('confirmedChart:ranges:all')
  ];

  const lastTimestamp = extractLatest(data);

  // Data is pre-sorted by date (TrendChart relies on this)
  const lastDate = startOfDay(new Date(lastTimestamp));

  const tabFirstDates: (Date | null)[] = [sub(lastDate, { weeks: 2 }), sub(lastDate, { months: 2 }), null];

  const firstDate = tabFirstDates[chartsTabIndex];

  const filteredData = data.filter(([dateStr]) => !firstDate || isAfter(startOfDay(new Date(dateStr)), firstDate));

  const tabChartTypes = ['bar', 'bar', 'bar'] as const;
  const chartType = tabChartTypes[chartsTabIndex];
  return (
    <Card>
      {title && (
        <>
          <Text style={styles.title}>{title}</Text>
          <Spacing s={20} />
        </>
      )}
      <TabButtons tabLabels={tabLabels} selectedIndex={chartsTabIndex} onChange={setSelectedIndex} />
      <Spacing s={24} />
      <TrendChart data={filteredData} chartType={chartType} {...areaChartProps} />
      <Spacing s={16} />
      <Spacing s={8} />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.defaultBold
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
