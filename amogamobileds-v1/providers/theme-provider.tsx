import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
} from 'expo-router/react-navigation';
import { useMemo } from 'react';

import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../theme/colors';
import { Mode, ModeProvider, ModeStorage, useModeContext } from './mode-provider';
import { useColorTheme } from './color-theme-provider';

type Props = {
  children: React.ReactNode;
  /** Supply to persist the theme choice across launches. Omit and it resets. */
  storage?: ModeStorage;
  storageKey?: string;
  defaultMode?: Mode;
};

/**
 * Mounts `ModeProvider` — the app-wide source of truth for light/dark/system —
 * and maps the resolved scheme onto React Navigation's theme.
 */
export const ThemeProvider = ({
  children,
  storage,
  storageKey,
  defaultMode,
}: Props) => (
  <ModeProvider
    storage={storage}
    storageKey={storageKey}
    defaultMode={defaultMode}
  >
    <NavigationTheme>{children}</NavigationTheme>
  </ModeProvider>
);

const NavigationTheme = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const { currentTheme } = useColorTheme();
  const dynamicPrimary = currentTheme?.preview;

  const theme = useMemo(() => {
    if (colorScheme === 'dark') {
      return {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: dynamicPrimary || Colors.dark.primary,
          background: Colors.dark.background,
          card: Colors.dark.card,
          text: Colors.dark.text,
          border: Colors.dark.border,
          notification: Colors.dark.red,
        },
      };
    }

    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: dynamicPrimary || Colors.light.primary,
        background: Colors.light.background,
        card: Colors.light.card,
        text: Colors.light.text,
        border: Colors.light.border,
        notification: Colors.light.red,
      },
    };
  }, [colorScheme, dynamicPrimary]);

  return <RNThemeProvider value={theme}>{children}</RNThemeProvider>;
};

export function useTheme() {
  const modeContext = useModeContext();
  const colorScheme = useColorScheme();
  const isDark = (modeContext?.scheme || colorScheme) === 'dark';
  let primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;

  try {
    const { currentTheme } = useColorTheme();
    if (currentTheme?.preview) {
      primaryColor = currentTheme.preview;
    }
  } catch {}

  const baseColors = isDark ? Colors.dark : Colors.light;

  const toggleMode = () => {
    if (!modeContext) return;
    const current = modeContext.scheme;
    const next = current === 'dark' ? 'light' : 'dark';
    modeContext.setMode(next);
  };

  return {
    colors: {
      ...baseColors,
      primary: primaryColor,
      tint: primaryColor,
      tabIconSelected: primaryColor,
    },
    resolvedMode: (isDark ? 'dark' : 'light') as 'dark' | 'light',
    isDark,
    mode: modeContext?.mode || 'system',
    setMode: modeContext?.setMode || (() => {}),
    toggleMode,
  };
}
