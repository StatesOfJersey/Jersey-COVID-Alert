import React from 'react';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';

import { Markdown } from 'components/atoms/markdown';
import { Spacing } from 'components/atoms/spacing';
import { SelectList } from 'components/atoms/select-list';

import { supportedLocales } from 'services/i18n/common';
import { Scrollable } from 'components/templates/scrollable';

interface LanguageType {
  value: string;
  label: string;
}

export const Language = () => {
  const { t, i18n } = useTranslation();

  const languages: LanguageType[] = Object.entries(supportedLocales).map(([langCode, langData]) => ({
    value: langCode,
    label: langData.name
  }));

  const currentLanguage = languages.find(({ value }) => value === i18n.language);

  return (
    <Scrollable heading={t('language:title')}>
      <Markdown style={{}}>{t('language:info')}</Markdown>
      <Spacing s={6} />
      <SelectList
        items={languages}
        selectedValue={currentLanguage!.value}
        onItemSelected={lang => {
          SecureStore.setItemAsync('appLanguage', lang);
          i18n.changeLanguage(lang);
        }}
      />
    </Scrollable>
  );
};
