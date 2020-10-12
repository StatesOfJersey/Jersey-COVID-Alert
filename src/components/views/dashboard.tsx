import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useExposure, StatusState } from 'react-native-exposure-notification-service';
import * as SecureStore from 'expo-secure-store';

import { AppIcons } from 'assets/icons';
import { Button } from 'components/atoms/button';
import { CheckInCard } from 'components/molecules/check-in-card';
import { CloseContactWarning } from 'components/molecules/close-contact-warning';
import { AppStats } from 'components/organisms/app-stats';
import { CovidStats } from 'components/organisms/covid-stats';
import { QuickCheckIn } from 'components/molecules/quick-checkin';
import { Scrollable } from 'components/templates/scrollable';
import { Spacing } from 'components/atoms/spacing';
import { Toast } from 'components/atoms/toast';
import { TracingAvailable } from 'components/molecules/tracing-available';
import { TrendChartCard } from 'components/organisms/trend-chart-card';
import { useApplication } from 'providers/context';
import { useAppState } from 'hooks/app-state';
import { useSettings } from 'providers/settings';
import { ActiveCaseBreakdown } from 'components/organisms/active-cases-breakdown';
import { colors } from 'theme';
import { StatsSource } from '../molecules/stats-source';

export const Dashboard: FC = () => {
  const app = useApplication();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [quickCheckInDismissed, setQuickCheckInDismissed] = useState(false);
  const [tracingNowAvailable, setTracingNowAvailable] = useState(false);
  const [appState] = useAppState();
  const isFocused = useIsFocused();
  const exposure = useExposure();
  const {
    features: { symptomChecker }
  } = useSettings();

  const { verifyCheckerStatus } = app;
  const { checkInConsent, quickCheckIn, checks } = app;

  const displayCheckInConsent = symptomChecker && !checkInConsent;
  const displayQuickCheckIn =
    symptomChecker &&
    !quickCheckInDismissed &&
    (quickCheckIn || (checkInConsent && checks.length > 0 && !app.completedChecker));

  useFocusEffect(
    React.useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }
      exposure.readPermissions();
      verifyCheckerStatus();
    }, [isFocused, appState, verifyCheckerStatus])
  );

  const onRefresh = () => {
    setRefreshing(true);
    app.loadAppData().then(() => setRefreshing(false));
  };

  useEffect(() => {
    const checkTracingNowAvailable = async () => {
      const supportPossible = await SecureStore.getItemAsync('supportPossible');
      if (supportPossible && supportPossible === 'true') {
        if (
          exposure.canSupport &&
          exposure.supported &&
          exposure.status.state !== StatusState.active &&
          exposure.status.state !== StatusState.restricted
        ) {
          setTracingNowAvailable(true);
        } else if (exposure.supported) {
          try {
            SecureStore.deleteItemAsync('supportPossible');
          } catch (e) {
            console.log(e);
          }
        }
      }
    };
    checkTracingNowAvailable();
  }, [exposure.canSupport, exposure.supported, exposure.status.state]);

  const errorToast = app.data === null && (
    <Toast type="error" icon={<AppIcons.Alert width={24} height={24} />} message={t('common:missingError')} />
  );

  return (
    <Scrollable
      safeArea={false}
      toast={errorToast}
      backgroundColor={colors.background.cards}
      refresh={{ refreshing, onRefresh }}
    >
      {tracingNowAvailable && (
        <>
          <TracingAvailable />
          <Spacing s={16} />
        </>
      )}
      {exposure.contacts && exposure.contacts.length > 0 && (
        <>
          <CloseContactWarning />
          <Spacing s={16} />
        </>
      )}
      {displayCheckInConsent && (
        <>
          <CheckInCard onPress={() => navigation.navigate('symptoms', { screen: 'symptoms.checker' })} />
          <Spacing s={16} />
        </>
      )}
      {displayQuickCheckIn && (
        <QuickCheckIn
          onDismissed={() => setQuickCheckInDismissed(true)}
          nextHandler={() =>
            navigation.navigate('symptoms', {
              screen: 'symptoms.checker',
              params: { timestamp: Date.now(), skipQuickCheckIn: true }
            })
          }
        />
      )}
      {app.data === null && (
        <>
          <View style={styles.empty}>
            <Button type="empty" onPress={onRefresh}>
              {t('common:missingDataAction')}
            </Button>
          </View>
        </>
      )}
      {app.data && (
        <>
          {app.data.installs > 3000 && <AppStats installs={app.data.installs} />}
          <Spacing s={16} />
          <CovidStats data={app.data} onCountyBreakdown={() => navigation.navigate('casesByCounty')} />
          <Spacing s={16} />
          <TrendChartCard title={t('confirmedChart:title')} data={app.data.daily} />
          <Spacing s={16} />
          <ActiveCaseBreakdown data={app.data} />
          <Spacing s={24} />
          <StatsSource
            lastUpdated={{
              stats: new Date(app.data.generatedAt),
              profile: new Date(app.data.generatedAt)
            }}
          />
          <Spacing s={24} />
        </>
      )}
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  }
});
