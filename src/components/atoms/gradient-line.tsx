import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from 'theme';

interface GradientLineProps {
  width?: number;
}

export const GradientLine: React.FC<GradientLineProps> = ({ width }) => {
  return (
    <LinearGradient
      colors={colors.gradients.defaultOrange}
      style={[styles.gradient, !!width && { width }]}
      start={[1, 0]}
      end={[0, 0]}
    />
  );
};

const styles = StyleSheet.create({
  gradient: {
    height: 6,
    width: '100%'
  }
});
