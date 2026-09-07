import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Platform } from 'react-native';
import { colorThemes, ColorThemeDefinition } from '@/theme/color-themes';

import { useColorScheme } from '@/hooks/useColorScheme';

export interface ColorThemeContextType {
  colorTheme: string;
  setColorTheme: (name: string) => void;
  resetColorTheme: () => void;
  currentTheme: ColorThemeDefinition;
  colorThemes: ColorThemeDefinition[];
}

export const DEFAULT_COLOR_THEME = 'zinc';
const STORAGE_KEY = 'amoga-color-theme';

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

// Helper to apply CSS custom properties on web
function applyTokensToWeb(theme: ColorThemeDefinition, isDark: boolean) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const root = document.documentElement;
  const tokens = isDark ? theme.tokens.dark : theme.tokens.light;

  for (const [prop, value] of Object.entries(tokens)) {
    root.style.setProperty(prop, value);
  }

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ColorThemeProvider({
  children,
  defaultTheme = DEFAULT_COLOR_THEME,
  isDark: propIsDark,
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  isDark?: boolean;
}) {
  const scheme = useColorScheme();
  const isDark = propIsDark !== undefined ? propIsDark : scheme === 'dark';

  const [colorTheme, _setColorTheme] = useState<string>(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || defaultTheme;
    }
    return defaultTheme;
  });

  const currentTheme = useMemo(
    () => colorThemes.find((t) => t.name === colorTheme) || colorThemes[0],
    [colorTheme]
  );

  useEffect(() => {
    applyTokensToWeb(currentTheme, isDark);
  }, [currentTheme, isDark]);

  const setColorTheme = useCallback((name: string) => {
    _setColorTheme(name);
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, name);
      } catch {}
    }
  }, []);

  const resetColorTheme = useCallback(() => {
    _setColorTheme(DEFAULT_COLOR_THEME);
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  const value = useMemo(
    () => ({
      colorTheme,
      setColorTheme,
      resetColorTheme,
      currentTheme,
      colorThemes,
    }),
    [colorTheme, setColorTheme, resetColorTheme, currentTheme]
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    const fallbackTheme = colorThemes.find((t) => t.name === DEFAULT_COLOR_THEME) || colorThemes[0];
    return {
      colorTheme: DEFAULT_COLOR_THEME,
      setColorTheme: () => {},
      resetColorTheme: () => {},
      currentTheme: fallbackTheme,
      colorThemes,
    };
  }
  return context;
}
