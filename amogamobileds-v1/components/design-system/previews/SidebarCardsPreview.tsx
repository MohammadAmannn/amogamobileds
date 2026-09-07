import React, { useState } from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  Layers,
  Check,
  Sparkles,
  MousePointer,
  CheckCircle2,
  Sliders,
  Eye,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import { ComponentBadge } from '../ComponentBadge'
import type { GalleryEntry } from '../../types'

interface DemoCardItem {
  id: string
  name: string
  category: string
  badge: string
  filePath: string
  unread?: boolean
}

const DEMO_SIDEBAR_CARDS: DemoCardItem[] = [
  {
    id: 'demo-task-page',
    name: 'Complete Task Page (Sprint Board & Kanban)',
    category: 'Task',
    badge: 'Task Page',
    filePath: 'index.tsx',
  },
  {
    id: 'demo-task-item',
    name: 'Task Card Item',
    category: 'Task',
    badge: 'Task Card',
    filePath: 'task-card-item.tsx',
  },
  {
    id: 'demo-notif-page',
    name: 'Complete Notifications Page (Layout)',
    category: 'Notifications',
    badge: 'Notifications',
    filePath: 'notification-detail-panel.tsx',
  },
  {
    id: 'demo-notif-item',
    name: 'Notification Card Item',
    category: 'Notifications',
    badge: 'Notice Card',
    filePath: 'notification-card-item.tsx',
  },
  {
    id: 'demo-file-manager',
    name: 'File Manager View',
    category: 'Files',
    badge: 'File Explorer',
    filePath: 'user-file-cards-view.tsx',
  },
  {
    id: 'demo-file-item',
    name: 'File Card Item',
    category: 'Files',
    badge: 'File Card',
    filePath: 'file-card-item.tsx',
  },
  {
    id: 'demo-file-upload',
    name: 'File Upload & Document Composer',
    category: 'Files',
    badge: 'Upload Composer',
    filePath: 'file-upload-form.tsx',
  },
]

export function SidebarCardsPreview({ entry }: { entry?: GalleryEntry }) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const { width } = useWindowDimensions()
  const isWide = width >= 768

  const [selectedCardId, setSelectedCardId] = useState<string>('demo-task-page')

  const activeCard =
    DEMO_SIDEBAR_CARDS.find((c) => c.id === selectedCardId) ||
    DEMO_SIDEBAR_CARDS[0]

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Overview Intro Card */}
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.introCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.introHeaderRow}>
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
              <Layers size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.mainTitle, { color: colors.foreground }]}>
                Sidebar Cards Architecture
              </Text>
              <Text style={[styles.mainSubtitle, { color: colors.mutedForeground }]}>
                Borderless navigation item cards with active indicator stripe.
              </Text>
            </View>
          </View>

          {/* Key Specs Pills */}
          <View style={styles.specsRow}>
            <View
              style={[
                styles.specBadge,
                {
                  backgroundColor: isDark ? colors.background : colors.secondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.specBadgeText, { color: colors.foreground }]}>
                No Outer Border (0px)
              </Text>
            </View>
            <View
              style={[
                styles.specBadge,
                {
                  backgroundColor: isDark ? colors.background : colors.secondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.specBadgeText, { color: colors.foreground }]}>
                Left Accent Stripe (3.5px)
              </Text>
            </View>
            <View
              style={[
                styles.specBadge,
                {
                  backgroundColor: isDark ? colors.background : colors.secondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.specBadgeText, { color: colors.foreground }]}>
                Lavender Tint on Selected
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Interactive Demo Container */}
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.demoMasterBox,
            isWide && styles.demoMasterBoxWide,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Left Column: Live Sidebar Cards Column Simulation */}
          <View
            style={[
              styles.sidebarColumnDemo,
              isWide && styles.sidebarColumnDemoWide,
              {
                backgroundColor: colors.background,
                borderRightColor: colors.border,
              },
            ]}
          >
            <View style={styles.sidebarColumnHeader}>
              <Text style={[styles.sidebarColumnTitle, { color: colors.mutedForeground }]}>
                INTERACTIVE SIDEBAR LIST
              </Text>
              <Text style={[styles.sidebarColumnSub, { color: colors.mutedForeground }]}>
                Click any card to inspect active state
              </Text>
            </View>

            <View style={styles.cardsList}>
              {DEMO_SIDEBAR_CARDS.map((card) => {
                const isSelected = selectedCardId === card.id
                return (
                  <Pressable
                    key={card.id}
                    onPress={() => setSelectedCardId(card.id)}
                    style={({ pressed }) => [
                      styles.demoCardItem,
                      isSelected
                        ? {
                            backgroundColor: isDark
                              ? 'rgba(99, 102, 241, 0.14)'
                              : '#eef2ff',
                          }
                        : {
                            backgroundColor: pressed
                              ? isDark
                                ? 'rgba(255, 255, 255, 0.04)'
                                : 'rgba(0, 0, 0, 0.03)'
                              : 'transparent',
                          },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.indicatorBar,
                          { backgroundColor: colors.primary || '#4f46e5' },
                        ]}
                      />
                    )}

                    <View style={styles.cardTopRow}>
                      <Text
                        style={[
                          styles.cardNameText,
                          {
                            color: colors.foreground,
                            fontWeight: isSelected ? '700' : '600',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {card.name}
                      </Text>
                      <ComponentBadge
                        category={card.category}
                        badgeText={card.badge}
                      />
                    </View>

                    <Text
                      style={[
                        styles.cardPathText,
                        { color: colors.mutedForeground },
                      ]}
                      numberOfLines={1}
                    >
                      {card.filePath}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          {/* Right Column: Card Anatomy & Active Inspector */}
          <View style={styles.inspectorRightColumn}>
            <View style={styles.inspectorHeader}>
              <View style={styles.badgeGroup}>
                <Text style={[styles.inspectorTitle, { color: colors.foreground }]}>
                  Selected Card Specs
                </Text>
                <View
                  style={[
                    styles.activeBadgePill,
                    {
                      backgroundColor: isDark
                        ? 'rgba(16, 185, 129, 0.15)'
                        : '#d1fae5',
                      borderColor: isDark
                        ? 'rgba(16, 185, 129, 0.3)'
                        : '#a7f3d0',
                    },
                  ]}
                >
                  <Text style={styles.activeBadgePillText}>Active State</Text>
                </View>
              </View>
              <Text style={[styles.inspectorSub, { color: colors.mutedForeground }]}>
                Live token values applied to current selection.
              </Text>
            </View>

            {/* Active Card Preview Box */}
            <View
              style={[
                styles.isolatedPreviewBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.isolatedPreviewLabel, { color: colors.mutedForeground }]}>
                ISOLATED CARD PREVIEW
              </Text>

              <View
                style={[
                  styles.demoCardItem,
                  {
                    backgroundColor: isDark
                      ? 'rgba(99, 102, 241, 0.14)'
                      : '#eef2ff',
                    marginTop: 8,
                  },
                ]}
              >
                <View
                  style={[
                    styles.indicatorBar,
                    { backgroundColor: colors.primary || '#4f46e5' },
                  ]}
                />

                <View style={styles.cardTopRow}>
                  <Text
                    style={[
                      styles.cardNameText,
                      { color: colors.foreground, fontWeight: '700' },
                    ]}
                    numberOfLines={1}
                  >
                    {activeCard.name}
                  </Text>
                  <ComponentBadge
                    category={activeCard.category}
                    badgeText={activeCard.badge}
                  />
                </View>

                <Text
                  style={[
                    styles.cardPathText,
                    { color: colors.mutedForeground },
                  ]}
                  numberOfLines={1}
                >
                  {activeCard.filePath}
                </Text>
              </View>
            </View>

            {/* Token Properties List */}
            <View
              style={[
                styles.tokenPropertiesBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.tokenRow}>
                <Text style={[styles.tokenLabel, { color: colors.mutedForeground }]}>
                  Border Width:
                </Text>
                <Text style={[styles.tokenValue, { color: colors.foreground }]}>
                  0px (Borderless)
                </Text>
              </View>

              <View style={styles.tokenRow}>
                <Text style={[styles.tokenLabel, { color: colors.mutedForeground }]}>
                  Border Radius:
                </Text>
                <Text style={[styles.tokenValue, { color: colors.foreground }]}>
                  12px (Rounded)
                </Text>
              </View>

              <View style={styles.tokenRow}>
                <Text style={[styles.tokenLabel, { color: colors.mutedForeground }]}>
                  Left Stripe:
                </Text>
                <Text style={[styles.tokenValue, { color: colors.primary }]}>
                  3.5px solid ({colors.primary})
                </Text>
              </View>

              <View style={styles.tokenRow}>
                <Text style={[styles.tokenLabel, { color: colors.mutedForeground }]}>
                  Background:
                </Text>
                <Text style={[styles.tokenValue, { color: colors.foreground }]}>
                  {isDark ? 'rgba(99, 102, 241, 0.14)' : '#eef2ff'}
                </Text>
              </View>

              <View style={styles.tokenRow}>
                <Text style={[styles.tokenLabel, { color: colors.mutedForeground }]}>
                  Pill Badge:
                </Text>
                <Text style={[styles.tokenValue, { color: colors.foreground }]}>
                  {activeCard.badge} (Upper Case)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  introCard: {
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
  introHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  mainSubtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  specBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  demoMasterBox: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  demoMasterBoxWide: {
    flexDirection: 'row',
  },
  sidebarColumnDemo: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sidebarColumnDemoWide: {
    width: 340,
    borderBottomWidth: 0,
    borderRightWidth: 1,
  },
  sidebarColumnHeader: {
    paddingBottom: 12,
    gap: 2,
  },
  sidebarColumnTitle: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: 0.5,
  },
  sidebarColumnSub: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  cardsList: {
    gap: 2,
  },
  demoCardItem: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0,
    gap: 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  indicatorBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3.5,
    borderRadius: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardNameText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 18,
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  cardPathText: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  inspectorRightColumn: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  inspectorHeader: {
    gap: 4,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inspectorTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  activeBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  activeBadgePillText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Open Sans',
  },
  inspectorSub: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  isolatedPreviewBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  isolatedPreviewLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'Open Sans',
  },
  tokenPropertiesBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenLabel: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  tokenValue: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
})
