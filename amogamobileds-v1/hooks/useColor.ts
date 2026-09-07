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
    // Only use custom theme accent if theme is not zinc and has a valid preview color
    if (currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview) {
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

