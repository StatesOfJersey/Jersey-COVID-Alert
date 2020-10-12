import React, { FC } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { text, shadows, colors } from 'theme';

interface TabButtonsProps {
  tabLabels: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const TabButtons: FC<TabButtonsProps> = ({ tabLabels, selectedIndex, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {tabLabels.map((labelText, index) => (
          <View
            style={[styles.tab, selectedIndex === index ? styles.selected : styles.unselected]}
            key={`tab-button-${index}`}
          >
            <TouchableOpacity
              accessibilityRole="button"
              importantForAccessibility="yes"
              activeOpacity={0.6}
              onPress={() => onChange(index)}
            >
              <Text numberOfLines={1} style={styles.label}>
                {labelText}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    borderRadius: 8,
    borderColor: `${colors.dot}88`,
    borderStyle: 'solid',
    borderWidth: 1
  },
  wrapper: {
    marginHorizontal: -4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    alignSelf: 'stretch'
  },
  tab: {
    flexGrow: 1,
    borderRadius: 8,
    marginTop: -4,
    marginBottom: -2,
    borderWidth: 1,
    borderStyle: 'solid'
  },
  selected: {
    ...shadows.select,
    borderColor: `${colors.dot}88`,
    backgroundColor: colors.white,
    borderRadius: 8
  },
  unselected: {
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  label: {
    ...text.defaultBold,
    alignSelf: 'center',
    paddingVertical: 10
  }
});
