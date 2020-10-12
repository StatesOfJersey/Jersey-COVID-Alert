const teal = '#3A7B7F';
const red = '#be3427';
const white = '#FFFFFF';
const darkBlue = '#353B79';
const darkBlueGrey = '#252954';
const lightGray = '#B2B2B2';
const whiteSmoke = '#f5f5f5';
const separatorGray = '#EAEAEA';
const activeRed = '#C84B28';
const lightRed = '#FEEACE';
const lightOrange = '#EF8754';

export const colors = {
  separatorGray,
  activeRed,
  lightRed,
  whiteSmoke,
  yellow: '#FFEA0C', // review & remove,
  lightYellow: '#fff37a',
  mildYellow: '#fff16f',
  darkerYellow: '#FFDA1A', // review & merge to yellow
  orange: '#FF8248', // review as used only in toast
  lightOrange,
  white,
  red,
  teal,
  darkBlue,
  main: darkBlue,
  lightBlue: '#1E407B',
  lightGray,
  darkGreen: '#03854333',
  quotedText: '#1b0802',
  gray: '#F5F5F5', // review - only input
  darkGray: '#96989B', // review - only input
  dot: lightGray,
  selectedDot: '#2E2E2E',
  success: '#047a3b',
  text: '#2e2e2e',
  midGray: '#4e4e4e',
  midOrange: '#ffebcf',
  buttons: {
    default: {
      text: white,
      background: darkBlue,
      shadow: darkBlueGrey
    },
    secondary: {
      text: darkBlue,
      background: white,
      shadow: lightGray
    },
    danger: {
      text: white,
      background: '#be3427',
      shadow: '#6e0221'
    },
    empty: {
      text: darkBlue,
      background: white,
      shadow: '#D3D0D0'
    }
  },
  background: {
    red: '#F6E1DF',
    default: white,
    cards: '#FAFAFA',
    chart: '#f5f5f8',
    warning: '#BE3427'
  },
  gradients: {
    defaultOrange: ['rgb(255,196,65)', 'rgb(243,111,86)']
  }
};
