import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';

import { text as textStyles, colors } from 'theme';

interface InlineLinkProps {
  text?: string;
  onPress: () => void;
  ref?: any;
}

export const InlineLink: React.FC<InlineLinkProps> = ({ text, onPress, children }) => {
  const linkText = text || children;
  return (
    <TouchableWithoutFeedback accessibilityRole="link" importantForAccessibility="yes" onPress={onPress}>
      <Text onPress={() => onPress} style={styles.link}>
        {linkText}
      </Text>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  link: {
    flex: 1,
    ...textStyles.defaultBold,
    color: colors.main
  }
});
