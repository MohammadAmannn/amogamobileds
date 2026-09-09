import '../lib/polyfills';
import { Spinner } from '../components/ui/spinner';
import { ToastProvider } from '../components/ui/toast';
import { View } from '../components/ui/view';
import { useColorScheme } from '../hooks/useColorScheme';
import { AuthProvider, useAuth } from '../providers/auth-provider';
import { ThemeProvider } from '../providers/theme-provider';
import { ColorThemeProvider } from '../providers/color-theme-provider';
import { Colors } from '../theme/colors';
import { osName } from 'expo-device';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans/400Regular';
import { OpenSans_500Medium } from '@expo-google-fonts/open-sans/500Medium';

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

/**
 * The three route groups and the conditions under which each is reachable.
 *
 * `Stack.Protected` unmounts the screens whose guard is false and redirects
 * away from them, so this is not a cosmetic hide: with no session there is no
 * navigation path into `(tabs)` at all, deep link or otherwise. The guards are
 * mutually exclusive, so exactly one group is mounted at a time.
 *
 * Guards are the last line, not the only one — every table's RLS policies say
 * the same thing server-side, where a modified client cannot argue.
 */
function RootNavigator() {
  const colorScheme = useColorScheme() || 'light';
  const { session, profile, loading } = useAuth();

  // Session restore reads encrypted storage, which takes a beat. Rendering the
  // navigator before it resolves flashes the sign-in screen at a user who is
  // already signed in.
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size='lg' variant='circle' />
      </View>
    );
  }

  const isWeb = Platform.OS === 'web';
  const signedIn = isWeb ? true : !!session;
  // While the profile row is still being created by the trigger, `profile` is
  // null. Treating that as "not onboarded" would flash the onboarding screen,
  // so hold the user in the app until it arrives.
  const needsOnboarding = !isWeb && signedIn && profile?.onboarded === false;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={needsOnboarding}>
        <Stack.Screen name='(onboarding)' options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={signedIn && !needsOnboarding}>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />

        <Stack.Screen
          name='sheet'
          options={{
            headerShown: false,
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.4, 0.7, 1],
            contentStyle: {
              backgroundColor: isLiquidGlassAvailable()
                ? 'transparent'
                : colorScheme === 'dark'
                  ? Colors.dark.card
                  : Colors.light.card,
            },
            headerTransparent: Platform.OS === 'ios' ? true : false,
            headerLargeTitle: false,
            title: '',
            presentation:
              Platform.OS === 'ios'
                ? isLiquidGlassAvailable() && osName !== 'iPadOS'
                  ? 'formSheet'
                  : 'modal'
                : 'modal',
            sheetInitialDetentIndex: 0,
            headerStyle: {
              backgroundColor:
                Platform.OS === 'ios'
                  ? 'transparent'
                  : colorScheme === 'dark'
                    ? Colors.dark.card
                    : Colors.light.card,
            },
            headerBlurEffect: isLiquidGlassAvailable()
              ? undefined
              : colorScheme === 'dark'
                ? 'dark'
                : 'light',
          }}
        />
      </Stack.Protected>

      <Stack.Screen name='+not-found' />
    </Stack>
  );
}

/**
 * Status bar, Android navigation bar and root background, kept in step with the
 * theme.
 *
 * A component rather than inline in `RootLayout` so `useColorScheme()` resolves
 * *inside* `ThemeProvider`. Read above it and this would see the OS scheme
 * rather than the user's choice — which on native the global `Appearance`
 * override happens to paper over, but on web would leave the system chrome
 * stuck on the system theme.
 */
function SystemChrome() {
  const colorScheme = useColorScheme() || 'light';

  useEffect(() => {
    if (Platform.OS === 'android') {
      // `setButtonStyleAsync` was removed in expo-navigation-bar 57; `setStyle`
      // is the replacement and is synchronous.
      NavigationBar.setStyle(colorScheme === 'light' ? 'dark' : 'light');
    }
  }, [colorScheme]);

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === 'dark' ? Colors.dark.background : Colors.light.background
    );
  }, [colorScheme]);

  return (
    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} animated />
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium,
  });

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      if (!document.getElementById('open-sans-web-font')) {
        const link = document.createElement('link');
        link.id = 'open-sans-web-font';
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..600;1,300..600&display=swap';
        document.head.appendChild(link);
      }

      if (!document.getElementById('open-sans-global-css')) {
        const style = document.createElement('style');
        style.id = 'open-sans-global-css';
        style.textContent = `
          :root {
            --font-open-sans: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          * {
            font-family: var(--font-open-sans) !important;
            font-weight: 400 !important;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-open-sans) !important;
            font-weight: 500 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* `storage` makes the light/dark choice survive a restart. SecureStore
          has no web implementation, so on web this degrades to no persistence
          rather than erroring — the toggle itself still works there. */}
      <ThemeProvider storage={SecureStore}>
        <ColorThemeProvider>
          <SystemChrome />

          <AuthProvider>
            <ToastProvider>
              <RootNavigator />
            </ToastProvider>
          </AuthProvider>
        </ColorThemeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
