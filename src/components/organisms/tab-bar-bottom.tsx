import React, { ReactNode, FC } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, Share, Platform } from 'react-native';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { useExposure, StatusState } from 'react-native-exposure-notification-service';

import { colors, text } from 'theme';
import { TabBarIcons, AppIcons } from 'assets/icons';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from 'providers/settings';
import { useReminder } from 'providers/reminder';

export const shareApp = async (t: TFunction) => {
  try {
    await Share.share(
      {
        title: t('common:message'),
        message: Platform.OS === 'android' ? t('common:url') : undefined,
        url: t('common:url')
      },
      {
        subject: t('common:name'),
        dialogTitle: t('common:name')
      }
    );
  } catch (error) {
    console.log(t('tabBar:shareError'));
  }
};

interface Tab {
  label: string;
  icon: {
    active: ReactNode;
    inactive?: ReactNode;
    unknown?: ReactNode;
    paused?: ReactNode;
  };
}

const getIcon = (tab: Tab, active: Boolean, status: String, paused: boolean) => {
  if (status === StatusState.unknown && tab.icon.unknown) {
    return tab.icon.unknown;
  }
  if (paused && tab.icon.paused) return tab.icon.paused;
  if (active) return tab.icon.active;
  return tab.icon.inactive ? tab.icon.inactive : tab.icon.active;
};

const ctOnUnselected = <TabBarIcons.ContactTracing.On width={32} height={24} color={colors.activeRed} />;
const ctOffUnselected = <TabBarIcons.ContactTracing.Off width={32} height={24} color={colors.activeRed} />;
const ctOnSelected = <TabBarIcons.ContactTracing.On width={32} height={24} color={colors.activeRed} />;
const ctOffSelected = <TabBarIcons.ContactTracing.Off width={32} height={24} color={colors.activeRed} />;
const checkActive = <TabBarIcons.CheckIn width={32} height={24} color={colors.activeRed} />;
const ctUnknownSelected = <TabBarIcons.ContactTracing.Unknown width={32} height={24} color={colors.activeRed} />;
const ctPaused = <TabBarIcons.ContactTracing.Paused width={32} height={24} color={colors.activeRed} />;

const barChartActive = <TabBarIcons.Updates width={32} height={24} color={colors.activeRed} />;
const settingsSelected = (
  <TabBarIcons.Settings width={Platform.OS === 'android' ? 24 : 32} height={24} color={colors.activeRed} />
);
const shareIcon = <AppIcons.Share width={24} height={24} color={colors.activeRed} />;

/**
 * The component assumes the order of the <Tab /> components in the BottomNavigation is correct.
 * No need for a generic approach... yet.
 */
export const TabBarBottom: FC<any> = ({ state }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { status, enabled } = useExposure();
  const { paused } = useReminder();
  const {
    features: { symptomChecker }
  } = useSettings();

  const tabItems = [
    {
      label: t('tabBar:exposureAlert'),
      icon: {
        inactive: status.state === StatusState.active && enabled ? ctOnUnselected : ctOffUnselected,
        active: status.state === StatusState.active && enabled ? ctOnSelected : ctOffSelected,
        paused: paused ? ctPaused : ctOnSelected,
        unknown: ctUnknownSelected,
        width: 32
      }
    },
    {
      label: t('tabBar:updates'),
      icon: {
        active: barChartActive,
        width: 32
      }
    },
    ...(symptomChecker
      ? [
          {
            label: t('tabBar:symptomCheck'),
            icon: {
              active: checkActive,
              width: 32
            }
          }
        ]
      : []),
    {
      label: t('tabBar:shareApp'),
      icon: {
        active: shareIcon,
        width: 24
      }
    },
    {
      label: t('tabBar:settings'),
      icon: {
        active: settingsSelected,
        width: Platform.OS === 'android' ? 24 : 32
      }
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabItems.map((tab, index) => {
          const routeIndex = index === 3 ? 2 : index;
          const isActive = state.index === routeIndex && index !== 2;
          const routeName = state.routes[routeIndex] && state.routes[routeIndex].name;
          return (
            <TouchableWithoutFeedback
              key={`tab-bar-item-${index}`}
              onPress={tab.label === t('tabBar:shareApp') ? () => shareApp(t) : () => navigation.navigate(routeName)}
            >
              <View style={[styles.tab, isActive && styles.tabActive]}>
                <View style={[styles.icon, { width: tab.icon.width }]}>
                  {getIcon(tab, isActive, status.state, !!paused)}
                </View>
                <Text allowFontScaling={false} style={[styles.label, isActive && styles.labelActive]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    height: Constants.statusBarHeight === 44 ? 88 : 80
  },
  tab: {
    flexBasis: '25%',
    flexGrow: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 14,
    borderTopColor: colors.separatorGray,
    borderTopWidth: 1
  },
  tabActive: {
    backgroundColor: colors.lightRed,
    borderTopWidth: 4,
    paddingTop: 11,
    borderTopColor: colors.activeRed
  },
  label: {
    ...text.smallBold,
    lineHeight: 14,
    paddingLeft: 10,
    paddingRight: 10,
    letterSpacing: -0.35,
    paddingTop: 4,
    textAlign: 'center'
  },
  labelActive: {
    color: colors.text
  },
  icon: {
    height: 24
  }
});
