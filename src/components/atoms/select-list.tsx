import React, { FC } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';

import { colors, text } from 'theme';
import Icons from 'assets/icons';

interface ListItem {
  value: any;
  label: string;
}

interface SelectListProps {
  items: ListItem[];
  selectedValue?: any;
  onItemSelected: (value: any) => void;
}

export const SelectList: FC<SelectListProps> = ({ items, selectedValue, onItemSelected }) => {
  const renderItem = ({ label, value }: ListItem, index: number) => {
    const isLast = index === items.length - 1;
    let color = colors.text;
    let backgroundColor = colors.gray;
    if (value === selectedValue) {
      color = colors.white;
      backgroundColor = colors.main;
    }

    const labelHint = value === selectedValue ? `${label} selected` : `${label} unselected`;

    return (
      <TouchableWithoutFeedback
        key={`item-${index}`}
        onPress={() => onItemSelected(value)}
        accessibilityLabel={labelHint}
        accessibilityHint={labelHint}
        accessibilityRole="checkbox"
      >
        <View style={[styles.row, { backgroundColor }, isLast && styles.lastItem]}>
          <View style={styles.icon}>{value === selectedValue ? <IconSelected /> : <IconNotSelected />}</View>
          <Text style={[text.defaultBold, { color }]}>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return <View>{items.map(renderItem)}</View>;
};

const IconSelected = () => <Icons.RadioSelected width={22} height={22} color={colors.darkBlue} />;

const IconNotSelected = () => <View style={styles.circle} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: `${colors.dot}80`,
    borderRadius: 8,
    marginBottom: 8
  },
  icon: {
    marginRight: 12
  },
  circle: {
    width: 22,
    height: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: `${colors.dot}80`,
    borderRadius: 13
  },
  iconSize: {
    width: 22,
    height: 22
  },
  lastItem: {
    marginBottom: 0
  }
});
