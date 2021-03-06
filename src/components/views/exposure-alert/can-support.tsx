import React, { FC } from 'react';
import { Platform, Text, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useExposure } from 'react-native-exposure-notification-service';

import { AppIcons } from 'assets/icons';
import { Button } from 'components/atoms/button';
import { Card } from 'components/atoms/card';
import { colors, text } from 'theme';
import { ResponsiveImage } from 'components/atoms/responsive-image';
import { Spacing } from 'components/atoms/layout';
import { Toast } from 'components/atoms/toast';

const NotActiveImage = require('assets/images/phone/not-active.png');

export const CanSupport: FC = () => {
  const { t } = useTranslation();
  const exposure = useExposure();

  const checkForUpgradeHandler = async () => {
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:');
      } else {
        await exposure.triggerUpdate();
        await exposure.supportsExposureApi();
      }
    } catch (err) {
      console.log('Error handling check for upgrade', err);
    }
  };

  return (
    <Card padding={{ v: 12 }}>
      <ResponsiveImage h={150} source={NotActiveImage} />
      <Spacing s={8} />
      <Toast
        color={colors.red}
        backgroundColor={colors.background.red}
        message={t('exposureAlert:canSupport:title')}
        icon={<AppIcons.Alert width={24} height={24} />}
      />
      <Spacing s={16} />
      <Text style={text.default}>{t(`exposureAlert:canSupport:message:${Platform.OS}`)}</Text>
      <Spacing s={12} />
      <Button onPress={checkForUpgradeHandler}>{t('exposureAlert:canSupport:button')}</Button>
    </Card>
  );
};
