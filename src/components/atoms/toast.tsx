import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle } from 'react-native';

import { Markdown } from './markdown';

import { text, colors } from 'theme';

interface ToastProps {
  type?: string;
  icon?: ReactNode;
  color?: string;
  backgroundColor?: string;
  message?: string;
  markdown?: boolean;
  style?: ViewStyle;
  iconStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Toast: React.FC<ToastProps> = ({
  type,
  color,
  backgroundColor,
  icon,
  message,
  style,
  children,
  iconStyle = {},
  textStyle = {}
}) => {
  const iconStyling: ViewStyle[] = [styles.icon, iconStyle];
  const textStyling: TextStyle[] = [text.defaultBold, textStyle];
  const containerStyling: ViewStyle[] = [styles.messageContainer];

  if (type === 'error') {
    iconStyling.push(styles.iconError);
    textStyling.push(styles.messageError);
  }

  if (color) {
    iconStyling.push({ backgroundColor: color });
  }

  if (backgroundColor) {
    containerStyling.push({ backgroundColor });
  }

  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={[styles.container, style]}>
      {icon && <View style={iconStyling}>{icon}</View>}
      <View style={containerStyling}>
        {message && <Text style={textStyling}>{message}</Text>}
        {children && <Markdown>{children}</Markdown>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 48
  },
  icon: {
    width: 48,
    minHeight: 48,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconError: {
    backgroundColor: colors.red
  },
  messageContainer: {
    flex: 1,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 12
  },
  messageError: {
    color: colors.red
  }
});

export { Toast };
