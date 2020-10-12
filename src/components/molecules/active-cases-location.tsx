import React, { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

import { text, colors } from 'theme';
import { Card } from 'components/atoms/card';
import { HorizontalBarChartContent } from 'components/atoms/horizontal-bar-chart-content';
import { StatsData } from 'services/api';

interface ActiveCasesLocationProps {
  data: StatsData;
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

export const ActiveCasesLocation: FC<ActiveCasesLocationProps> = ({ data }) => {
  const { t } = useTranslation();

  const chartData = [
    {
      value: data.cases.hospital,
      label: t('stats:activeCasesBreakdown.hospital')
    },
    {
      value: data.cases.care,
      label: t('stats:activeCasesBreakdown.care')
    },
    {
      value: data.cases.community,
      label: t('stats:activeCasesBreakdown.community')
    }
  ];

  const contentInset = { top: 6, bottom: 6 };

  const level = Math.max(data.cases.hospital, data.cases.care, data.cases.community);
  const layout = level < 100 ? { width: '15%', x: 35 } : { width: '25%', x: 65 };

  return (
    <Card>
      <Text style={styles.title}>{t('stats:activeCasesBreakdown:casesLocation')}</Text>
      <View style={styles.container}>
        <YAxis
          style={{ width: layout.width }}
          data={chartData}
          // concatenating the value and index here ensure we'll never have duplicate Y values
          yAccessor={({ item, index }) => `${item.value}-${index}`}
          scale={scale.scaleBand}
          min={0}
          contentInset={contentInset}
          svg={{
            ...text.xxlargeBlack,
            fill: colors.text,
            textAnchor: 'end',
            x: layout.x
          }}
          // we split the Y accessor from above back out here to use the value as a label
          formatLabel={value => formatLabel(value.split('-')[0])}
        />
        <View style={styles.chartingCol}>
          <HorizontalBarChartContent
            style={styles.chart}
            chartData={chartData}
            contentInset={contentInset}
            primaryColor={colors.darkBlue}
            gapPercent={60}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 16
  },
  yAxisCol: {
    width: '25%'
  },
  chartingCol: {
    flexGrow: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.lightGray
  },
  title: {
    ...text.defaultBold
  },
  chart: {
    flex: 1,
    height: 144
  }
});
