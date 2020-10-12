import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { text } from 'theme';

interface ListItemProps {
  icon: any;
  label: string;
}

export const ListItem: React.FC<ListItemProps> = ({ icon, label }) => {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.label} accessible accessibilityRole="text">
        <Text style={text.default}>{label}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  icon: {
    width: 64,
    alignItems: 'center'
  },
  label: {
    flex: 1
  }
});
