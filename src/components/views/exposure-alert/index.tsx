import React, { useCallback, useEffect } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useExposure, StatusState, AuthorisedStatus, StatusType } from 'react-native-exposure-notification-service';

import { Card } from 'components/atoms/card';
import { CloseContactWarning } from 'components/molecules/close-contact-warning';
import { text, scale, colors } from 'theme';
import { Spacing } from 'components/atoms/spacing';
import { useAppState } from 'hooks/app-state';
import { Active } from './active';
import { NotActive } from './not-active';
import { NoSupport } from './no-support';
import { CanSupport } from './can-support';
import { NotEnabled } from './not-enabled';
import { Paused } from './paused';
import { Scrollable } from 'components/templates/scrollable';
import { useApplication } from 'providers/context';
import { useReminder } from 'providers/reminder';

export const ExposureAlert = ({ navigation }: any) => {
  const { t } = useTranslation();
  const exposure = useExposure();
  const isFocused = useIsFocused();
  const [appState] = useAppState();
  const { loadAppData } = useApplication();
  const { checked, paused } = useReminder();
  const { supported, canSupport, status, enabled, isAuthorised, initialised } = exposure;

  useFocusEffect(
    useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }

      async function onFocus() {
        await exposure.readPermissions();
        exposure.getCloseContacts();
      }

      onFocus();
    }, [isFocused, appState])
  );

  useEffect(() => {
    const loadData = async () => {
      await loadAppData();
    };
    loadData();
  }, []);

  const ready = checked && initialised;
  const pausedStatus = ready && paused;

  let showCards = true;
  let exposureStatusCard;
  if (ready) {
    if (pausedStatus) {
      exposureStatusCard = <Paused />;
    } else if (!supported) {
      exposureStatusCard = !canSupport ? <NoSupport /> : <CanSupport />;
      showCards = false;
    } else {
      if (status.state === StatusState.active && enabled) {
        exposureStatusCard = <Active />;
      } else if (isAuthorised === AuthorisedStatus.unknown) {
        exposureStatusCard = <NotEnabled />;
      } else {
        const type = status.type || [];
        exposureStatusCard = (
          <NotActive
            exposureOff={type.indexOf(StatusType.exposure) !== -1}
            bluetoothOff={type.indexOf(StatusType.bluetooth) !== -1}
          />
        );
      }
    }
  }

  return (
    <Scrollable
      safeArea={false}
      heading={t('exposureAlert:title')}
      accessibilityRefocus
      backgroundColor={colors.background.cards}
    >
      {exposure.contacts && exposure.contacts.length > 0 && (
        <>
          <CloseContactWarning />
          <Spacing s={16} />
        </>
      )}
      {exposureStatusCard}
      {ready && showCards && (
        <>
          <Spacing s={16} />
          <Card onPress={() => navigation.navigate('uploadKeys')} padding={{ r: 4 }}>
            <Text style={styles.cardTitle}>{t('exposureAlert:uploadCard:title')}</Text>
            <Spacing s={8} />
            <Text style={styles.cardContent}>{t('exposureAlert:uploadCard:text')}</Text>
          </Card>
        </>
      )}
      <Spacing s={16} />
      <Card onPress={() => navigation.navigate('closeContact', { info: true })} padding={{ r: 4 }}>
        <Text style={styles.cardTitle}>{t('exposureAlert:closeContactCard:title')}</Text>
        <Spacing s={8} />
        <Text style={styles.cardContent}>{t('exposureAlert:closeContactCard:text')}</Text>
      </Card>
      {ready && !paused && status.state === StatusState.active && enabled && (
        <>
          <Spacing s={16} />
          <Card
            icon={
              <Image
                accessibilityIgnoresInvertColors
                style={styles.imageSize}
                {...styles.imageSize}
                source={require('assets/images/pause/image.png')}
              />
            }
            onPress={() => navigation.navigate('pause')}
            padding={{ r: 4 }}
          >
            <Text style={styles.cardTitle}>{t('exposureAlert:pause:text')}</Text>
          </Card>
        </>
      )}
      <Spacing s={16} />
      <Card onPress={() => navigation.navigate('howTheAppWorks')} padding={{ r: 4 }}>
        <Text style={styles.cardTitle}>{t('exposureAlert:howItWorksCard:text')}</Text>
      </Card>
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    ...text.defaultBold,
    lineHeight: scale(23)
  },
  cardContent: {
    ...text.default,
    lineHeight: scale(21)
  },
  imageSize: {
    width: 32,
    height: 32
  }
});
