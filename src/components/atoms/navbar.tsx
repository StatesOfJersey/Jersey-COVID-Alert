import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeArea } from 'react-native-safe-area-context';

import Icons, { AppIcons } from 'assets/icons';
import { colors, text } from 'theme';
import { useApplication } from 'providers/context';
import { useNavigation } from '@react-navigation/native';

interface NavBarProps {
  placeholder?: boolean;
}

export const NavBar: FC<NavBarProps> = ({ placeholder }) => {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const { user } = useApplication();

  const [state, setState] = useState({ back: false });

  useEffect(() => {
    let unsubscribeStart: (() => any) | null = null;
    let unsubscribeEnd: (() => any) | null = null;
    if (!placeholder) {
      unsubscribeStart = navigation.addListener('transitionStart', () => {
        const { index } = navigation.dangerouslyGetState();
        setState(s => ({
          ...s,
          back: index !== 0
        }));
      });

      unsubscribeEnd = navigation.addListener('transitionEnd', () => {
        const { index } = navigation.dangerouslyGetState();
        setState(s => ({
          ...s,
          back: index > 0
        }));
      });
    }

    return () => {
      unsubscribeStart && unsubscribeStart();
      unsubscribeEnd && unsubscribeEnd();
    };
  }, [user, navigation, placeholder]);

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 2 }]}>
      <View style={styles.container}>
        <View style={[styles.col, styles.left]}>
          {state.back && (
            <TouchableWithoutFeedback
              accessibilityRole="button"
              accessibilityHint={t('navbar:backHint')}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.back}>
                <AppIcons.Back width={24} height={24} color={colors.white} />
                <Text allowFontScaling={false} style={styles.backText}>
                  {t('navbar:back')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        <View
          accessible
          accessibilityLabel={t('common:name')}
          accessibilityHint={t('common:name')}
          accessibilityRole="text"
          style={[styles.col, styles.center]}
        >
          <Icons.LogoHeader color={colors.white} width={219} height={40} />
        </View>
        <View style={[styles.col, styles.right]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: colors.main
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 8 : 0
  },
  col: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  left: {
    width: '25%',
    alignItems: 'flex-start',
    paddingLeft: 4
  },
  center: {
    width: '50%',
    justifyContent: 'flex-start',
    marginBottom: 8,
    alignItems: 'center'
  },
  right: {
    width: '25%',
    alignItems: 'flex-end',
    paddingRight: 12
  },
  back: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  backText: {
    ...text.largeBold,
    textAlign: 'left',
    marginLeft: 4,
    color: colors.white
  },
  iconSize: {
    width: 24,
    height: 24
  },
  logoSize: {
    width: 92,
    height: 36
  }
});
