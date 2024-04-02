import {Theme} from '@react-navigation/native';
import {useTheme as useReactNavigationTheme} from '@react-navigation/native';

export type CustomTheme = Theme & {
  colors: Record<'focus' | 'warning', string>;
};

export type ColorNames = keyof Theme['colors'];

enum Colors {
  black = '#000000',
  darkGrey = '#2A2A2A',
  midGrey = '#6C6C6C',
  lightGrey = '#EDEDED',
  blue = '#2541FC',
  coral = '#FF4A6E',
  pink = '#DE00A5',
  lightPink = '#E28FC7',
  red = '#FF0000',
  white = '#FFFFFF',

  pacBlue = '#031f46',
}

export const darkTheme: CustomTheme = {
  dark: true,
  colors: {
    primary: Colors.lightPink,
    background: Colors.darkGrey,
    card: Colors.midGrey,
    text: Colors.white,
    border: Colors.lightGrey,
    notification: Colors.lightPink,
    focus: Colors.blue,
    warning: Colors.red,
  },
};

export const lightTheme: CustomTheme = {
  dark: false,
  colors: {
    primary: Colors.pacBlue,
    background: Colors.white,
    card: Colors.lightGrey,
    text: Colors.darkGrey,
    border: Colors.midGrey,
    notification: Colors.pink,
    focus: Colors.blue,
    warning: Colors.red,
  },
};

export const useTheme = useReactNavigationTheme as () => CustomTheme;
