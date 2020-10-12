import React, { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Heading } from 'components/atoms/heading';
import { Card } from 'components/atoms/card';
import { text } from 'theme';
import { BubbleIcons } from 'assets/icons';
import { formatNumber } from 'services/i18n';

interface AppStatsProps {
  installs: number;
}

export const AppStats: FC<AppStatsProps> = ({ installs }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Heading text={t('stats:title')} />
      <Card>
        <View style={styles.row} accessible accessibilityRole="text">
          <View style={styles.icon}>
            <BubbleIcons.Shield width={56} height={56} />
          </View>
          <View style={styles.col}>
            <Text style={text.xxlargeBlack}>{formatNumber(installs)}</Text>
            <Text style={styles.text}>{t('appStats:usersSinceLaunch')}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  col: {
    flex: 1,
    flexDirection: 'column'
  },
  text: {
    flex: 1,
    ...text.defaultBoldOpacity70
  },
  rowPercentage: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  icon: {
    marginRight: 20
  },
  progress: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20
  }
});
