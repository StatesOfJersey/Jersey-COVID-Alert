import React, { FC, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import countryCodes from 'assets/country-codes';
import { Dropdown } from 'components/atoms/dropdown';
import { text, colors } from 'theme';

const countryCodeItems = countryCodes.map(cc => ({
  ...cc,
  value: cc.iso
}));
countryCodeItems.splice(1, 0, {});

interface CountryCodeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CountryCodeDropdown: FC<CountryCodeDropdownProps> = ({ value, onValueChange }) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const items = !searchTerm
    ? countryCodeItems
    : countryCodeItems.filter(({ name }) => name && name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Dropdown
      label={t('phoneNumber:code:label')}
      items={items}
      value={value}
      onValueChange={onValueChange}
      placeholder={t('phoneNumber:code:placeholder')}
      search={{
        placeholder: t('phoneNumber:code:searchPlaceholder'),
        term: searchTerm,
        onChange: setSearchTerm,
        noResults: t('phoneNumber:code:noResults')
      }}
      itemRenderer={item => <ItemRenderer item={item} isSelected={value === item.value} />}
      display={({ code, name }) => `${name} (${code})`}
    />
  );
};

const ItemRenderer = (props: any) => {
  const { item, isSelected } = props;
  const { name, code } = item;

  const color = isSelected ? colors.darkBlue : colors.text;
  return (
    <View style={styles.textWrapper}>
      <Text style={[text.xlargeBold, { color }]}>
        {name}&nbsp;
        <Text style={[text.xlarge, { color }]}>({code})</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
});
