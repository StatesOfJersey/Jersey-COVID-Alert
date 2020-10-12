import React, { useRef } from 'react';
import { Platform, ScrollView, Text, Linking, Alert } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useExposure, StatusState } from 'react-native-exposure-notification-service';

import { Button } from 'components/atoms/button';
import { text } from 'theme';
import { KeyboardScrollable } from 'components/templates/keyboard-scrollable';
import { Markdown } from 'components/atoms/markdown';
import { Spacing, Separator } from 'components/atoms/layout';
import { useAppState } from 'hooks/app-state';

export const ExposureAlertSettings = () => {
  const { t } = useTranslation();
  const [appState] = useAppState();
  const isFocused = useIsFocused();
  const {
    supported,
    status,
    enabled,
    supportsExposureApi,
    contacts,
    deleteExposureData,
    authoriseExposure,
    readPermissions
  } = useExposure();

  const scrollViewRef = useRef<ScrollView>(null);

  const serviceStatus = status.state === StatusState.active && enabled ? 'active' : 'notActive';

  useFocusEffect(
    React.useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }

      readPermissions();
    }, [isFocused, appState, readPermissions])
  );

  const gotoSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:');
      } else {
        console.log('tracing supported:', supported);
        if (supported) {
          if (enabled) {
            await IntentLauncher.startActivityAsync('com.google.android.gms.settings.EXPOSURE_NOTIFICATION_SETTINGS');
          } else {
            await authoriseExposure();
          }
        } else {
          await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS, {
            data: 'package:com.governmentofjersey.jerseycovidalert'
          });
        }
        await supportsExposureApi();
      }
    } catch (e) {
      console.log("Error opening app's settings", e);
    }
  };

  const clearDataHandler = async () => {
    Alert.alert(t('exposureAlert:settings:clearData:confirmTitle'), t('exposureAlert:settings:clearData:confirmText'), [
      {
        text: t('exposureAlert:settings:clearData:cancel'),
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: t('exposureAlert:settings:clearData:confirm'),
        onPress: async () => {
          try {
            await deleteExposureData();
          } catch (e) {
            console.log('Error deleting exposure data', e);
            Alert.alert('Error', t('exposureAlert:settings:clearData:error'));
          }
        },
        style: 'destructive'
      }
    ]);
  };

  return (
    <KeyboardScrollable heading={t('exposureAlert:title')} scrollViewRef={scrollViewRef}>
      <Text style={text.largeBold}>{t('exposureAlert:settings:status:title')}</Text>
      <Spacing s={12} />
      <Text style={text.largeBold}>{t(`exposureAlert:settings:status:${serviceStatus}`)}</Text>
      <Spacing s={12} />
      {!enabled && (
        <>
          <Text style={text.default}>{t('exposureAlert:settings:status:intro')}</Text>
          <Spacing s={12} />
        </>
      )}
      <Text style={text.default}>
        {Platform.OS === 'ios' || enabled
          ? t('exposureAlert:settings:status:ios:intro')
          : t('exposureAlert:settings:status:android:intro')}
      </Text>
      <Spacing s={12} />
      <Button type="empty" onPress={gotoSettings}>
        {Platform.OS === 'ios' || enabled
          ? t('exposureAlert:settings:status:ios:gotoSettings')
          : t('exposureAlert:settings:status:android:gotoSettings')}
      </Button>

      {contacts && contacts.length > 0 && (
        <>
          <Separator />
          <Text style={text.largeBold}>{t('exposureAlert:settings:clearData:title')}</Text>
          <Spacing s={12} />
          <Markdown>{t('exposureAlert:settings:clearData:intro')}</Markdown>
          <Spacing s={12} />
          <Button type="danger" onPress={clearDataHandler}>
            {t('exposureAlert:settings:clearData:button')}
          </Button>
        </>
      )}
    </KeyboardScrollable>
  );
};
