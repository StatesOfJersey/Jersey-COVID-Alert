import React, { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Heading } from 'components/atoms/heading';
import { Card } from 'components/atoms/card';
import { text } from 'theme';
import { formatNumber } from 'services/i18n/index';
import { StatsData } from 'services/api';
import { Spacing } from 'components/atoms/spacing';
import { ActiveCasesLocation } from 'components/molecules/active-cases-location';

interface ActiveCaseBreakdownProps {
  data: StatsData;
}

export const ActiveCaseBreakdown: FC<ActiveCaseBreakdownProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <View>
      <Heading text={t('stats:activeCasesBreakdown:title')} />
      <Card padding={{ v: 8, h: 16, r: 24 }}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('stats:activeCasesBreakdown:symptomatic')}</Text>
          <Text style={styles.value}>{formatNumber(data.cases.symptomatic)}</Text>
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.label}>{t('stats:activeCasesBreakdown:asymptomatic')}</Text>
          <Text style={styles.value}>{formatNumber(data.cases.asymptomatic)}</Text>
        </View>
      </Card>
      <Spacing s={16} />
      <ActiveCasesLocation data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    flex: 1
  },
  rowLast: {
    borderBottomWidth: 0,
    flex: 1
  },
  label: {
    flex: 1,
    ...text.defaultBold
  },
  value: {
    ...text.largeBlack
  }
});
