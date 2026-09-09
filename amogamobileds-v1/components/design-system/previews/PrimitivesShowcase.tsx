import React, { useState } from 'react'
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  User,
  Heart,
  Mail,
  Send,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Copy,
  Eye,
  EyeOff,
  Bell,
  Search,
  ExternalLink,
  Terminal,
  Bookmark,
  Share2,
  Printer,
  Calendar,
  Layers,
  Settings,
  HelpCircle,
  LogOut,
  Folder,
  Code,
  Image as ImageIcon,
  ChevronsUpDown,
  Laptop,
} from 'lucide-react-native'
import { useTheme } from '../../../providers/theme-provider'
import type { GalleryEntry } from '../../types'

interface PrimitivesShowcaseProps {
  entry: GalleryEntry
}

export function PrimitivesShowcase({ entry }: PrimitivesShowcaseProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  // Interactive local states
  const [activeTab, setActiveTab] = useState('preview')
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    item1: true,
    item2: false,
    item3: false,
  })
  const [switchStates, setSwitchStates] = useState({
    airplane: false,
    notifications: true,
    marketing: false,
    security: true,
  })
  const [checkboxStates, setCheckboxStates] = useState({
    terms: true,
    newsletter: false,
    bookmarks: true,
    urls: false,
  })
  const [selectedRadio, setSelectedRadio] = useState('comfortable')
  const [selectedProfile, setSelectedProfile] = useState('andy')
  const [selectedTabPane, setSelectedTabPane] = useState('account')
  const [selectedFruit, setSelectedFruit] = useState('Apple')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>('file')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(true)
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(true)
  const [isTooltipOpen, setIsTooltipOpen] = useState(true)
  const [progressVal, setProgressVal] = useState(66)
  const [singleToggle, setSingleToggle] = useState(true)
  const [toggleGroup, setToggleGroup] = useState({
    bold: true,
    italic: false,
    underline: false,
  })
  const [inputValue, setInputValue] = useState('m@example.com')
  const [textareaValue, setTextareaValue] = useState(
    'Type your message here.'
  )
  const [showPassword, setShowPassword] = useState(false)

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Render component-specific live demo (1:1 with React Native Reusables)
  const renderDemo = () => {
    const id = (entry?.id || '').toLowerCase()
    const name = (entry?.name || '').toLowerCase()

    // ─── 1. MENUBAR ───────────────────────────────────────────
    if (id.includes('menubar') || name.includes('menubar')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Menubar Preview
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
            A visually persistent desktop-grade menu providing quick access to commands.
          </Text>

          {/* Menubar Container */}
          <View
            style={[
              styles.menubarBar,
              { backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border },
            ]}
          >
            {['file', 'edit', 'view', 'profiles'].map((menuKey) => {
              const label = menuKey.charAt(0).toUpperCase() + menuKey.slice(1)
              const isActive = isMenuOpen === menuKey
              return (
                <Pressable
                  key={menuKey}
                  onPress={() => setIsMenuOpen(isActive ? null : menuKey)}
                  style={[
                    styles.menubarTab,
                    isActive && {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : colors.secondary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.menubarTabText,
                      {
                        color: isActive ? colors.primary : colors.foreground,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* Open Menubar Dropdown Menu */}
          {isMenuOpen === 'file' && (
            <View
              style={[
                styles.menuDropdown,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Pressable style={styles.menuItemRow}>
                <Text style={[styles.menuItemLabel, { color: colors.foreground }]}>New Tab</Text>
                <Text style={[styles.menuItemShortcut, { color: colors.mutedForeground }]}>⌘T</Text>
              </Pressable>
              <Pressable style={styles.menuItemRow}>
                <Text style={[styles.menuItemLabel, { color: colors.foreground }]}>New Window</Text>
                <Text style={[styles.menuItemShortcut, { color: colors.mutedForeground }]}>⌘N</Text>
              </Pressable>
              <Pressable style={styles.menuItemRow}>
                <Text style={[styles.menuItemLabel, { color: colors.mutedForeground }]}>New Incognito Window</Text>
              </Pressable>

              <View style={[styles.cardDivider, { backgroundColor: colors.border, marginVertical: 4 }]} />

              <Pressable style={styles.menuItemRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Share2 size={14} color={colors.mutedForeground} />
                  <Text style={[styles.menuItemLabel, { color: colors.foreground }]}>Share</Text>
                </View>
                <ChevronRight size={14} color={colors.mutedForeground} />
              </Pressable>

              <View style={[styles.cardDivider, { backgroundColor: colors.border, marginVertical: 4 }]} />

              <Pressable style={styles.menuItemRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Printer size={14} color={colors.mutedForeground} />
                  <Text style={[styles.menuItemLabel, { color: colors.foreground }]}>Print...</Text>
                </View>
                <Text style={[styles.menuItemShortcut, { color: colors.mutedForeground }]}>⌘P</Text>
              </Pressable>
            </View>
          )}

          {isMenuOpen === 'view' && (
            <View
              style={[
                styles.menuDropdown,
                { backgroundColor: colors.card, borderColor: colors.border, marginLeft: 80 },
              ]}
            >
              <Pressable
                onPress={() =>
                  setCheckboxStates((c) => ({ ...c, bookmarks: !c.bookmarks }))
                }
                style={styles.menuItemRow}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {checkboxStates.bookmarks && <Check size={14} color={colors.primary} strokeWidth={3} />}
                  <Text style={[styles.menuItemLabel, { color: colors.foreground, marginLeft: checkboxStates.bookmarks ? 0 : 22 }]}>
                    Always Show Bookmarks Bar
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() =>
                  setCheckboxStates((c) => ({ ...c, urls: !c.urls }))
                }
                style={styles.menuItemRow}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {checkboxStates.urls && <Check size={14} color={colors.primary} strokeWidth={3} />}
                  <Text style={[styles.menuItemLabel, { color: colors.foreground, marginLeft: checkboxStates.urls ? 0 : 22 }]}>
                    Always Show Full URLs
                  </Text>
                </View>
              </Pressable>

              <View style={[styles.cardDivider, { backgroundColor: colors.border, marginVertical: 4 }]} />

              <Pressable style={styles.menuItemRow}>
                <Text style={[styles.menuItemLabel, { color: colors.foreground, marginLeft: 22 }]}>Reload</Text>
                <Text style={[styles.menuItemShortcut, { color: colors.mutedForeground }]}>⌘R</Text>
              </Pressable>
            </View>
          )}

          {isMenuOpen === 'profiles' && (
            <View
              style={[
                styles.menuDropdown,
                { backgroundColor: colors.card, borderColor: colors.border, marginLeft: 140 },
              ]}
            >
              {['andy', 'benoit', 'luis'].map((p) => {
                const pLabel = p.charAt(0).toUpperCase() + p.slice(1)
                const isSelected = selectedProfile === p
                return (
                  <Pressable
                    key={p}
                    onPress={() => setSelectedProfile(p)}
                    style={styles.menuItemRow}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {isSelected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                      <Text style={[styles.menuItemLabel, { color: colors.foreground, marginLeft: isSelected ? 0 : 18 }]}>
                        {pLabel}
                      </Text>
                    </View>
                  </Pressable>
                )
              })}
              <View style={[styles.cardDivider, { backgroundColor: colors.border, marginVertical: 4 }]} />
              <Pressable style={styles.menuItemRow}>
                <Text style={[styles.menuItemLabel, { color: colors.foreground, marginLeft: 18 }]}>Edit...</Text>
              </Pressable>
            </View>
          )}
        </View>
      )
    }

    // ─── 2. DIALOG ────────────────────────────────────────────
    if (id === 'primitive-dialog' || name === 'dialog') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Dialog Modal Preview
          </Text>
          <Pressable
            onPress={() => setIsDialogOpen(!isDialogOpen)}
            style={[styles.btn, { backgroundColor: colors.primary, alignSelf: 'flex-start' }]}
          >
            <Text style={[styles.btnText, { color: colors.primaryForeground || '#ffffff' }]}>
              {isDialogOpen ? 'Close Dialog' : 'Edit Profile'}
            </Text>
          </Pressable>

          {/* Dialog Container */}
          <View
            style={[
              styles.dialogBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardHeading, { color: colors.foreground }]}>
                Edit profile
              </Text>
              <Text style={[styles.cardSubheading, { color: colors.mutedForeground }]}>
                Make changes to your profile here. Click save when you're done.
              </Text>
            </View>

            <View style={{ gap: 14 }}>
              <View style={styles.dialogFormRow}>
                <Text style={[styles.fieldLabel, { width: 80, color: colors.foreground }]}>
                  Name
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { flex: 1, backgroundColor: isDark ? colors.background : '#ffffff', borderColor: colors.border },
                  ]}
                >
                  <TextInput
                    defaultValue='Pedro Duarte'
                    style={[styles.textInput, { color: colors.foreground }]}
                  />
                </View>
              </View>

              <View style={styles.dialogFormRow}>
                <Text style={[styles.fieldLabel, { width: 80, color: colors.foreground }]}>
                  Username
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { flex: 1, backgroundColor: isDark ? colors.background : '#ffffff', borderColor: colors.border },
                  ]}
                >
                  <TextInput
                    defaultValue='@peduarte'
                    style={[styles.textInput, { color: colors.foreground }]}
                  />
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Pressable
                style={[styles.btn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
              >
                <Text style={[styles.btnText, { color: colors.foreground }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
              >
                <Text style={[styles.btnText, { color: colors.primaryForeground || '#ffffff' }]}>
                  Save changes
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )
    }

    // ─── 3. ALERT DIALOG ──────────────────────────────────────
    if (id.includes('alert-dialog') || name.includes('alert dialog')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Alert Dialog Confirmation
          </Text>
          <View
            style={[
              styles.dialogBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardHeading, { color: colors.foreground }]}>
                Are you absolutely sure?
              </Text>
              <Text style={[styles.cardSubheading, { color: colors.mutedForeground, lineHeight: 20 }]}>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Pressable
                style={[styles.btn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
              >
                <Text style={[styles.btnText, { color: colors.foreground }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { backgroundColor: colors.destructive, borderColor: colors.destructive }]}
              >
                <Text style={[styles.btnText, { color: '#ffffff' }]}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )
    }

    // ─── 4. SELECT ────────────────────────────────────────────
    if (id === 'primitive-select' || name === 'select') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Select Trigger & Options
          </Text>

          <Pressable
            onPress={() => setIsSelectOpen(!isSelectOpen)}
            style={[
              styles.selectTrigger,
              {
                backgroundColor: isDark ? colors.card : '#ffffff',
                borderColor: isSelectOpen ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={{ fontSize: 13, color: colors.foreground }}>{selectedFruit}</Text>
            <ChevronsUpDown size={16} color={colors.mutedForeground} />
          </Pressable>

          {isSelectOpen && (
            <View
              style={[
                styles.selectMenu,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.mutedForeground, paddingHorizontal: 8, paddingVertical: 4 }}>
                FRUITS
              </Text>
              {['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'].map((fruit) => {
                const isSelected = selectedFruit === fruit
                return (
                  <Pressable
                    key={fruit}
                    onPress={() => {
                      setSelectedFruit(fruit)
                      setIsSelectOpen(false)
                    }}
                    style={({ pressed }) => [
                      styles.selectItem,
                      isSelected && { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : colors.secondary },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={{ fontSize: 13, color: colors.foreground }}>{fruit}</Text>
                    {isSelected && <Check size={14} color={colors.primary} strokeWidth={2.5} />}
                  </Pressable>
                )
              })}
            </View>
          )}
        </View>
      )
    }

    // ─── 5. POPOVER ───────────────────────────────────────────
    if (id.includes('popover') || name.includes('popover')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Popover Dimensions Settings
          </Text>
          <View
            style={[
              styles.dialogBox,
              { backgroundColor: colors.card, borderColor: colors.border, maxWidth: 360 },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardHeading, { color: colors.foreground, fontSize: 15 }]}>
                Dimensions
              </Text>
              <Text style={[styles.cardSubheading, { color: colors.mutedForeground }]}>
                Set the dimensions for the layer.
              </Text>
            </View>

            <View style={{ gap: 10 }}>
              {[
                { label: 'Width', val: '100%' },
                { label: 'Max. width', val: '300px' },
                { label: 'Height', val: '25px' },
                { label: 'Max. height', val: 'none' },
              ].map((dim, i) => (
                <View key={i} style={styles.dialogFormRow}>
                  <Text style={[styles.fieldLabel, { width: 90, color: colors.foreground }]}>
                    {dim.label}
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { flex: 1, backgroundColor: isDark ? colors.background : '#ffffff', borderColor: colors.border },
                    ]}
                  >
                    <TextInput
                      defaultValue={dim.val}
                      style={[styles.textInput, { color: colors.foreground }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )
    }

    // ─── 6. TOOLTIP & HOVER CARD ──────────────────────────────
    if (
      id.includes('tooltip') ||
      name.includes('tooltip') ||
      id.includes('hover') ||
      name.includes('hover')
    ) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Tooltip & Hover Card Previews
          </Text>

          {/* Tooltip Demonstration */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.mutedForeground }}>
              Tooltip Popup
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable
                style={[
                  styles.btn,
                  { backgroundColor: colors.secondary, borderColor: colors.border },
                ]}
              >
                <Bookmark size={16} color={colors.foreground} />
                <Text style={[styles.btnText, { color: colors.foreground }]}>Hover / Press Me</Text>
              </Pressable>
              <View
                style={[
                  styles.badgePill,
                  {
                    backgroundColor: isDark ? '#18181b' : '#09090b',
                    borderColor: colors.border,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  },
                ]}
              >
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#ffffff' }}>
                  Add to library
                </Text>
              </View>
            </View>
          </View>

          {/* Hover Card Demonstration */}
          <View style={{ gap: 8, marginTop: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.mutedForeground }}>
              Hover Card Info
            </Text>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: colors.card, borderColor: colors.border, maxWidth: 360 },
              ]}
            >
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <View
                  style={[
                    styles.avatar,
                    styles.avatarMd,
                    { backgroundColor: isDark ? '#ffffff' : '#09090b' },
                  ]}
                >
                  <Text style={[styles.avatarTextMd, { color: isDark ? '#09090b' : '#ffffff' }]}>
                    N
                  </Text>
                </View>
                <View style={{ gap: 2, flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground }}>
                    @nextjs
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                    The React Framework – created and maintained by @vercel.
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Calendar size={13} color={colors.mutedForeground} />
                <Text style={{ fontSize: 11, color: colors.mutedForeground }}>
                  Joined December 2021
                </Text>
              </View>
            </View>
          </View>
        </View>
      )
    }

    // ─── 7. COLLAPSIBLE ───────────────────────────────────────
    if (id.includes('collapsible') || name.includes('collapsible')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Collapsible Section
          </Text>
          <View
            style={[
              styles.cardBox,
              { backgroundColor: colors.card, borderColor: colors.border, maxWidth: 380 },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.foreground }}>
                @peduarte starred 3 repositories
              </Text>
              <Pressable
                onPress={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
                style={[styles.btn, styles.btnSm, { backgroundColor: colors.secondary, borderColor: colors.border }]}
              >
                <ChevronsUpDown size={14} color={colors.foreground} />
              </Pressable>
            </View>

            <View
              style={[
                styles.badgePill,
                { backgroundColor: colors.secondary, borderColor: colors.border, alignSelf: 'stretch', justifyContent: 'center' },
              ]}
            >
              <Text style={{ fontSize: 12, color: colors.foreground }}>@radix-ui/primitives</Text>
            </View>

            {isCollapsibleOpen && (
              <View style={{ gap: 8 }}>
                <View
                  style={[
                    styles.badgePill,
                    { backgroundColor: colors.secondary, borderColor: colors.border, alignSelf: 'stretch', justifyContent: 'center' },
                  ]}
                >
                  <Text style={{ fontSize: 12, color: colors.foreground }}>@radix-ui/react</Text>
                </View>
                <View
                  style={[
                    styles.badgePill,
                    { backgroundColor: colors.secondary, borderColor: colors.border, alignSelf: 'stretch', justifyContent: 'center' },
                  ]}
                >
                  <Text style={{ fontSize: 12, color: colors.foreground }}>@stitches/react</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )
    }

    // ─── 8. ASPECT RATIO ──────────────────────────────────────
    if (id.includes('aspect') || name.includes('aspect')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Aspect Ratio (16:9 Container)
          </Text>
          <View
            style={[
              styles.cardBox,
              { backgroundColor: colors.card, borderColor: colors.border, maxWidth: 440, padding: 0, overflow: 'hidden' },
            ]}
          >
            <View
              style={{
                width: '100%',
                aspectRatio: 16 / 9,
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <ImageIcon size={48} color={colors.primary} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>
                16 : 9 Aspect Ratio Preview
              </Text>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground }}>
                Landscape Hero Banner
              </Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>
                Photo by Drew Beamer on Unsplash.
              </Text>
            </View>
          </View>
        </View>
      )
    }

    // ─── 9. SEPARATOR ─────────────────────────────────────────
    if (id.includes('separator') || name.includes('separator')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Separator Demo
          </Text>
          <View style={{ gap: 12, maxWidth: 400 }}>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground }}>
                Radix Primitives
              </Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                An open-source UI component library for React and React Native.
              </Text>
            </View>
            <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Text style={{ fontSize: 12, color: colors.foreground }}>Blog</Text>
              <View style={{ width: 1, height: 16, backgroundColor: colors.border }} />
              <Text style={{ fontSize: 12, color: colors.foreground }}>Docs</Text>
              <View style={{ width: 1, height: 16, backgroundColor: colors.border }} />
              <Text style={{ fontSize: 12, color: colors.foreground }}>Source</Text>
            </View>
          </View>
        </View>
      )
    }

    // ─── 10. BUTTONS ──────────────────────────────────────────
    if (id === 'primitive-button' || name === 'button') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Button Variants & Sizes
          </Text>
          <View style={styles.rowWrap}>
            <Pressable
              style={[styles.btn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
            >
              <Text style={[styles.btnText, { color: colors.primaryForeground || '#ffffff' }]}>
                Default
              </Text>
            </Pressable>

            <Pressable
              style={[styles.btn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
            >
              <Text style={[styles.btnText, { color: colors.foreground }]}>Secondary</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1.5 }]}
            >
              <Text style={[styles.btnText, { color: colors.foreground }]}>Outline</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, { backgroundColor: colors.destructive, borderColor: colors.destructive }]}
            >
              <Text style={[styles.btnText, { color: '#ffffff' }]}>Destructive</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, { backgroundColor: 'transparent', borderColor: 'transparent' }]}
            >
              <Text style={[styles.btnText, { color: colors.foreground }]}>Ghost</Text>
            </Pressable>

            <Pressable style={styles.linkBtn}>
              <Text style={[styles.linkBtnText, { color: colors.primary }]}>Link</Text>
            </Pressable>
          </View>
        </View>
      )
    }

    // ─── 11. BADGE ────────────────────────────────────────────
    if (id === 'primitive-badge' || name === 'badge') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Badge Variants
          </Text>
          <View style={styles.rowWrap}>
            <View
              style={[
                styles.badgePill,
                { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.badgePillText, { color: colors.primaryForeground || '#ffffff' }]}>
                Default
              </Text>
            </View>

            <View
              style={[
                styles.badgePill,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.badgePillText, { color: colors.foreground }]}>
                Secondary
              </Text>
            </View>

            <View
              style={[
                styles.badgePill,
                { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 },
              ]}
            >
              <Text style={[styles.badgePillText, { color: colors.foreground }]}>
                Outline
              </Text>
            </View>

            <View
              style={[
                styles.badgePill,
                { backgroundColor: colors.destructive, borderColor: colors.destructive },
              ]}
            >
              <Text style={[styles.badgePillText, { color: '#ffffff' }]}>
                Destructive
              </Text>
            </View>
          </View>
        </View>
      )
    }

    // ─── 12. AVATAR ───────────────────────────────────────────
    if (id === 'primitive-avatar' || name === 'avatar') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Avatar Sizes & Online Indicator
          </Text>
          <View style={styles.rowWrap}>
            <View style={[styles.avatar, styles.avatarSm, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarTextSm, { color: colors.primaryForeground || '#ffffff' }]}>
                CN
              </Text>
            </View>

            <View style={[styles.avatar, styles.avatarMd, { backgroundColor: '#3b82f6' }]}>
              <Text style={[styles.avatarTextMd, { color: '#ffffff' }]}>MA</Text>
              <View style={[styles.avatarPresence, { backgroundColor: '#22c55e', borderColor: colors.background }]} />
            </View>

            <View style={[styles.avatar, styles.avatarLg, { backgroundColor: '#8b5cf6' }]}>
              <Text style={[styles.avatarTextLg, { color: '#ffffff' }]}>JD</Text>
            </View>
          </View>
        </View>
      )
    }

    // ─── 13. ACCORDION ────────────────────────────────────────
    if (id === 'primitive-accordion' || name === 'accordion') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Accordion FAQ
          </Text>
          <View
            style={[
              styles.accordionBox,
              { backgroundColor: colors.card, borderColor: colors.border, maxWidth: 500 },
            ]}
          >
            <View style={[styles.accordionItem, { borderBottomColor: colors.border }]}>
              <Pressable style={styles.accordionHeader} onPress={() => toggleAccordion('item1')}>
                <Text style={[styles.accordionQuestion, { color: colors.foreground }]}>
                  Is it accessible?
                </Text>
                {accordionOpen.item1 ? (
                  <ChevronDown size={18} color={colors.mutedForeground} />
                ) : (
                  <ChevronRight size={18} color={colors.mutedForeground} />
                )}
              </Pressable>
              {accordionOpen.item1 && (
                <View style={styles.accordionBody}>
                  <Text style={[styles.accordionAnswer, { color: colors.mutedForeground }]}>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </Text>
                </View>
              )}
            </View>

            <View style={[styles.accordionItem, { borderBottomColor: colors.border }]}>
              <Pressable style={styles.accordionHeader} onPress={() => toggleAccordion('item2')}>
                <Text style={[styles.accordionQuestion, { color: colors.foreground }]}>
                  Is it styled?
                </Text>
                {accordionOpen.item2 ? (
                  <ChevronDown size={18} color={colors.mutedForeground} />
                ) : (
                  <ChevronRight size={18} color={colors.mutedForeground} />
                )}
              </Pressable>
              {accordionOpen.item2 && (
                <View style={styles.accordionBody}>
                  <Text style={[styles.accordionAnswer, { color: colors.mutedForeground }]}>
                    Yes. It comes with default styles that matches the other components' aesthetics.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.accordionItem}>
              <Pressable style={styles.accordionHeader} onPress={() => toggleAccordion('item3')}>
                <Text style={[styles.accordionQuestion, { color: colors.foreground }]}>
                  Is it animated?
                </Text>
                {accordionOpen.item3 ? (
                  <ChevronDown size={18} color={colors.mutedForeground} />
                ) : (
                  <ChevronRight size={18} color={colors.mutedForeground} />
                )}
              </Pressable>
              {accordionOpen.item3 && (
                <View style={styles.accordionBody}>
                  <Text style={[styles.accordionAnswer, { color: colors.mutedForeground }]}>
                    Yes. It's animated by default, but you can disable it if you prefer.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )
    }

    // ─── 14. ALERT ────────────────────────────────────────────
    if (id === 'primitive-alert' || name === 'alert') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Alert Notification
          </Text>
          <View
            style={[
              styles.alertCard,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                borderColor: colors.border,
                maxWidth: 480,
              },
            ]}
          >
            <Terminal size={18} color={colors.foreground} />
            <View style={styles.alertContent}>
              <Text style={[styles.alertTitle, { color: colors.foreground }]}>Heads up!</Text>
              <Text style={[styles.alertDescription, { color: colors.mutedForeground }]}>
                You can add components to your app using the cli.
              </Text>
            </View>
          </View>
        </View>
      )
    }

    // ─── 15. CARD ─────────────────────────────────────────────
    if (id === 'primitive-card' || name === 'card') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Card Container
          </Text>
          <View
            style={[
              styles.cardBox,
              { backgroundColor: colors.card, borderColor: colors.border, maxWidth: 420 },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardHeading, { color: colors.foreground }]}>
                Create project
              </Text>
              <Text style={[styles.cardSubheading, { color: colors.mutedForeground }]}>
                Deploy your new project in one-click.
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: isDark ? colors.background : '#ffffff', borderColor: colors.border },
                  ]}
                >
                  <TextInput
                    placeholder='Name of your project'
                    placeholderTextColor={colors.mutedForeground}
                    style={[styles.textInput, { color: colors.foreground }]}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Framework</Text>
                <View
                  style={[
                    styles.selectTrigger,
                    { backgroundColor: isDark ? colors.background : '#ffffff', borderColor: colors.border },
                  ]}
                >
                  <Text style={{ fontSize: 13, color: colors.foreground }}>Next.js / Expo</Text>
                  <ChevronsUpDown size={14} color={colors.mutedForeground} />
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Pressable
                style={[styles.btn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
              >
                <Text style={[styles.btnText, { color: colors.foreground }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
              >
                <Text style={[styles.btnText, { color: colors.primaryForeground || '#ffffff' }]}>
                  Deploy
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )
    }

    // ─── 16. CHECKBOX ─────────────────────────────────────────
    if (id === 'primitive-checkbox' || name === 'checkbox') {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Checkbox Control
          </Text>
          <Pressable
            onPress={() =>
              setCheckboxStates((c) => ({ ...c, terms: !c.terms }))
            }
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, maxWidth: 400 }}
          >
            <View
              style={[
                styles.checkboxBox,
                {
                  backgroundColor: checkboxStates.terms ? colors.primary : 'transparent',
                  borderColor: checkboxStates.terms ? colors.primary : colors.mutedForeground,
                  marginTop: 2,
                },
              ]}
            >
              {checkboxStates.terms && (
                <Check size={12} color={colors.primaryForeground || '#ffffff'} strokeWidth={3} />
              )}
            </View>
            <View style={{ gap: 2, flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.foreground }}>
                Accept terms and conditions
              </Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                You agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>
          </Pressable>
        </View>
      )
    }

    // ─── 17. INPUT & TEXTAREA ─────────────────────────────────
    if (id.includes('input') || id.includes('textarea') || name.includes('input') || name.includes('textarea')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Input & Textarea Fields
          </Text>
          <View style={{ gap: 16, maxWidth: 420 }}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border },
                ]}
              >
                <TextInput
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder='Email'
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.textInput, { color: colors.foreground }]}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Message Textarea</Text>
              <TextInput
                multiline
                numberOfLines={3}
                value={textareaValue}
                onChangeText={setTextareaValue}
                style={[
                  styles.textareaInput,
                  { backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border, color: colors.foreground },
                ]}
              />
            </View>
          </View>
        </View>
      )
    }

    // ─── 18. SWITCH & TOGGLE ──────────────────────────────────
    if (id.includes('switch') || id.includes('toggle') || name.includes('switch') || name.includes('toggle')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Switch & Toggle Controls
          </Text>
          <View style={{ gap: 16, maxWidth: 400 }}>
            <View
              style={[
                styles.switchRow,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 10, borderWidth: 1 },
              ]}
            >
              <View style={styles.switchInfo}>
                <Text style={[styles.switchTitle, { color: colors.foreground }]}>Airplane Mode</Text>
              </View>
              <Pressable
                onPress={() =>
                  setSwitchStates((s) => ({ ...s, airplane: !s.airplane }))
                }
                style={[
                  styles.switchTrack,
                  { backgroundColor: switchStates.airplane ? colors.primary : colors.secondary },
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    switchStates.airplane && styles.switchThumbActive,
                  ]}
                />
              </Pressable>
            </View>

            {/* Toggle Group */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.mutedForeground }}>
                Toggle Group (Rich Formatting)
              </Text>
              <View
                style={[
                  styles.toggleGroupBar,
                  { backgroundColor: colors.secondary, borderColor: colors.border },
                ]}
              >
                <Pressable
                  onPress={() => setToggleGroup((t) => ({ ...t, bold: !t.bold }))}
                  style={[
                    styles.toggleGroupBtn,
                    toggleGroup.bold && { backgroundColor: isDark ? colors.card : '#ffffff' },
                  ]}
                >
                  <Bold size={16} color={toggleGroup.bold ? colors.primary : colors.mutedForeground} />
                </Pressable>
                <Pressable
                  onPress={() => setToggleGroup((t) => ({ ...t, italic: !t.italic }))}
                  style={[
                    styles.toggleGroupBtn,
                    toggleGroup.italic && { backgroundColor: isDark ? colors.card : '#ffffff' },
                  ]}
                >
                  <Italic size={16} color={toggleGroup.italic ? colors.primary : colors.mutedForeground} />
                </Pressable>
                <Pressable
                  onPress={() => setToggleGroup((t) => ({ ...t, underline: !t.underline }))}
                  style={[
                    styles.toggleGroupBtn,
                    toggleGroup.underline && { backgroundColor: isDark ? colors.card : '#ffffff' },
                  ]}
                >
                  <Underline size={16} color={toggleGroup.underline ? colors.primary : colors.mutedForeground} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )
    }

    // ─── 19. TABS ─────────────────────────────────────────────
    if (id.includes('tabs') || name.includes('tabs')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Tabs Component
          </Text>
          <View style={{ maxWidth: 420 }}>
            <View
              style={[
                styles.tabHeaderWrap,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              {['account', 'password'].map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setSelectedTabPane(tab)}
                  style={[
                    styles.tabNavBtn,
                    selectedTabPane === tab && {
                      backgroundColor: isDark ? colors.card : '#ffffff',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabNavBtnText,
                      {
                        color: selectedTabPane === tab ? colors.primary : colors.mutedForeground,
                        fontWeight: selectedTabPane === tab ? '700' : '500',
                      },
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View
              style={[
                styles.tabPaneBox,
                { backgroundColor: colors.card, borderColor: colors.border, marginTop: 12 },
              ]}
            >
              {selectedTabPane === 'account' ? (
                <View style={{ gap: 12 }}>
                  <Text style={[styles.cardHeading, { color: colors.foreground, fontSize: 14 }]}>
                    Account
                  </Text>
                  <Text style={[styles.cardSubheading, { color: colors.mutedForeground }]}>
                    Make changes to your account here. Click save when you're done.
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 12 }}>
                  <Text style={[styles.cardHeading, { color: colors.foreground, fontSize: 14 }]}>
                    Password
                  </Text>
                  <Text style={[styles.cardSubheading, { color: colors.mutedForeground }]}>
                    Change your password here. After saving, you'll be logged out.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )
    }

    // ─── 20. PROGRESS ────────────────────────────────────────
    if (id.includes('progress') || name.includes('progress')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Progress Bar ({progressVal}%)
          </Text>
          <View style={{ gap: 16, maxWidth: 440 }}>
            <View style={{ gap: 8 }}>
              <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${progressVal}%`, backgroundColor: colors.primary },
                  ]}
                />
              </View>
              <View style={styles.rowWrap}>
                {[0, 33, 66, 100].map((v) => (
                  <Pressable
                    key={v}
                    onPress={() => setProgressVal(v)}
                    style={[
                      styles.btn,
                      styles.btnSm,
                      { backgroundColor: progressVal === v ? colors.primary : colors.secondary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.btnTextSm,
                        { color: progressVal === v ? colors.primaryForeground || '#ffffff' : colors.foreground },
                      ]}
                    >
                      {v}%
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      )
    }

    // ─── 21. SKELETON ─────────────────────────────────────────
    if (id.includes('skeleton') || name.includes('skeleton')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Skeleton Loading Placeholder
          </Text>
          <View style={{ gap: 16, maxWidth: 440 }}>
            <View
              style={[
                styles.cardBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <View
                  style={[
                    styles.skeletonBox,
                    { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary },
                  ]}
                />
                <View style={{ gap: 8, flex: 1 }}>
                  <View
                    style={[
                      styles.skeletonBox,
                      { width: '50%', height: 14, borderRadius: 4, backgroundColor: colors.secondary },
                    ]}
                  />
                  <View
                    style={[
                      styles.skeletonBox,
                      { width: '80%', height: 12, borderRadius: 4, backgroundColor: colors.secondary },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    }

    // ─── 21. RADIO GROUP ──────────────────────────────────────
    if (id.includes('radio') || name.includes('radio')) {
      return (
        <View style={styles.showcaseSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Radio Group Options
          </Text>
          <View style={{ gap: 12, maxWidth: 360 }}>
            {[
              { id: 'default', label: 'Default', desc: 'Standard density spacing.' },
              { id: 'comfortable', label: 'Comfortable', desc: 'Expanded line height and padding.' },
              { id: 'compact', label: 'Compact', desc: 'Tight rows for high information density.' },
            ].map((opt) => {
              const isSelected = selectedRadio === opt.id
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setSelectedRadio(opt.id)}
                  style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      { borderColor: isSelected ? colors.primary : colors.mutedForeground, marginTop: 2 },
                    ]}
                  >
                    {isSelected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <View style={{ gap: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.foreground }}>
                      {opt.label}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{opt.desc}</Text>
                  </View>
                </Pressable>
              )
            })}
          </View>
        </View>
      )
    }

    // ─── 22. TEXT & TYPOGRAPHY ────────────────────────────────
    return (
      <View style={styles.showcaseSection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Typography & Text Hierarchy
        </Text>
        <View style={{ gap: 12, maxWidth: 480 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: colors.foreground }}>
            Heading 1 (24px Bold)
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground }}>
            Heading 2 (20px SemiBold)
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
            Heading 3 (16px Medium)
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 22, color: colors.mutedForeground }}>
            The king thought long and hard, and finally he decided to consult his advisors.
          </Text>
          <View
            style={{
              padding: 12,
              backgroundColor: colors.secondary,
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: colors.primary,
            }}
          >
            <Text style={{ fontSize: 13, fontStyle: 'italic', color: colors.foreground }}>
              "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Stage Header */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isDark
                  ? 'rgba(59, 130, 246, 0.15)'
                  : 'rgba(59, 130, 246, 0.12)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
              },
            ]}
          >
            <Boxes size={18} color={colors.primary} />
          </View>
          <View style={styles.headerTitles}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              {entry.name}
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {entry.filePath}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.badgePill,
            {
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              borderColor: 'rgba(59, 130, 246, 0.4)',
            },
          ]}
        >
          <Text style={[styles.badgePillText, { color: '#2563eb' }]}>
            {entry.badge || 'PRIMITIVE'}
          </Text>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>{renderDemo()}</View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  contentWrap: {
    width: '100%',
    maxWidth: 860,
    gap: 24,
  },
  showcaseSection: {
    width: '100%',
    gap: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    marginTop: -8,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  btnSm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnLg: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  btnTextSm: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  linkBtnText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: 'Open Sans',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  avatar: {
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarSm: { width: 32, height: 32 },
  avatarMd: { width: 40, height: 40 },
  avatarLg: { width: 52, height: 52 },
  avatarTextSm: { fontSize: 11, fontWeight: '700' },
  avatarTextMd: { fontSize: 14, fontWeight: '700' },
  avatarTextLg: { fontSize: 18, fontWeight: '700' },
  avatarPresence: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  accordionBox: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accordionItem: {
    borderBottomWidth: 1,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionQuestion: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  accordionAnswer: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Open Sans',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  alertContent: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  alertDescription: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Open Sans',
  },
  cardBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    gap: 4,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  cardSubheading: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  cardDivider: {
    height: 1,
    width: '100%',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Open Sans',
    padding: 0,
  },
  textareaInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    fontFamily: 'Open Sans',
    minHeight: 96,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  switchInfo: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  toggleGroupBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 4,
  },
  toggleGroupBtn: {
    padding: 8,
    borderRadius: 6,
  },
  tabHeaderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  tabNavBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabNavBtnText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  tabPaneBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
  progressTrack: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  skeletonBox: {
    opacity: 0.7,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menubarBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    alignSelf: 'flex-start',
    gap: 2,
  },
  menubarTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  menubarTabText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  menuDropdown: {
    position: 'absolute',
    top: 96,
    width: 240,
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    zIndex: 100,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  menuItemLabel: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  menuItemShortcut: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  dialogBox: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  dialogFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 320,
  },
  selectMenu: {
    position: 'absolute',
    top: 96,
    width: 320,
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    zIndex: 100,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
})
