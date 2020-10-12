import en from 'assets/lang/en.json';
import pl from 'assets/lang/pl.json';
import pt from 'assets/lang/pt.json';
import bg from 'assets/lang/bg.json';
import ro from 'assets/lang/ro.json';

export const fallback = 'en';
export const defaultNamespace = 'common';
export const namespaces = ['common'];

export const supportedLocales: Record<string, any> = {
  en: {
    name: 'English',
    ...en
  },
  pl: {
    name: 'Polish',
    ...pl
  },
  pt: {
    name: 'Portuguese',
    ...pt
  },
  bg: {
    name: 'Bulgarian',
    ...bg
  },
  ro: {
    name: 'Romanian',
    ...ro
  }
};
