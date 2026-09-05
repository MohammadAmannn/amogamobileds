import React, { useState } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MediaPicker, type MediaAsset } from '@/components/ui/media-picker';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useToast } from '@/components/ui/toast';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useColor } from '@/hooks/useColor';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

const initialsOf = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';

export default function WebSettingsScreen() {
  const { user, profile, signOut } = useAuth();
  const { update, saving } = useProfile();
  const { upload, uploading } = useAvatarUpload();
  const toast = useToast();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [invoking, setInvoking] = useState(false);
  const [functionResult, setFunctionResult] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const background = useColor('background');
  const textColor = useColor('text');
  const textMuted = useColor('textMuted');
  const borderColor = useColor('border');

  const changeAvatar = async (assets: MediaAsset[]) => {
    const asset = assets[0];
    if (!asset) return;

    const url = await upload(asset);
    if (!url) {
      toast.error('Could not upload', 'Check the avatars bucket policies.');
      return;
    }

    if (await update({ avatar_url: url })) {
      toast.success('Avatar updated');
    }
  };

  const saveName = async () => {
    if (await update({ display_name: displayName.trim() || null })) {
      toast.success('Saved');
    }
  };

  const invokeFunction = async () => {
    setInvoking(true);
    setFunctionResult(null);

    const { data, error } = await supabase.functions.invoke('hello-world');
    setInvoking(false);

    if (error) {
      toast.error('Function failed', 'Deploy it: npm run functions:deploy');
      return;
    }

    setFunctionResult(JSON.stringify(data, null, 2));
  };

  const deleteAccount = async () => {
    setConfirmingDelete(false);
    const { error } = await supabase.functions.invoke('delete-account');

    if (error) {
      toast.error('Could not delete', 'Deploy it: npm run functions:deploy');
      return;
    }

    await signOut();
  };

  const nameChanged = displayName.trim() !== (profile?.display_name ?? '');

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 36,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: 680, gap: 20 }}>
          {/* Header */}
          <View style={{ gap: 4, marginBottom: 4 }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '800',
                color: textColor,
                letterSpacing: -0.3,
              }}
            >
              Settings
            </Text>
            <Text style={{ fontSize: 13, color: textMuted }}>
              Manage your profile, preferences, and application settings.
            </Text>
          </View>

          {/* Profile Card */}
          <Card style={{ padding: 24, gap: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: textColor }}>
              Profile Information
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Avatar size={72}>
                {profile?.avatar_url ? (
                  <AvatarImage source={{ uri: profile.avatar_url }} />
                ) : (
                  <AvatarFallback>
                    {initialsOf(profile?.display_name ?? user?.email ?? '')}
                  </AvatarFallback>
                )}
              </Avatar>

              <View style={{ gap: 6, flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: textColor }}>
                  {profile?.display_name ?? 'No display name'}
                </Text>
                <Text style={{ fontSize: 12, color: textMuted }}>{user?.email}</Text>
                <View style={{ width: 140, marginTop: 4 }}>
                  <MediaPicker
                    mediaType='image'
                    variant='outline'
                    size='sm'
                    buttonText='Change photo'
                    showPreview={false}
                    disabled={uploading || saving}
                    onSelectionChange={changeAvatar}
                    onError={(message) => toast.error('Picker error', message)}
                  />
                </View>
              </View>
            </View>

            <Separator />

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: textColor }}>
                Display Name
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="Enter your name"
                    value={displayName}
                    onChangeText={setDisplayName}
                    maxLength={64}
                  />
                </View>
                <Button
                  size="default"
                  disabled={!nameChanged || saving}
                  loading={saving}
                  onPress={saveName}
                >
                  Save
                </Button>
              </View>
            </View>
          </Card>

          {/* Appearance Card */}
          <Card style={{ padding: 24, gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: textColor }}>
              Appearance
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ gap: 2, flex: 1, paddingRight: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>
                  Theme Mode
                </Text>
                <Text style={{ fontSize: 12, color: textMuted }}>
                  Toggle between Light, Dark, or System system appearance.
                </Text>
              </View>
              <ModeToggle />
            </View>
          </Card>

          {/* Edge Function Test Card */}
          <Card style={{ padding: 24, gap: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ gap: 2, flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: textColor }}>
                  Supabase Edge Functions
                </Text>
                <Text style={{ fontSize: 12, color: textMuted }}>
                  Test authenticated calls to server-side functions.
                </Text>
              </View>
              <Button
                size="sm"
                variant="outline"
                loading={invoking}
                disabled={invoking}
                onPress={invokeFunction}
              >
                Invoke hello-world
              </Button>
            </View>

            {functionResult && (
              <View
                style={{
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: borderColor + '30',
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    color: textColor,
                  }}
                >
                  {functionResult}
                </Text>
              </View>
            )}
          </Card>

          {/* Account / Danger Zone */}
          <Card style={{ padding: 24, gap: 14 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: textColor }}>
              Account & Security
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: textColor }}>
                  Sign Out
                </Text>
                <Text style={{ fontSize: 12, color: textMuted }}>
                  Log out of your account on this browser.
                </Text>
              </View>
              <SignOutButton />
            </View>

            <Separator />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ gap: 2, flex: 1, paddingRight: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#ef4444' }}>
                  Delete Account
                </Text>
                <Text style={{ fontSize: 12, color: textMuted }}>
                  Permanently delete your profile and all associated data.
                </Text>
              </View>
              <Button
                variant="destructive"
                size="sm"
                onPress={() => setConfirmingDelete(true)}
              >
                Delete Account
              </Button>
            </View>
          </Card>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        isVisible={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        title="Delete your account?"
        description="Your profile, tasks and uploaded files are removed. This cannot be undone."
        confirmText="Delete"
        cancelText="Keep it"
        onConfirm={deleteAccount}
        onCancel={() => setConfirmingDelete(false)}
      />
    </View>
  );
}
