import React, { FC } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from 'components/atoms/card';
import { colors, text } from 'theme';
import { ResponsiveImage } from 'components/atoms/responsive-image';
import { Spacing } from 'components/atoms/layout';
import { useReminder } from 'providers/reminder';
import { Button } from 'components/atoms/button';
import { format } from 'date-fns';

const PausedState = require('assets/images/paused-state/image.png');
const PausedIcon = require('assets/images/icon-pause/image.png');

export const Paused: FC = () => {
  const { t } = useTranslation();
  const { paused, deleteReminder } = useReminder();

  return (
    <Card padding={{ v: 12 }}>
      <ResponsiveImage h={150} source={PausedState} />
      <Spacing s={4} />
      <View style={styles.row}>
        <View style={styles.traceIcon}>
          <Image
            accessibilityIgnoresInvertColors={false}
            style={styles.image}
            resizeMode="contain"
            source={PausedIcon}
          />
        </View>
        <View style={styles.messageWrapper}>
          <Text style={text.defaultBold}>
            {paused && t('exposureAlert:pause:paused', { time: format(new Date(Number(paused!)), 'HH:mm') })}
          </Text>
        </View>
      </View>
      <Spacing s={12} />
      <Button onPress={() => deleteReminder()}>{t('exposureAlert:pause:reactivate:label')}</Button>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  traceIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.midOrange,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageWrapper: {
    flex: 1,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 12
  },
  image: {
    width: 24,
    height: 24
  }
});
