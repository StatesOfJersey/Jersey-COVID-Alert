import React, { FC } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTranslation } from 'react-i18next';
import { useSafeArea } from 'react-native-safe-area-context';

import { Gradient } from 'components/templates/gradient';

const AppLogoImage = require('assets/images/app-logo/app-logo.png');

export const Loading: FC = () => {
  const { t } = useTranslation();
  const insets = useSafeArea();
  return (
    <Gradient>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.emptyTop} />
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
        <View style={styles.emptyBottom} />
      </View>
      <Spinner animation="fade" visible />
    </Gradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  appLogo: {
    width: 203,
    height: 134
  },
  emptyBottom: {
    height: '35%',
    width: '100%'
  },
  emptyTop: {
    height: '30%',
    width: '100%'
  }
});
