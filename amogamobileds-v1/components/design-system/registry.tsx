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
import { ColorPicker } from '@/components/ui/color-picker';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Toggle, ToggleGroup } from '@/components/ui/toggle';
import { Tooltip } from '@/components/ui/tooltip';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { ActionSheet } from '@/components/ui/action-sheet';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Collapsible } from '@/components/ui/collapsible';
import {
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  OptionType,
} from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { FilePicker } from '@/components/ui/file-picker';
import { MediaPicker } from '@/components/ui/media-picker';
import { Gallery } from '@/components/ui/gallery';
import { HelloWave } from '@/components/ui/hello-wave';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Link } from '@/components/ui/link';
import { ParallaxScrollView } from '@/components/ui/parallax-scrollview';
import { Picker } from '@/components/ui/picker';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { RadioGroup, RadioOption } from '@/components/ui/radio';
import { ScrollView } from '@/components/ui/scroll-view';
import { SearchBar } from '@/components/ui/searchbar';
import { ShareButton } from '@/components/ui/share';
import { Sheet } from '@/components/ui/sheet';
import { Table, TableColumn } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Video } from '@/components/ui/video';
import { AudioPlayer } from '@/components/ui/audio-player';
import { AudioRecorder } from '@/components/ui/audio-recorder';
import { AudioWaveform } from '@/components/ui/audio-waveform';
import { Camera } from '@/components/ui/camera';
import { CameraPreview as CameraPreviewComponent } from '@/components/ui/camera-preview';
import { Carousel } from '@/components/ui/carousel';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { Onboarding } from '@/components/ui/onboarding';

// CHARTS
import { ChartContainer } from '@/components/charts/chart-container';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { AreaChart } from '@/components/charts/area-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { ProgressRingChart } from '@/components/charts/progress-ring-chart';
import { BubbleChart } from '@/components/charts/bubble-chart';
import { CandlestickChart } from '@/components/charts/candlestick-chart';
import { ColumnChart } from '@/components/charts/column-chart';
import { DoughnutChart } from '@/components/charts/doughnut-chart';
import { HeatmapChart } from '@/components/charts/heatmap-chart';
import { PolarAreaChart } from '@/components/charts/polar-area-chart';
import { RadarChart } from '@/components/charts/radar-chart';
import { RadialBarChart } from '@/components/charts/radial-bar-chart';
import { ScatterChart } from '@/components/charts/scatter-chart';
import { StackedAreaChart } from '@/components/charts/stacked-area-chart';
import { StackedBarChart } from '@/components/charts/stacked-bar-chart';
import { TreemapChart } from '@/components/charts/treemap-chart';

import {
  Mail,
  Lock,
  Sparkles,
  Bold,
  Italic,
  Underline,
  HelpCircle,
  Share2,
  Camera as CameraIcon,
  Heart,
  Shield,
  Bell,
  Activity
} from 'lucide-react-native';

import { AppThemesPreview } from './previews/AppThemesPreview';
import { LucideIconsPreview } from './previews/LucideIconsPreview';
import { ChatPreviews } from './previews/ChatPreviews';

export type ComponentCategory =
  | 'Primitives'
  | 'Inputs'
  | 'Charts'
  | 'Feedback'
  | 'Layout'
  | 'Display'
  | 'Media'
  | 'Data'
  | 'Themes'
  | 'Icons'
  | 'Chat';

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

/* =========================================================================
   1. PRIMITIVES
   ========================================================================= */

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
      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>STATUS INDICATORS</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Badge variant="default">PRO Feature</Badge>
        <Badge variant="secondary">Verified</Badge>
        <Badge variant="destructive">Live Incident</Badge>
      </View>
    </View>
  );
}

function AvatarPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>SIZES & FALLBACKS</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Avatar size={36}>
          <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar size={48}>
          <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }} />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar size={60}>
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
      </View>
    </View>
  );
}

function IconPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>THEMED LUCIDE ICONS</Text>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Icon name={Heart} size={24} color="#ef4444" />
        <Icon name={Sparkles} size={24} color="#8b5cf6" />
        <Icon name={Shield} size={24} color="#10b981" />
        <Icon name={Bell} size={24} color="#f59e0b" />
        <Icon name={Activity} size={24} color="#3b82f6" />
      </View>
    </View>
  );
}

function ImagePreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>RESPONSIVE IMAGE</Text>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600' }}
        style={{ width: '100%', height: 180, borderRadius: 12 }}
        contentFit="cover"
      />
    </View>
  );
}

function TextPreview() {
  return (
    <View style={{ gap: 10 }}>
      <Text variant="heading">Heading Typography</Text>
      <Text variant="title">Title Typography</Text>
      <Text variant="subtitle">Subtitle Typography</Text>
      <Text variant="body">Body typography with balanced line height and optimal legibility.</Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>Caption metadata and secondary hints.</Text>
    </View>
  );
}

function ViewPreview() {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)' }}>
        <Text variant="body" style={{ fontWeight: '600', color: '#3b82f6' }}>Foundational View Container</Text>
        <Text variant="caption" style={{ marginTop: 4 }}>Supports theme tokens, flexible layout, and cross-platform padding.</Text>
      </View>
    </View>
  );
}

function HelloWavePreview() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
      <HelloWave />
      <Text variant="title">Welcome to BNA UI</Text>
    </View>
  );
}

function LinkPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Link href="https://ui.ahmedbna.com">
        <Text style={{ color: '#3b82f6', textDecorationLine: 'underline', fontWeight: '500' }}>
          Explore BNA UI Documentation ↗
        </Text>
      </Link>
    </View>
  );
}

function SeparatorPreview() {
  return (
    <View style={{ gap: 14 }}>
      <Text variant="body">Section Alpha</Text>
      <Separator />
      <Text variant="body">Section Beta</Text>
      <Separator orientation="horizontal" />
      <Text variant="caption" style={{ opacity: 0.7 }}>Dividers separate content sections cleanly.</Text>
    </View>
  );
}

/* =========================================================================
   2. INPUTS & FORMS
   ========================================================================= */

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
    </View>
  );
}

function InputOTPPreview() {
  const [otp, setOtp] = useState('482910');
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>6-DIGIT VERIFICATION CODE</Text>
      <InputOTP length={6} value={otp} onChangeText={setOtp} />
    </View>
  );
}

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
    </View>
  );
}

function RadioPreview() {
  const [selected, setSelected] = useState('monthly');
  const options: RadioOption[] = [
    { label: 'Monthly Plan ($12/mo)', value: 'monthly' },
    { label: 'Annual Plan ($99/yr - Save 30%)', value: 'annual' },
    { label: 'Lifetime Access ($299)', value: 'lifetime', disabled: true },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>BILLING CYCLE</Text>
      <RadioGroup options={options} value={selected} onValueChange={setSelected} />
    </View>
  );
}

function TogglePreview() {
  const [pressed, setPressed] = useState(false);
  const [format, setFormat] = useState('bold');

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>STANDALONE TOGGLE</Text>
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        <Text>{pressed ? 'Active State' : 'Inactive State'}</Text>
      </Toggle>

      <Text variant="caption" style={{ fontWeight: '600', marginTop: 8 }}>TOGGLE GROUP</Text>
      <ToggleGroup>
        <Toggle pressed={format === 'bold'} onPressedChange={() => setFormat('bold')}><Bold size={16} /></Toggle>
        <Toggle pressed={format === 'italic'} onPressedChange={() => setFormat('italic')}><Italic size={16} /></Toggle>
        <Toggle pressed={format === 'underline'} onPressedChange={() => setFormat('underline')}><Underline size={16} /></Toggle>
      </ToggleGroup>
    </View>
  );
}

function SearchbarPreview() {
  const [search, setSearch] = useState('');
  return (
    <View style={{ gap: 12 }}>
      <SearchBar
        placeholder="Search components, tokens, icons..."
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
}

function ComboboxPreview() {
  const [val, setVal] = useState<OptionType | null>({ label: 'React Native', value: 'react-native' });
  return (
    <View style={{ gap: 12 }}>
      <Combobox value={val} onValueChange={setVal}>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select Framework" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search frameworks..." />
          <ComboboxList>
            <ComboboxItem value="react-native">React Native</ComboboxItem>
            <ComboboxItem value="expo">Expo Router</ComboboxItem>
            <ComboboxItem value="typescript">TypeScript</ComboboxItem>
            <ComboboxItem value="supabase">Supabase</ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </View>
  );
}

function PickerPreview() {
  const [val, setVal] = useState('us');
  const options = [
    { label: 'United States (+1)', value: 'us' },
    { label: 'United Kingdom (+44)', value: 'uk' },
    { label: 'Germany (+49)', value: 'de' },
    { label: 'Japan (+81)', value: 'jp' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Picker
        label="Country Code"
        options={options}
        value={val}
        onValueChange={(v) => v && setVal(v)}
      />
    </View>
  );
}

function DatePickerPreview() {
  const [date, setDate] = useState(new Date());
  return (
    <View style={{ gap: 12 }}>
      <DatePicker
        label="Appointment Date"
        value={date}
        onChange={(d) => {
          if (d instanceof Date) setDate(d);
        }}
      />
    </View>
  );
}

function FilePickerPreview() {
  const [files, setFiles] = useState<any[]>([]);
  return (
    <View style={{ gap: 12 }}>
      <FilePicker
        onFilesSelected={setFiles}
        maxFiles={3}
      />
    </View>
  );
}

function MediaPickerPreview() {
  const [media, setMedia] = useState<any[]>([]);
  return (
    <View style={{ gap: 12 }}>
      <MediaPicker
        onSelectionChange={(assets) => setMedia(assets)}
        multiple
      />
    </View>
  );
}

function ColorPickerPreview() {
  const [color, setColor] = useState('#6366f1');
  return (
    <View style={{ gap: 14 }}>
      <ColorPicker value={color} onColorChange={setColor} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: color }} />
        <Text variant="caption" style={{ fontWeight: '600' }}>Active: {color.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function SliderPreview() {
  const [value, setValue] = useState(65);
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>VOLUME LEVEL: {value}%</Text>
      <Slider value={value} onValueChange={setValue} min={0} max={100} />
    </View>
  );
}

/* =========================================================================
   3. FEEDBACK & STATUS
   ========================================================================= */

function AlertPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Alert variant="default">
        <AlertTitle>Order Dispatched</AlertTitle>
        <AlertDescription>Your package is in transit and will arrive by tomorrow 4 PM.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription>Your API key has expired. Please generate a new key in settings.</AlertDescription>
      </Alert>
    </View>
  );
}

function AlertDialogPreview() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button variant="destructive" onPress={() => setOpen(true)}>
        Open Alert Dialog
      </Button>
      <AlertDialog
        isVisible={open}
        onClose={() => setOpen(false)}
        title="Delete Deployment?"
        description="This action cannot be undone. This will permanently delete your cluster."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={() => setOpen(false)}
      />
    </View>
  );
}

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

function ProgressPreview() {
  const [val, setVal] = useState(68);
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="caption" style={{ fontWeight: '600' }}>UPLOADING ASSETS</Text>
        <Text variant="caption" style={{ fontWeight: '600' }}>{val}%</Text>
      </View>
      <Progress value={val} />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
        <Button size="sm" variant="outline" onPress={() => setVal(Math.max(0, val - 15))}>-15%</Button>
        <Button size="sm" variant="outline" onPress={() => setVal(Math.min(100, val + 15))}>+15%</Button>
      </View>
    </View>
  );
}

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

/* =========================================================================
   4. LAYOUT & STRUCTURE
   ========================================================================= */

function CardPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Card>
        <CardHeader>
          <CardTitle>Cloud Cluster PRO</CardTitle>
          <CardDescription>Managed Kubernetes in us-east-1 with high availability.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text variant="body">
            Cards group related content, actions, and media in a unified elevated surface.
          </Text>
        </CardContent>
        <CardFooter style={{ justifyContent: 'flex-end', gap: 8 }}>
          <Button size="sm" variant="outline">Docs</Button>
          <Button size="sm" variant="default">Upgrade</Button>
        </CardFooter>
      </Card>
    </View>
  );
}

function AccordionPreview() {
  return (
    <View style={{ gap: 8 }}>
      <Accordion>
        <AccordionItem title="What is BNA UI?">
          <Text variant="body">
            BNA UI is an open-code mobile design system built with Expo, React Native, and TypeScript.
          </Text>
        </AccordionItem>
        <AccordionItem title="How does copy-paste work?">
          <Text variant="body">
            You own the component source code. Copy the files directly into your project and customize freely.
          </Text>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

function CollapsiblePreview() {
  return (
    <View style={{ gap: 10 }}>
      <Collapsible title="Advanced Configuration">
        <View style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.04)', gap: 4 }}>
          <Text variant="caption">SSL Encryption: Enabled</Text>
          <Text variant="caption">HTTP/3 QUIC: Enabled</Text>
          <Text variant="caption">Edge Caching: 300s TTL</Text>
        </View>
      </Collapsible>
    </View>
  );
}

function SheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button variant="default" onPress={() => setOpen(true)}>Open Side Sheet</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <View style={{ gap: 16, padding: 20 }}>
          <Text variant="title">Sidebar Navigation</Text>
          <Text variant="body">Configure filter preferences and navigation options.</Text>
          <Button variant="default" onPress={() => setOpen(false)}>Apply Filters</Button>
        </View>
      </Sheet>
    </View>
  );
}

function BottomSheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button variant="default" onPress={() => setOpen(true)}>Open Bottom Sheet</Button>
      <BottomSheet isVisible={open} onClose={() => setOpen(false)} title="Quick Actions">
        <View style={{ gap: 12, paddingVertical: 12 }}>
          <Button variant="outline">Share Link</Button>
          <Button variant="outline">Add to Favorites</Button>
          <Button variant="destructive" onPress={() => setOpen(false)}>Close Sheet</Button>
        </View>
      </BottomSheet>
    </View>
  );
}

function ActionSheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button variant="default" onPress={() => setOpen(true)}>Show Action Sheet</Button>
      <ActionSheet
        visible={open}
        onClose={() => setOpen(false)}
        title="Photo Options"
        options={[
          { title: 'Take Photo', onPress: () => setOpen(false) },
          { title: 'Choose from Library', onPress: () => setOpen(false) },
        ]}
      />
    </View>
  );
}

function ScrollViewPreview() {
  return (
    <View style={{ height: 160 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.03)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' }}>
              <Text variant="body">Scroll item #{i}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function AvoidKeyboardPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Input label="Chat Message" placeholder="Type a message..." />
      <AvoidKeyboard offset={10} />
      <Text variant="caption" style={{ opacity: 0.7 }}>Automatically shifts content smoothly above native keyboard.</Text>
    </View>
  );
}

function ParallaxScrollViewPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Text variant="body" style={{ fontWeight: '600' }}>Parallax Header ScrollView</Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>Smooth scaling and translation header effects on scroll.</Text>
    </View>
  );
}

function OnboardingPreview() {
  const steps = [
    { id: '1', title: 'Welcome to Amoga', description: 'Modern React Native design system components.' },
    { id: '2', title: 'Copy & Paste', description: 'Fully customizable, typed, open-code components.' },
    { id: '3', title: 'Ready to Ship', description: 'Build stunning cross-platform mobile apps in record time.' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Onboarding steps={steps} onComplete={() => {}} />
    </View>
  );
}

/* =========================================================================
   5. DISPLAY & OVERLAYS
   ========================================================================= */

function TooltipPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Tooltip content="Verified encrypted connection">
        <Button variant="outline" icon={HelpCircle}>Hover / Tap for Hint</Button>
      </Tooltip>
    </View>
  );
}

function PopoverPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Context Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <View style={{ gap: 6, width: 200, padding: 8 }}>
            <Text variant="caption" style={{ fontWeight: '700' }}>Popover Actions</Text>
            <Text variant="caption">Floating contextual information layer.</Text>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  );
}

function TablePreview() {
  const columns: TableColumn[] = [
    { id: 'invoice', header: 'Invoice', accessorKey: 'invoice' },
    { id: 'status', header: 'Status', accessorKey: 'status' },
    { id: 'amount', header: 'Amount', accessorKey: 'amount' },
  ];
  const data = [
    { invoice: 'INV-001', status: 'Paid', amount: '$250.00' },
    { invoice: 'INV-002', status: 'Pending', amount: '$150.00' },
    { invoice: 'INV-003', status: 'Completed', amount: '$420.00' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Table data={data} columns={columns} />
    </View>
  );
}

function TabsPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Text variant="body" style={{ marginTop: 8 }}>Manage your profile information and email address.</Text>
        </TabsContent>
        <TabsContent value="password">
          <Text variant="body" style={{ marginTop: 8 }}>Change password and configure two-factor authentication.</Text>
        </TabsContent>
      </Tabs>
    </View>
  );
}

function CarouselPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Carousel showIndicators showArrows>
        <View style={{ height: 120, backgroundColor: '#3b82f6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Slide 1: Telemetry</Text>
        </View>
        <View style={{ height: 120, backgroundColor: '#10b981', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Slide 2: Security</Text>
        </View>
        <View style={{ height: 120, backgroundColor: '#8b5cf6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Slide 3: Performance</Text>
        </View>
      </Carousel>
    </View>
  );
}

function ModeTogglePreview() {
  return (
    <View style={{ gap: 12, alignItems: 'center' }}>
      <ModeToggle />
    </View>
  );
}

function SharePreview() {
  return (
    <View style={{ gap: 12 }}>
      <ShareButton
        content={{
          title: 'Check out BNA UI',
          message: 'A comprehensive open-code mobile UI system for Expo and React Native!',
          url: 'https://ui.ahmedbna.com',
        }}
      >
        <Button variant="default">Share App</Button>
      </ShareButton>
    </View>
  );
}

/* =========================================================================
   6. MEDIA & AUDIO/VIDEO
   ========================================================================= */

function AudioPlayerPreview() {
  return (
    <View style={{ gap: 12 }}>
      <AudioPlayer
        source={{ uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }}
        showControls
        showWaveform
      />
    </View>
  );
}

function AudioRecorderPreview() {
  return (
    <View style={{ gap: 12 }}>
      <AudioRecorder onRecordingComplete={() => {}} />
    </View>
  );
}

function AudioWaveformPreview() {
  return (
    <View style={{ gap: 12 }}>
      <AudioWaveform progress={0.45} />
    </View>
  );
}

function VideoPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Video
        source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
        style={{ width: '100%', height: 180, borderRadius: 12 }}
        nativeControls
      />
    </View>
  );
}

function GalleryPreview() {
  const items = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400', title: 'Abstract' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', title: 'Vibrant' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', title: 'Patterns' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Gallery items={items} columns={3} />
    </View>
  );
}

function CameraPreview() {
  return (
    <View style={{ gap: 12, padding: 16, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center' }}>
      <CameraIcon size={32} color="#6366f1" />
      <Text variant="body" style={{ fontWeight: '600' }}>Camera Component</Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>Captures photos/videos with zoom, flash, and aspect ratio controls.</Text>
    </View>
  );
}

function CameraPreviewPreview() {
  return (
    <View style={{ gap: 12, padding: 16, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center' }}>
      <CameraIcon size={32} color="#10b981" />
      <Text variant="body" style={{ fontWeight: '600' }}>Camera Preview</Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>Full screen viewfinder with capture controls and media gallery preview.</Text>
    </View>
  );
}

/* =========================================================================
   7. CHARTS (18 COMPREHENSIVE CHARTS)
   ========================================================================= */

function ChartContainerPreview() {
  return (
    <ChartContainer title="System Metrics" description="Weekly telemetry breakdown">
      <BarChart
        data={[
          { label: 'Mon', value: 45 },
          { label: 'Tue', value: 72 },
          { label: 'Wed', value: 60 },
        ]}
        width={280}
        height={160}
      />
    </ChartContainer>
  );
}

function BarChartPreview() {
  const data = [
    { label: 'Jan', value: 42 },
    { label: 'Feb', value: 68 },
    { label: 'Mar', value: 85 },
    { label: 'Apr', value: 55 },
    { label: 'May', value: 92 },
  ];
  return (
    <ChartContainer title="Monthly Revenue ($K)">
      <BarChart data={data} width={300} height={180} />
    </ChartContainer>
  );
}

function LineChartPreview() {
  const data = [
    { label: 'W1', value: 20 },
    { label: 'W2', value: 45 },
    { label: 'W3', value: 38 },
    { label: 'W4', value: 75 },
    { label: 'W5', value: 90 },
  ];
  return (
    <ChartContainer title="User Engagement Growth">
      <LineChart data={data} width={300} height={180} />
    </ChartContainer>
  );
}

function AreaChartPreview() {
  const data = [
    { label: 'Q1', value: 120 },
    { label: 'Q2', value: 240 },
    { label: 'Q3', value: 380 },
    { label: 'Q4', value: 510 },
  ];
  return (
    <ChartContainer title="Data Volume (GB)">
      <AreaChart data={data} width={300} height={180} />
    </ChartContainer>
  );
}

function PieChartPreview() {
  const data = [
    { label: 'iOS', value: 55, color: '#6366f1' },
    { label: 'Android', value: 35, color: '#10b981' },
    { label: 'Web', value: 10, color: '#f59e0b' },
  ];
  return (
    <ChartContainer title="Platform Share">
      <PieChart data={data} size={180} />
    </ChartContainer>
  );
}

function DoughnutChartPreview() {
  const data = [
    { label: 'Direct', value: 45, color: '#3b82f6' },
    { label: 'Referral', value: 30, color: '#10b981' },
    { label: 'Social', value: 25, color: '#ec4899' },
  ];
  return (
    <ChartContainer title="Acquisition Channels">
      <DoughnutChart data={data} />
    </ChartContainer>
  );
}

function ProgressRingChartPreview() {
  const data = [
    { label: 'Move', value: 85, color: '#ef4444' },
    { label: 'Exercise', value: 65, color: '#10b981' },
    { label: 'Stand', value: 92, color: '#3b82f6' },
  ];
  return (
    <ChartContainer title="Daily Fitness Rings">
      <ProgressRingChart data={data} size={180} />
    </ChartContainer>
  );
}

function RadialBarChartPreview() {
  const data = [
    { label: 'CPU', value: 78, color: '#f43f5e' },
    { label: 'Memory', value: 62, color: '#8b5cf6' },
    { label: 'Storage', value: 45, color: '#06b6d4' },
  ];
  return (
    <ChartContainer title="Resource Utilization">
      <RadialBarChart data={data} />
    </ChartContainer>
  );
}

function ColumnChartPreview() {
  const data = [
    { label: '2022', value: 320, color: '#3b82f6' },
    { label: '2023', value: 480, color: '#10b981' },
    { label: '2024', value: 640, color: '#8b5cf6' },
  ];
  return (
    <ChartContainer title="Annual Shipments">
      <ColumnChart data={data} />
    </ChartContainer>
  );
}

function BubbleChartPreview() {
  const data = [
    { x: 10, y: 30, size: 15, label: 'Alpha' },
    { x: 25, y: 60, size: 25, label: 'Beta' },
    { x: 45, y: 80, size: 20, label: 'Gamma' },
  ];
  return (
    <ChartContainer title="Market Dispersion">
      <BubbleChart data={data} />
    </ChartContainer>
  );
}

function CandlestickChartPreview() {
  const data = [
    { date: 'Mon', open: 120, high: 135, low: 115, close: 130 },
    { date: 'Tue', open: 130, high: 140, low: 125, close: 128 },
    { date: 'Wed', open: 128, high: 145, low: 126, close: 142 },
  ];
  return (
    <ChartContainer title="Asset Price Action">
      <CandlestickChart data={data} />
    </ChartContainer>
  );
}

function HeatmapChartPreview() {
  const data = [
    { row: 'Mon', col: 'Morning', value: 40 },
    { row: 'Mon', col: 'Afternoon', value: 75 },
    { row: 'Tue', col: 'Morning', value: 60 },
    { row: 'Tue', col: 'Afternoon', value: 90 },
  ];
  return (
    <ChartContainer title="Activity Intensity Matrix">
      <HeatmapChart data={data} />
    </ChartContainer>
  );
}

function PolarAreaChartPreview() {
  const data = [
    { label: 'DevOps', value: 80, color: '#3b82f6' },
    { label: 'Frontend', value: 95, color: '#10b981' },
    { label: 'Backend', value: 85, color: '#8b5cf6' },
    { label: 'Design', value: 70, color: '#f59e0b' },
  ];
  return (
    <ChartContainer title="Team Capabilities">
      <PolarAreaChart data={data} />
    </ChartContainer>
  );
}

function RadarChartPreview() {
  const data = [
    { label: 'Speed', value: 90 },
    { label: 'Reliability', value: 85 },
    { label: 'Security', value: 95 },
    { label: 'Usability', value: 88 },
    { label: 'Scalability', value: 92 },
  ];
  return (
    <ChartContainer title="System Radar Evaluation">
      <RadarChart data={data} />
    </ChartContainer>
  );
}

function ScatterChartPreview() {
  const data = [
    { x: 5, y: 10 },
    { x: 15, y: 30 },
    { x: 25, y: 55 },
  ];
  return (
    <ChartContainer title="Correlation Matrix">
      <ScatterChart data={data} />
    </ChartContainer>
  );
}

function StackedAreaChartPreview() {
  const data = [
    { x: 1, y: [20, 30], label: 'Jan' },
    { x: 2, y: [35, 45], label: 'Feb' },
  ];
  return (
    <ChartContainer title="Traffic Split by Source">
      <StackedAreaChart data={data} categories={['Organic', 'Paid']} />
    </ChartContainer>
  );
}

function StackedBarChartPreview() {
  const data = [
    { label: 'Q1', values: [30, 20] },
    { label: 'Q2', values: [45, 30] },
  ];
  return (
    <ChartContainer title="Channel Revenue Breakdown">
      <StackedBarChart data={data} categories={['Direct', 'Partner']} />
    </ChartContainer>
  );
}

function TreemapChartPreview() {
  const data = [
    { label: 'Engine', value: 300, color: '#3b82f6' },
    { label: 'UI', value: 200, color: '#10b981' },
  ];
  return (
    <ChartContainer title="Bundle Size Treemap">
      <TreemapChart data={data} />
    </ChartContainer>
  );
}

/* =========================================================================
   COMPONENTS REGISTRY CATALOG
   ========================================================================= */

export const DESIGN_SYSTEM_COMPONENTS: ComponentItem[] = [
  // 1. PRIMITIVES
  {
    id: 'button',
    name: 'Button',
    file: 'button.tsx',
    category: 'Primitives',
    tag: 'BUTTON',
    description: 'Versatile button with multiple variants, sizes, and interactive animations.',
    Preview: ButtonPreview,
    codeSnippet: `import { Button } from '@/components/ui/button';

export function Example() {
  return <Button variant="default">Click Me</Button>;
}`,
  },
  {
    id: 'badge',
    name: 'Badge',
    file: 'badge.tsx',
    category: 'Primitives',
    tag: 'BADGE',
    description: 'A small status descriptor for UI elements with color indicators.',
    Preview: BadgePreview,
    codeSnippet: `import { Badge } from '@/components/ui/badge';

export function Example() {
  return <Badge variant="success">Active</Badge>;
}`,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    file: 'avatar.tsx',
    category: 'Primitives',
    tag: 'AVATAR',
    description: 'An image element with initials fallback for representing user profiles.',
    Preview: AvatarPreview,
    codeSnippet: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Example() {
  return (
    <Avatar size={48}>
      <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}`,
  },
  {
    id: 'icon',
    name: 'Icon',
    file: 'icon.tsx',
    category: 'Primitives',
    tag: 'ICON',
    description: 'Themed icon component with support for Lucide React Native icons.',
    Preview: IconPreview,
    codeSnippet: `import { Icon } from '@/components/ui/icon';
import { Heart } from 'lucide-react-native';

export function Example() {
  return <Icon name={Heart} size={24} color="#ef4444" />;
}`,
  },
  {
    id: 'image',
    name: 'Image',
    file: 'image.tsx',
    category: 'Primitives',
    tag: 'IMAGE',
    description: 'Responsive image component with loading states and error handling.',
    Preview: ImagePreview,
    codeSnippet: `import { Image } from '@/components/ui/image';

export function Example() {
  return <Image source={{ uri: 'https://example.com/hero.jpg' }} style={{ width: '100%', height: 200 }} />;
}`,
  },
  {
    id: 'text',
    name: 'Text',
    file: 'text.tsx',
    category: 'Primitives',
    tag: 'TEXT',
    description: 'Typography component with preconfigured headings, weights, and color tokens.',
    Preview: TextPreview,
    codeSnippet: `import { Text } from '@/components/ui/text';

export function Example() {
  return <Text variant="title">Heading Text</Text>;
}`,
  },
  {
    id: 'view',
    name: 'View',
    file: 'view.tsx',
    category: 'Primitives',
    tag: 'VIEW',
    description: 'Foundational View component with theme tokens and ref forwarding.',
    Preview: ViewPreview,
    codeSnippet: `import { View } from '@/components/ui/view';

export function Example() {
  return <View style={{ padding: 16 }}>Container</View>;
}`,
  },
  {
    id: 'hello-wave',
    name: 'Hello Wave',
    file: 'hello-wave.tsx',
    category: 'Primitives',
    tag: 'HELLO WAVE',
    description: 'Animated waving hand emoji with smooth rotation animation.',
    Preview: HelloWavePreview,
    codeSnippet: `import { HelloWave } from '@/components/ui/hello-wave';

export function Example() {
  return <HelloWave />;
}`,
  },
  {
    id: 'link',
    name: 'Link',
    file: 'link.tsx',
    category: 'Primitives',
    tag: 'LINK',
    description: 'Accessible navigation link for internal and external URLs.',
    Preview: LinkPreview,
    codeSnippet: `import { Link } from '@/components/ui/link';

export function Example() {
  return <Link href="https://ui.ahmedbna.com">Visit Documentation</Link>;
}`,
  },
  {
    id: 'separator',
    name: 'Separator',
    file: 'separator.tsx',
    category: 'Primitives',
    tag: 'SEPARATOR',
    description: 'Subtle divider lines to delineate sections and content blocks.',
    Preview: SeparatorPreview,
    codeSnippet: `import { Separator } from '@/components/ui/separator';

export function Example() {
  return <Separator style={{ marginVertical: 16 }} />;
}`,
  },

  // 2. INPUTS & FORMS
  {
    id: 'input',
    name: 'Input',
    file: 'input.tsx',
    category: 'Inputs',
    tag: 'INPUT',
    description: 'Styled text input component with labels, validation errors, and icon slots.',
    Preview: InputPreview,
    codeSnippet: `import { Input } from '@/components/ui/input';

export function Example() {
  const [value, setValue] = useState('');
  return <Input label="Email" placeholder="you@example.com" value={value} onChangeText={setValue} />;
}`,
  },
  {
    id: 'input-otp',
    name: 'Input OTP',
    file: 'input-otp.tsx',
    category: 'Inputs',
    tag: 'INPUT OTP',
    description: 'Secure segmented verification pin input for one-time passwords.',
    Preview: InputOTPPreview,
    codeSnippet: `import { InputOTP } from '@/components/ui/input-otp';

export function Example() {
  const [otp, setOtp] = useState('');
  return <InputOTP length={6} value={otp} onChangeText={setOtp} />;
}`,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    file: 'checkbox.tsx',
    category: 'Inputs',
    tag: 'CHECKBOX',
    description: 'Accessible toggle for boolean values and multi-select lists.',
    Preview: CheckboxPreview,
    codeSnippet: `import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} label="Agree to Terms" />;
}`,
  },
  {
    id: 'switch',
    name: 'Switch',
    file: 'switch.tsx',
    category: 'Inputs',
    tag: 'SWITCH',
    description: 'Smooth toggle switch for switching settings and binary preferences.',
    Preview: SwitchPreview,
    codeSnippet: `import { Switch } from '@/components/ui/switch';

export function Example() {
  const [val, setVal] = useState(true);
  return <Switch value={val} onValueChange={setVal} label="Enable Notifications" />;
}`,
  },
  {
    id: 'radio',
    name: 'Radio Group',
    file: 'radio.tsx',
    category: 'Inputs',
    tag: 'RADIO',
    description: 'Set of checkable radio buttons where only one option can be selected.',
    Preview: RadioPreview,
    codeSnippet: `import { RadioGroup } from '@/components/ui/radio';

export function Example() {
  const [val, setVal] = useState('monthly');
  return (
    <RadioGroup
      options={[{ label: 'Monthly', value: 'monthly' }]}
      value={val}
      onValueChange={setVal}
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
    description: 'Two-state button and multi-button segmented groups.',
    Preview: TogglePreview,
    codeSnippet: `import { Toggle, ToggleGroup } from '@/components/ui/toggle';

export function Example() {
  const [active, setActive] = useState(false);
  return <Toggle pressed={active} onPressedChange={setActive}>Toggle Me</Toggle>;
}`,
  },
  {
    id: 'searchbar',
    name: 'Searchbar',
    file: 'searchbar.tsx',
    category: 'Inputs',
    tag: 'SEARCHBAR',
    description: 'Customizable search input with debouncing and clear action.',
    Preview: SearchbarPreview,
    codeSnippet: `import { SearchBar } from '@/components/ui/searchbar';

export function Example() {
  const [q, setQ] = useState('');
  return <SearchBar placeholder="Search..." value={q} onChangeText={setQ} />;
}`,
  },
  {
    id: 'combobox',
    name: 'Combobox',
    file: 'combobox.tsx',
    category: 'Inputs',
    tag: 'COMBOBOX',
    description: 'Searchable dropdown combining an input with a searchable list of items.',
    Preview: ComboboxPreview,
    codeSnippet: `import { Combobox } from '@/components/ui/combobox';

export function Example() {
  const [item, setItem] = useState('');
  return <Combobox items={[{ label: 'Option 1', value: '1' }]} value={item} onValueChange={setItem} />;
}`,
  },
  {
    id: 'picker',
    name: 'Picker',
    file: 'picker.tsx',
    category: 'Inputs',
    tag: 'PICKER',
    description: 'Dropdown selection menu with search and section support.',
    Preview: PickerPreview,
    codeSnippet: `import { Picker } from '@/components/ui/picker';

export function Example() {
  const [val, setVal] = useState('');
  return <Picker options={[{ label: 'A', value: 'a' }]} value={val} onValueChange={setVal} />;
}`,
  },
  {
    id: 'date-picker',
    name: 'Date Picker',
    file: 'date-picker.tsx',
    category: 'Inputs',
    tag: 'DATE PICKER',
    description: 'Date and time selection sheet with calendar and time wheel.',
    Preview: DatePickerPreview,
    codeSnippet: `import { DatePicker } from '@/components/ui/date-picker';

export function Example() {
  const [date, setDate] = useState(new Date());
  return <DatePicker label="Select Date" value={date} onChange={setDate} />;
}`,
  },
  {
    id: 'file-picker',
    name: 'File Picker',
    file: 'file-picker.tsx',
    category: 'Inputs',
    tag: 'FILE PICKER',
    description: 'Upload files and documents with validation and size checks.',
    Preview: FilePickerPreview,
    codeSnippet: `import { FilePicker } from '@/components/ui/file-picker';

export function Example() {
  return <FilePicker onFilesSelected={(files) => console.log(files)} />;
}`,
  },
  {
    id: 'media-picker',
    name: 'Media Picker',
    file: 'media-picker.tsx',
    category: 'Inputs',
    tag: 'MEDIA PICKER',
    description: 'Select images and videos from device gallery or camera.',
    Preview: MediaPickerPreview,
    codeSnippet: `import { MediaPicker } from '@/components/ui/media-picker';

export function Example() {
  return <MediaPicker onSelectionChange={(media) => console.log(media)} />;
}`,
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    file: 'color-picker.tsx',
    category: 'Inputs',
    tag: 'COLOR PICKER',
    description: 'HSV visual color palette and swatch selector.',
    Preview: ColorPickerPreview,
    codeSnippet: `import { ColorPicker } from '@/components/ui/color-picker';

export function Example() {
  const [color, setColor] = useState('#6366f1');
  return <ColorPicker value={color} onColorChange={setColor} />;
}`,
  },
  {
    id: 'slider',
    name: 'Slider',
    file: 'slider.tsx',
    category: 'Inputs',
    tag: 'SLIDER',
    description: 'Smooth slider control for choosing a value within a numeric range.',
    Preview: SliderPreview,
    codeSnippet: `import { Slider } from '@/components/ui/slider';

export function Example() {
  const [val, setVal] = useState(50);
  return <Slider value={val} onValueChange={setVal} min={0} max={100} />;
}`,
  },

  // 3. FEEDBACK & STATUS
  {
    id: 'alert',
    name: 'Alert',
    file: 'alert.tsx',
    category: 'Feedback',
    tag: 'ALERT',
    description: 'Inline callout messages for status notifications and warnings.',
    Preview: AlertPreview,
    codeSnippet: `import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function Example() {
  return (
    <Alert variant="default">
      <AlertTitle>Notification</AlertTitle>
      <AlertDescription>Your file has finished uploading.</AlertDescription>
    </Alert>
  );
}`,
  },
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    file: 'alert-dialog.tsx',
    category: 'Feedback',
    tag: 'ALERT DIALOG',
    description: 'Modal confirmation dialog that interrupts the user for critical decisions.',
    Preview: AlertDialogPreview,
    codeSnippet: `import { AlertDialog } from '@/components/ui/alert-dialog';

export function Example() {
  const [open, setOpen] = useState(false);
  return <AlertDialog isVisible={open} onClose={() => setOpen(false)} title="Confirm Action" onConfirm={() => setOpen(false)} />;
}`,
  },
  {
    id: 'toast',
    name: 'Toast Notifications',
    file: 'toast.tsx',
    category: 'Feedback',
    tag: 'TOAST',
    description: 'Floating notification alerts with iOS Dynamic Island animation.',
    Preview: ToastPreview,
    codeSnippet: `import { useToast } from '@/components/ui/toast';

export function Example() {
  const toast = useToast();
  return <Button onPress={() => toast.success('Saved', 'Changes saved successfully.')}>Show Toast</Button>;
}`,
  },
  {
    id: 'spinner',
    name: 'Spinner & Loader',
    file: 'spinner.tsx',
    category: 'Feedback',
    tag: 'SPINNER',
    description: 'Indicates background activity and asynchronous loading states.',
    Preview: SpinnerPreview,
    codeSnippet: `import { Spinner } from '@/components/ui/spinner';

export function Example() {
  return <Spinner size="default" />;
}`,
  },
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
    id: 'skeleton',
    name: 'Skeleton Shimmer',
    file: 'skeleton.tsx',
    category: 'Feedback',
    tag: 'SKELETON',
    description: 'Placeholder shapes representing content during fetching.',
    Preview: SkeletonPreview,
    codeSnippet: `import { Skeleton } from '@/components/ui/skeleton';

export function Example() {
  return <Skeleton style={{ width: '100%', height: 48, borderRadius: 8 }} />;
}`,
  },

  // 4. LAYOUT & STRUCTURE
  {
    id: 'card',
    name: 'Card',
    file: 'card.tsx',
    category: 'Layout',
    tag: 'CARD',
    description: 'Elevated surfaces grouping related headers, contents, and actions.',
    Preview: CardPreview,
    codeSnippet: `import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function Example() {
  return (
    <Card>
      <CardHeader><CardTitle>Card Header</CardTitle></CardHeader>
      <CardContent><Text>Card Body Content</Text></CardContent>
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
    description: 'Collapsible header sections with smooth height animations.',
    Preview: AccordionPreview,
    codeSnippet: `import { Accordion, AccordionItem } from '@/components/ui/accordion';

export function Example() {
  return (
    <Accordion>
      <AccordionItem title="Question 1">Answer 1</AccordionItem>
    </Accordion>
  );
}`,
  },
  {
    id: 'collapsible',
    name: 'Collapsible',
    file: 'collapsible.tsx',
    category: 'Layout',
    tag: 'COLLAPSIBLE',
    description: 'Interactive component which expands and collapses custom content.',
    Preview: CollapsiblePreview,
    codeSnippet: `import { Collapsible } from '@/components/ui/collapsible';

export function Example() {
  return (
    <Collapsible title="Advanced">
      <Text>Expanded Details</Text>
    </Collapsible>
  );
}`,
  },
  {
    id: 'sheet',
    name: 'Sheet',
    file: 'sheet.tsx',
    category: 'Layout',
    tag: 'SHEET',
    description: 'Side modal sheet for navigation drawers and filter settings.',
    Preview: SheetPreview,
    codeSnippet: `import { Sheet } from '@/components/ui/sheet';

export function Example() {
  const [open, setOpen] = useState(false);
  return <Sheet open={open} onOpenChange={setOpen}><Text>Content</Text></Sheet>;
}`,
  },
  {
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    file: 'bottom-sheet.tsx',
    category: 'Layout',
    tag: 'BOTTOM SHEET',
    description: 'Modal sheet sliding up from bottom with gesture snap points.',
    Preview: BottomSheetPreview,
    codeSnippet: `import { BottomSheet } from '@/components/ui/bottom-sheet';

export function Example() {
  const [open, setOpen] = useState(false);
  return <BottomSheet isVisible={open} onClose={() => setOpen(false)} title="Menu"><Text>Sheet Body</Text></BottomSheet>;
}`,
  },
  {
    id: 'action-sheet',
    name: 'Action Sheet',
    file: 'action-sheet.tsx',
    category: 'Layout',
    tag: 'ACTION SHEET',
    description: 'Native action menu sheet triggered from the bottom of screen.',
    Preview: ActionSheetPreview,
    codeSnippet: `import { ActionSheet } from '@/components/ui/action-sheet';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <ActionSheet
      visible={open}
      onClose={() => setOpen(false)}
      title="Options"
      options={[{ title: 'Option 1', onPress: () => {} }]}
    />
  );
}`,
  },
  {
    id: 'scroll-view',
    name: 'Scroll View',
    file: 'scroll-view.tsx',
    category: 'Layout',
    tag: 'SCROLL VIEW',
    description: 'Scrollable container view with indicator controls.',
    Preview: ScrollViewPreview,
    codeSnippet: `import { ScrollView } from '@/components/ui/scroll-view';

export function Example() {
  return <ScrollView><Text>Scrollable Content</Text></ScrollView>;
}`,
  },
  {
    id: 'avoid-keyboard',
    name: 'Avoid Keyboard',
    file: 'avoid-keyboard.tsx',
    category: 'Layout',
    tag: 'AVOID KEYBOARD',
    description: 'Automatically adjusts viewport height to prevent keyboard overlap.',
    Preview: AvoidKeyboardPreview,
    codeSnippet: `import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';

export function Example() {
  return <AvoidKeyboard><Input label="Chat" /></AvoidKeyboard>;
}`,
  },
  {
    id: 'parallax-scrollview',
    name: 'Parallax ScrollView',
    file: 'parallax-scrollview.tsx',
    category: 'Layout',
    tag: 'PARALLAX',
    description: 'Scroll view featuring a rich parallax header image transformation.',
    Preview: ParallaxScrollViewPreview,
    codeSnippet: `import { ParallaxScrollView } from '@/components/ui/parallax-scrollview';

export function Example() {
  return <ParallaxScrollView headerImage={<Image source={{ uri: '...' }} />}><Text>Content</Text></ParallaxScrollView>;
}`,
  },
  {
    id: 'onboarding',
    name: 'Onboarding Flow',
    file: 'onboarding.tsx',
    category: 'Layout',
    tag: 'ONBOARDING',
    description: 'Multi-step welcome flow with animated pagination and skip controls.',
    Preview: OnboardingPreview,
    codeSnippet: `import { Onboarding } from '@/components/ui/onboarding';

export function Example() {
  return <Onboarding steps={[{ id: '1', title: 'Welcome', description: 'Explore the app' }]} onComplete={() => {}} />;
}`,
  },

  // 5. DISPLAY & OVERLAYS
  {
    id: 'tooltip',
    name: 'Tooltip',
    file: 'tooltip.tsx',
    category: 'Display',
    tag: 'TOOLTIP',
    description: 'Contextual overlays with helpful hints on hover or press.',
    Preview: TooltipPreview,
    codeSnippet: `import { Tooltip } from '@/components/ui/tooltip';

export function Example() {
  return <Tooltip content="Hint text"><Button>Hover</Button></Tooltip>;
}`,
  },
  {
    id: 'popover',
    name: 'Popover',
    file: 'popover.tsx',
    category: 'Display',
    tag: 'POPOVER',
    description: 'Floating rich content layer anchored to any interactive trigger.',
    Preview: PopoverPreview,
    codeSnippet: `import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export function Example() {
  return (
    <Popover>
      <PopoverTrigger><Button>Open</Button></PopoverTrigger>
      <PopoverContent><Text>Popover content</Text></PopoverContent>
    </Popover>
  );
}`,
  },
  {
    id: 'table',
    name: 'Table',
    file: 'table.tsx',
    category: 'Display',
    tag: 'TABLE',
    description: 'Flexible data table with styled header, rows, and cells.',
    Preview: TablePreview,
    codeSnippet: `import { Table } from '@/components/ui/table';

export function Example() {
  return <Table data={[{ id: '1', name: 'Item' }]} columns={[{ id: 'name', header: 'Name', accessorKey: 'name' }]} />;
}`,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    file: 'tabs.tsx',
    category: 'Display',
    tag: 'TABS',
    description: 'Segmented content views with animated indicators.',
    Preview: TabsPreview,
    codeSnippet: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function Example() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger></TabsList>
      <TabsContent value="tab1"><Text>Tab Content</Text></TabsContent>
    </Tabs>
  );
}`,
  },
  {
    id: 'carousel',
    name: 'Carousel',
    file: 'carousel.tsx',
    category: 'Display',
    tag: 'CAROUSEL',
    description: 'Sliding carousel banner with indicators and gestures.',
    Preview: CarouselPreview,
    codeSnippet: `import { Carousel } from '@/components/ui/carousel';

export function Example() {
  return <Carousel showIndicators><View><Text>Slide 1</Text></View></Carousel>;
}`,
  },
  {
    id: 'mode-toggle',
    name: 'Mode Toggle',
    file: 'mode-toggle.tsx',
    category: 'Display',
    tag: 'THEME',
    description: 'Switch between light, dark, and system themes.',
    Preview: ModeTogglePreview,
    codeSnippet: `import { ModeToggle } from '@/components/ui/mode-toggle';

export function Example() {
  return <ModeToggle />;
}`,
  },
  {
    id: 'share',
    name: 'Share',
    file: 'share.tsx',
    category: 'Display',
    tag: 'SHARE',
    description: 'Triggers platform native share sheet with custom links and messages.',
    Preview: SharePreview,
    codeSnippet: `import { ShareButton } from '@/components/ui/share';

export function Example() {
  return <ShareButton message="Check out BNA UI" url="https://ui.ahmedbna.com"><Button>Share</Button></ShareButton>;
}`,
  },

  // 6. MEDIA & AUDIO/VIDEO
  {
    id: 'audio-player',
    name: 'Audio Player',
    file: 'audio-player.tsx',
    category: 'Media',
    tag: 'AUDIO PLAYER',
    description: 'Full audio player with scrubber, time duration, and track info.',
    Preview: AudioPlayerPreview,
    codeSnippet: `import { AudioPlayer } from '@/components/ui/audio-player';

export function Example() {
  return <AudioPlayer source={{ uri: 'https://example.com/audio.mp3' }} showControls />;
}`,
  },
  {
    id: 'audio-recorder',
    name: 'Audio Recorder',
    file: 'audio-recorder.tsx',
    category: 'Media',
    tag: 'AUDIO RECORDER',
    description: 'Records audio with visual waveform feedback and playback.',
    Preview: AudioRecorderPreview,
    codeSnippet: `import { AudioRecorder } from '@/components/ui/audio-recorder';

export function Example() {
  return <AudioRecorder onRecordingComplete={(uri) => console.log(uri)} />;
}`,
  },
  {
    id: 'audio-waveform',
    name: 'Audio Waveform',
    file: 'audio-waveform.tsx',
    category: 'Media',
    tag: 'WAVEFORM',
    description: 'Animated sound waveform visualization with scrubber position.',
    Preview: AudioWaveformPreview,
    codeSnippet: `import { AudioWaveform } from '@/components/ui/audio-waveform';

export function Example() {
  return <AudioWaveform progress={0.5} />;
}`,
  },
  {
    id: 'video',
    name: 'Video Player',
    file: 'video.tsx',
    category: 'Media',
    tag: 'VIDEO',
    description: 'Full-featured video player with native playback controls.',
    Preview: VideoPreview,
    codeSnippet: `import { Video } from '@/components/ui/video';

export function Example() {
  return <Video source={{ uri: 'https://example.com/video.mp4' }} style={{ height: 200 }} nativeControls />;
}`,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    file: 'gallery.tsx',
    category: 'Media',
    tag: 'GALLERY',
    description: 'Responsive multi-image gallery with modal zoom viewer.',
    Preview: GalleryPreview,
    codeSnippet: `import { Gallery } from '@/components/ui/gallery';

export function Example() {
  return <Gallery items={[{ id: '1', uri: 'https://example.com/photo.jpg' }]} columns={3} />;
}`,
  },
  {
    id: 'camera',
    name: 'Camera',
    file: 'camera.tsx',
    category: 'Media',
    tag: 'CAMERA',
    description: 'Camera view with zoom controls, torch, front/back switch, and recording.',
    Preview: CameraPreview,
    codeSnippet: `import { Camera } from '@/components/ui/camera';

export function Example() {
  return <Camera />;
}`,
  },
  {
    id: 'camera-preview',
    name: 'Camera Preview',
    file: 'camera-preview.tsx',
    category: 'Media',
    tag: 'CAMERA PREVIEW',
    description: 'Complete camera screen with capture button and media gallery viewer.',
    Preview: CameraPreviewPreview,
    codeSnippet: `import { CameraPreview } from '@/components/ui/camera-preview';

export function Example() {
  return <CameraPreview onMediaCaptured={(media) => console.log(media)} />;
}`,
  },

  // 7. CHARTS (18 CHARTS)
  {
    id: 'chart-container',
    name: 'Chart Container',
    file: 'chart-container.tsx',
    category: 'Charts',
    tag: 'CONTAINER',
    description: 'Standard container card wrapping charts with header, subtitle, and legend.',
    Preview: ChartContainerPreview,
    codeSnippet: `import { ChartContainer } from '@/components/charts/chart-container';

export function Example() {
  return <ChartContainer title="Telemetry"><Text>Chart Element</Text></ChartContainer>;
}`,
  },
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    file: 'bar-chart.tsx',
    category: 'Charts',
    tag: 'BAR CHART',
    description: 'Vertical bar charts with grid lines, rounded caps, and value tooltips.',
    Preview: BarChartPreview,
    codeSnippet: `import { BarChart } from '@/components/charts/bar-chart';

export function Example() {
  const data = [{ label: 'Jan', value: 40 }, { label: 'Feb', value: 70 }];
  return <BarChart data={data} width={300} height={200} />;
}`,
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    file: 'line-chart.tsx',
    category: 'Charts',
    tag: 'LINE CHART',
    description: 'Continuous smooth line chart with data points and gradient area fills.',
    Preview: LineChartPreview,
    codeSnippet: `import { LineChart } from '@/components/charts/line-chart';

export function Example() {
  const data = [{ label: 'Mon', value: 10 }, { label: 'Tue', value: 35 }];
  return <LineChart data={data} width={300} height={200} />;
}`,
  },
  {
    id: 'area-chart',
    name: 'Area Chart',
    file: 'area-chart.tsx',
    category: 'Charts',
    tag: 'AREA CHART',
    description: 'Smooth gradient-filled area chart for volumetric and trend metrics.',
    Preview: AreaChartPreview,
    codeSnippet: `import { AreaChart } from '@/components/charts/area-chart';

export function Example() {
  const data = [{ label: 'Q1', value: 100 }, { label: 'Q2', value: 250 }];
  return <AreaChart data={data} width={300} height={200} />;
}`,
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    file: 'pie-chart.tsx',
    category: 'Charts',
    tag: 'PIE CHART',
    description: 'Pie charts with percentage distribution and slice highlights.',
    Preview: PieChartPreview,
    codeSnippet: `import { PieChart } from '@/components/charts/pie-chart';

export function Example() {
  const data = [{ label: 'A', value: 60, color: '#3b82f6' }, { label: 'B', value: 40, color: '#10b981' }];
  return <PieChart data={data} size={180} />;
}`,
  },
  {
    id: 'doughnut-chart',
    name: 'Doughnut Chart',
    file: 'doughnut-chart.tsx',
    category: 'Charts',
    tag: 'DOUGHNUT',
    description: 'Donut chart with hollow center, metric display, and legend.',
    Preview: DoughnutChartPreview,
    codeSnippet: `import { DoughnutChart } from '@/components/charts/doughnut-chart';

export function Example() {
  const data = [{ label: 'Direct', value: 50, color: '#3b82f6' }, { label: 'Organic', value: 50, color: '#10b981' }];
  return <DoughnutChart data={data} />;
}`,
  },
  {
    id: 'progress-ring-chart',
    name: 'Progress Ring',
    file: 'progress-ring-chart.tsx',
    category: 'Charts',
    tag: 'PROGRESS RING',
    description: 'Multi-ring radial progress chart for fitness and multi-goal tracking.',
    Preview: ProgressRingChartPreview,
    codeSnippet: `import { ProgressRingChart } from '@/components/charts/progress-ring-chart';

export function Example() {
  const data = [{ label: 'Move', value: 80, color: '#ef4444' }];
  return <ProgressRingChart data={data} size={180} />;
}`,
  },
  {
    id: 'radial-bar-chart',
    name: 'Radial Bar Chart',
    file: 'radial-bar-chart.tsx',
    category: 'Charts',
    tag: 'RADIAL BAR',
    description: 'Circular radial bar chart with gauge display and center metrics.',
    Preview: RadialBarChartPreview,
    codeSnippet: `import { RadialBarChart } from '@/components/charts/radial-bar-chart';

export function Example() {
  const data = [{ label: 'CPU', value: 75, color: '#f43f5e' }];
  return <RadialBarChart data={data} />;
}`,
  },
  {
    id: 'column-chart',
    name: 'Column Chart',
    file: 'column-chart.tsx',
    category: 'Charts',
    tag: 'COLUMN CHART',
    description: 'Horizontal column bars for comparing categorized values.',
    Preview: ColumnChartPreview,
    codeSnippet: `import { ColumnChart } from '@/components/charts/column-chart';

export function Example() {
  const data = [{ label: 'Item 1', value: 80, color: '#3b82f6' }];
  return <ColumnChart data={data} />;
}`,
  },
  {
    id: 'bubble-chart',
    name: 'Bubble Chart',
    file: 'bubble-chart.tsx',
    category: 'Charts',
    tag: 'BUBBLE CHART',
    description: '3D coordinate mapping chart visualizing X, Y, and magnitude size.',
    Preview: BubbleChartPreview,
    codeSnippet: `import { BubbleChart } from '@/components/charts/bubble-chart';

export function Example() {
  const data = [{ x: 10, y: 20, size: 15, label: 'A' }];
  return <BubbleChart data={data} />;
}`,
  },
  {
    id: 'candlestick-chart',
    name: 'Candlestick Chart',
    file: 'candlestick-chart.tsx',
    category: 'Charts',
    tag: 'CANDLESTICK',
    description: 'Financial stock chart with Open, High, Low, and Close candles.',
    Preview: CandlestickChartPreview,
    codeSnippet: `import { CandlestickChart } from '@/components/charts/candlestick-chart';

export function Example() {
  const data = [{ date: 'Mon', open: 100, high: 120, low: 95, close: 115 }];
  return <CandlestickChart data={data} />;
}`,
  },
  {
    id: 'heatmap-chart',
    name: 'Heatmap Chart',
    file: 'heatmap-chart.tsx',
    category: 'Charts',
    tag: 'HEATMAP',
    description: 'Matrix color density map for activity levels and time distributions.',
    Preview: HeatmapChartPreview,
    codeSnippet: `import { HeatmapChart } from '@/components/charts/heatmap-chart';

export function Example() {
  const data = [{ row: 'Mon', col: 'Morning', value: 40 }];
  return <HeatmapChart data={data} />;
}`,
  },
  {
    id: 'polar-area-chart',
    name: 'Polar Area Chart',
    file: 'polar-area-chart.tsx',
    category: 'Charts',
    tag: 'POLAR AREA',
    description: 'Polar radial area chart with equal-angle variable-radius sectors.',
    Preview: PolarAreaChartPreview,
    codeSnippet: `import { PolarAreaChart } from '@/components/charts/polar-area-chart';

export function Example() {
  const data = [{ label: 'A', value: 80, color: '#3b82f6' }];
  return <PolarAreaChart data={data} />;
}`,
  },
  {
    id: 'radar-chart',
    name: 'Radar Chart',
    file: 'radar-chart.tsx',
    category: 'Charts',
    tag: 'RADAR CHART',
    description: 'Spider radar plot for multi-variable attribute comparison.',
    Preview: RadarChartPreview,
    codeSnippet: `import { RadarChart } from '@/components/charts/radar-chart';

export function Example() {
  const data = [{ label: 'Speed', value: 90 }, { label: 'Quality', value: 80 }];
  return <RadarChart data={data} />;
}`,
  },
  {
    id: 'scatter-chart',
    name: 'Scatter Chart',
    file: 'scatter-chart.tsx',
    category: 'Charts',
    tag: 'SCATTER CHART',
    description: 'Scatter point chart for statistical distributions and cluster analysis.',
    Preview: ScatterChartPreview,
    codeSnippet: `import { ScatterChart } from '@/components/charts/scatter-chart';

export function Example() {
  const data = [{ x: 5, y: 10 }, { x: 15, y: 30 }];
  return <ScatterChart data={data} />;
}`,
  },
  {
    id: 'stacked-area-chart',
    name: 'Stacked Area Chart',
    file: 'stacked-area-chart.tsx',
    category: 'Charts',
    tag: 'STACKED AREA',
    description: 'Multi-series cumulative area chart for layered volume breakdown.',
    Preview: StackedAreaChartPreview,
    codeSnippet: `import { StackedAreaChart } from '@/components/charts/stacked-area-chart';

export function Example() {
  const data = [{ x: 1, y: [20, 30], label: 'Jan' }];
  return <StackedAreaChart data={data} categories={['Organic', 'Paid']} />;
}`,
  },
  {
    id: 'stacked-bar-chart',
    name: 'Stacked Bar Chart',
    file: 'stacked-bar-chart.tsx',
    category: 'Charts',
    tag: 'STACKED BAR',
    description: 'Segmented horizontal and vertical stacked bar charts.',
    Preview: StackedBarChartPreview,
    codeSnippet: `import { StackedBarChart } from '@/components/charts/stacked-bar-chart';

export function Example() {
  const data = [{ label: 'Q1', values: [30, 20] }];
  return <StackedBarChart data={data} categories={['Direct', 'Partner']} />;
}`,
  },
  {
    id: 'treemap-chart',
    name: 'Treemap Chart',
    file: 'treemap-chart.tsx',
    category: 'Charts',
    tag: 'TREEMAP',
    description: 'Hierarchical nested rectangles scaled proportionally by value.',
    Preview: TreemapChartPreview,
    codeSnippet: `import { TreemapChart } from '@/components/charts/treemap-chart';

export function Example() {
  const data = [{ label: 'Engine', value: 300, color: '#3b82f6' }];
  return <TreemapChart data={data} />;
}`,
  },
  // ─── THEMES ─────────────────────────────────────────────────────────────
  {
    id: 'app-themes',
    name: 'App Themes & Tokens Showcase',
    file: 'color-themes.ts',
    category: 'Themes',
    tag: 'THEMES',
    description: 'Dynamic theme explorer featuring 50+ curated themes, base palettes, and live mode preview.',
    Preview: AppThemesPreview,
    codeSnippet: `import { useColorTheme } from '@/providers/color-theme-provider';

export function Example() {
  const { colorTheme, setColorTheme, colorThemes } = useColorTheme();
  return (
    <button onClick={() => setColorTheme('supabase')}>
      Current Theme: {colorTheme}
    </button>
  );
}`,
  },

  // ─── ICONS ──────────────────────────────────────────────────────────────
  {
    id: 'lucide-icons',
    name: 'Lucide React Icons Explorer',
    file: 'icon.tsx',
    category: 'Icons',
    tag: 'ICONS',
    description: 'Comprehensive searchable icon gallery with live stroke, size & color customization.',
    Preview: LucideIconsPreview,
    codeSnippet: `import { Search, Sparkles, Heart, Settings } from 'lucide-react-native';

export function Example() {
  return <Sparkles size={24} color="#8b5cf6" strokeWidth={2} />;
}`,
  },

  // ─── CHAT ───────────────────────────────────────────────────────────────
  {
    id: 'chat-sidebar',
    name: 'Chat Sidebar',
    file: 'chat-sidebar.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Master sidebar container with subtabs (Chats, Contact, Groups, Folder), search bar, category divider line with count, and a scrollable conversation list.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-sidebar' }} />,
    codeSnippet: `import { ChatSidebar, ChatCardItem } from '@/components/chat';

export function Example() {
  return (
    <ChatSidebar tabs={[{ id: 'chats', label: 'Chats' }]} activeTab="chats">
      <ChatCardItem id="1" title="Aman" lastMessage="Hey there!" isActive />
    </ChatSidebar>
  );
}`,
  },
  {
    id: 'chat-card-item',
    name: 'Chat Card Item',
    file: 'chat-card-item.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Conversation preview card for sidebar list. Displays contact name, pill badge (💬 Chat), timestamp, member & online counter, and last message snippet with active left accent stripe.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-card-item' }} />,
    codeSnippet: `import { ChatCardItem } from '@/components/chat';

export function Example() {
  return (
    <ChatCardItem
      id="c1"
      title="Aman"
      badgeLabel="Chat"
      time="about 3 hours ago"
      membersCount={2}
      lastMessage="images (1).jpg"
      isActive
    />
  );
}`,
  },
  {
    id: 'chat-input',
    name: 'Chat Input (Composer)',
    file: 'chat-input.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Modern messaging pill input container with emoji picker, attachment clip, camera trigger, and circular emerald green microphone/send button.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-input' }} />,
    codeSnippet: `import { ChatInput } from '@/components/chat';

export function Example() {
  const [msg, setMsg] = React.useState('');
  return <ChatInput value={msg} onChange={setMsg} onSend={() => setMsg('')} placeholder="Message" />;
}`,
  },
  {
    id: 'chat-header',
    name: 'Chat Header',
    file: 'chat-header.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Conversation header bar with user avatar, status/presence, and exact HeaderActions (Act on this bell, Quick Flag, and 3-dot dropdown menu).',
    Preview: () => <ChatPreviews entry={{ id: 'chat-header' }} />,
    codeSnippet: `import { ChatHeader } from '@/components/chat';

export function Example() {
  return (
    <ChatHeader
      title="Mohammed Aman"
      subtitle="Last seen today at 04:58 PM"
      status="online"
    />
  );
}`,
  },
  {
    id: 'chat-message-list',
    name: 'Chat Message List',
    file: 'chat-message-list.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Scrollable message viewport container with automatic auto-scroll to bottom, infinite scroll top loader for history, and rich bubble rendering for text, live location cards, and media attachments.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-message-list' }} />,
    codeSnippet: `import { ChatMessageList, ChatBubble } from '@/components/chat';

export function Example() {
  return (
    <ChatMessageList>
      <ChatBubble senderName="Mohammed Aman" content="Hello!" time="09:06 AM" status="read" />
    </ChatMessageList>
  );
}`,
  },
  {
    id: 'chat-bubble',
    name: 'Message Bubble',
    file: 'chat-bubble.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Pure, customizable message bubble. Supports text, file/PDF attachments, location cards, status delivery receipts (sent, delivered, read), and interactive reactions.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-bubble' }} />,
    codeSnippet: `import { ChatBubble } from '@/components/chat';

export function Example() {
  return (
    <ChatBubble
      senderName="Aman"
      content="Got it! Looks super clean."
      time="09:55 AM"
      status="read"
      reactions={[{ emoji: '👍', count: 2 }]}
    />
  );
}`,
  },
  {
    id: 'typing-indicator',
    name: 'Typing Indicator',
    file: 'typing-indicator.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Smooth 3-dot pulse animation indicating live incoming message activity.',
    Preview: () => <ChatPreviews entry={{ id: 'typing-indicator' }} />,
    codeSnippet: `import { TypingIndicator } from '@/components/chat';

export function Example() {
  return <TypingIndicator label="Aman is typing..." />;
}`,
  },
  {
    id: 'chat-empty-state',
    name: 'Chat Empty State',
    file: 'chat-empty-state.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Clean placeholder screen displayed when no conversation is selected or a message thread is empty.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-empty-state' }} />,
    codeSnippet: `import { ChatEmptyState } from '@/components/chat';

export function Example() {
  return (
    <ChatEmptyState
      title="No conversation selected"
      description="Choose a chat from the sidebar or start a new conversation to begin messaging."
    />
  );
}`,
  },
  {
    id: 'contact-manager',
    name: 'Contact Manager',
    file: 'contact-manager.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Standalone contact management interface. Displays saved contacts with avatar initials, email, status toggle switch, and direct actions for Chat, Edit, and Delete.',
    Preview: () => <ChatPreviews entry={{ id: 'contact-manager' }} />,
    codeSnippet: `import { ContactManager } from '@/components/chat';

export function Example() {
  return <ContactManager contacts={[{ id: '1', name: 'Aman', email: 'aman@amoga.io', initials: 'AM', isEnabled: true }]} />;
}`,
  },
  {
    id: 'group-manager',
    name: 'Groups Manager',
    file: 'group-manager.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Group channel manager for creating, searching, and managing team chat groups with member counts and instant chat triggers.',
    Preview: () => <ChatPreviews entry={{ id: 'group-manager' }} />,
    codeSnippet: `import { GroupManager } from '@/components/chat';

export function Example() {
  return <GroupManager groups={[{ id: 'g1', name: 'Design Team', membersCount: 4, isEnabled: true }]} />;
}`,
  },
  {
    id: 'chat-action-menu',
    name: '3-Dot Message Action Menu',
    file: 'chat-action-menu.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Interactive dropdown context menu for chat messages featuring Reply, Forward, Pin Message, Star, Favorite, Archive, Action This, and Delete.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-action-menu' }} />,
    codeSnippet: `import { ChatActionMenu } from '@/components/chat';

export function Example() {
  return <ChatActionMenu onSelect={(actionId) => console.log(actionId)} />;
}`,
  },
  {
    id: 'chat-icon-bar',
    name: 'Chat Icon Bar (Action Pill)',
    file: 'chat-icon-bar.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Floating pill action bar for message feedback and reactions featuring Thumbs Up, Thumbs Down, Copy, Share, and More options.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-icon-bar' }} />,
    codeSnippet: `import { ChatIconBar } from '@/components/chat';

export function Example() {
  return <ChatIconBar onThumbUp={() => {}} onCopy={() => {}} />;
}`,
  },
  {
    id: 'file-upload-progress',
    name: 'File Upload with Progress Bar',
    file: 'file-upload-progress.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Dynamic file upload progress indicator card supporting upload states (Uploading, Paused, Completed, Error), smooth percentage bar, and pause/cancel/retry controls.',
    Preview: () => <ChatPreviews entry={{ id: 'file-upload-progress' }} />,
    codeSnippet: `import { FileUploadProgress } from '@/components/chat';

export function Example() {
  return (
    <FileUploadProgress
      fileName="quarterly_financial_report.pdf"
      fileSize="3.6 MB"
      fileType="PDF"
      initialProgress={68}
      status="uploading"
    />
  );
}`,
  },
  {
    id: 'uploaded-file-card',
    name: 'Uploaded File Card',
    file: 'uploaded-file-card.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Compact attachment card displaying file type icon badge, document name, file size/extension metadata, and direct View/Preview and Download actions.',
    Preview: () => <ChatPreviews entry={{ id: 'uploaded-file-card' }} />,
    codeSnippet: `import { UploadedFileCard } from '@/components/chat';

export function Example() {
  return (
    <UploadedFileCard
      fileName="bank-full.csv"
      fileSize="3.6 MB"
      fileType="CSV"
      extension="csv"
      onPreview={() => {}}
      onDownload={() => {}}
    />
  );
}`,
  },
  {
    id: 'chat-attachment-menu',
    name: 'Chat Attachment Menu',
    file: 'chat-attachment-menu.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Interactive popup attachment menu featuring Images, Videos, Documents, Location, Image Converter, Doc Converter, Doc Scanner, Scan Document, and Extract Text.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-attachment-menu' }} />,
    codeSnippet: `import { ChatAttachmentMenu } from '@/components/chat';

export function Example() {
  return <ChatAttachmentMenu onSelect={(type) => console.log(type)} selectedId="location" />;
}`,
  },
  {
    id: 'chat-location-card',
    name: 'Location Sharing Card',
    file: 'chat-location-card.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Rich location sharing card with animated radar map canvas, map pin marker, coordinates, live tracking badge, and direct Navigate & View actions.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-location-card' }} />,
    codeSnippet: `import { ChatLocationCard } from '@/components/chat';

export function Example() {
  return (
    <ChatLocationCard
      title="Amoga Tech Hub"
      address="Building 10, Cyber City, Gurugram"
      latitude={28.4595}
      longitude={77.0266}
      isLive
    />
  );
}`,
  },
];

export const COMPONENTS = DESIGN_SYSTEM_COMPONENTS;
