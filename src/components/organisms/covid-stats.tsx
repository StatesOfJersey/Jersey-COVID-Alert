import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { StatsData } from 'services/api';
import { Spacing } from 'components/atoms/spacing';
import { Card } from 'components/atoms/card';
import { CountyBreakdownCard } from 'components/molecules/county-breakdown-card';
import { text } from 'theme';
import { BubbleIcons } from 'assets/icons';
import { useSettings } from 'providers/settings';
import { formatNumber } from 'services/i18n';

interface CovidStatsProps {
  style?: ViewStyle;
  data: StatsData;
  onCountyBreakdown: () => void;
}

export const CovidStats: FC<CovidStatsProps> = ({ style, data, onCountyBreakdown }) => {
  const { t } = useTranslation();
  const {
    features: { countyBreakdown }
  } = useSettings();

  return (
    <View style={[styles.container, style]}>
      {countyBreakdown && (
        <>
          <CountyBreakdownCard onPress={onCountyBreakdown} />
          <Spacing s={16} />
        </>
      )}
      <Card>
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.confirmedBackground]}>
            <BubbleIcons.Total width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={[text.xxlargeBlack, styles.columnText]}>{formatNumber(data.cases.tests)}</Text>
            <Text style={[text.defaultBoldOpacity70, styles.columnText]}>{t('stats:totalCases')}</Text>
          </View>
        </View>
        <Spacing s={16} />
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.confirmedBackground]}>
            <BubbleIcons.Pending width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={[text.xxlargeBlack, styles.columnText]}>{formatNumber(data.cases.pending)}</Text>
            <Text style={[text.defaultBoldOpacity70, styles.columnText]}>{t('stats:pendingCases')}</Text>
          </View>
        </View>
        <Spacing s={16} />
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.confirmedBackground]}>
            <BubbleIcons.Negative width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={[text.xxlargeBlack, styles.columnText]}>{formatNumber(data.cases.negative)}</Text>
            <Text style={[text.defaultBoldOpacity70, styles.columnText]}>{t('stats:negativeCases')}</Text>
          </View>
        </View>
        <Spacing s={16} />
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.hospitalisedBackground]}>
            <BubbleIcons.Cases width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={[text.xxlargeBlack]}>{formatNumber(data.cases.positive)}</Text>
            <Text style={[text.defaultBoldOpacity70]}>{t('stats:positiveCases')}</Text>
          </View>
        </View>
        <Spacing s={16} />
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.icuBackground]}>
            <BubbleIcons.Recovered width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={[text.xxlargeBlack]}>{formatNumber(data.cases.recovered)}</Text>
            <Text style={[text.defaultBoldOpacity70]}>{t('stats:recoveredCases')}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const iconStyle = StyleSheet.create({
  icon: {
    borderRadius: 28,
    marginRight: 20
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  icuBackground: {
    backgroundColor: '#ebf8ff'
  },
  hospitalisedBackground: {
    backgroundColor: '#f4eafc'
  },
  deathsBackground: {
    backgroundColor: '#a1a1a1'
  },
  confirmedBackground: {
    backgroundColor: '#fed7e2'
  },
  iconSize: {
    width: 36,
    height: 36
  },
  column: {
    flexDirection: 'column',
    width: '100%',
    flex: 1
  },
  columnText: {
    width: '100%'
  }
});
