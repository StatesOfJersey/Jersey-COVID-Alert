import React, { FC, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

import { PrivacyLink } from 'components/views/privacy-notice';
import { useApplication } from 'providers/context';
import { register } from 'services/api';
import { Spacing } from 'components/atoms/layout';
import { Markdown } from 'components/atoms/markdown';
import { Button } from 'components/atoms/button';
import { Quote } from 'components/molecules/quote';
import { Toast } from 'components/atoms/toast';
import { Scrollable } from 'components/templates/scrollable';
import { AppIcons, DataIcons } from 'assets/icons';
import { ListItem } from 'components/atoms/list-item';
import { ResponsiveImage } from 'components/atoms/responsive-image';

const DataProtectionImage = require('assets/images/dataprotection/dataprotection.png');

interface YourDataProps {
  navigation: StackNavigationProp<any>;
}

export const YourData: FC<YourDataProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const app = useApplication();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const onContinue = async () => {
    try {
      app.showActivityIndicator();
      await app.clearContext();
      const { token, refreshToken } = await register();

      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken, {});

      await app.setContext({
        user: {
          new: true,
          valid: true
        }
      });

      app.hideActivityIndicator();
      navigation.push('appUsage');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'appUsage' }]
      // });
    } catch (err) {
      app.hideActivityIndicator();
      console.log('Error registering device: ', err, typeof err, err.message);
      setRegisterError(t('common:networkError'));
    }
  };

  const errorToast = !!registerError && (
    <Toast type="error" icon={<AppIcons.Alert width={24} height={24} />} message={registerError} />
  );

  const listItems = [
    { id: 'noLocation', icon: <DataIcons.NoLocation width={48} height={48} />, label: t('yourData:list:noLocation') },
    { id: 'shield', icon: <DataIcons.Shield width={40} height={42} />, label: t('yourData:list:shield') },
    { id: 'noPerson', icon: <DataIcons.NoPerson width={48} height={48} />, label: t('yourData:list:noPerson') },
    { id: 'padlock', icon: <DataIcons.Padlock width={31} height={42} />, label: t('yourData:list:padlock') },
    { id: 'noId', icon: <DataIcons.NoId width={48} height={48} />, label: t('yourData:list:noId') },
    { id: 'trashcan', icon: <DataIcons.TrashCan width={27} height={38} />, label: t('yourData:list:trashCan') }
  ];

  return (
    <Scrollable toast={errorToast} heading={t('yourData:title')}>
      <ResponsiveImage h={168} source={DataProtectionImage} />
      <Spacing s={34} />
      {listItems.map(item => (
        <React.Fragment key={item.id}>
          <ListItem icon={item.icon} label={item.label} />
          <Spacing s={17} />
        </React.Fragment>
      ))}
      <Spacing s={20} />
      <Markdown markdownStyles={{ block: { marginBottom: 16 } }}>{t('yourData:info')}</Markdown>
      <Spacing s={8} />
      <PrivacyLink />
      <Spacing s={24} />
      <Quote text={t('yourData:viewInSettings')} />
      <Spacing s={36} />
      <Button onPress={onContinue}>{t('yourData:continue')}</Button>
    </Scrollable>
  );
};
