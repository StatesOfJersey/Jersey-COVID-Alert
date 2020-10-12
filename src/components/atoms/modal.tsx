import React from 'react';
import { StyleSheet } from 'react-native';
import RNModal, { ModalProps } from 'react-native-modal';
import { useSafeArea } from 'react-native-safe-area-context';

import { colors } from 'theme';

interface Props extends Partial<ModalProps> {
  isVisible: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ isVisible, children }) => {
  const insets = useSafeArea();
  return (
    <RNModal style={[styles.modal, { marginTop: insets.top + 12 }]} isVisible={isVisible}>
      {children}
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 0,
    marginBottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 1
  }
});
