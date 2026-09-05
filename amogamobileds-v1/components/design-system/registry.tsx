import React, { useState } from 'react';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputOTP } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useToast } from '@/components/ui/toast';
import { Mail, Lock, Heart, Check, Sparkles, AlertCircle, Search, User } from 'lucide-react-native';

export type ComponentCategory = 'Primitives' | 'Inputs' | 'Feedback' | 'Layout' | 'Display';

export interface ComponentItem {
  id: string;
  name: string;
  file: string;
  category: ComponentCategory;
  tag: string;
  description: string;
  Preview: React.ComponentType;
}

// 1. Button Preview
function ButtonPreview() {
  const [loading, setLoading] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>VARIANTS</Text>
      <View style={{ gap: 8 }}>
        <Button variant="default" onPress={() => {}}>Default Primary</Button>
        <Button variant="secondary" onPress={() => {}}>Secondary Button</Button>
        <Button variant="outline" onPress={() => {}}>Outline Button</Button>
        <Button variant="ghost" onPress={() => {}}>Ghost Button</Button>
        <Button variant="destructive" onPress={() => {}}>Destructive Action</Button>
      </View>

      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>SIZES</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" variant="default">Small</Button>
        <Button size="default" variant="default">Default</Button>
        <Button size="lg" variant="default">Large</Button>
      </View>

      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>STATES & ICONS</Text>
      <View style={{ gap: 8 }}>
        <Button
          variant="default"
          loading={loading}
          onPress={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          {loading ? 'Processing...' : 'Tap for Loading State'}
        </Button>
        <Button variant="outline" icon={Sparkles}>With Sparkles Icon</Button>
        <Button variant="default" disabled>Disabled Button</Button>
      </View>
    </View>
  );
}

// 2. Input Preview
function InputPreview() {
  const [val, setVal] = useState('');
  const [pwd, setPwd] = useState('');
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>TEXT INPUTS</Text>
      <Input
        label="Standard Input"
        placeholder="Type something..."
        value={val}
        onChangeText={setVal}
      />
      <Input
        label="With Leading Icon"
        icon={Mail}
        placeholder="your.email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Password Input"
        icon={Lock}
        placeholder="Enter your secret"
        secureTextEntry
        value={pwd}
        onChangeText={setPwd}
      />
      <Input
        label="With Error State"
        placeholder="Invalid field..."
        error="This field is required and cannot be empty"
        value=""
        onChangeText={() => {}}
      />
    </View>
  );
}

// 3. Badge Preview
function BadgePreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>BADGE TONES</Text>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success">Success</Badge>
      </View>

      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>STATUS PILLS</Text>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Badge variant="default">v1.0.0</Badge>
        <Badge variant="success">Active</Badge>
        <Badge variant="destructive">Deprecated</Badge>
        <Badge variant="secondary">In Review</Badge>
      </View>
    </View>
  );
}

// 4. Avatar Preview
function AvatarPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>AVATAR VARIATIONS</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Avatar size={52}>
          <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }} />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <Avatar size={40}>
          <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }} />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar size={32}>
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
      </View>

      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>FALLBACK INITIALS</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar size={40}>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar size={40}>
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>
        <Avatar size={40}>
          <AvatarFallback>TG</AvatarFallback>
        </Avatar>
      </View>
    </View>
  );
}

// 5. Card Preview
function CardPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>CARD LAYOUT</Text>
      <Card style={{ gap: 10 }}>
        <Text variant="title">Feature Announcement</Text>
        <Text variant="caption">
          Cards contain content and actions about a single subject. They visually group related information together.
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <Button size="sm" variant="ghost">Learn More</Button>
          <Button size="sm" variant="default">Get Started</Button>
        </View>
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
        <Avatar size={40}>
          <AvatarFallback>DS</AvatarFallback>
        </Avatar>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '600' }}>Amoga Design System</Text>
          <Text variant="caption">Components & Tokens</Text>
        </View>
        <Badge variant="outline">v1.0</Badge>
      </Card>
    </View>
  );
}

// 6. Checkbox Preview
function CheckboxPreview() {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>INTERACTIVE CHECKBOXES</Text>
      <View style={{ gap: 12 }}>
        <Checkbox
          checked={checked1}
          onCheckedChange={setChecked1}
          label="Push notifications enabled"
        />
        <Checkbox
          checked={checked2}
          onCheckedChange={setChecked2}
          label="Dark mode automatic schedule"
        />
        <Checkbox
          checked={checked3}
          onCheckedChange={setChecked3}
          label="I agree to the Terms of Service"
        />
      </View>
    </View>
  );
}

// 7. Switch Preview
function SwitchPreview() {
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>TOGGLE SWITCHES</Text>
      <Card style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontWeight: '600' }}>Biometric Login</Text>
            <Text variant="caption">Use Face ID or Fingerprint</Text>
          </View>
          <Switch value={sw1} onValueChange={setSw1} />
        </View>
        <Separator />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontWeight: '600' }}>Offline Mode</Text>
            <Text variant="caption">Cache content locally</Text>
          </View>
          <Switch value={sw2} onValueChange={setSw2} />
        </View>
      </Card>
    </View>
  );
}

// 8. InputOTP Preview
function InputOTPPreview() {
  const [otp, setOtp] = useState('');
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>PIN / OTP ENTRY</Text>
      <InputOTP
        length={6}
        value={otp}
        onChangeText={setOtp}
        onComplete={(code) => alert(`Entered Code: ${code}`)}
      />
      <Text variant="caption">Value: {otp || 'Empty'}</Text>
    </View>
  );
}

// 9. Toast Preview
function ToastPreview() {
  const toast = useToast();
  return (
    <View style={{ gap: 12 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>TOAST TRIGGERS</Text>
      <Button variant="default" onPress={() => toast.success('Saved successfully', 'Your profile changes have been synced.')}>
        Trigger Success Toast
      </Button>
      <Button variant="destructive" onPress={() => toast.error('Action Failed', 'Network connection was interrupted.')}>
        Trigger Error Toast
      </Button>
      <Button variant="outline" onPress={() => toast.info('Update Available', 'A new version of the app is available.')}>
        Trigger Info Toast
      </Button>
    </View>
  );
}

// 10. Spinner & Loading Preview
function SpinnerPreview() {
  return (
    <View style={{ gap: 20, alignItems: 'center' }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>SPINNER SIZES & VARIANTS</Text>
      <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
        <Spinner size="sm" />
        <Spinner size="default" />
        <Spinner size="lg" />
      </View>
    </View>
  );
}

// 11. Skeleton Preview
function SkeletonPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>SKELETON SHAPES</Text>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Skeleton style={{ width: 44, height: 44, borderRadius: 22 }} />
          <View style={{ gap: 6, flex: 1 }}>
            <Skeleton style={{ width: '70%', height: 14, borderRadius: 4 }} />
            <Skeleton style={{ width: '40%', height: 12, borderRadius: 4 }} />
          </View>
        </View>
        <Skeleton style={{ width: '100%', height: 60, borderRadius: 8 }} />
      </Card>
    </View>
  );
}

// 12. Text Typography Preview
function TypographyPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>TYPOGRAPHY SCALE</Text>
      <Card style={{ gap: 8 }}>
        <Text variant="title">Title Headline (24px)</Text>
        <Text variant="subtitle">Subtitle Section (18px)</Text>
        <Text variant="body">Body standard text for paragraphs and reading experience.</Text>
        <Text variant="caption">Caption small notes and secondary descriptions.</Text>
        <Text variant="caption" style={{ fontFamily: 'monospace' }}>const amoga = "Design System";</Text>
      </Card>
    </View>
  );
}

// 13. Separator Preview
function SeparatorPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>DIVIDERS & SEPARATION</Text>
      <Card style={{ gap: 12 }}>
        <Text variant="body">Section Alpha Content</Text>
        <Separator />
        <Text variant="body">Section Beta Content</Text>
        <Separator />
        <Text variant="body">Section Gamma Content</Text>
      </Card>
    </View>
  );
}

// 14. Mode Toggle Preview
function ModeTogglePreview() {
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>PALETTE SWITCHER</Text>
      <Card style={{ alignItems: 'center', padding: 20, gap: 12 }}>
        <ModeToggle />
        <Text variant="caption">Tap above to alternate between light and dark themes</Text>
      </Card>
    </View>
  );
}

export const DESIGN_SYSTEM_COMPONENTS: ComponentItem[] = [
  {
    id: 'button',
    name: 'Button Component',
    file: 'button.tsx',
    category: 'Primitives',
    tag: 'BUTTON',
    description: 'Trigger actions with multiple variants (default, secondary, outline, ghost, destructive) and sizes.',
    Preview: ButtonPreview,
  },
  {
    id: 'input',
    name: 'Input & Form Controls',
    file: 'input.tsx',
    category: 'Inputs',
    tag: 'INPUT',
    description: 'Text inputs with labels, helper text, error validations, icons, and password toggles.',
    Preview: InputPreview,
  },
  {
    id: 'badge',
    name: 'Badge & Status Tag',
    file: 'badge.tsx',
    category: 'Primitives',
    tag: 'BADGE',
    description: 'Visual status indicator tags with multiple tone variants (default, secondary, destructive, success).',
    Preview: BadgePreview,
  },
  {
    id: 'avatar',
    name: 'Avatar & Profile Icons',
    file: 'avatar.tsx',
    category: 'Display',
    tag: 'AVATAR',
    description: 'User avatar images with automatic initial fallbacks and responsive sizing.',
    Preview: AvatarPreview,
  },
  {
    id: 'card',
    name: 'Card Container Box',
    file: 'card.tsx',
    category: 'Layout',
    tag: 'CARD',
    description: 'Surface cards providing elevation, border rounding, and structured layout grouping.',
    Preview: CardPreview,
  },
  {
    id: 'checkbox',
    name: 'Checkbox Selection',
    file: 'checkbox.tsx',
    category: 'Inputs',
    tag: 'CHECKBOX',
    description: 'Toggleable multi-state checkboxes with animated checks and label integration.',
    Preview: CheckboxPreview,
  },
  {
    id: 'switch',
    name: 'Switch & Toggle',
    file: 'switch.tsx',
    category: 'Inputs',
    tag: 'SWITCH',
    description: 'Fluid sliding toggle switches for binary preferences and settings.',
    Preview: SwitchPreview,
  },
  {
    id: 'input-otp',
    name: 'Input OTP (Pin Code)',
    file: 'input-otp.tsx',
    category: 'Inputs',
    tag: 'OTP INPUT',
    description: 'Segmented pin code inputs for 2FA, phone verification, and security verification.',
    Preview: InputOTPPreview,
  },
  {
    id: 'toast',
    name: 'Toast Notifications',
    file: 'toast.tsx',
    category: 'Feedback',
    tag: 'TOAST',
    description: 'Global floating notification banners for successes, errors, and announcements.',
    Preview: ToastPreview,
  },
  {
    id: 'spinner',
    name: 'Spinner & Activity Indicator',
    file: 'spinner.tsx',
    category: 'Feedback',
    tag: 'SPINNER',
    description: 'Hardware-accelerated spinning indicators for asynchronous operations and loading states.',
    Preview: SpinnerPreview,
  },
  {
    id: 'skeleton',
    name: 'Skeleton Shimmer Loader',
    file: 'skeleton.tsx',
    category: 'Feedback',
    tag: 'SKELETON',
    description: 'Animated placeholder shapes to represent content while data is fetching.',
    Preview: SkeletonPreview,
  },
  {
    id: 'text',
    name: 'Typography & Text Scale',
    file: 'text.tsx',
    category: 'Primitives',
    tag: 'TEXT',
    description: 'Curated hierarchy of font sizes, weights, line heights, and typography tokens.',
    Preview: TypographyPreview,
  },
  {
    id: 'separator',
    name: 'Separator & Rule',
    file: 'separator.tsx',
    category: 'Layout',
    tag: 'SEPARATOR',
    description: 'Subtle divider lines to delineate sections and content blocks.',
    Preview: SeparatorPreview,
  },
  {
    id: 'mode-toggle',
    name: 'Theme Mode Toggle',
    file: 'mode-toggle.tsx',
    category: 'Display',
    tag: 'THEME',
    description: 'Quick switcher between light, dark, and system theme palettes.',
    Preview: ModeTogglePreview,
  },
];

export const COMPONENTS = DESIGN_SYSTEM_COMPONENTS;
