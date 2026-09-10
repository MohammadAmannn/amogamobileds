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
  const modeContext = useModeContext();
  const colorScheme = useColorScheme();
  const isDark = (modeContext?.scheme || colorScheme) === 'dark';
  
  let dynamicPrimary: string | undefined = undefined;
  try {
    const colorThemeCtx = useColorTheme();
    dynamicPrimary = colorThemeCtx?.currentTheme?.preview;
  } catch {}

  const theme = useMemo(() => {
    if (isDark) {
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
  }, [isDark, dynamicPrimary]);

  return <RNThemeProvider value={theme}>{children}</RNThemeProvider>;
};

export function useTheme() {
  const modeContext = useModeContext();
  const colorScheme = useColorScheme();
  const isDark = (modeContext?.scheme || colorScheme) === 'dark';

  let currentTheme: any = undefined;
  try {
    const colorCtx = useColorTheme();
    currentTheme = colorCtx?.currentTheme;
  } catch {}

  const baseColors = isDark ? Colors.dark : Colors.light;
  
  // Resolve primary accent color
  let primaryColor = currentTheme?.preview || currentTheme?.colors?.[0] || (isDark ? '#a855f7' : '#7c3aed');
  if (isDark && (primaryColor === '#18181b' || primaryColor === '#000000')) {
    primaryColor = '#a855f7';
  }

  const themeBg = isDark ? '#09090b' : '#ffffff';
  const themeCard = isDark ? '#18181b' : '#f8fafc';
  const themeBorder = isDark ? '#27272a' : '#e2e8f0';
  const themeFg = isDark ? '#f8fafc' : '#0f172a';
  const themeMutedFg = isDark ? '#94a3b8' : '#64748b';

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
      background: themeBg,
      card: themeCard,
      border: themeBorder,
      foreground: themeFg,
      text: themeFg,
      mutedForeground: themeMutedFg,
    },
    resolvedMode: (isDark ? 'dark' : 'light') as 'dark' | 'light',
    isDark,
    mode: modeContext?.mode || 'system',
    setMode: modeContext?.setMode || (() => {}),
    toggleMode,
  };
}
