import React, { FC, useState, useEffect, useMemo, createRef } from 'react';
import { StyleSheet, View, TextInput, ViewStyle, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useTranslation } from 'react-i18next';

import { text, colors } from 'theme';

interface CodeInputProps {
  style?: ViewStyle;
  count: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
}

export const CodeInput: FC<CodeInputProps> = ({ style, count, disabled = false, autoFocus = false, onChange }) => {
  const { t } = useTranslation();
  const [values, setValue] = useState<string[]>(Array(count).fill(''));
  const refs = useMemo(() => Array.from({ length: count }).map(() => createRef<TextInput>()), [count]);

  useEffect(() => {
    if (autoFocus) {
      refs[0].current?.focus();
    }
  }, [refs, autoFocus]);

  const onKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0) {
      if (values[index] === '') {
        refs[index - 1].current?.focus();
      }
    }
  };

  const onChangeTextHandler = (index: number, value: string) => {
    const newValues = [...values];
    newValues.splice(index, 1, value);
    setValue(newValues);

    if (!value) {
      return;
    }

    if (newValues.every(v => !!v)) {
      onChange && onChange(newValues.join(''));
    }

    if (index < count - 1) {
      refs[index + 1].current?.focus();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {values.map((value, index) => {
        return (
          <TextInput
            key={`i_${index}`}
            ref={refs[index]}
            selectTextOnFocus
            style={[styles.block, index === 0 && styles.leftMargin, index === count - 1 && styles.rightMargin]}
            maxLength={1}
            keyboardType="number-pad"
            returnKeyType="done"
            editable={!disabled}
            value={value}
            onChangeText={txt => onChangeTextHandler(index, txt)}
            onKeyPress={e => onKeyPress(index, e)}
            accessibilityLabel={t('codeInput:accessibilityLabel', {
              number: index + 1
            })}
            accessibilityHint={t('codeInput:accessibilityHint', { count })}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  block: {
    height: 72,
    flex: 1,
    ...text.xxlargeBlack,
    color: colors.main,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    backgroundColor: colors.whiteSmoke,
    borderColor: colors.dot,
    borderRadius: 3,
    marginHorizontal: 6
  },
  leftMargin: {
    marginLeft: 0
  },
  rightMargin: {
    marginRight: 0
  }
});
