import React, { FC } from 'react';
import { Platform, Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { useTranslation } from 'react-i18next';
import { AuthorisedStatus, StatusState, StatusType, useExposure } from 'react-native-exposure-notification-service';

import { AppIcons } from 'assets/icons';
import { Button } from 'components/atoms/button';
import { Card } from 'components/atoms/card';
import { colors, text } from 'theme';
import { Markdown } from 'components/atoms/markdown';
import { ResponsiveImage } from 'components/atoms/responsive-image';
import { Spacing } from 'components/atoms/layout';
import { Toast } from 'components/atoms/toast';

const NotActiveImage = require('assets/images/phone/not-active.png');

interface NotActiveProps {
  exposureOff?: boolean;
  bluetoothOff?: boolean;
}

export const NotActive: FC<NotActiveProps> = ({ exposureOff = false, bluetoothOff = false }) => {
  const { t } = useTranslation();
  const { status, askPermissions, supportsExposureApi, isAuthorised } = useExposure();

  const bluetoothDisabled = status.state === StatusState.disabled && status.type?.includes(StatusType.bluetooth);
  const ensUnknown = status.state === StatusState.unknown;
  const notAuthorised = isAuthorised === AuthorisedStatus.unknown;

  const gotoSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        if (bluetoothDisabled) {
          Linking.openURL('App-Prefs:');
        } else {
          Linking.openSettings();
        }
      } else {
        bluetoothDisabled
          ? await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_SETTINGS)
          : await askPermissions!();
        await supportsExposureApi();
      }
    } catch (e) {
      console.log("Error opening app's settings", e);
    }
  };

  const messageKey = exposureOff
    ? bluetoothOff
      ? 'message11'
      : 'message10'
    : bluetoothOff
    ? 'message01'
    : 'message10';

  return (
    <Card padding={{ v: 12 }}>
      <ResponsiveImage h={150} source={NotActiveImage} />
      <Spacing s={8} />
      <Toast
        color={colors.red}
        backgroundColor={colors.background.red}
        message={t('exposureAlert:notActive:title')}
        icon={<AppIcons.Alert width={24} height={24} />}
      />
      <Spacing s={16} />
      <Markdown style={text.default}>
        {Platform.OS === 'ios'
          ? t(`exposureAlert:notActive:${messageKey}`)
          : t('exposureAlert:notActive:android:message')}
      </Markdown>
      <Spacing s={12} />
      <Button onPress={async () => (ensUnknown || notAuthorised ? await askPermissions() : gotoSettings())}>
        {Platform.OS === 'ios' ? t('exposureAlert:notActive:button') : t('exposureAlert:notActive:android:button')}
      </Button>
    </Card>
  );
};
