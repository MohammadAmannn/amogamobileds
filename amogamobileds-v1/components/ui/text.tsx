import { useColor } from '../../hooks/useColor';
import { FONT_SIZE } from '../../theme/globals';
import React, { forwardRef } from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  Platform,
} from 'react-native';

type TextVariant =
  'body' | 'title' | 'subtitle' | 'caption' | 'heading' | 'link';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
}

const headingVariants: TextVariant[] = ['heading', 'title', 'subtitle'];

const OPEN_SANS_REGULAR = Platform.select({
  web: 'var(--font-open-sans), "Open Sans", sans-serif',
  default: 'OpenSans_400Regular',
});

const OPEN_SANS_MEDIUM = Platform.select({
  web: 'var(--font-open-sans), "Open Sans", sans-serif',
  default: 'OpenSans_500Medium',
});

export const Text = React.memo(
  forwardRef<RNText, TextProps>(
    (
      { variant = 'body', lightColor, darkColor, style, children, ...props },
      ref
    ) => {
      const textColor = useColor('text', {
        light: lightColor,
        dark: darkColor,
      });
      const mutedColor = useColor('textMuted');
      const defaultAccessibilityRole = headingVariants.includes(variant)
        ? 'header'
        : undefined;

      const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
          color: textColor,
          fontFamily: OPEN_SANS_REGULAR,
          fontWeight: '400',
        };

        switch (variant) {
          case 'heading':
            return {
              ...baseStyle,
              fontSize: 26,
              fontFamily: OPEN_SANS_MEDIUM,
              fontWeight: '500',
            };
          case 'title':
            return {
              ...baseStyle,
              fontSize: 22,
              fontFamily: OPEN_SANS_MEDIUM,
              fontWeight: '500',
            };
          case 'subtitle':
            return {
              ...baseStyle,
              fontSize: 18,
              fontFamily: OPEN_SANS_REGULAR,
              fontWeight: '400',
            };
          case 'caption':
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontFamily: OPEN_SANS_REGULAR,
              fontWeight: '400',
              color: mutedColor,
            };
          case 'link':
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontFamily: OPEN_SANS_REGULAR,
              fontWeight: '400',
              textDecorationLine: 'underline',
            };
          default: // 'body'
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontFamily: OPEN_SANS_REGULAR,
              fontWeight: '400',
            };
        }
      };

      return (
        <RNText
          ref={ref}
          style={[getTextStyle(), style]}
          accessibilityRole={defaultAccessibilityRole}
          {...props}
        >
          {children}
        </RNText>
      );
    }
  )
);

Text.displayName = 'Text';
