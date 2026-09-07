import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/theme/colors';
import { useColorTheme } from '@/providers/color-theme-provider';

export function useColor(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
  props?: { light?: string; dark?: string }
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props?.[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  try {
    const { currentTheme } = useColorTheme();
    if (currentTheme?.preview) {
      // In dark mode, if the theme is zinc, use dark system tokens so text/buttons are readable on dark bg
      if (theme === 'dark' && currentTheme.name === 'zinc') {
        return Colors.dark[colorName];
      }
      if (
        colorName === 'primary' ||
        colorName === 'tint' ||
        colorName === 'tabIconSelected' ||
        colorName === 'ring'
      ) {
        return currentTheme.preview;
      }
    }
  } catch {}

  return Colors[theme][colorName];
}

