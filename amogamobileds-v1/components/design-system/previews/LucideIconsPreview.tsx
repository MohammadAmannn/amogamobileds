import React, { useState, useMemo } from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  Search,
  Copy,
  Check,
  Sparkles,
  LayoutGrid,
  Layers,
  Wand2,
  Ticket,
  Kanban,
  CreditCard,
  BarChart3,
  TrendingUp,
  PieChart,
  MapPin,
  Mail,
  MessageSquare,
  Bell,
  FileText,
  CalendarDays,
  Calendar,
  FileEdit,
  ScanLine,
  Sliders,
  Palette,
  Settings,
  User,
  Users,
  Shield,
  Folder,
  FolderOpen,
  UploadCloud,
  Download,
  Printer,
  Trash2,
  Plus,
  Minus,
  Edit,
  Edit2,
  Edit3,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  HelpCircle,
  RefreshCw,
  Share2,
  Lock,
  Unlock,
  Key,
  Globe,
  Terminal,
  Code2,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  X,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Filter,
  SlidersHorizontal,
  Heart,
  Star,
  Bookmark,
  Send,
  Inbox,
  Paperclip,
  Image,
  Video,
  Music,
  Headphones,
  Mic,
  Camera,
  Sun,
  Moon,
  Zap,
  Flame,
  Activity,
  Award,
  Gift,
  Tag,
  Package,
  ShoppingCart,
  DollarSign,
  Percent,
  Wallet,
  Building,
  Home,
  Compass,
  Navigation,
  Map,
  Volume2,
  VolumeX,
  Wifi,
  Radio,
  FileCheck,
  FileQuestion,
  FileCode,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

interface IconItem {
  name: string
  component: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
  category: string
  tags: string[]
}

const ALL_ICONS: IconItem[] = [
  // UI & Navigation
  { name: 'LayoutGrid', component: LayoutGrid, category: 'Navigation', tags: ['grid', 'dashboard', 'apps'] },
  { name: 'Menu', component: Menu, category: 'Navigation', tags: ['hamburger', 'sidebar', 'drawer'] },
  { name: 'ChevronRight', component: ChevronRight, category: 'Navigation', tags: ['arrow', 'next', 'expand'] },
  { name: 'ChevronLeft', component: ChevronLeft, category: 'Navigation', tags: ['arrow', 'back', 'previous'] },
  { name: 'ChevronDown', component: ChevronDown, category: 'Navigation', tags: ['dropdown', 'bottom'] },
  { name: 'ChevronUp', component: ChevronUp, category: 'Navigation', tags: ['top', 'collapse'] },
  { name: 'ArrowLeft', component: ArrowLeft, category: 'Navigation', tags: ['back', 'return'] },
  { name: 'ArrowRight', component: ArrowRight, category: 'Navigation', tags: ['next', 'forward', 'proceed'] },
  { name: 'ArrowUp', component: ArrowUp, category: 'Navigation', tags: ['upload', 'top'] },
  { name: 'ArrowDown', component: ArrowDown, category: 'Navigation', tags: ['download', 'bottom'] },
  { name: 'Home', component: Home, category: 'Navigation', tags: ['main', 'house', 'dashboard'] },
  { name: 'Compass', component: Compass, category: 'Navigation', tags: ['explore', 'guide'] },
  { name: 'Navigation', component: Navigation, category: 'Navigation', tags: ['map', 'location', 'gps'] },

  // Actions & Controls
  { name: 'Search', component: Search, category: 'Actions', tags: ['find', 'query', 'filter'] },
  { name: 'Plus', component: Plus, category: 'Actions', tags: ['add', 'create', 'new'] },
  { name: 'Minus', component: Minus, category: 'Actions', tags: ['remove', 'decrease', 'collapse'] },
  { name: 'X', component: X, category: 'Actions', tags: ['close', 'delete', 'cancel', 'cross'] },
  { name: 'Check', component: Check, category: 'Actions', tags: ['tick', 'confirm', 'success'] },
  { name: 'CheckCircle2', component: CheckCircle2, category: 'Actions', tags: ['approved', 'verified', 'done'] },
  { name: 'Edit', component: Edit, category: 'Actions', tags: ['pencil', 'write', 'modify'] },
  { name: 'Edit3', component: Edit3, category: 'Actions', tags: ['modify', 'compose'] },
  { name: 'Trash2', component: Trash2, category: 'Actions', tags: ['delete', 'remove', 'bin'] },
  { name: 'Eye', component: Eye, category: 'Actions', tags: ['preview', 'view', 'visible'] },
  { name: 'EyeOff', component: EyeOff, category: 'Actions', tags: ['hide', 'hidden', 'invisible'] },
  { name: 'Copy', component: Copy, category: 'Actions', tags: ['duplicate', 'clipboard'] },
  { name: 'Download', component: Download, category: 'Actions', tags: ['save', 'export'] },
  { name: 'UploadCloud', component: UploadCloud, category: 'Actions', tags: ['cloud', 'file', 'attach'] },
  { name: 'Printer', component: Printer, category: 'Actions', tags: ['print', 'pdf', 'paper'] },
  { name: 'RefreshCw', component: RefreshCw, category: 'Actions', tags: ['reload', 'sync', 'rotate'] },
  { name: 'Filter', component: Filter, category: 'Actions', tags: ['sort', 'refine'] },
  { name: 'Share2', component: Share2, category: 'Actions', tags: ['social', 'link', 'forward'] },
  { name: 'MoreHorizontal', component: MoreHorizontal, category: 'Actions', tags: ['dots', 'menu', 'options'] },
  { name: 'MoreVertical', component: MoreVertical, category: 'Actions', tags: ['kebab', 'menu'] },
  { name: 'Maximize2', component: Maximize2, category: 'Actions', tags: ['fullscreen', 'expand'] },
  { name: 'Minimize2', component: Minimize2, category: 'Actions', tags: ['exit', 'collapse'] },

  // Communication & Social
  { name: 'Mail', component: Mail, category: 'Communication', tags: ['email', 'inbox', 'message'] },
  { name: 'Inbox', component: Inbox, category: 'Communication', tags: ['received', 'tray'] },
  { name: 'Send', component: Send, category: 'Communication', tags: ['paperplane', 'submit'] },
  { name: 'MessageSquare', component: MessageSquare, category: 'Communication', tags: ['chat', 'comment', 'discussion'] },
  { name: 'Bell', component: Bell, category: 'Communication', tags: ['notification', 'alert', 'alarm'] },
  { name: 'Sparkles', component: Sparkles, category: 'Communication', tags: ['ai', 'magic', 'generate', 'stars'] },
  { name: 'Wand2', component: Wand2, category: 'Communication', tags: ['wizard', 'ai', 'magic'] },

  // Content, Files & Editor
  { name: 'FileText', component: FileText, category: 'Content & Files', tags: ['document', 'page', 'pdf'] },
  { name: 'FileCheck', component: FileCheck, category: 'Content & Files', tags: ['verified', 'doc'] },
  { name: 'FileCode', component: FileCode, category: 'Content & Files', tags: ['programming', 'source'] },
  { name: 'FileQuestion', component: FileQuestion, category: 'Content & Files', tags: ['unknown', 'help'] },
  { name: 'Folder', component: Folder, category: 'Content & Files', tags: ['directory', 'storage'] },
  { name: 'FolderOpen', component: FolderOpen, category: 'Content & Files', tags: ['opened', 'browse'] },
  { name: 'FileEdit', component: FileEdit, category: 'Content & Files', tags: ['rich editor', 'compose', 'notes'] },
  { name: 'Paperclip', component: Paperclip, category: 'Content & Files', tags: ['attachment', 'link'] },
  { name: 'Bold', component: Bold, category: 'Content & Files', tags: ['font', 'weight'] },
  { name: 'Italic', component: Italic, category: 'Content & Files', tags: ['font', 'slant'] },
  { name: 'Underline', component: Underline, category: 'Content & Files', tags: ['font', 'line'] },
  { name: 'List', component: List, category: 'Content & Files', tags: ['bullet', 'points'] },
  { name: 'ListOrdered', component: ListOrdered, category: 'Content & Files', tags: ['numbered', 'order'] },

  // Analytics & Data
  { name: 'BarChart3', component: BarChart3, category: 'Analytics & Data', tags: ['chart', 'statistics', 'graph'] },
  { name: 'TrendingUp', component: TrendingUp, category: 'Analytics & Data', tags: ['growth', 'stats', 'rise'] },
  { name: 'PieChart', component: PieChart, category: 'Analytics & Data', tags: ['percentage', 'distribution'] },
  { name: 'Activity', component: Activity, category: 'Analytics & Data', tags: ['pulse', 'monitor', 'health'] },
  { name: 'Kanban', component: Kanban, category: 'Analytics & Data', tags: ['columns', 'board', 'tasks'] },
  { name: 'Layers', component: Layers, category: 'Analytics & Data', tags: ['stack', 'shared', 'components'] },

  // Commerce & Finance
  { name: 'Ticket', component: Ticket, category: 'Finance', tags: ['voucher', 'coupon', 'pass'] },
  { name: 'CreditCard', component: CreditCard, category: 'Finance', tags: ['payment', 'bank', 'card'] },
  { name: 'Wallet', component: Wallet, category: 'Finance', tags: ['money', 'crypto', 'funds'] },
  { name: 'DollarSign', component: DollarSign, category: 'Finance', tags: ['currency', 'price', 'usd'] },
  { name: 'Percent', component: Percent, category: 'Finance', tags: ['discount', 'rate', 'tax'] },
  { name: 'ShoppingCart', component: ShoppingCart, category: 'Finance', tags: ['cart', 'order', 'store'] },
  { name: 'Package', component: Package, category: 'Finance', tags: ['box', 'product', 'delivery'] },
  { name: 'Tag', component: Tag, category: 'Finance', tags: ['price', 'label', 'badge'] },
  { name: 'Building', component: Building, category: 'Finance', tags: ['company', 'enterprise', 'office'] },

  // Time & System
  { name: 'Calendar', component: Calendar, category: 'System & Theme', tags: ['date', 'schedule', 'picker'] },
  { name: 'CalendarDays', component: CalendarDays, category: 'System & Theme', tags: ['month', 'agenda'] },
  { name: 'Clock', component: Clock, category: 'System & Theme', tags: ['time', 'duration', 'hour'] },
  { name: 'Palette', component: Palette, category: 'System & Theme', tags: ['theme', 'color', 'paint'] },
  { name: 'Sun', component: Sun, category: 'System & Theme', tags: ['light', 'brightness', 'day'] },
  { name: 'Moon', component: Moon, category: 'System & Theme', tags: ['dark', 'night', 'theme'] },
  { name: 'Settings', component: Settings, category: 'System & Theme', tags: ['gear', 'configure', 'preferences'] },
  { name: 'Sliders', component: Sliders, category: 'System & Theme', tags: ['controls', 'adjust'] },
  { name: 'User', component: User, category: 'System & Theme', tags: ['person', 'profile', 'account'] },
  { name: 'Users', component: Users, category: 'System & Theme', tags: ['team', 'group', 'audience'] },
  { name: 'Shield', component: Shield, category: 'System & Theme', tags: ['security', 'protect', 'auth'] },
  { name: 'Lock', component: Lock, category: 'System & Theme', tags: ['private', 'secure'] },
  { name: 'Unlock', component: Unlock, category: 'System & Theme', tags: ['public', 'open'] },
  { name: 'Key', component: Key, category: 'System & Theme', tags: ['access', 'token'] },
  { name: 'Globe', component: Globe, category: 'System & Theme', tags: ['world', 'web', 'internet'] },
  { name: 'Laptop', component: Laptop, category: 'System & Theme', tags: ['device', 'desktop', 'computer'] },
  { name: 'Smartphone', component: Smartphone, category: 'System & Theme', tags: ['mobile', 'phone'] },
  { name: 'Tablet', component: Tablet, category: 'System & Theme', tags: ['ipad', 'device'] },
  { name: 'ScanLine', component: ScanLine, category: 'System & Theme', tags: ['ocr', 'scanner', 'barcode'] },
]

const CATEGORIES = [
  'All',
  'Navigation',
  'Actions',
  'Communication',
  'Content & Files',
  'Analytics & Data',
  'Finance',
  'System & Theme',
]

const SIZES = [16, 20, 24, 28]

export function LucideIconsPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [iconSize, setIconSize] = useState<number>(20)
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null)

  const filteredIcons = useMemo(() => {
    return ALL_ICONS.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [search, selectedCategory])

  const handleCopy = (iconName: string) => {
    const snippet = `import { ${iconName} } from 'lucide-react-native'`
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(snippet)
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea')
        textarea.value = snippet
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    } catch {
      // ignore copy errors
    }
    setCopiedIcon(iconName)
    setTimeout(() => setCopiedIcon(null), 2000)
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#09090b' : '#ffffff',
          borderColor: colors.border,
        },
      ]}
    >
      {/* 1. Top Header Bar */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: isDark ? '#09090b' : '#ffffff',
            borderBottomColor: isDark ? colors.border : '#f1f5f9',
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isDark
                  ? 'rgba(129, 140, 248, 0.18)'
                  : 'rgba(99, 102, 241, 0.1)',
                borderColor: isDark
                  ? 'rgba(129, 140, 248, 0.35)'
                  : 'rgba(199, 210, 254, 0.6)',
              },
            ]}
          >
            <Sparkles size={18} color={isDark ? '#a5b4fc' : '#4f46e5'} strokeWidth={1.8} />
          </View>
          <View style={styles.headerTitles}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Lucide Icons Gallery
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              Official icon set used across the application. Click any icon to copy its JSX import.
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
            ]}
            hitSlop={6}
          >
            <Bell size={16} color={colors.mutedForeground} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
            ]}
            hitSlop={6}
          >
            <Bookmark size={16} color={colors.mutedForeground} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && { backgroundColor: isDark ? '#27272a' : '#f1f5f9' },
            ]}
            hitSlop={6}
          >
            <MoreVertical size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      {/* 2. Control Bar (Search + Size Options + Category Chips) */}
      <View
        style={[
          styles.controlBar,
          {
            backgroundColor: isDark ? '#0f0f12' : '#f8fafc',
            borderBottomColor: isDark ? colors.border : '#e2e8f0',
          },
        ]}
      >
        <View style={styles.searchRow}>
          {/* Search Box */}
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? colors.border : '#e2e8f0',
              },
            ]}
          >
            <Search size={14} color={colors.mutedForeground} strokeWidth={1.8} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search icons by name or keywords (e.g. arrow, chat, cloud, edit)..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {search ? (
              <Pressable onPress={() => setSearch('')} hitSlop={6}>
                <X size={13} color={colors.mutedForeground} />
              </Pressable>
            ) : null}
          </View>

          {/* Size Adjuster Buttons */}
          <View style={styles.sizeAdjuster}>
            <Text style={[styles.sizeLabel, { color: colors.mutedForeground }]}>
              Size:
            </Text>
            <View style={styles.sizeBtnsGroup}>
              {SIZES.map((sz) => (
                <Pressable
                  key={sz}
                  onPress={() => setIconSize(sz)}
                  style={[
                    styles.sizeBtn,
                    {
                      backgroundColor:
                        iconSize === sz
                          ? isDark
                            ? '#4f46e5'
                            : '#4f46e5'
                          : isDark
                          ? '#18181b'
                          : '#ffffff',
                      borderColor:
                        iconSize === sz
                          ? '#4f46e5'
                          : isDark
                          ? colors.border
                          : '#e2e8f0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeBtnText,
                      {
                        color:
                          iconSize === sz
                            ? '#ffffff'
                            : isDark
                            ? '#a1a1aa'
                            : '#64748b',
                      },
                    ]}
                  >
                    {sz}px
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? '#4f46e5'
                        : '#4f46e5'
                      : isDark
                      ? '#18181b'
                      : '#ffffff',
                    borderColor: isSelected
                      ? '#4f46e5'
                      : isDark
                      ? colors.border
                      : '#e2e8f0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color:
                        isSelected
                          ? '#ffffff'
                          : isDark
                          ? '#a1a1aa'
                          : '#64748b',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {/* 3. Main Grid Canvas */}
      <ScrollView
        style={styles.canvasScroll}
        contentContainerStyle={styles.canvasContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridMetaRow}>
          <Text style={[styles.gridCountText, { color: colors.mutedForeground }]}>
            Showing{' '}
            <Text style={{ color: colors.foreground, fontWeight: '500' }}>
              {filteredIcons.length}
            </Text>{' '}
            icons
          </Text>
          <Text style={[styles.copyHintText, { color: colors.mutedForeground }]}>
            Click card to copy import
          </Text>
        </View>

        {filteredIcons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Search size={32} color={colors.mutedForeground} style={{ opacity: 0.4, marginBottom: 8 }} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No icons found for "{search}"
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Try another keyword or explore the categories above.
            </Text>
          </View>
        ) : (
          <View style={styles.iconGrid}>
            {filteredIcons.map((item) => {
              const IconComp = item.component
              const isCopied = copiedIcon === item.name

              return (
                <Pressable
                  key={item.name}
                  onPress={() => handleCopy(item.name)}
                  style={({ pressed }) => [
                    styles.iconCard,
                    {
                      backgroundColor: isCopied
                        ? isDark
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(16, 185, 129, 0.1)'
                        : isDark
                        ? '#18181b'
                        : '#ffffff',
                      borderColor: isCopied
                        ? isDark
                          ? '#10b981'
                          : '#059669'
                        : isDark
                        ? colors.border
                        : '#e2e8f0',
                    },
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <View style={styles.iconCenterWrap}>
                    <IconComp
                      size={iconSize}
                      color={
                        isCopied
                          ? '#10b981'
                          : isDark
                          ? '#e4e4e7'
                          : '#18181b'
                      }
                      strokeWidth={1.8}
                    />
                  </View>

                  <Text
                    style={[
                      styles.iconNameText,
                      {
                        color: isCopied
                          ? '#10b981'
                          : colors.foreground,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={[
                      styles.iconCategoryTag,
                      { color: colors.mutedForeground },
                    ]}
                    numberOfLines={1}
                  >
                    {item.category}
                  </Text>

                  {isCopied && (
                    <View style={styles.copiedOverlay}>
                      <Check size={14} color="#ffffff" strokeWidth={2.4} />
                      <Text style={styles.copiedOverlayText}>Copied!</Text>
                    </View>
                  )}
                </Pressable>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 520,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
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
    minWidth: 0,
    gap: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBar: {
    padding: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: 260,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    padding: 0,
  },
  sizeAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sizeLabel: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  sizeBtnsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  sizeBtnText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  categoriesScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  canvasScroll: {
    flex: 1,
  },
  canvasContainer: {
    padding: 16,
    gap: 12,
  },
  gridMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridCountText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  copyHintText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  emptySubtitle: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    marginTop: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconCard: {
    position: 'relative',
    width: 106,
    minHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 4,
  },
  iconCenterWrap: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconNameText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  iconCategoryTag: {
    fontSize: 8.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    opacity: 0.6,
    textAlign: 'center',
  },
  copiedOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#059669',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  copiedOverlayText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
})

export default LucideIconsPreview
