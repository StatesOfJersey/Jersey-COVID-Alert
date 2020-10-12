import React, { FC } from 'react';
import { TouchableWithoutFeedback, Text, View, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

import { SPACING_HORIZONTAL } from 'constants/shared';
import { Spacing } from 'components/atoms/layout';
import { Button } from 'components/atoms/button';
import { Scrollable } from 'components/templates/scrollable';
import { ResponsiveImage } from 'components/atoms/responsive-image';
import { Heading } from 'components/atoms/heading';
import Icons, { AppIcons } from 'assets/icons';
import { useSafeArea } from 'react-native-safe-area-context';
import { Card } from '../atoms/card';
import { colors, text } from 'theme';

const BluetoothImage = require('assets/images/howTheAppWorks/bluetooth.png');
const CodesImage = require('assets/images/howTheAppWorks/codes.png');
const TracingImage = require('assets/images/howTheAppWorks/tracing.png');
const ExposureImage = require('assets/images/howTheAppWorks/exposure.png');
const HelplineImage = require('assets/images/howTheAppWorks/helpline.png');

export const HowTheAppWorks: FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeArea();

  return (
    <View style={[styles.container, { marginTop: insets.top + (Platform.OS === 'android' ? 8 : 0) }]}>
      <View style={styles.heading}>
        <Heading
          accessibilityFocus
          text={t('howTheAppWorks:title')}
          button={
            <TouchableWithoutFeedback
              accessibilityRole="button"
              accessibilityHint={`Close ${t('howTheAppWorks:title')}`}
              accessibilityLabel={`Close ${t('howTheAppWorks:title')}`}
              onPress={async () => navigation.goBack()}
            >
              <View style={styles.close}>
                <AppIcons.Close width={16} height={16} />
              </View>
            </TouchableWithoutFeedback>
          }
        />
      </View>
      <Scrollable>
        <Spacing s={16} />
        <ResponsiveImage h={168} source={BluetoothImage} />
        <Spacing s={16} />
        <Text style={text.default}>{t('howTheAppWorks:text:bluetooth')}</Text>
        <Spacing s={24} />
        <ResponsiveImage h={168} source={CodesImage} />
        <Spacing s={16} />
        <Text style={text.default}>{t('howTheAppWorks:text:codes')}</Text>
        <Spacing s={24} />
        <ResponsiveImage h={168} source={TracingImage} />
        <Spacing s={16} />
        <Text style={text.default}>{t('howTheAppWorks:text:tracing')}</Text>
        <Spacing s={24} />
        <ResponsiveImage h={168} source={ExposureImage} />
        <Spacing s={16} />
        <Text style={text.default}>{t('howTheAppWorks:text:exposure')}</Text>
        <Spacing s={24} />
        <ResponsiveImage h={168} source={HelplineImage} />
        <Spacing s={16} />
        <Text style={text.default}>{t('howTheAppWorks:text:helpline')}</Text>
        <Spacing s={24} />

        <Spacing s={16} />
        <Card
          hideArrow
          onPress={() =>
            WebBrowser.openBrowserAsync(t('howTheAppWorks:support:link'), {
              enableBarCollapsing: true,
              showInRecents: true
            })
          }
          icon={<Icons.Logo style={styles.linkIcon} width={56} height={56} />}
        >
          <View style={styles.isolateLinkContainer}>
            <Text style={styles.isolateLink}>{t('howTheAppWorks:support:text')}</Text>
          </View>
        </Card>
        <Spacing s={20} />
        <Button type="empty" onPress={async () => navigation.goBack()}>
          {t('howTheAppWorks:close')}
        </Button>
      </Scrollable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  heading: {
    paddingHorizontal: SPACING_HORIZONTAL
  },
  close: {
    position: 'relative',
    width: 16,
    paddingHorizontal: 32,
    paddingVertical: 8,
    top: 0,
    right: -16,
    zIndex: 99
  },
  linkIcon: {
    marginRight: 0
  },
  isolateLink: {
    flex: 1,
    ...text.defaultBold,
    color: colors.main
  },
  isolateLinkContainer: {
    alignItems: 'flex-start'
  },
  inlineLink: {
    ...text.defaultBold,
    color: colors.main
  }
});
