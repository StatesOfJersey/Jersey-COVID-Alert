import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useTranslation } from 'react-i18next';
import PushNotification from 'react-native-push-notification';
import { addDays } from 'date-fns';
import { useExposure } from 'react-native-exposure-notification-service';

interface State {
  paused: string | null;
  checked: boolean;
}

interface ReminderContextValue extends State {
  setReminder: (date: Date) => void;
  deleteReminder: () => void;
}

const initialState = {
  paused: null,
  checked: false
};

export const ReminderContext = createContext(initialState as ReminderContextValue);

export interface API {
  children: any;
}

const REMINDER_KEY = 'jers.reminder';
const REMINDER_ID = 12345;

export const Provider = ({ children }: API) => {
  const [state, setState] = useState<State>(initialState);
  const { t } = useTranslation();
  const exposure = useExposure();

  useEffect(() => {
    AsyncStorage.getItem(REMINDER_KEY).then(paused =>
      setState({
        paused,
        checked: true
      })
    );
  }, []);

  const deleteReminder = () => {
    PushNotification.cancelLocalNotifications({ id: String(REMINDER_ID) });
    AsyncStorage.removeItem(REMINDER_KEY);
    try {
      exposure.start();
    } catch (err) {
      console.log(err);
    }
    setState({
      ...state,
      paused: null
    });
  };

  const setReminder = (date: Date) => {
    const currentDate = new Date();
    const notificationDate = date < currentDate ? addDays(date, 1) : date;
    const timestamp = String(notificationDate.getTime());
    AsyncStorage.setItem(REMINDER_KEY, timestamp);
    try {
      exposure.pause();
    } catch (err) {
      console.log(err);
    }

    PushNotification.localNotificationSchedule({
      id: REMINDER_ID,
      title: t('reminder:title'),
      message: t('reminder:message'),
      date: notificationDate,
      repeatType: 'hour',
      // @ts-ignore
      allowWhileIdle: true
    });

    setState({
      ...state,
      paused: timestamp
    });
  };

  const value: ReminderContextValue = {
    ...state,
    setReminder,
    deleteReminder
  };

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
};

export const ReminderProvider = Provider;

export const useReminder = () => useContext(ReminderContext);
