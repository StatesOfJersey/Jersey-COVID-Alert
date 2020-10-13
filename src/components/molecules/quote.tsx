import React, { FC } from 'react';
import { StyleSheet, ViewStyle, View, Text } from 'react-native';

import { text as textStyles, colors } from 'theme';

interface QuoteProps {
  style?: ViewStyle;
  text: string;
}

export const Quote: FC<QuoteProps> = ({ style, text }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: colors.lightBlue
  },
  text: {
    ...textStyles.default,
    color: colors.quotedText,
    paddingLeft: 20,
    paddingVertical: 8
  }
});
