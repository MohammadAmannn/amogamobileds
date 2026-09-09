import { useColor } from '../../hooks/useColor';
import { useColorScheme } from '../../hooks/useColorScheme';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

export function AuthScreen({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const bg = useColor('background');
  const cardBg = useColor('card');
  const borderColor = useColor('border');
  const textColor = useColor('text');
  const textMuted = useColor('textMuted');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh' as any,
        paddingHorizontal: 16,
        paddingVertical: 32,
      }}
    >
      <ScrollView
        style={{ width: '100%', maxWidth: 440 }}
        contentContainerStyle={{
          paddingVertical: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Brand Logo & Header */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: 24,
            gap: 8,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#059669',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
            } as any}
          >
            <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '700' }}>⌘</Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: textMuted,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Amoga Design System
          </Text>
        </View>

        {/* Elevated Card Container */}
        <View
          style={{
            width: '100%',
            backgroundColor: cardBg,
            borderRadius: 16,
            borderWidth: 1,
            borderColor,
            padding: 32,
            gap: 20,
            boxShadow: isDark
              ? '0 20px 40px rgba(0,0,0,0.5)'
              : '0 12px 32px rgba(0,0,0,0.06)',
          } as any}
        >
          {/* Title & Subtitle */}
          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: textColor,
                letterSpacing: -0.3,
              }}
            >
              {title}
            </Text>
            {subtitle && (
              <Text style={{ fontSize: 13, color: textMuted, lineHeight: 18 }}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Form Fields */}
          <View style={{ gap: 16 }}>{children}</View>

          {/* Footer */}
          {footer && (
            <View
              style={{
                gap: 12,
                marginTop: 4,
                borderTopWidth: 1,
                borderTopColor: borderColor + '40',
                paddingTop: 16,
              }}
            >
              {footer}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
