import React, { useRef, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput
} from 'react-native';
import { ModalProps } from 'react-native-modal';
import { useSafeArea } from 'react-native-safe-area-context';

import { Spacing } from 'components/atoms/layout';
import { Modal } from 'components/atoms/modal';
import { colors, text } from 'theme';
import Icons, { AppIcons } from 'assets/icons';

interface DropdownModalProps extends Partial<ModalProps> {
  title: string;
  items: any[];
  selectedValue: string;
  onSelect: (value: any) => void;
  onClose: () => void;
  search?: {
    placeholder: string;
    term: string;
    onChange: (value: string) => void;
    noResults: string;
  };
  itemRenderer?: (item: any) => React.ReactNode;
  instructions?: () => React.ReactNode;
}

export const DropdownModal: React.FC<DropdownModalProps> = ({
  title,
  items,
  selectedValue,
  onSelect,
  onClose,
  search,
  itemRenderer,
  instructions
}) => {
  const insets = useSafeArea();
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const renderItem = (item: any, index: number) => {
    const { label, value } = item;
    const color = value === selectedValue ? colors.darkBlue : colors.text;

    if (!item.value) {
      return (
        <View key={`item_${index}`} style={listStyles.row}>
          <Text>-</Text>
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback key={`item_${index}`} onPress={() => onSelect(value)}>
        <View
          style={[listStyles.row, index === 0 && listStyles.rowFirst, index === items.length - 1 && listStyles.rowLast]}
        >
          {itemRenderer ? (
            itemRenderer(item)
          ) : (
            <View style={listStyles.textWrapper}>
              <Text style={[text.xlargeBold, { color }]}>{label}</Text>
            </View>
          )}
          {value === selectedValue && (
            <View style={listStyles.iconWrapper}>
              <Icons.CheckMark width={26} height={26} />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderContent = () => {
    if (search) {
      if (!search.term && instructions) {
        return <View style={listStyles.contentWrapper}>{instructions()}</View>;
      }

      if (search.term && !items.length) {
        return (
          <View style={listStyles.contentWrapper}>
            <Text style={listStyles.noResults}>{search?.noResults}</Text>
          </View>
        );
      }
    }

    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={insets.top + 12}
        style={listStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <ScrollView keyboardShouldPersistTaps="always">{items.map(renderItem)}</ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <Modal isVisible={true}>
      <View style={styles.top}>
        <View style={styles.header}>
          <TouchableWithoutFeedback
            accessibilityRole="button"
            accessibilityHint={`Close ${title}`}
            accessibilityLabel={`Close ${title}`}
            onPress={onClose}
          >
            <View style={styles.closeIconWrapper}>
              <AppIcons.Close width={16} height={16} />
            </View>
          </TouchableWithoutFeedback>
          <Text style={text.small}>{title}</Text>
        </View>
        {search && (
          <>
            <Spacing s={12} />
            <View style={styles.search}>
              <TextInput
                ref={searchInputRef}
                style={[styles.searchInput, !!search.term && styles.searchUnderlined]}
                placeholderTextColor="rgb(106, 116, 128)"
                placeholder={search.placeholder}
                onChangeText={search.onChange}
                value={search.term}
              />
            </View>
          </>
        )}
      </View>
      {renderContent()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  top: {
    paddingHorizontal: 32,
    paddingTop: 32
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  closeIconWrapper: {
    position: 'absolute',
    top: -16,
    right: -16,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    zIndex: 99
  },
  search: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(221, 221, 221)'
  },
  searchInput: {
    height: 48,
    ...text.xlarge,
    color: colors.main
  },
  selectedIconSize: {
    width: 26,
    height: 26
  },
  searchUnderlined: {
    textDecorationLine: 'underline'
  },
  closeIcon: {
    width: 16,
    height: 16
  }
});

const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 4
  },
  row: {
    flexDirection: 'row',
    marginVertical: 8
  },
  rowFirst: {
    marginTop: 0
  },
  rowLast: {
    marginBottom: 16
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconWrapper: {
    position: 'absolute',
    right: 0
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 96,
    alignSelf: 'center',
    width: '75%'
  },
  noResults: {
    ...text.large,
    textAlign: 'center'
  }
});
