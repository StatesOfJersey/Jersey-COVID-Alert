import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from 'theme';

const SWOOSH_WIDTH = 375;
const SWOOSH_HEIGHT = 433;

export const Gradient: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const windowWidth = Dimensions.get('window').width;
  const imageHeight = (windowWidth * SWOOSH_HEIGHT) / SWOOSH_WIDTH;

  return (
    <LinearGradient colors={colors.gradients.defaultOrange} style={styles.gradient}>
      <Image
        style={[styles.image, { width: windowWidth, height: imageHeight }]}
        width={windowWidth}
        height={imageHeight}
        resizeMode="contain"
        source={require('assets/images/swoosh/swoosh.png')}
        accessible
        accessibilityRole="text"
        accessibilityHint={t('common:name')}
        accessibilityIgnoresInvertColors={false}
      />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
});
