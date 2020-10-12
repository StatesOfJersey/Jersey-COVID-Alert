import React, { FC, useRef } from 'react';
import { Text, ScrollView, View, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useExposure } from 'react-native-exposure-notification-service';

import { Spacing, Separator } from 'components/atoms/layout';
import { Heading } from 'components/atoms/heading';
import { Link } from 'components/atoms/link';
import { Markdown } from 'components/atoms/markdown';
import { PhoneNumber } from 'components/organisms/phone-number';
import { text } from 'theme';
import { saveMetric, METRIC_TYPES } from 'services/api';
import { KeyboardScrollable } from 'components/templates/keyboard-scrollable';

const CallbackImage = require('assets/images/callback/image.png');

interface FollowUpCallProps {
  route: any;
}

export const FollowUpCall: FC<FollowUpCallProps> = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { configure } = useExposure();
  const scrollViewRef = useRef<ScrollView>(null);

  const gotoDashboard = (optin = false) => {
    if (optin) {
      saveMetric({ event: METRIC_TYPES.CALLBACK_OPTIN });
    }

    if (route && route.params && route.params.embedded) {
      return navigation.popToTop();
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'main' }]
    });
  };

  return (
    <KeyboardScrollable scrollViewRef={scrollViewRef}>
      <View style={styles.row}>
        <View style={styles.titleView}>
          <Heading accessibilityFocus text={t('followUpCall:title')} lineWidth={235} />
          <Markdown>{t('followUpCall:intro')}</Markdown>
        </View>
        <Image accessibilityIgnoresInvertColors source={CallbackImage} width={180} height={208} style={styles.image} />
      </View>
      <Spacing s={12} />
      <Text style={text.default}>{t('followUpCall:note')}</Text>
      <Separator />
      <PhoneNumber
        buttonLabel={t('followUpCall:optIn')}
        onSuccess={() => {
          configure();
          gotoDashboard(true);
        }}
      />
      <Spacing s={24} />
      <Link align="center" onPress={gotoDashboard}>
        {t('followUpCall:noThanks')}
      </Link>
      <Spacing s={50} />
    </KeyboardScrollable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 240,
    marginRight: -72
  },
  titleView: {
    flex: 1,
    paddingTop: 20,
    paddingRight: 16
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    minHeight: 120
  }
});
