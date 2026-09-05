import { Ionicons } from '@expo/vector-icons';
import type { Provider } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useToast } from '@/components/ui/toast';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const getRedirectUri = () => {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';
  }
  return makeRedirectUri({
    scheme: 'amogamobileds-v1',
  });
};

const PROVIDERS: {
  provider: Provider;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { provider: 'google', label: 'Continue with Google', icon: 'logo-google' },
  { provider: 'apple', label: 'Continue with Apple', icon: 'logo-apple' },
  { provider: 'github', label: 'Continue with GitHub', icon: 'logo-github' },
];

/**
 * Browser-based OAuth, one code path for every provider.
 */
export function OAuthButtons({ disabled }: { disabled?: boolean }) {
  const [pending, setPending] = useState<Provider | null>(null);
  const toast = useToast();
  const primary = useColor('primary');

  const signInWith = async (provider: Provider) => {
    setPending(provider);

    try {
      const redirectTo = getRedirectUri();
      console.log('OAuth Redirect URL:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No authorization URL returned');

      if (Platform.OS === 'web') {
        // On web the browser navigates and `detectSessionInUrl` finishes the
        // job on the way back. `assign` rather than setting `location.href`:
        // the React Compiler treats the assignment as mutating a value it does
        // not own.
        globalThis.location.assign(data.url);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      console.log('WebBrowser Result:', JSON.stringify(result));

      if (result.type !== 'success' || !result.url) {
        return;
      }

      const { queryParams } = Linking.parse(result.url);
      const code = typeof queryParams?.code === 'string' ? queryParams.code : null;

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
      } else {
        const fragment = result.url.split('#')[1];
        if (fragment) {
          const params = new URLSearchParams(fragment);
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          if (access_token && refresh_token) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (setSessionError) throw setSessionError;
          }
        }
      }
    } catch (caught) {
      console.error('OAuth Sign-in Error:', caught);
      toast.error('Sign-in failed', (caught as Error).message);
    } finally {
      setPending(null);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      {PROVIDERS.map(({ provider, label, icon }) => (
        <Button
          key={provider}
          variant='outline'
          disabled={disabled || pending !== null}
          loading={pending === provider}
          onPress={() => signInWith(provider)}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Ionicons name={icon} size={18} color={primary} />
            <Text style={{ fontWeight: '500', color: primary }}>{label}</Text>
          </View>
        </Button>
      ))}
    </View>
  );
}
