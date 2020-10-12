import React, { FC } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';

import { Button } from 'components/atoms/button';
import { colors, text } from 'theme';
import { Spacing } from 'components/atoms/spacing';
import { Gradient } from 'components/templates/gradient';

const AppLogoImage = require('assets/images/app-logo/app-logo.png');

export const Over16: FC<any> = ({ navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeArea();

  return (
    <Gradient>
      <View style={[styles.container]}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.top}>
            <View style={styles.empty2} />
            <Image
              style={styles.appLogo}
              width={203}
              height={134}
              resizeMode="contain"
              source={AppLogoImage}
              accessible
              accessibilityRole="text"
              accessibilityHint={t('common:name')}
              accessibilityIgnoresInvertColors={false}
            />
            <View style={styles.empty1} />
          </View>

          <View style={[styles.bottom, { paddingBottom: insets.bottom }]}>
            <Spacing s={37} />
            <Text style={styles.notice}>{t('ageRequirement:notice')}</Text>
            <Spacing s={24} />
            <Button onPress={() => navigation.replace('getStarted')}>{t('ageRequirement:over')}</Button>
            <Spacing s={11} />
            <Button type="empty" onPress={() => navigation.replace('under16')}>
              {t('ageRequirement:under')}
            </Button>
            <Spacing s={17} />
          </View>
        </ScrollView>
      </View>
    </Gradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  scroll: {
    flex: 1
  },
  appLogo: {
    width: 203,
    height: 134
  },
  empty1: {
    flex: 1
  },
  empty2: {
    flex: 2
  },
  top: {
    flex: 1,
    alignItems: 'center'
  },
  bottom: {
    backgroundColor: colors.white,
    paddingHorizontal: 20
  },
  notice: {
    textAlign: 'center',
    ...text.largeBold
  },
  logoPlaceholder: {
    width: 184,
    height: 77,
    backgroundColor: colors.white,
    opacity: 0.7
  },
  emblemPlaceholder: {
    width: 39,
    height: 58,
    backgroundColor: colors.white,
    opacity: 0.7
  }
});
