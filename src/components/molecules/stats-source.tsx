import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { colors, text } from 'theme';
import { Markdown } from '../atoms/markdown';

interface StatsSourceProps {
  style?: ViewStyle;
  lastUpdated: {
    stats: Date;
    profile: Date;
  };
}

export const StatsSource: FC<StatsSourceProps> = ({ style, lastUpdated }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.container, style]}>
      <Text style={text.xsmallBold}>{t('statsSource:monitor')}</Text>
      <Text style={text.xsmallBold}>
        {t('statsSource:lastUpdatedStats')}&nbsp;
        {format(lastUpdated.stats, 'ha dd/MM/yyyy')}
      </Text>
      <Text style={text.xsmallBold}>
        {t('statsSource:lastUpdatedProfile')}&nbsp;
        {format(lastUpdated.profile, 'ha dd/MM/yyyy')}
      </Text>
      <Markdown
        style={styles.markdownContainer}
        markdownStyles={{
          text: {
            ...text.xsmallBold,
            flexWrap: 'wrap'
          },
          link: {
            ...text.xsmallBold,
            color: colors.darkBlue,
            flexWrap: 'wrap'
          }
        }}
      >
        {t('statsSource:summaryLink')}
      </Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  markdownContainer: {
    backgroundColor: 'transparent'
  }
});
