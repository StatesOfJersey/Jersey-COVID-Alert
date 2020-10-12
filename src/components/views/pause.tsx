import React, { useState } from 'react';
import { StyleSheet, Image, Text, View, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addHours, format } from 'date-fns';

import { useReminder } from 'providers/reminder';
import { colors, text } from 'theme';
import { Scrollable } from '../templates/scrollable';
import { Spacing } from '../atoms/spacing';
import { Button } from '../atoms/button';
import { Markdown } from '../atoms/markdown';
import { markDownStyles } from './privacy-notice';

const getClosestInterval = (interval: number, date = new Date()) => {
  const ms = 1000 * 60 * interval;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
};

const createInterval = (interval: number) => {
  const date = addHours(getClosestInterval(15, new Date()), interval);
  const label = format(date, 'HH:mm');
  return {
    label,
    date
  };
};

export const Pause = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { setReminder } = useReminder();
  const [show, setShow] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<Date | null>(null);
  const [selectedIntervalOption, setSelectedIntervalOption] = useState<number | null>(null);

  return (
    <Scrollable
      safeArea={false}
      heading={t('pause:title')}
      accessibilityRefocus
      backgroundColor={colors.background.cards}
    >
      <Markdown style={styles.markdownContainer} markdownStyles={markDownStyles}>
        {t('pause:introduction')}
      </Markdown>
      <Spacing s={30} />
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedIntervalOption(null);
          setShow(true);
        }}
      >
        <View>
          <Text style={text.defaultBold}>{t('pause:dropdown:label')}</Text>
          <Spacing s={30} />
          <View style={[styles.card, styles.dropdown, selectedInterval ? styles.selected : null]}>
            <Text style={[text.defaultBold, { flex: 1 }]}>
              {selectedInterval ? format(selectedInterval, 'HH:mm') : t('pause:dropdown:placeholder')}
            </Text>
            <Image
              accessibilityIgnoresInvertColors={false}
              source={require('../../assets/images/chevron-down/image.png')}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Spacing s={30} />
      <Text style={text.defaultBold}>{t('pause:alternativeTime')}</Text>
      <Spacing s={30} />
      <View style={styles.row}>
        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedInterval(null);
            setSelectedIntervalOption(1);
          }}
        >
          <View style={[styles.card, styles.intervals, selectedIntervalOption === 1 ? styles.selected : null]}>
            <Text style={text.defaultBold}>{t('pause:intervals:4:label')}</Text>
            <Text style={text.defaultBold}>{createInterval(4).label}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedInterval(null);
            setSelectedIntervalOption(2);
          }}
        >
          <View style={[styles.card, styles.intervals, selectedIntervalOption === 2 ? styles.selected : null]}>
            <Text style={text.defaultBold}>{t('pause:intervals:8:label')}</Text>
            <Text style={text.defaultBold}>{createInterval(8).label}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedInterval(null);
            setSelectedIntervalOption(3);
          }}
        >
          <View
            style={[
              styles.card,
              styles.intervals,
              { marginRight: 0 },
              selectedIntervalOption === 3 ? styles.selected : null
            ]}
          >
            <Text style={text.defaultBold}>{t('pause:intervals:12:label')}</Text>
            <Text style={[text.defaultBold, styles.lightGray]}>{createInterval(12).label}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Spacing s={30} />
      <Button
        disabled={!selectedIntervalOption && !selectedInterval}
        onPress={() => {
          if (selectedInterval) {
            setReminder(selectedInterval);
          } else if (selectedIntervalOption) {
            setReminder(createInterval(selectedIntervalOption * 4).date);
          }
          navigation.goBack();
        }}
      >
        {t('pause:button:label')}
      </Button>
      <Spacing s={30} />
      <DateTimePickerModal
        isVisible={show}
        mode="time"
        date={selectedInterval || getClosestInterval(15)}
        onConfirm={e => {
          setSelectedInterval(e);
          setShow(false);
        }}
        onCancel={() => setShow(false)}
        headerTextIOS={t('pause:modalHeader')}
      />
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderColor: colors.darkGray,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4
  },
  dropdown: {
    flexDirection: 'row',
    maxWidth: 120,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent'
  },
  intervals: {
    flex: 1,
    marginRight: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent'
  },
  lightGray: {
    color: colors.midGray
  },
  selected: {
    backgroundColor: colors.midOrange,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.activeRed
  },
  markdownContainer: {
    backgroundColor: colors.background.cards
  }
});
