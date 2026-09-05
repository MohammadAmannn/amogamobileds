import React, { useState } from 'react';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
import { ColorPicker, ColorSwatch } from '@/components/ui/color-picker';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Toggle, ToggleGroup } from '@/components/ui/toggle';
import { Tooltip } from '@/components/ui/tooltip';
import { ChartContainer } from '@/components/charts/chart-container';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { AreaChart } from '@/components/charts/area-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { ProgressRingChart } from '@/components/charts/progress-ring-chart';
import { Mail, Lock, Sparkles, Bold, Italic, Underline, HelpCircle } from 'lucide-react-native';

export type ComponentCategory =
  | 'Primitives'
  | 'Inputs'
  | 'Charts'
  | 'Feedback'
  | 'Layout'
  | 'Display';

export interface ComponentItem {
  id: string;
  name: string;
  file: string;
  category: ComponentCategory;
  tag: string;
  description: string;
  Preview: React.ComponentType;
  codeSnippet?: string;
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
        <Button variant="outline" icon={Sparkles}>
          With Left Icon
        </Button>
        <Button variant="default" disabled>
          Disabled Button
        </Button>
      </View>
    </View>
  );
}

// 2. Input Preview
function InputPreview() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');

  return (
    <View style={{ gap: 16 }}>
      <Input
        label="Email"
        icon={Mail}
        placeholder="you@example.com"
        value={val1}
        onChangeText={setVal1}
      />
      <Input
        label="Password"
        icon={Lock}
        placeholder="Enter password"
        secureTextEntry
        value={val2}
        onChangeText={setVal2}
      />
      <Input
        label="With Error"
        placeholder="Invalid field"
        error="This field is required"
        value={val3}
        onChangeText={setVal3}
      />
      <Input
        label="Textarea"
        type="textarea"
        rows={3}
        placeholder="Write a long description or message..."
      />
    </View>
  );
}

// 3. Badge Preview
function BadgePreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>BADGE VARIANTS</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
      </View>
    </View>
  );
}

// 4. Card Preview
function CardPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>A clean container with header and content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text variant="body">
            Cards group related content, actions, and media in a unified elevated surface.
          </Text>
        </CardContent>
        <CardFooter style={{ justifyContent: 'flex-end' }}>
          <Button size="sm" variant="default">Action</Button>
        </CardFooter>
      </Card>
    </View>
  );
}

// 5. Checkbox Preview
function CheckboxPreview() {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  return (
    <View style={{ gap: 14 }}>
      <Checkbox
        checked={checked1}
        onCheckedChange={setChecked1}
        label="Accept Terms and Conditions"
      />
      <Checkbox
        checked={checked2}
        onCheckedChange={setChecked2}
        label="Subscribe to weekly product updates"
      />
      <Checkbox
        checked={checked3}
        onCheckedChange={setChecked3}
        disabled
        label="Disabled Checkbox option"
      />
    </View>
  );
}

// 6. Switch Preview
function SwitchPreview() {
  const [s1, setS1] = useState(true);
  const [s2, setS2] = useState(false);

  return (
    <View style={{ gap: 16 }}>
      <Switch
        value={s1}
        onValueChange={setS1}
        label="Push Notifications"
      />
      <Switch
        value={s2}
        onValueChange={setS2}
        label="Biometric Face ID Lock"
      />
      <Switch
        value={false}
        disabled
        label="Disabled Switch"
      />
    </View>
  );
}

// 7. InputOTP Preview
function InputOTPPreview() {
  const [otp, setOtp] = useState('1234');
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>6-DIGIT VERIFICATION CODE</Text>
      <InputOTP length={6} value={otp} onChangeText={setOtp} />
    </View>
  );
}

// 8. Toast Preview
function ToastPreview() {
  const toast = useToast();
  return (
    <View style={{ gap: 10 }}>
      <Button
        variant="default"
        onPress={() => toast.success('Profile Updated', 'Your profile details have been saved.')}
      >
        Trigger Success Toast
      </Button>
      <Button
        variant="destructive"
        onPress={() => toast.error('Payment Failed', 'Card was declined by issuing bank.')}
      >
        Trigger Error Toast
      </Button>
    </View>
  );
}

// 9. Spinner Preview
function SpinnerPreview() {
  return (
    <View style={{ gap: 20, alignItems: 'center' }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>SPINNER SIZES</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
        <Spinner size="sm" />
        <Spinner size="default" />
        <Spinner size="lg" />
      </View>
    </View>
  );
}

// 10. Skeleton Preview
function SkeletonPreview() {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Skeleton style={{ width: 48, height: 48, borderRadius: 24 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton style={{ width: '60%', height: 16, borderRadius: 4 }} />
          <Skeleton style={{ width: '40%', height: 12, borderRadius: 4 }} />
        </View>
      </View>
      <Skeleton style={{ width: '100%', height: 80, borderRadius: 12, marginTop: 8 }} />
    </View>
  );
}

// 11. Avatar Preview
function AvatarPreview() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Avatar size={36}>
        <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar size={44}>
        <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }} />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar size={56}>
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
    </View>
  );
}

// 12. Typography Preview
function TypographyPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Text variant="heading">Heading (28px)</Text>
      <Text variant="title">Title (24px)</Text>
      <Text variant="subtitle">Subtitle (19px)</Text>
      <Text variant="body">Body standard copy text (16px)</Text>
      <Text variant="caption">Caption muted small text (14px)</Text>
      <Text variant="link">Underlined Link text</Text>
    </View>
  );
}

// 13. Separator Preview
function SeparatorPreview() {
  return (
    <View style={{ gap: 14 }}>
      <Text variant="caption">Section Top</Text>
      <Separator />
      <Text variant="caption">Section Middle</Text>
      <Separator />
      <Text variant="caption">Section Bottom</Text>
    </View>
  );
}

// 14. ModeToggle Preview
function ModeTogglePreview() {
  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <Text variant="caption">TAP TO TOGGLE THEME</Text>
      <ModeToggle />
    </View>
  );
}

// 15. ColorPicker Preview
function ColorPickerPreview() {
  const [color1, setColor1] = useState('#059669');
  const [color2, setColor2] = useState('#3b82f6');
  const [color3, setColor3] = useState('#ec4899');

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>TAP SWATCH TO OPEN MODAL PICKER</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <ColorPicker value={color1} onColorChange={setColor1} swatchSize={48} />
          <Text style={{ fontSize: 12, fontWeight: '600' }}>{color1.toUpperCase()}</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <ColorPicker value={color2} onColorChange={setColor2} swatchSize={48} />
          <Text style={{ fontSize: 12, fontWeight: '600' }}>{color2.toUpperCase()}</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <ColorPicker value={color3} onColorChange={setColor3} swatchSize={48} />
          <Text style={{ fontSize: 12, fontWeight: '600' }}>{color3.toUpperCase()}</Text>
        </View>
      </View>

      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>STANDALONE SWATCHES</Text>
      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
        {['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6'].map((c) => (
          <ColorSwatch key={c} color={c} size={32} />
        ))}
      </View>
    </View>
  );
}

// 16. Accordion Preview
function AccordionPreview() {
  return (
    <Accordion>
      <AccordionItem title="What is Amoga Design System?" defaultExpanded>
        Amoga Design System is a unified cross-platform component library built for React Native, Expo, and Web.
      </AccordionItem>
      <AccordionItem title="Does it support both mobile and desktop web?">
        Yes! It renders native mobile views on iOS/Android and elevated responsive components on Web.
      </AccordionItem>
      <AccordionItem title="Can I customize color tokens?">
        Colors are dynamically driven by theme variables and dark/light mode tokens.
      </AccordionItem>
    </Accordion>
  );
}

// 17. Progress Preview
function ProgressPreview() {
  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600' }}>25% Storage Used</Text>
        <Progress value={25} />
      </View>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600' }}>65% Uploading Media</Text>
        <Progress value={65} color="#3b82f6" />
      </View>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600' }}>100% Completed Task</Text>
        <Progress value={100} color="#10b981" />
      </View>
    </View>
  );
}

// 18. Slider Preview
function SliderPreview() {
  const [val1, setVal1] = useState(40);
  const [val2, setVal2] = useState(75);

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600' }}>Volume: {val1}%</Text>
        <Slider value={val1} onValueChange={setVal1} />
      </View>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600' }}>Brightness: {val2}%</Text>
        <Slider value={val2} onValueChange={setVal2} showValue />
      </View>
    </View>
  );
}

// 19. Toggle Preview
function TogglePreview() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>TOOLBAR TOGGLE BUTTONS</Text>
      <ToggleGroup>
        <Toggle pressed={bold} onPressedChange={setBold}>
          <Bold size={16} />
        </Toggle>
        <Toggle pressed={italic} onPressedChange={setItalic}>
          <Italic size={16} />
        </Toggle>
        <Toggle pressed={underline} onPressedChange={setUnderline}>
          <Underline size={16} />
        </Toggle>
      </ToggleGroup>
    </View>
  );
}

// 20. Tooltip Preview
function TooltipPreview() {
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
      <Tooltip content="Help & Support info">
        <Button variant="outline" size="sm" icon={HelpCircle}>
          Hover or Tap Me
        </Button>
      </Tooltip>
    </View>
  );
}

// 21. BarChart Preview
function BarChartPreview() {
  const data = [
    { label: 'Jan', value: 34 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 78, color: '#059669' },
    { label: 'Apr', value: 45 },
    { label: 'May', value: 92, color: '#059669' },
    { label: 'Jun', value: 64 },
  ];

  return (
    <ChartContainer
      title="Monthly Sales Performance"
      description="Revenue generated per month in thousands ($k)"
    >
      <BarChart data={data} width={280} height={180} />
    </ChartContainer>
  );
}

// 22. LineChart Preview
function LineChartPreview() {
  const data = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 28 },
    { label: 'Wed', value: 42 },
    { label: 'Thu', value: 35 },
    { label: 'Fri', value: 68 },
    { label: 'Sat', value: 85 },
    { label: 'Sun', value: 94 },
  ];

  return (
    <ChartContainer
      title="Daily Active Users"
      description="Active session growth throughout the week"
    >
      <LineChart data={data} width={280} height={180} />
    </ChartContainer>
  );
}

// 23. AreaChart Preview
function AreaChartPreview() {
  const data = [
    { label: 'Q1', value: 120 },
    { label: 'Q2', value: 240 },
    { label: 'Q3', value: 380 },
    { label: 'Q4', value: 510 },
  ];

  return (
    <ChartContainer
      title="Network Traffic Bandwidth"
      description="Quarterly data throughput in Terabytes (TB)"
    >
      <AreaChart data={data} width={280} height={180} color="#059669" />
    </ChartContainer>
  );
}

// 24. PieChart Preview
function PieChartPreview() {
  const data = [
    { label: 'Desktop', value: 45, color: '#059669' },
    { label: 'Mobile', value: 35, color: '#3b82f6' },
    { label: 'Tablet', value: 20, color: '#f59e0b' },
  ];

  return (
    <ChartContainer
      title="Device Platform Share"
      description="Breakdown of traffic by operating environment"
    >
      <PieChart data={data} size={180} donut centerValue="100%" centerLabel="Total Users" />
    </ChartContainer>
  );
}

// 25. ProgressRingChart Preview
function ProgressRingChartPreview() {
  const data = [
    { label: 'Move', value: 85, color: '#ef4444' },
    { label: 'Exercise', value: 65, color: '#10b981' },
    { label: 'Stand', value: 92, color: '#3b82f6' },
  ];

  return (
    <ChartContainer
      title="Daily Activity Rings"
      description="Multi-metric radial goal completion status"
    >
      <ProgressRingChart data={data} size={180} strokeWidth={12} ringSpacing={5} />
    </ChartContainer>
  );
}

export const DESIGN_SYSTEM_COMPONENTS: ComponentItem[] = [
  // PRIMITIVES
  {
    id: 'button',
    name: 'Button',
    file: 'button.tsx',
    category: 'Primitives',
    tag: 'BUTTON',
    description: 'Versatile action buttons with multiple variants, fluid spring animation, haptics, and icon support.',
    Preview: ButtonPreview,
    codeSnippet: `import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react-native';

export function Example() {
  return (
    <Button
      variant="default"
      size="default"
      icon={Sparkles}
      onPress={() => console.log('Tapped')}
    >
      Primary Action
    </Button>
  );
}`,
  },
  {
    id: 'badge',
    name: 'Badge',
    file: 'badge.tsx',
    category: 'Primitives',
    tag: 'BADGE',
    description: 'Status descriptors, pill tags, and counts for categorizing items.',
    Preview: BadgePreview,
    codeSnippet: `import { Badge } from '@/components/ui/badge';

export function Example() {
  return (
    <Badge variant="success">Verified</Badge>
  );
}`,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    file: 'avatar.tsx',
    category: 'Primitives',
    tag: 'AVATAR',
    description: 'Profile image components with automatic fallback initials and loading handling.',
    Preview: AvatarPreview,
    codeSnippet: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Example() {
  return (
    <Avatar size="default">
      <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}`,
  },
  {
    id: 'text',
    name: 'Typography',
    file: 'text.tsx',
    category: 'Primitives',
    tag: 'TYPOGRAPHY',
    description: 'Curated hierarchy of font sizes, weights, and typography tokens.',
    Preview: TypographyPreview,
    codeSnippet: `import { Text } from '@/components/ui/text';

export function Example() {
  return (
    <>
      <Text variant="title">Heading Title</Text>
      <Text variant="body">Standard body text copy.</Text>
    </>
  );
}`,
  },

  // INPUTS
  {
    id: 'input',
    name: 'Input & Textarea',
    file: 'input.tsx',
    category: 'Inputs',
    tag: 'INPUT',
    description: 'Text inputs and textareas with validation errors, label grids, and trailing accessories.',
    Preview: InputPreview,
    codeSnippet: `import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react-native';

export function Example() {
  const [email, setEmail] = useState('');
  return (
    <Input
      label="Email"
      icon={Mail}
      placeholder="you@example.com"
      value={email}
      onChangeText={setEmail}
    />
  );
}`,
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    file: 'color-picker.tsx',
    category: 'Inputs',
    tag: 'COLOR PICKER',
    description: 'Interactive color picker with HSV 2D canvas, hue slider, hex text entry, and swatches.',
    Preview: ColorPickerPreview,
    codeSnippet: `import { ColorPicker, ColorSwatch } from '@/components/ui/color-picker';

export function Example() {
  const [color, setColor] = useState('#059669');
  return (
    <ColorPicker
      value={color}
      onColorChange={setColor}
      swatchSize={44}
    />
  );
}`,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    file: 'checkbox.tsx',
    category: 'Inputs',
    tag: 'CHECKBOX',
    description: 'Selectable boxes for boolean options, multiple choice, and agreement forms.',
    Preview: CheckboxPreview,
    codeSnippet: `import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  const [accepted, setAccepted] = useState(false);
  return (
    <Checkbox
      checked={accepted}
      onCheckedChange={setAccepted}
      label="I agree to the terms"
    />
  );
}`,
  },
  {
    id: 'switch',
    name: 'Switch',
    file: 'switch.tsx',
    category: 'Inputs',
    tag: 'SWITCH',
    description: 'Fluid sliding toggle switches for binary preferences and settings.',
    Preview: SwitchPreview,
    codeSnippet: `import { Switch } from '@/components/ui/switch';

export function Example() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Switch
      value={enabled}
      onValueChange={setEnabled}
      label="Enable Push Notifications"
    />
  );
}`,
  },
  {
    id: 'slider',
    name: 'Slider',
    file: 'slider.tsx',
    category: 'Inputs',
    tag: 'SLIDER',
    description: 'Smooth draggable track sliders for numerical ranges, volume, and brightness controls.',
    Preview: SliderPreview,
    codeSnippet: `import { Slider } from '@/components/ui/slider';

export function Example() {
  const [value, setValue] = useState(50);
  return (
    <Slider
      value={value}
      min={0}
      max={100}
      onValueChange={setValue}
      showValue
    />
  );
}`,
  },
  {
    id: 'toggle',
    name: 'Toggle & Group',
    file: 'toggle.tsx',
    category: 'Inputs',
    tag: 'TOGGLE',
    description: 'Two-state toggle buttons and grouped button toolbars.',
    Preview: TogglePreview,
    codeSnippet: `import { Toggle, ToggleGroup } from '@/components/ui/toggle';
import { Bold, Italic } from 'lucide-react-native';

export function Example() {
  const [bold, setBold] = useState(false);
  return (
    <ToggleGroup>
      <Toggle pressed={bold} onPressedChange={setBold}>
        <Bold size={16} />
      </Toggle>
    </ToggleGroup>
  );
}`,
  },
  {
    id: 'input-otp',
    name: 'Input OTP (Pin Code)',
    file: 'input-otp.tsx',
    category: 'Inputs',
    tag: 'OTP INPUT',
    description: 'Segmented pin code inputs for 2FA, phone verification, and security codes.',
    Preview: InputOTPPreview,
    codeSnippet: `import { InputOTP } from '@/components/ui/input-otp';

export function Example() {
  const [otp, setOtp] = useState('');
  return (
    <InputOTP length={6} value={otp} onChangeText={setOtp} />
  );
}`,
  },

  // CHARTS
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    file: 'bar-chart.tsx',
    category: 'Charts',
    tag: 'BAR CHART',
    description: 'Vertical bar charts with grid lines, rounded bar caps, and value labels.',
    Preview: BarChartPreview,
    codeSnippet: `import { BarChart } from '@/components/charts/bar-chart';
import { ChartContainer } from '@/components/charts/chart-container';

export function Example() {
  const data = [
    { label: 'Jan', value: 34 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 78 },
  ];
  return (
    <ChartContainer title="Revenue Performance">
      <BarChart data={data} width={300} height={200} />
    </ChartContainer>
  );
}`,
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    file: 'line-chart.tsx',
    category: 'Charts',
    tag: 'LINE CHART',
    description: 'Continuous line spline charts with data dots, grid lines, and axis labels.',
    Preview: LineChartPreview,
    codeSnippet: `import { LineChart } from '@/components/charts/line-chart';
import { ChartContainer } from '@/components/charts/chart-container';

export function Example() {
  const data = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 28 },
    { label: 'Wed', value: 42 },
  ];
  return (
    <ChartContainer title="Daily Active Users">
      <LineChart data={data} width={300} height={200} />
    </ChartContainer>
  );
}`,
  },
  {
    id: 'area-chart',
    name: 'Area Chart',
    file: 'area-chart.tsx',
    category: 'Charts',
    tag: 'AREA CHART',
    description: 'Smooth gradient-filled area charts for volumetric data and trend visualisations.',
    Preview: AreaChartPreview,
    codeSnippet: `import { AreaChart } from '@/components/charts/area-chart';
import { ChartContainer } from '@/components/charts/chart-container';

export function Example() {
  const data = [
    { label: 'Q1', value: 120 },
    { label: 'Q2', value: 240 },
    { label: 'Q3', value: 380 },
  ];
  return (
    <ChartContainer title="Data Throughput">
      <AreaChart data={data} width={300} height={200} />
    </ChartContainer>
  );
}`,
  },
  {
    id: 'pie-chart',
    name: 'Pie & Donut Chart',
    file: 'pie-chart.tsx',
    category: 'Charts',
    tag: 'PIE CHART',
    description: 'Pie and Donut charts with customizable inner radius, center metric, and legend.',
    Preview: PieChartPreview,
    codeSnippet: `import { PieChart } from '@/components/charts/pie-chart';
import { ChartContainer } from '@/components/charts/chart-container';

export function Example() {
  const data = [
    { label: 'Desktop', value: 45, color: '#059669' },
    { label: 'Mobile', value: 35, color: '#3b82f6' },
  ];
  return (
    <ChartContainer title="Device Breakdown">
      <PieChart data={data} size={200} donut centerValue="100%" />
    </ChartContainer>
  );
}`,
  },
  {
    id: 'progress-ring',
    name: 'Progress Ring Chart',
    file: 'progress-ring-chart.tsx',
    category: 'Charts',
    tag: 'PROGRESS RING',
    description: 'Multi-ring radial progress chart for fitness goals and multi-target progress.',
    Preview: ProgressRingChartPreview,
    codeSnippet: `import { ProgressRingChart } from '@/components/charts/progress-ring-chart';
import { ChartContainer } from '@/components/charts/chart-container';

export function Example() {
  const data = [
    { label: 'Move', value: 85, color: '#ef4444' },
    { label: 'Exercise', value: 65, color: '#10b981' },
  ];
  return (
    <ChartContainer title="Goal Activity">
      <ProgressRingChart data={data} size={180} />
    </ChartContainer>
  );
}`,
  },

  // FEEDBACK
  {
    id: 'progress',
    name: 'Progress Bar',
    file: 'progress.tsx',
    category: 'Feedback',
    tag: 'PROGRESS',
    description: 'Animated linear completion bar with smooth width transitions.',
    Preview: ProgressPreview,
    codeSnippet: `import { Progress } from '@/components/ui/progress';

export function Example() {
  return <Progress value={65} />;
}`,
  },
  {
    id: 'toast',
    name: 'Toast Notifications',
    file: 'toast.tsx',
    category: 'Feedback',
    tag: 'TOAST',
    description: 'Global floating notification banners for successes, errors, and announcements.',
    Preview: ToastPreview,
    codeSnippet: `import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export function Example() {
  const toast = useToast();
  return (
    <Button onPress={() => toast.success('Saved', 'Your changes have been saved.')}>
      Show Toast
    </Button>
  );
}`,
  },
  {
    id: 'spinner',
    name: 'Spinner & Loader',
    file: 'spinner.tsx',
    category: 'Feedback',
    tag: 'SPINNER',
    description: 'Hardware-accelerated spinning indicators for asynchronous operations and loading states.',
    Preview: SpinnerPreview,
    codeSnippet: `import { Spinner } from '@/components/ui/spinner';

export function Example() {
  return <Spinner size="default" />;
}`,
  },
  {
    id: 'skeleton',
    name: 'Skeleton Shimmer',
    file: 'skeleton.tsx',
    category: 'Feedback',
    tag: 'SKELETON',
    description: 'Animated placeholder shapes to represent content while data is fetching.',
    Preview: SkeletonPreview,
    codeSnippet: `import { Skeleton } from '@/components/ui/skeleton';

export function Example() {
  return <Skeleton style={{ width: '100%', height: 48, borderRadius: 8 }} />;
}`,
  },

  // LAYOUT
  {
    id: 'card',
    name: 'Card',
    file: 'card.tsx',
    category: 'Layout',
    tag: 'CARD',
    description: 'Elevated surfaces that group related information and actions.',
    Preview: CardPreview,
    codeSnippet: `import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export function Example() {
  return (
    <Card title="Card Title" description="Card description">
      <Text>Card body content</Text>
    </Card>
  );
}`,
  },
  {
    id: 'accordion',
    name: 'Accordion',
    file: 'accordion.tsx',
    category: 'Layout',
    tag: 'ACCORDION',
    description: 'Vertically stacked interactive collapsible headers with smooth height transitions.',
    Preview: AccordionPreview,
    codeSnippet: `import { Accordion, AccordionItem } from '@/components/ui/accordion';

export function Example() {
  return (
    <Accordion>
      <AccordionItem title="Item 1" defaultExpanded>
        Content for item 1
      </AccordionItem>
      <AccordionItem title="Item 2">
        Content for item 2
      </AccordionItem>
    </Accordion>
  );
}`,
  },
  {
    id: 'separator',
    name: 'Separator & Rule',
    file: 'separator.tsx',
    category: 'Layout',
    tag: 'SEPARATOR',
    description: 'Subtle divider lines to delineate sections and content blocks.',
    Preview: SeparatorPreview,
    codeSnippet: `import { Separator } from '@/components/ui/separator';

export function Example() {
  return <Separator style={{ marginVertical: 16 }} />;
}`,
  },

  // DISPLAY
  {
    id: 'tooltip',
    name: 'Tooltip',
    file: 'tooltip.tsx',
    category: 'Display',
    tag: 'TOOLTIP',
    description: 'Contextual overlays with helpful hints on hover or press.',
    Preview: TooltipPreview,
    codeSnippet: `import { Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Tooltip content="More info">
      <Button variant="outline">Tap me</Button>
    </Tooltip>
  );
}`,
  },
  {
    id: 'mode-toggle',
    name: 'Theme Mode Toggle',
    file: 'mode-toggle.tsx',
    category: 'Display',
    tag: 'THEME',
    description: 'Quick switcher between light, dark, and system theme palettes.',
    Preview: ModeTogglePreview,
    codeSnippet: `import { ModeToggle } from '@/components/ui/mode-toggle';

export function Example() {
  return <ModeToggle />;
}`,
  },
];

export const COMPONENTS = DESIGN_SYSTEM_COMPONENTS;
