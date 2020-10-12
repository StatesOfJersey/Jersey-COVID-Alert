import React, { useEffect, useState } from 'react';
import { enableScreens } from 'react-native-screens';
import { Platform, StatusBar, Image, View, AppState, LogBox } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PushNotification, { PushNotification as PN } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import { ExposureProvider, TraceConfiguration, KeyServerType } from 'react-native-exposure-notification-service';
import { isMountedRef, navigationRef } from 'navigation';

import 'services/i18n';
import { ApplicationProvider, useApplication } from 'providers/context';
import { SettingsProvider, SettingsContext, useSettings } from 'providers/settings';
import { Base } from 'components/templates/base';
import { NavBar } from 'components/atoms/navbar';
import { TabBarBottom } from 'components/organisms/tab-bar-bottom';
import { Over16 } from 'components/views/over-16';
import { Under16 } from 'components/views/under-16';
import { GetStarted } from 'components/views/get-started';
import { YourData } from 'components/views/your-data';
import { AppUsage } from 'components/views/app-usage';
import { ExposureAlertInformation } from 'components/views/exposure-alert-information';
import { FollowUpCall } from 'components/views/follow-up-call';
import { Sorry } from 'components/views/sorry';
import { TermsAndConditions } from 'components/views/terms-and-conditions';
import { PrivacyNotice } from 'components/views/privacy-notice';
import { Dashboard } from 'components/views/dashboard';
import { SymptomChecker } from 'components/views/symptom-checker';
import { SymptomsHistory } from 'components/views/symptoms-history';
import { ExposureAlert } from 'components/views/exposure-alert';
import { CountyBreakdown } from 'components/views/county-breakdown';
import { CloseContact } from 'components/views/close-contact';
import { UploadKeys } from 'components/views/upload-keys';
import { Settings } from 'components/views/settings';
import { ExposureAlertSettings } from 'components/views/settings/exposure-alert';
import { CheckInSettings } from 'components/views/settings/check-in';
import { Metrics } from 'components/views/settings/metrics';
import { Leave } from 'components/views/settings/leave';
import { Debug } from 'components/views/settings/debug';
import { Language } from 'components/views/settings/language';
import { FollowUpCallSettings } from 'components/views/settings/follow-up-call';
import { HowTheAppWorks } from 'components/views/how-the-app-works';
import { colors } from 'theme';
import { Loading } from 'components/views/loading';
import { urls } from 'constants/urls';
import { ReminderProvider } from './providers/reminder';
import { notificationHooks } from './services/notifications';
import { Pause } from 'components/views/pause';

// Mute multiple known warnings to display on device. Those warning messages coming from React Native components and need to be fixed by RN team in future updates
LogBox.ignoreLogs(['Animated', 'Warning: componentWill', 'Possible Unhandled Promise']);

enableScreens();

try {
  NetInfo.fetch().then(state => console.log(state));
} catch (err) {
  console.log(err);
}

function cacheImages(images: (string | number)[]) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SymptomsStack = () => {
  const app = useApplication();
  const { t } = useTranslation();

  const initialRouteName = app.checks.length ? 'symptoms.history' : 'symptoms.checker';

  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true
        //   header: props => <NavBar hideSettings={!app.user || !app.user.id} {...props} />
      }}
      initialRouteName={initialRouteName}
      headerMode="none"
    >
      <Stack.Screen
        name="symptoms.history"
        component={SymptomsHistory}
        options={{ title: t('viewNames:symptomchecker') }}
      />
      <Stack.Screen
        name="symptoms.checker"
        component={SymptomChecker}
        options={{ title: t('viewNames:symptomchecker') }}
      />
    </Stack.Navigator>
  );
};

const MainStack = ({ route }: any) => {
  const { t } = useTranslation();
  const { isSymptomCheckerEnabled } = route.params;

  return (
    <Tab.Navigator initialRouteName="exposure-alert" tabBar={(props: any) => <TabBarBottom {...props} />}>
      <Tab.Screen name="exposure-alert" component={ExposureAlert} options={{ title: t('viewNames:exposureAlert') }} />
      <Tab.Screen name="dashboard" component={Dashboard} options={{ title: t('viewNames:updates') }} />

      {isSymptomCheckerEnabled && (
        <Tab.Screen name="symptoms" component={SymptomsStack} options={{ title: t('viewNames:symptomchecker') }} />
      )}

      <Tab.Screen name="settings" component={Settings} options={{ title: t('viewNames:settings') }} />
    </Tab.Navigator>
  );
};

function Navigation({
  notification,
  exposureNotificationClicked,
  isSymptomCheckerEnabled,
  isCountyBreakdownEnabled,
  setState
}: {
  traceConfiguration: TraceConfiguration;
  notification: PN | null;
  exposureNotificationClicked: Boolean | null;
  isSymptomCheckerEnabled: boolean;
  isCountyBreakdownEnabled: boolean;
  setState: (value: React.SetStateAction<State>) => void;
}) {
  const app = useApplication();
  const { t } = useTranslation();
  const initialScreen = app.user ? 'main' : 'over16';

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    if (navigationRef.current && notification) {
      navigationRef.current.navigate('closeContact');

      setState(s => ({ ...s, notification: null }));
    }
  }, [app, notification]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    if (navigationRef.current && exposureNotificationClicked) {
      console.log('exposureNotificationClicked', exposureNotificationClicked);
      navigationRef.current.navigate('closeContact');
      setState(s => ({ ...s, exposureNotificationClicked: null }));
    }
  }, [app, exposureNotificationClicked]);

  if (app.initializing) {
    return (
      <View>
        <Spinner visible />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={e => {
        navigationRef.current = e;
        notificationHooks.navigation = e as NavigationContainerRef;
      }}
    >
      <Spinner animation="fade" visible={!!app.loading} />
      <Stack.Navigator
        screenOptions={{
          header: props => <NavBar {...props} />,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animationEnabled: true,
          headerShown: true
        }}
        initialRouteName={initialScreen}
        mode="modal"
      >
        <Stack.Screen
          name="over16"
          component={Over16}
          options={{
            title: t('viewNames:age'),
            header: () => null,
            cardStyle: { backgroundColor: colors.yellow }
          }}
        />
        <Stack.Screen name="under16" component={Under16} />
        <Stack.Screen
          name="getStarted"
          component={GetStarted}
          options={{
            title: t('viewNames:getStarted')
          }}
        />
        <Stack.Screen
          name="howTheAppWorks"
          component={HowTheAppWorks}
          options={{
            headerShown: false,
            title: t('viewNames:howTheAppWorks'),
            cardStyle: {
              backgroundColor: colors.white
            },
            gestureEnabled: true,
            ...TransitionPresets.ModalTransition
          }}
        />
        <Stack.Screen name="yourData" component={YourData} options={{ title: t('yourData:title') }} />
        <Stack.Screen name="appUsage" component={AppUsage} options={{ title: t('appUsage:title') }} />
        <Stack.Screen
          name="exposureAlertInformation"
          component={ExposureAlertInformation}
          options={{ title: t('tabBar:exposureAlert') }}
        />
        <Stack.Screen name="followUpCall" component={FollowUpCall} options={{ title: t('followUpCall:title') }} />

        <Stack.Screen
          name="main"
          component={MainStack}
          options={{ showSettings: true }}
          initialParams={{ isSymptomCheckerEnabled }}
        />
        {isCountyBreakdownEnabled && (
          <Stack.Screen
            name="casesByCounty"
            component={CountyBreakdown}
            options={{ title: t('viewNames:casesByCounty') }}
          />
        )}
        <Stack.Screen name="closeContact" component={CloseContact} options={{ title: t('viewNames:closeContact') }} />
        <Stack.Screen name="uploadKeys" component={UploadKeys} options={{ title: t('viewNames:uploadKeys') }} />
        <Stack.Screen name="pause" component={Pause} options={{ title: t('viewNames:pause') }} />

        <Stack.Screen
          name="settings.exposureAlert"
          component={ExposureAlertSettings}
          options={{ title: t('viewNames:settingsExposureAlert') }}
        />
        <Stack.Screen
          name="settings.followUpCall"
          component={FollowUpCallSettings}
          options={{ title: t('viewNames:settingsFollowUpCall') }}
        />
        <Stack.Screen
          name="settings.checkIn"
          component={CheckInSettings}
          options={{ title: t('viewNames:settingsCheckin') }}
        />
        <Stack.Screen name="settings.terms" component={TermsAndConditions} options={{ title: t('viewNames:terms') }} />
        <Stack.Screen name="settings.privacy" component={PrivacyNotice} options={{ title: t('viewNames:privacy') }} />
        <Stack.Screen name="settings.metrics" component={Metrics} options={{ title: t('viewNames:metrics') }} />
        <Stack.Screen name="settings.leave" component={Leave} options={{ title: t('viewNames:leave') }} />
        <Stack.Screen name="settings.language" component={Language} options={{ title: t('viewNames:language') }} />
        <Stack.Screen name="settings.debug" component={Debug} />

        <Stack.Screen name="sorry" component={Sorry} />
        <Stack.Screen name="terms" component={TermsAndConditions} options={{ title: t('viewNames:terms') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const ExposureApp: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState<{
    authToken: string;
    refreshToken: string;
  }>({ authToken: '', refreshToken: '' });

  const { traceConfiguration } = useSettings();
  const app = useApplication();

  useEffect(() => {
    async function getTokens() {
      try {
        const storedAuthToken = await SecureStore.getItemAsync('token');
        const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
        setTokens({
          authToken: storedAuthToken || '',
          refreshToken: storedRefreshToken || ''
        });
      } catch (err) {
        console.error('error getting tokens', err);
      }
    }

    getTokens();
  }, [app.user]);

  return (
    <ExposureProvider
      isReady={Boolean(app.user?.valid && tokens.authToken && tokens.refreshToken)}
      traceConfiguration={traceConfiguration}
      serverUrl={urls.api}
      keyServerUrl={urls.api}
      keyServerType={KeyServerType.nearform}
      authToken={tokens.authToken}
      refreshToken={tokens.refreshToken}
      notificationTitle={t('closeContactNotification:title')}
      notificationDescription={t('closeContactNotification:description')}
      analyticsOptin={app.analyticsConsent}
    >
      {children}
    </ExposureProvider>
  );
};

interface State {
  loading: boolean;
  token?: { os: string; token: string };
  notification: PN | null;
  exposureNotificationClicked: Boolean | null;
}

export default function App(props: { exposureNotificationClicked: Boolean | null }) {
  const [state, setState] = React.useState<State>({
    loading: false,
    notification: null,
    exposureNotificationClicked: props.exposureNotificationClicked
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        const imageAssets = cacheImages([
          require('assets/images/app-logo/app-logo.png'),
          require('assets/images/apple/image.png'),
          require('assets/images/callback/image.png'),
          require('assets/images/contact-tracing/contact-tracing-spin.png'),
          require('assets/images/contact-tracing/ct-off-selected.png'),
          require('assets/images/contact-tracing/ct-off-unselected.png'),
          require('assets/images/contact-tracing/ct-on-selected.png'),
          require('assets/images/contact-tracing/ct-on-unselected.png'),
          require('assets/images/exposure-alert/exposure-alert.png'),
          require('assets/images/google/image.png'),
          require('assets/images/information/alt.png'),
          require('assets/images/information/womanPhone.png'),
          require('assets/images/onboardingTeam/onboardingTeam.png'),
          require('assets/images/permissions/permissions-5.png'),
          require('assets/images/phone/not-active.png'),
          require('assets/images/swoosh/swoosh.png'),
          require('assets/images/symptoma/image.png'),
          require('assets/images/symptomb/image.png'),
          require('assets/images/symptomc/image.png'),
          require('assets/images/symptomd/image.png'),
          require('assets/images/symptoms-history/1_temp.png'),
          require('assets/images/symptoms-history/2_cough.png'),
          require('assets/images/symptoms-history/4_nose.png'),
          require('assets/images/under16/under16.png')
        ]);

        const fonts = await Font.loadAsync({
          'lato-black': require('assets/fonts/lato/Lato-Black.ttf'),
          'lato-bold': require('assets/fonts/lato/Lato-Bold.ttf'),
          lato: require('assets/fonts/lato/Lato-Regular.ttf'),
          'lato-thin': require('assets/fonts/lato/Lato-Thin.ttf')
        });

        await Promise.all([...imageAssets, fonts]);
      } catch (e) {
        console.warn(e);
      } finally {
        setState({ ...state, loading: false });
      }
    }

    loadResourcesAndDataAsync();

    notificationHooks.handleNotification = async function (notification) {
      let requiresHandling = false;
      if (Platform.OS === 'ios') {
        if ((notification && notification.userInteraction) || (AppState.currentState === 'active' && notification)) {
          PushNotification.setApplicationIconBadgeNumber(0);
          requiresHandling = true;
          setTimeout(() => {
            notification.finish(Platform.OS === 'ios' ? PushNotificationIOS.FetchResult.NoData : '');
          }, 3000);
        }
      }
      if (requiresHandling) {
        setTimeout(() => setState(s => ({ ...s, notification })), 500);
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <Base>
        <SettingsProvider>
          <SettingsContext.Consumer>
            {settingsValue => {
              if (!settingsValue.loaded) {
                return Platform.OS !== 'ios' ? <Loading /> : null;
              }
              return (
                <ReminderProvider>
                  <ApplicationProvider
                    user={settingsValue.user}
                    consent={settingsValue.consent}
                    appConfig={settingsValue.appConfig}
                  >
                    <ExposureApp>
                      <StatusBar barStyle="light-content" />
                      <Navigation
                        traceConfiguration={settingsValue.traceConfiguration}
                        notification={state.notification}
                        exposureNotificationClicked={state.exposureNotificationClicked}
                        isSymptomCheckerEnabled={settingsValue.features.symptomChecker}
                        isCountyBreakdownEnabled={settingsValue.features.countyBreakdown}
                        setState={setState}
                      />
                    </ExposureApp>
                  </ApplicationProvider>
                </ReminderProvider>
              );
            }}
          </SettingsContext.Consumer>
        </SettingsProvider>
      </Base>
    </SafeAreaProvider>
  );
}
