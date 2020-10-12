import React, { FC } from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { AppIcons } from 'assets/icons';
import { Button } from 'components/atoms/button';
import { Card } from 'components/atoms/card';
import { colors, text } from 'theme';
import { ResponsiveImage } from 'components/atoms/responsive-image';
import { Spacing } from 'components/atoms/layout';
import { Toast } from 'components/atoms/toast';

const NotActiveImage = require('assets/images/phone/not-active.png');

export const NotEnabled: FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Card padding={{ v: 12 }}>
      <ResponsiveImage h={150} source={NotActiveImage} />
      <Spacing s={8} />
      <Toast
        color={colors.red}
        backgroundColor={colors.background.red}
        message={t('exposureAlert:notEnabled:title')}
        icon={<AppIcons.Alert width={24} height={24} />}
      />
      <Spacing s={16} />
      <Text style={text.default}>{t('exposureAlert:notEnabled:message')}</Text>
      <Spacing s={12} />
      <Button onPress={() => navigation.navigate('exposureAlertInformation', { embedded: true })}>
        {t('exposureAlert:notEnabled:button')}
      </Button>
    </Card>
  );
};
