import React, { useState, useEffect, useCallback } from 'react';
import { NativeEventEmitter, ScrollView, Text, View, Alert, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import ExposureNotification, { useExposure, CloseContact } from 'react-native-exposure-notification-service';

import { Button } from 'components/atoms/button';

import { Basic } from 'components/templates/basic';

const emitter = new NativeEventEmitter(ExposureNotification);

export const Debug = () => {
  const exposure = useExposure();
  const [events, setLog] = useState([]);
  const [contacts, setContacts] = useState<CloseContact[] | null>(null);
  const [logData, setLogData] = useState<{ [key: string]: any } | null>(null);

  const loadData = useCallback(async () => {
    const _contacts = await exposure.getCloseContacts();

    const _logData = await exposure.getLogData();

    const runDates = _logData.lastRun;
    if (runDates && typeof runDates === 'string') {
      const dates = runDates
        .replace(/^,/, '')
        .split(',')
        .map(d => {
          return format(parseInt(d, 10), 'dd/MM HH:mm:ss');
        });
      _logData.lastRun = dates.join(', ');
    } else {
      _logData.lastRun ? format(_logData.lastRun, 'dd/MM HH:mm:ss') : 'Unknown';
    }

    setLogData(_logData);
    setContacts(_contacts);
  }, [setLogData, setContacts, exposure]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleEvent(ev: { status?: any; scheduledTask?: any } = {}) {
    // @ts-ignore
    events.push(ev);
    setLog([...events]);
  }

  const checkExposure = async () => {
    const subscription = emitter.addListener('exposureEvent', handleEvent);

    try {
      setLog([]);
      subscription.remove();
      emitter.removeListener('exposureEvent', handleEvent);
    } catch (e) {}
    await exposure.checkExposure(true, true);
  };

  useEffect(() => {
    // @ts-ignore
    function handleSilentEvent(ev) {
      if (ev.exposure || (ev.info && ev.info.includes('saveDailyMetric'))) {
        loadData();
      }
    }

    const subscription = emitter.addListener('exposureEvent', handleSilentEvent);

    return () => {
      try {
        subscription.remove();
      } catch (e) {
        console.log('Remove error', e);
      }
    };
  }, []);

  const deleteAllData = async () => {
    Alert.alert('Delete Data', 'Are you sure you want to delete all data.', [
      {
        text: 'No',
        onPress: () => console.log('No Pressed'),
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: async () => {
          setLog([]);
          await exposure.deleteAllData();
          setContacts([]);
          setLogData(null);
          await exposure.configure(); // reconfigure as delete all deletes sharedprefs on android
        },
        style: 'cancel'
      }
    ]);
  };

  const displayContact = (contact: { [key: string]: any }) => {
    const aDay = 24 * 60 * 60 * 1000;

    const contactDate = contact.exposureAlertDate - contact.daysSinceLastExposure * aDay;
    const displayData = [
      `When: ${format(contact.exposureAlertDate, 'dd/MM HH:mm')}`,
      `Last: ${format(contactDate, 'dd/MM')}`,
      `Score: ${contact.maxRiskScore}`,
      `Keys: ${contact.matchedKeyCount}`,
      `Durations: ${contact.attenuationDurations}`
    ];

    if (contact.maximumRiskScoreFullRange) {
      displayData.push(`maximumRiskScoreFullRange: ${contact.maximumRiskScoreFullRange}`);
      displayData.push(`riskScoreSumFullRange: ${contact.riskScoreSumFullRange}`);
      displayData.push(`customAttenuationDurations: ${contact.customAttenuationDurations}`);
    }

    if (contact.details) {
      contact.details.forEach((d: { [key: string]: any }) => {
        displayData.push(`When: ${format(d.date, 'dd/MM')}`);
        displayData.push(`Duration: ${d.duration}`);
        displayData.push(`Attentuation: ${d.attenuationValue}`);
        displayData.push(`Risk Score: ${d.totalRiskScore}`);
        displayData.push(`Attentuation Durations: ${d.attenuationDurations}`);
      });
    }
    Alert.alert('Exposure Details', displayData.join('\n'), [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
        style: 'cancel'
      }
    ]);
  };

  const listContactInfo = (contact: { [key: string]: any }) => {
    const aDay = 24 * 60 * 60 * 1000;

    const contactDate = contact.exposureAlertDate - contact.daysSinceLastExposure * aDay;
    return `When: ${format(contact.exposureAlertDate, 'dd/MM HH:mm')}, Last: ${format(contactDate, 'dd/MM')}, Score: ${
      contact.maxRiskScore
    }, Keys: ${contact.matchedKeyCount} ${contact.details ? ', *' : ''}`;
  };

  return (
    <Basic heading="Debug">
      <Button type="danger" onPress={checkExposure}>
        Check Exposure
      </Button>
      <Button type="danger" onPress={deleteAllData}>
        Delete All Data
      </Button>
      {logData && (
        <View style={styles.logScroll}>
          <ScrollView style={styles.contactsScroll}>
            {logData.installedPlayServicesVersion > 0 && (
              <Text>Play Services Version: {logData.installedPlayServicesVersion}</Text>
            )}
            {logData.nearbyApiSupported === true ||
              (logData.nearbyApiSupported === false && (
                <Text>Exposure API Supported: {`${logData.nearbyApiSupported}`}</Text>
              ))}
            {<Text>Last Index: {logData.lastIndex}</Text>}
            {<Text>Last Ran: {logData.lastRun}</Text>}
            {Boolean(logData.lastError && logData.lastError.length) && (
              <Text selectable={true}>Last Message: {`${logData.lastError}`}</Text>
            )}
            {Boolean(logData.lastApiError && logData.lastApiError.length) && (
              <Text selectable={true}>Last Exposure API Error: {`${logData.lastApiError}`}</Text>
            )}
          </ScrollView>
        </View>
      )}
      <View style={styles.contacts}>
        <Text style={styles.title}>Contacts</Text>
      </View>
      <ScrollView style={styles.contactsScroll}>
        {contacts &&
          contacts.map((c, index) => (
            <Text key={index} style={styles.row} onPress={() => displayContact(c)}>
              {listContactInfo(c)}
            </Text>
          ))}
      </ScrollView>
      <View style={styles.contacts}>
        <Text selectable={true} style={styles.title}>
          Logs
        </Text>
      </View>
      <ScrollView>
        <Text selectable={true}>{JSON.stringify(events, null, 2)}</Text>
      </ScrollView>
    </Basic>
  );
};

const styles = StyleSheet.create({
  stats: {
    marginTop: 24,
    paddingTop: 8,
    borderTopWidth: 1
  },
  contacts: {
    marginTop: 12,
    borderTopWidth: 1
  },
  logScroll: {
    height: 100
  },
  contactsScroll: {
    height: 200
  },
  title: {
    fontSize: 24,
    marginBottom: 12
  },
  row: {
    height: 28
  }
});
