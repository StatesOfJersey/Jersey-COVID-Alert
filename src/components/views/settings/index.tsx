import React, { useState, useEffect, FC } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HIDE_DEBUG } from '@env';
import { getVersion, Version } from 'react-native-exposure-notification-service';

import { AppIcons } from 'assets/icons';
import { Scrollable } from 'components/templates/scrollable';
import { Card } from 'components/atoms/card';
import { useSettings } from 'providers/settings';

import { colors, text } from 'theme';

const REQUIRED_PRESS_COUNT = 3;

interface SettingLineItem {
  id: string;
  title: string;
  screen: string;
  label: string;
  hint: string;
}

export * from './check-in';
export * from './leave';
export * from './debug';

export const Settings: FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [version, setVersion] = useState<Version>();
  const [pressCount, setPressCount] = useState<number>(0);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const {
    features: { symptomChecker }
  } = useSettings();

  const versionPressHandler = async () => {
    setPressCount(pressCount + 1);
    if (!showDebug && pressCount + 1 >= REQUIRED_PRESS_COUNT) {
      await AsyncStorage.setItem('cti.showDebug', 'y');
      setShowDebug(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const showDebugData = await AsyncStorage.getItem('cti.showDebug');
        if (showDebugData) {
          setShowDebug(showDebugData === 'y');
        }
      } catch (err) {
        console.log('Error reading "cti.showDebug" from async storage:', err);
      }
    };
    const getVer = async () => {
      const ver = await getVersion();
      setVersion(ver);
    };
    getVer();
    init();
  }, []);

  const settings: SettingLineItem[] = [
    {
      id: 'exposureAlert',
      title: t('settings:exposureAlert'),
      label: t('settings:exposureAlert'),
      hint: t('settings:exposureAlertHint'),
      screen: 'settings.exposureAlert'
    },
    {
      id: 'callback',
      title: t('settings:followUpCall'),
      label: t('settings:followUpCall'),
      hint: t('settings:followUpCallHint'),
      screen: 'settings.followUpCall'
    },
    {
      id: 'terms',
      title: t('settings:termsAndConditions'),
      label: t('settings:termsAndConditions'),
      hint: t('settings:termsAndConditionsHint'),
      screen: 'settings.terms'
    },
    {
      id: 'privacy',
      title: t('settings:privacyNotice'),
      label: t('settings:privacyNotice'),
      hint: t('settings:privacyNoticeHint'),
      screen: 'settings.privacy'
    },
    {
      id: 'metrics',
      title: t('settings:metrics'),
      label: t('settings:metrics'),
      hint: t('settings:metricsHint'),
      screen: 'settings.metrics'
    },
    {
      id: 'howTheAppWorks',
      title: t('settings:howTheAppWorks'),
      label: t('settings:howTheAppWorks'),
      hint: t('settings:howTheAppWorksHint'),
      screen: 'howTheAppWorks'
    },
    {
      id: 'languages',
      title: t('settings:language'),
      label: t('settings:language'),
      hint: t('settings:languageHint'),
      screen: 'settings.language'
    },
    {
      id: 'leave',
      title: t('settings:leave'),
      label: t('settings:leave'),
      hint: t('settings:leaveHint'),
      screen: 'settings.leave'
    }
  ];

  if (symptomChecker) {
    settings.splice(1, 0, {
      id: 'checkIn',
      title: t('settings:checkIn'),
      label: t('settings:checkIn'),
      hint: t('settings:checkinHint'),
      screen: 'settings.checkIn'
    });
  }

  if (HIDE_DEBUG !== 'y' && showDebug) {
    settings.push({
      id: 'debug',
      label: '',
      hint: '',
      title: 'Debug',
      screen: 'settings.debug'
    });
  }

  return (
    <Scrollable heading={t('settings:title')} scrollViewFlex backgroundColor={colors.background.cards}>
      <Card style={styles.container} padding={{ h: 0, v: 0 }}>
        {settings.map(({ id, label, hint, screen, title }, index) => (
          <TouchableWithoutFeedback
            key={id}
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityHint={hint}
            onPress={() => navigation.navigate(screen)}
          >
            <View style={index === settings.length - 1 ? [styles.item, styles.itemLast] : styles.item}>
              <Text style={styles.text}>{title}</Text>
              <AppIcons.ArrowRight width={18} height={18} color={colors.main} />
            </View>
          </TouchableWithoutFeedback>
        ))}
      </Card>
      <View style={styles.flex} />
      {version && (
        <Text style={text.default} onPress={versionPressHandler}>
          App version {Platform.OS === 'ios' ? 'iOS' : 'Android'} {version.display}
        </Text>
      )}
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 0,
    flexGrow: 0
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.separatorGray
  },
  itemLast: {
    borderBottomWidth: 0
  },
  text: {
    flex: 1,
    ...text.defaultBold
  }
});
