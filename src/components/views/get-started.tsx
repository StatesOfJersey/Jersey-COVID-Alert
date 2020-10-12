import React, { FC } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { Spacing } from 'components/atoms/layout';
import { Markdown } from 'components/atoms/markdown';
import { Button } from 'components/atoms/button';
import { Scrollable } from 'components/templates/scrollable';
import { TermsAndConditionsLink } from 'components/views/terms-and-conditions';
import { ResponsiveImage } from 'components/atoms/responsive-image';
import { useNavigation } from '@react-navigation/native';

const OnboardingTeamImage = require('assets/images/onboardingTeam/onboardingTeam.png');
interface GetStartedProps {
  navigation: StackNavigationProp<any>;
}

export const GetStarted: FC<GetStartedProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onContinue = async () => {
    navigation.replace('yourData');
  };

  return (
    <>
      <Scrollable heading={t('onboarding:intro:title')}>
        <ResponsiveImage h={168} source={OnboardingTeamImage} />
        <Spacing s={28} />
        <Markdown markdownStyles={{ block: { marginBottom: 16 } }}>{t('onboarding:intro:info')}</Markdown>
        <Button
          type="empty"
          onPress={() => {
            navigation.navigate('howTheAppWorks');
          }}
        >
          {t('onboarding:intro:howItWorks')}
        </Button>
        <Spacing s={16} />
        <TermsAndConditionsLink />
        <Spacing s={8} />
        <Button onPress={onContinue}>{t('onboarding:intro:action')}</Button>
      </Scrollable>
    </>
  );
};
