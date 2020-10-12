import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { text } from 'theme';
import { InlineLink } from 'components/atoms/inline-link';
import { Markdown } from 'components/atoms/markdown';
import { Scrollable } from 'components/templates/scrollable';
import { useSettings } from 'providers/settings';
import { useApplication } from 'providers/context';
import { markDownStyles } from './privacy-notice';

export const TermsAndConditionsLink = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { accessibility } = useApplication();
  return accessibility.screenReaderEnabled ? (
    <InlineLink
      text={`${t('tandcPolicy:sentence:prefix')} ${t('tandcPolicy:sentence:link')}${t('tandcPolicy:sentence:suffix')}`}
      onPress={() => {
        navigation.navigate('terms');
      }}
    />
  ) : (
    <Text style={styles.text}>
      {t('tandcPolicy:sentence:prefix')}{' '}
      <InlineLink
        text={t('tandcPolicy:sentence:link')}
        onPress={() => {
          navigation.navigate('terms');
        }}
      />
      {t('tandcPolicy:sentence:suffix')}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...text.default,
    flexWrap: 'wrap',
    marginBottom: 8
  }
});

export const TermsAndConditions = () => {
  const { tandcText } = useSettings();
  const { t } = useTranslation();

  return (
    <Scrollable heading={t('tandcPolicy:title')}>
      <Markdown markdownStyles={markDownStyles}>{tandcText}</Markdown>
    </Scrollable>
  );
};
