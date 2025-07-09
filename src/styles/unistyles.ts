import { StyleSheet } from 'react-native-unistyles';

const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: 'bold' as const,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal' as const,
    },
  },
} as const;

const darkTheme = {
  colors: {
    primary: '#0A84FF',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#333333',
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
} as const;

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

export const initializeUnistyles = () => {
  StyleSheet.configure({
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
    breakpoints,
    settings: {
      initialTheme: 'dark',
    },
  });
};