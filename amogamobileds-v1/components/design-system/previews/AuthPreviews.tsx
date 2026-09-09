import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react-native';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/checkbox';
import { Separator } from '../../ui/separator';
import { Badge } from '../../ui/badge';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { useColorTheme } from '../../../providers/color-theme-provider';

// ---------------------------------------------------------------------------
// 1. Sign In Preview
// ---------------------------------------------------------------------------
export function SignInPreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const cardBg = isDark ? '#141721' : '#ffffff';
  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 16 }}>
      {/* Header */}
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: accent + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Lock size={20} color={accent} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Welcome back</Text>
        <Text style={{ fontSize: 12.5, color: muted }}>Sign in to continue to your account.</Text>
      </View>

      {/* Success banner */}
      {success && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#10b98120',
            borderWidth: 1,
            borderColor: '#10b98140',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
            Successfully authenticated!
          </Text>
        </View>
      )}

      {/* Form Fields */}
      <View style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Email</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Mail size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Password</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{ fontSize: 11.5, color: accent, fontWeight: '500' }}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Lock size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter password"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              {showPassword ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#94a3b8" />}
            </TouchableOpacity>
          </View>
        </View>

        <Button
          loading={loading}
          disabled={loading}
          onPress={handleSignIn}
          style={{ height: 42, borderRadius: 8, marginTop: 4 }}
        >
          Sign in
        </Button>
      </View>

      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 2 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: border }} />
        <Text style={{ fontSize: 11, color: muted }}>or continue with</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: border }} />
      </View>

      {/* Social Buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 38,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: isDark ? '#0c0f17' : '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 12.5, fontWeight: '600', color: text }}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 38,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: isDark ? '#0c0f17' : '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 12.5, fontWeight: '600', color: text }}>Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 12, color: muted }}>Don't have an account?</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: accent }}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 2. Sign Up Preview
// ---------------------------------------------------------------------------
export function SignUpPreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('AlexRivera2026!');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegistered(true);
      setTimeout(() => setRegistered(false), 3000);
    }, 1200);
  };

  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 14 }}>
      {/* Header */}
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: '#10b98120',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Sparkles size={20} color="#10b981" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Create an account</Text>
        <Text style={{ fontSize: 12.5, color: muted }}>Get started with your free 14-day trial.</Text>
      </View>

      {registered && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#10b98120',
            borderWidth: 1,
            borderColor: '#10b98140',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
            Account created! Confirmation sent.
          </Text>
        </View>
      )}

      {/* Form Fields */}
      <View style={{ gap: 11 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Full Name</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <User size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Work Email</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Mail size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Password</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Lock size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Create password"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Password Strength Indicators */}
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: '#10b981' }} />
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: '#10b981' }} />
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: '#10b981' }} />
            <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: border }} />
          </View>
          <Text style={{ fontSize: 10.5, color: '#10b981', marginTop: 1 }}>Strong password</Text>
        </View>

        {/* Terms checkbox */}
        <TouchableOpacity
          onPress={() => setAgree(!agree)}
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              borderWidth: 1.5,
              borderColor: agree ? accent : border,
              backgroundColor: agree ? accent : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {agree && <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>✓</Text>}
          </View>
          <Text style={{ fontSize: 12, color: muted, flex: 1 }}>
            I agree to the <Text style={{ color: accent }}>Terms of Service</Text> and{' '}
            <Text style={{ color: accent }}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>

        <Button
          loading={loading}
          disabled={loading || !agree}
          onPress={handleSignUp}
          style={{ height: 42, borderRadius: 8, marginTop: 4 }}
        >
          Create account
        </Button>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 12, color: muted }}>Already have an account?</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: accent }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 3. OTP Verification Preview
// ---------------------------------------------------------------------------
export function VerifyOtpPreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '7']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => setVerified(false), 3000);
    }, 1000);
  };

  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 16, alignItems: 'center' }}>
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: accent + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <ShieldCheck size={24} color={accent} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Two-factor auth</Text>
        <Text style={{ fontSize: 12.5, color: muted, textAlign: 'center' }}>
          Enter the 6-digit code sent to alex@example.com
        </Text>
      </View>

      {verified && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#10b98120',
            borderWidth: 1,
            borderColor: '#10b98140',
            width: '100%',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
            Code verified successfully!
          </Text>
        </View>
      )}

      {/* 6 OTP Input Boxes */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {otp.map((digit, idx) => (
          <View
            key={idx}
            style={{
              width: 44,
              height: 48,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: digit ? accent : border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: text }}>{digit}</Text>
          </View>
        ))}
      </View>

      <Button
        loading={loading}
        disabled={loading}
        onPress={handleVerify}
        style={{ width: '100%', height: 42, borderRadius: 8 }}
      >
        Verify Code
      </Button>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ fontSize: 12, color: muted }}>Didn't receive code?</Text>
        <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <RefreshCw size={12} color={accent} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: accent }}>Resend in 30s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// 4. Forgot Password Preview
// ---------------------------------------------------------------------------
export function ForgotPasswordPreview() {
  const isDark = useColorScheme() === 'dark';
  const { currentTheme } = useColorTheme();
  const accent = isDark
    ? currentTheme?.name && currentTheme.name !== 'zinc' && currentTheme.preview
      ? currentTheme.preview
      : '#818cf8'
    : currentTheme?.name && currentTheme.name !== 'zinc'
    ? currentTheme.preview
    : '#18181b';

  const [email, setEmail] = useState('alex.rivera@example.com');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const border = isDark ? '#232734' : '#e2e8f0';
  const text = isDark ? '#f8fafc' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#64748b';

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  return (
    <View style={{ width: '100%', maxWidth: 360, gap: 16 }}>
      <View style={{ gap: 4, alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: '#f59e0b20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <KeyRound size={20} color="#f59e0b" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: text }}>Forgot password?</Text>
        <Text style={{ fontSize: 12.5, color: muted, textAlign: 'center' }}>
          No worries, we'll send you reset instructions.
        </Text>
      </View>

      {sent && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#10b98120',
            borderWidth: 1,
            borderColor: '#10b98140',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
            Reset instructions sent to your email!
          </Text>
        </View>
      )}

      <View style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>Email address</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
              backgroundColor: isDark ? '#0c0f17' : '#f8fafc',
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <Mail size={15} color="#94a3b8" />
            <TextInput
              style={{ flex: 1, fontSize: 13, color: text, padding: 0 }}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <Button
          loading={loading}
          disabled={loading}
          onPress={handleSend}
          style={{ height: 42, borderRadius: 8, marginTop: 4 }}
        >
          Send reset instructions
        </Button>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}
      >
        <Text style={{ fontSize: 12.5, fontWeight: '600', color: accent }}>← Back to sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
