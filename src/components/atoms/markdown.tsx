import React from 'react';
import { Text, Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import M from 'react-native-easy-markdown';

import { Link } from 'components/atoms/link';
import { text, colors } from 'theme';

interface Markdown {
  style?: object;
  markdownStyles?: object;
}

const MarkdownLink = (href: string, title: string, children: any, key: string, navigation: any) => {
  const isHttp = href.startsWith('http');

  if (!isHttp) {
    return (
      <Link key={key} onPress={() => navigation.navigate(href)}>
        {children}
      </Link>
    );
  }

  const isTel = href.startsWith('tel:');

  const handle = isTel
    ? Linking.openURL(href)
    : () => {
        WebBrowser.openBrowserAsync(href, {
          enableBarCollapsing: true,
          showInRecents: true
        });
      };

  return (
    // @ts-ignore
    <Text key={key} onPress={handle}>
      {children}
    </Text>
  );
};

const Markdown: React.FC<Markdown> = ({ style, markdownStyles = {}, children: C }) => {
  const navigation = useNavigation();

  const combinedStyles = {
    ...localMarkdownStyles,
    ...markdownStyles
  };

  return (
    <M
      markdownStyles={combinedStyles}
      style={style || styles.container}
      renderLink={(href, title, children, key) => MarkdownLink(href, title, children, key, navigation)}
    >
      {C}
    </M>
  );
};

const localMarkdownStyles = StyleSheet.create({
  h1: text.xlargeBold,
  h2: text.largeBold,
  h3: text.largeBold,
  h4: text.largeBold,
  h5: text.largeBold,
  h6: text.largeBold,
  text: {
    ...text.default,
    flexWrap: 'wrap',
    marginBottom: 8
  },
  block: {
    marginBottom: 8
  },
  link: {
    ...text.defaultBold,
    color: colors.main
  },
  list: {
    marginBottom: -12
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  listItemNumber: {
    ...text.largeBlack,
    color: colors.main,
    marginRight: 12
  },
  listItemContent: {
    flex: 1,
    marginTop: 12
  },
  strong: {
    ...text.defaultBold
  }
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1
  }
});

export { Markdown };
