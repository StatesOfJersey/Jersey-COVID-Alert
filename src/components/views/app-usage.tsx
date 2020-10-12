import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { useExposure } from 'react-native-exposure-notification-service';
import { useApplication } from 'providers/context';

import { PrivacyLink } from 'components/views/privacy-notice';
import { Button } from 'components/atoms/button';
import { Link } from 'components/atoms/link';
import { Markdown } from 'components/atoms/markdown';
import { Quote } from 'components/molecules/quote';
import { Spacing } from 'components/atoms/spacing';
import { Scrollable } from 'components/templates/scrollable';

interface AppUsageProps {
  navigation: any;
}

export const AppUsage: FC<AppUsageProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { configure } = useExposure();
  const { setContext } = useApplication();

  const handleNext = async (consent: boolean) => {
    try {
      SecureStore.setItemAsync('analyticsConsent', String(consent), {});
      setContext({ analyticsConsent: consent });
      configure();
    } catch (e) {
      console.log('Error storing "analyticsConsent" securely', e);
    }

    navigation.navigate('exposureAlertInformation');
  };

  return (
    <Scrollable heading={t('appUsage:title')}>
      <Markdown markdownStyles={{ block: { marginBottom: 16 } }}>{t('appUsage:info')}</Markdown>
      <Spacing s={8} />
      <PrivacyLink />
      <Spacing s={24} />
      <Quote text={t('appUsage:settingsInfo')} />
      <Spacing s={24} />
      <Button onPress={() => handleNext(true)}>{t('appUsage:yesButton')}</Button>
      <Spacing s={24} />
      <Link align="center" onPress={() => handleNext(false)}>
        {t('appUsage:noThanks')}
      </Link>
    </Scrollable>
  );
};
