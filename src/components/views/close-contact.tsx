import React, { FC } from 'react';
import { StyleSheet, Text, Linking, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import PushNotification from 'react-native-push-notification';
import * as WebBrowser from 'expo-web-browser';

import { Button } from 'components/atoms/button';
import { Card } from 'components/atoms/card';
import { Markdown } from 'components/atoms/markdown';
import { Scrollable } from 'components/templates/scrollable';
import { Spacing } from 'components/atoms/layout';
import { useApplication } from 'providers/context';
import { useSettings } from 'providers/settings';

import Icons, { BubbleIcons } from 'assets/icons';
import { colors, text } from 'theme';

export const CloseContact: FC<any> = ({ route }) => {
  const { t } = useTranslation();
  const { callBackData } = useApplication();
  const { exposedTodo } = useSettings();

  const todoList = exposedTodo;

  const type = route.params && route.params.info;

  PushNotification.setApplicationIconBadgeNumber(0);

  return (
    <Scrollable heading={type ? t('closeContact:infoTitle') : t('closeContact:title')}>
      <Text style={text.largeBold}>{type ? t('closeContact:intro') : t('closeContact:alertintro')}</Text>
      {!callBackData && !type && (
        <>
          <Spacing s={16} />
          <Text style={text.default}>{t('closeContact:alertWithoutCallback:text')}</Text>
          <Spacing s={16} />
          <Card
            onPress={() => Linking.openURL(`tel:${t('closeContact:alertWithoutCallback:number')}`)}
            icon={<BubbleIcons.PhoneCall width={56} height={56} />}
          >
            <Text style={text.largeBlack}>{t('closeContact:alertWithoutCallback:header')}</Text>
            <Text style={styles.default}>{t('closeContact:alertWithoutCallback:number')}</Text>
          </Card>
        </>
      )}
      {callBackData && !type && (
        <>
          <Spacing s={16} />
          <Text style={text.default}>
            You previously requested a call from Contact Tracing – the team will call you as soon as possible.{' '}
          </Text>
        </>
      )}
      {type && (
        <>
          <Spacing s={16} />
          <Card
            hideArrow
            onPress={() =>
              WebBrowser.openBrowserAsync(t('closeContact:howToSelfIsolateLinkUrl'), {
                enableBarCollapsing: true,
                showInRecents: true
              })
            }
            icon={<Icons.Logo style={styles.linkIcon} width={56} height={56} />}
          >
            <View style={styles.isolateLinkContainer}>
              <Text style={styles.isolateLink}>{t('closeContact:howToSelfIsolateLinkTitle')}</Text>
            </View>
          </Card>
        </>
      )}
      <Spacing s={16} />
      {type && (
        <>
          <Text style={styles.default}>{t('closeContact:callBackIntro')}</Text>
          <Spacing s={22} />
          <Card
            onPress={() => Linking.openURL(`tel:${t('closeContact:supportCallNumber')}`)}
            icon={<BubbleIcons.PhoneCall width={56} height={56} />}
          >
            <Text style={text.largeBlack}>{t('closeContact:callBackHeader')}</Text>
            <Text style={styles.default}>{t('closeContact:callBackNumber')}</Text>
          </Card>
          <Spacing s={22} />
        </>
      )}
      <Markdown>{t('closeContact:todo:intro')}</Markdown>
      <Spacing s={12} />
      <Markdown
        markdownStyles={{
          listItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12
          },
          listItemContent: {
            flex: 1
          }
        }}
      >
        {todoList}
      </Markdown>
      <Spacing s={24} />
      {!type && callBackData && (
        <>
          <Text style={styles.default}>
            {t('closeContact:alertWithCallback:text')}
            <Text
              style={styles.inlineLink}
              onPress={() => Linking.openURL(`tel:${t('closeContact:supportCallNumber')}`)}
            >
              {' '}
              {t('closeContact:alertWithCallback:link')}
            </Text>
          </Text>
          <Spacing s={12} />
        </>
      )}
      {!type && !callBackData && (
        <>
          <Text style={styles.default}>{t('closeContact:supportIntro1NoCallback')}</Text>
        </>
      )}
      {type && !callBackData && (
        <>
          <Text style={styles.default}>{t('closeContact:supportIntro1')}</Text>
        </>
      )}
      {type && callBackData && (
        <>
          <Text style={styles.default}>{t('closeContact:supportIntro1')}</Text>
        </>
      )}
      <Spacing s={12} />
      <Text style={styles.default}>{t('closeContact:supportIntro2')}</Text>
      <Spacing s={24} />
      <Button
        width="100%"
        onPress={() =>
          WebBrowser.openBrowserAsync(t('closeContact:guidanceAndAdviceLinkUrl'), {
            enableBarCollapsing: true,
            showInRecents: true
          })
        }
      >
        {t('closeContact:guidanceAndAdviceLinkTitle')}
      </Button>
      <Spacing s={32} />
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  linkIcon: {
    marginRight: 0
  },
  content: {
    flex: 1
  },
  default: {
    ...text.default,
    lineHeight: 21
  },
  isolateLink: {
    flex: 1,
    ...text.defaultBold,
    color: colors.main
  },
  isolateLinkContainer: {
    alignItems: 'flex-start'
  },
  inlineLink: {
    ...text.defaultBold,
    color: colors.main
  }
});
