import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, findNodeHandle, AccessibilityInfo, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { Spacing } from 'components/atoms/spacing';
import { text as textStyles } from 'theme';
import { GradientLine } from 'components/atoms/gradient-line';

interface HeadingProps {
  text: string;
  lineWidth?: number;
  accessibilityFocus?: boolean;
  accessibilityRefocus?: boolean;
  button?: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  text,
  lineWidth,
  accessibilityFocus = false,
  accessibilityRefocus = false,
  button
}) => {
  const ref = useRef<any>();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (ref.current && accessibilityFocus) {
      const tag = findNodeHandle(ref.current);
      if (tag) {
        setTimeout(() => ref.current && AccessibilityInfo.setAccessibilityFocus(tag), 200);
      }
    }
  }, []);

  useFocusEffect(() => {
    if (isFocused && accessibilityRefocus && ref.current) {
      const tag = findNodeHandle(ref.current);
      if (tag) {
        setTimeout(() => ref.current && AccessibilityInfo.setAccessibilityFocus(tag), 200);
      }
    }
  });

  return (
    <>
      <View style={styles.container}>
        <Text importantForAccessibility="yes" ref={ref} style={styles.heading}>
          {text}
        </Text>
        {button}
      </View>

      <GradientLine width={lineWidth} />
      <Spacing s={16} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8
  },
  heading: {
    ...textStyles.xlargeBold
  }
});
