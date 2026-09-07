import React, { useState } from 'react'
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  Plug,
  CreditCard as CreditCardIcon,
  Wifi,
  ShoppingBag,
  Star,
  UserPlus,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Check,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import type { GalleryEntry } from '../../types'

// ─── 1. INTEGRATION CARD (SLACK) ────────────────────────────────────────────
export function IntegrationCardPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const [isConnected, setIsConnected] = useState(true)

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.dataCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.headerLeftGroup}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.15)'
                    : '#e0e7ff',
                  borderColor: isDark
                    ? 'rgba(99, 102, 241, 0.3)'
                    : '#c7d2fe',
                },
              ]}
            >
              <Plug size={20} color={isDark ? '#a5b4fc' : '#4f46e5'} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                Slack Integration
              </Text>
              <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
                Sync alerts & daily notifications
              </Text>
            </View>
          </View>
          <Switch
            value={isConnected}
            onValueChange={setIsConnected}
            trackColor={{ false: isDark ? '#3f3f46' : '#e4e4e7', true: '#10b981' }}
            thumbColor='#ffffff'
          />
        </View>

        <Text style={[styles.cardBodyText, { color: colors.mutedForeground }]}>
          Automatically post real-time system alerts, user feedback, and deployment status updates directly to your Slack #general channel.
        </Text>

        <View
          style={[
            styles.cardFooterRow,
            { borderTopColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: isConnected
                  ? isDark
                    ? 'rgba(16, 185, 129, 0.15)'
                    : '#d1fae5'
                  : isDark
                  ? '#27272a'
                  : '#f4f4f5',
                borderColor: isConnected
                  ? isDark
                    ? 'rgba(16, 185, 129, 0.3)'
                    : '#a7f3d0'
                  : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                {
                  color: isConnected
                    ? isDark
                      ? '#6ee7b7'
                      : '#047857'
                    : colors.mutedForeground,
                },
              ]}
            >
              {isConnected ? '● Connected' : 'Disconnected'}
            </Text>
          </View>

          <Pressable style={styles.actionLinkBtn} hitSlop={6}>
            <Text style={[styles.actionLinkText, { color: colors.primary }]}>
              Configure settings →
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

// ─── 2. CREDIT CARD (VISA) ──────────────────────────────────────────────────
export function CreditCardPreview() {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.creditCardBox}>
        {/* Glow background accents */}
        <View style={styles.cardGlow1} />
        <View style={styles.cardGlow2} />

        {/* Top Row: Chip & Contactless */}
        <View style={styles.creditTopRow}>
          <View style={styles.chipWrapper}>
            <View style={styles.chipGold}>
              <View style={styles.chipInner} />
            </View>
            <Wifi size={16} color='#cbd5e1' style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
          <Text style={styles.visaBrand}>VISA</Text>
        </View>

        {/* Card Number */}
        <Text style={styles.cardNumberText}>
          4242 •••• •••• 8892
        </Text>

        {/* Bottom Row */}
        <View style={styles.creditBottomRow}>
          <View>
            <Text style={styles.cardLabelText}>CARD HOLDER</Text>
            <Text style={styles.cardValueText}>ALEX M. JOHNSON</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.cardLabelText}>EXPIRES</Text>
            <Text style={styles.cardValueText}>12 / 28</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// ─── 3. ECOMMERCE PRODUCT VARIANT CARD ──────────────────────────────────────
export function EcommerceProductCardPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [selectedSize, setSelectedSize] = useState('US 9')
  const [selectedColor, setSelectedColor] = useState('black')

  const colorSwatches = [
    { id: 'black', hex: '#09090b' },
    { id: 'blue', hex: '#4f46e5' },
    { id: 'white', hex: '#f8fafc', border: '#cbd5e1' },
  ]
  const sizes = ['US 8', 'US 9', 'US 10', 'US 11']

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.dataCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            padding: 0,
            overflow: 'hidden',
          },
        ]}
      >
        {/* Product Visual Area */}
        <View
          style={[
            styles.productImageArea,
            {
              backgroundColor: isDark ? '#18181b' : '#f4f4f5',
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>20% OFF</Text>
          </View>
          <View style={styles.productIconCircle}>
            <ShoppingBag size={48} color={colors.primary} />
          </View>
        </View>

        <View style={styles.productCardBody}>
          <View style={styles.productTitleRow}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Air Max Pulse 3D
            </Text>
            <View style={styles.ratingBadge}>
              <Star size={13} color='#f59e0b' fill='#f59e0b' />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>

          <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
            Premium lightweight running shoes
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.priceCurrent, { color: colors.foreground }]}>
              $189.00
            </Text>
            <Text style={styles.priceOriginal}>$235.00</Text>
          </View>

          {/* Swatches */}
          <View style={styles.variantSection}>
            <Text style={[styles.variantLabel, { color: colors.mutedForeground }]}>
              Color Variant
            </Text>
            <View style={styles.swatchRow}>
              {colorSwatches.map((c) => {
                const isSelected = selectedColor === c.id
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setSelectedColor(c.id)}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c.hex },
                      c.border ? { borderWidth: 1, borderColor: c.border } : null,
                      isSelected && {
                        borderWidth: 2,
                        borderColor: colors.primary,
                        transform: [{ scale: 1.15 }],
                      },
                    ]}
                  />
                )
              })}
            </View>
          </View>

          {/* Size buttons */}
          <View style={styles.variantSection}>
            <Text style={[styles.variantLabel, { color: colors.mutedForeground }]}>
              Select Size
            </Text>
            <View style={styles.sizeRow}>
              {sizes.map((sz) => {
                const isSelected = selectedSize === sz
                return (
                  <Pressable
                    key={sz}
                    onPress={() => setSelectedSize(sz)}
                    style={[
                      styles.sizeBtn,
                      isSelected
                        ? {
                            backgroundColor: isDark
                              ? 'rgba(99, 102, 241, 0.15)'
                              : '#e0e7ff',
                            borderColor: colors.primary,
                          }
                        : {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                          },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeBtnText,
                        {
                          color: isSelected ? colors.primary : colors.foreground,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {sz}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          {/* Add to Cart */}
          <Pressable
            style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.primaryActionBtnText}>Add to Cart</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

// ─── 4. ASSIGN TASK CARD ────────────────────────────────────────────────────
export function AssignTaskCardPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const [assignedUser, setAssignedUser] = useState('Sarah Chen')

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.dataCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.tagPill,
              {
                backgroundColor: isDark
                  ? 'rgba(168, 85, 247, 0.15)'
                  : '#f3e8ff',
                borderColor: isDark
                  ? 'rgba(168, 85, 247, 0.3)'
                  : '#e9d5ff',
              },
            ]}
          >
            <Text
              style={[
                styles.tagPillText,
                { color: isDark ? '#c084fc' : '#7e22ce' },
              ]}
            >
              Task Assignment
            </Text>
          </View>
          <Text style={styles.priorityHighBadge}>HIGH PRIORITY</Text>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Design System Audit & Token Migration
          </Text>
          <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
            Audit existing primitives and update tokens to Tailwind v4.
          </Text>
        </View>

        {/* Assignee item */}
        <View style={{ gap: 4 }}>
          <Text style={[styles.variantLabel, { color: colors.mutedForeground }]}>
            Assignee
          </Text>
          <View
            style={[
              styles.assigneeBox,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.assigneeLeft}>
              <View
                style={[
                  styles.avatarFallback,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.avatarFallbackText}>SC</Text>
              </View>
              <Text style={[styles.assigneeName, { color: colors.foreground }]}>
                {assignedUser}
              </Text>
            </View>
            <Pressable
              onPress={() =>
                setAssignedUser(
                  assignedUser === 'Sarah Chen' ? 'Alex Morgan' : 'Sarah Chen'
                )
              }
              hitSlop={6}
            >
              <Text style={[styles.changeLink, { color: colors.primary }]}>
                Change
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Due date info */}
        <View style={styles.dueDateRow}>
          <View style={styles.dueLeftGroup}>
            <Calendar size={14} color={colors.primary} />
            <Text style={[styles.dueText, { color: colors.mutedForeground }]}>
              Due: Aug 28, 2026
            </Text>
          </View>
          <Text style={[styles.remainingDaysText, { color: colors.foreground }]}>
            3 Days Remaining
          </Text>
        </View>

        <Pressable
          style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
        >
          <UserPlus size={14} color='#ffffff' style={{ marginRight: 6 }} />
          <Text style={styles.primaryActionBtnText}>Assign Task Now</Text>
        </Pressable>
      </View>
    </View>
  )
}

// ─── 5. APPOINTMENT CARD (DR. EMILY WATSON) ─────────────────────────────────
export function AppointmentCardPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.dataCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.tagPill,
              {
                backgroundColor: isDark
                  ? 'rgba(20, 184, 166, 0.15)'
                  : '#ccfbf1',
                borderColor: isDark
                  ? 'rgba(20, 184, 166, 0.3)'
                  : '#99f6e4',
              },
            ]}
          >
            <Text
              style={[
                styles.tagPillText,
                { color: isDark ? '#2dd4bf' : '#0f766e' },
              ]}
            >
              Upcoming Medical Sync
            </Text>
          </View>
          <View
            style={[
              styles.tagPill,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.tagPillText,
                { color: colors.mutedForeground },
              ]}
            >
              Confirmed
            </Text>
          </View>
        </View>

        {/* Doctor profile info */}
        <View style={styles.doctorInfoRow}>
          <View
            style={[
              styles.doctorAvatarBox,
              {
                backgroundColor: isDark
                  ? 'rgba(20, 184, 166, 0.2)'
                  : '#d1fae5',
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.doctorAvatarText, { color: colors.primary }]}>
              EW
            </Text>
          </View>
          <View style={{ gap: 2 }}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Dr. Emily Watson
            </Text>
            <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
              Senior Cardiologist • General Health
            </Text>
          </View>
        </View>

        {/* Appointment detail box */}
        <View
          style={[
            styles.appointmentDetailBox,
            {
              backgroundColor: isDark ? colors.background : colors.secondary,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.detailItemRow}>
            <Calendar size={13} color={colors.primary} />
            <Text style={[styles.detailItemTextBold, { color: colors.foreground }]}>
              Thursday, August 24, 2026
            </Text>
          </View>
          <View style={styles.detailItemRow}>
            <Clock size={13} color={colors.primary} />
            <Text style={[styles.detailItemText, { color: colors.mutedForeground }]}>
              10:30 AM – 11:15 AM (45 mins)
            </Text>
          </View>
          <View style={styles.detailItemRow}>
            <MapPin size={13} color={colors.primary} />
            <Text style={[styles.detailItemText, { color: colors.mutedForeground }]}>
              Room 402, Building B • Medical Plaza
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonGroup}>
          <Pressable
            style={[
              styles.secondaryBtn,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>
              Reschedule
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.primaryBtnFlex,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.primaryActionBtnText}>Join Telehealth</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

// ─── 6. STATISTICS CARD ─────────────────────────────────────────────────────
export function StatisticsCardPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const sparklineHeights = [40, 55, 35, 60, 75, 65, 85, 90, 80, 95, 100]

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.dataCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.statsCategoryTitle, { color: colors.mutedForeground }]}>
            MONTHLY ACTIVE REVENUE
          </Text>
          <View
            style={[
              styles.trendingIconBox,
              {
                backgroundColor: isDark
                  ? 'rgba(16, 185, 129, 0.15)'
                  : '#d1fae5',
              },
            ]}
          >
            <TrendingUp size={14} color='#10b981' />
          </View>
        </View>

        <View style={styles.statsValueRow}>
          <Text style={[styles.statsMainValue, { color: colors.foreground }]}>
            $128,450.00
          </Text>
          <View style={styles.growthBadge}>
            <Text style={styles.growthBadgeText}>+18.4%</Text>
          </View>
        </View>
        <Text style={[styles.statsComparisonText, { color: colors.mutedForeground }]}>
          Compared to $108,520.00 last month
        </Text>

        {/* Sparkline visualization */}
        <View style={styles.sparklineContainer}>
          {sparklineHeights.map((h, i) => (
            <View
              key={i}
              style={[
                styles.sparklineBar,
                {
                  height: `${h}%`,
                  backgroundColor: isDark
                    ? 'rgba(16, 185, 129, 0.35)'
                    : 'rgba(16, 185, 129, 0.45)',
                },
              ]}
            />
          ))}
        </View>

        {/* Footer */}
        <View
          style={[
            styles.cardFooterRow,
            { borderTopColor: colors.border },
          ]}
        >
          <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
            Target: $140,000
          </Text>
          <Text style={styles.targetAchievedText}>91.7% Achieved</Text>
        </View>
      </View>
    </View>
  )
}

// ─── MASTER DATA CARDS PREVIEWS EXPORT ──────────────────────────────────────
export function DataCardsPreviews({ entry }: { entry?: GalleryEntry }) {
  const { colors } = useTheme()

  if (entry?.id === 'card-19-integration') {
    return <IntegrationCardPreview />
  }
  if (entry?.id === 'card-18-credit-card') {
    return <CreditCardPreview />
  }
  if (entry?.id === 'card-17-ecommerce-variant') {
    return <EcommerceProductCardPreview />
  }
  if (entry?.id === 'card-11-assign-task') {
    return <AssignTaskCardPreview />
  }
  if (entry?.id === 'card-10-appointment') {
    return <AppointmentCardPreview />
  }
  if (entry?.id === 'card-06-statistics') {
    return <StatisticsCardPreview />
  }

  // Default: Grid overview of all cards
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    >
      <IntegrationCardPreview />
      <CreditCardPreview />
      <EcommerceProductCardPreview />
      <AssignTaskCardPreview />
      <AppointmentCardPreview />
      <StatisticsCardPreview />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  gridContainer: {
    padding: 20,
    gap: 20,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 4,
  },
  dataCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  cardSubtext: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  cardBodyText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    lineHeight: 18,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  actionLinkBtn: {
    paddingVertical: 2,
  },
  actionLinkText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  creditCardBox: {
    height: 190,
    borderRadius: 16,
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGlow1: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  cardGlow2: {
    position: 'absolute',
    left: -20,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  creditTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipGold: {
    width: 32,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#f59e0b',
    borderWidth: 1,
    borderColor: '#d97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInner: {
    width: 20,
    height: 14,
    borderWidth: 1,
    borderColor: '#b45309',
    borderRadius: 2,
  },
  visaBrand: {
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#e0e7ff',
    letterSpacing: 2,
  },
  cardNumberText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: 3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  creditBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabelText: {
    fontSize: 8,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  productImageArea: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#f43f5e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  productIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productCardBody: {
    padding: 16,
    gap: 10,
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f59e0b',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceCurrent: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Open Sans',
  },
  priceOriginal: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  variantSection: {
    gap: 6,
  },
  variantLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sizeBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
  sizeBtnText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  primaryActionBtn: {
    height: 38,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryActionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  priorityHighBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 0.5,
  },
  assigneeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  assigneeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarFallback: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  assigneeName: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  changeLink: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  remainingDaysText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  doctorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  doctorAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  appointmentDetailBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailItemTextBold: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  detailItemText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  primaryBtnFlex: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCategoryTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'Open Sans',
  },
  trendingIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  statsMainValue: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Open Sans',
    letterSpacing: -0.5,
  },
  growthBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  growthBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  statsComparisonText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  sparklineContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingTop: 8,
  },
  sparklineBar: {
    flex: 1,
    borderRadius: 2,
  },
  targetAchievedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
    fontFamily: 'Open Sans',
  },
})
