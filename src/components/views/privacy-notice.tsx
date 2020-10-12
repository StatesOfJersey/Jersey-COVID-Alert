import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import Icons from 'assets/icons';
import { colors, text } from 'theme';
import { Link } from 'components/atoms/link';
import { Markdown } from 'components/atoms/markdown';
import { Scrollable } from 'components/templates/scrollable';
import { useSettings } from 'providers/settings';

const styles = StyleSheet.create({
  privacy: {
    width: 32,
    height: 32,
    marginRight: 8
  }
});

export const PrivacyLink = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <Link
      Icon={<Icons.Privacy style={styles.privacy} width={34} height={34} color={colors.main} />}
      text={t('privacyNotice:link')}
      onPress={() => {
        navigation.navigate('settings.privacy', { screen: 'settings.privacy' });
      }}
    />
  );
};

export const PrivacyNotice = () => {
  const { privacyText } = useSettings();
  const { t } = useTranslation();

  return (
    <Scrollable heading={t('privacyNotice:title')}>
      <Markdown markdownStyles={markDownStyles}>{privacyText}</Markdown>
    </Scrollable>
  );
};

export const markDownStyles = StyleSheet.create({
  h1: {
    ...text.xlargeBold,
    marginBottom: 16,
    marginTop: 0
  },
  h2: {
    ...text.largeBold,
    marginBottom: 20
  },
  h3: {
    ...text.largeBold,
    marginBottom: 20
  },
  h4: {
    ...text.largeBold,
    marginBottom: 20
  },
  h5: {
    ...text.largeBold,
    marginBottom: 20
  },
  h6: {
    ...text.largeBold,
    marginBottom: 20
  },
  text: {
    ...text.default,
    flexWrap: 'wrap',
    marginBottom: 16
  },
  listItemNumber: {
    ...text.largeBold,
    color: colors.darkBlue,
    paddingRight: 16,
    paddingTop: 3
  },
  listItemContent: {
    paddingTop: 2,
    paddingRight: 32
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  listItemBullet: {
    width: 4,
    height: 4,
    backgroundColor: 'black',
    borderRadius: 2,
    marginRight: 10,
    marginTop: 12
  },
  block: {
    marginBottom: 20
  },
  list: {
    marginBottom: 20
  }
});
