import React, { FC, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from 'components/atoms/card';
import { colors, text } from 'theme';
import { ResponsiveImage } from 'components/atoms/responsive-image';
import { Spacing } from 'components/atoms/layout';
import { useApplication } from 'providers/context';

const WomanPhoneImage = require('assets/images/information/womanPhone.png');
const ContactTracingSpinImage = require('assets/images/contact-tracing/contact-tracing-spin.png');

export const Active: FC = () => {
  const { t } = useTranslation();
  const { accessibility } = useApplication();
  const spinValue = useRef(new Animated.Value(0));
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const spin = spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  useEffect(() => {
    if (!accessibility.reduceMotionEnabled) {
      animation.current = Animated.loop(
        Animated.timing(spinValue.current, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      );
      animation.current.start();
    }
  }, []);

  useEffect(() => {
    if (!accessibility.reduceMotionEnabled && animation.current) {
      animation.current.stop();
      animation.current.start();
    } else if (!accessibility.reduceMotionEnabled && !animation.current) {
      animation.current = Animated.loop(
        Animated.timing(spinValue.current, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      );
      animation.current.start();
    } else {
      animation.current?.stop();
      animation.current = null;
    }
  }, [accessibility.reduceMotionEnabled]);

  return (
    <Card padding={{ v: 12 }}>
      <ResponsiveImage h={150} source={WomanPhoneImage} />
      <Spacing s={4} />
      <View style={styles.row}>
        <View style={styles.traceIcon}>
          <Animated.Image
            style={[styles.image, { transform: [{ rotate: spin }] }]}
            resizeMode="contain"
            source={ContactTracingSpinImage}
          />
        </View>
        <View style={styles.messageWrapper}>
          <Text style={text.defaultBold}>{t('exposureAlert:active:title')}</Text>
        </View>
      </View>
      <Spacing s={16} />
      <View style={[styles.row, styles.center]}>
        <Text style={text.defaultBold}>{t('exposureAlert:active:subtitle')}</Text>
      </View>
      <Spacing s={8} />
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  traceIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageWrapper: {
    flex: 1,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 12
  },
  image: {
    width: 24,
    height: 24
  },
  center: {
    justifyContent: 'center',
    alignContent: 'center'
  }
});
