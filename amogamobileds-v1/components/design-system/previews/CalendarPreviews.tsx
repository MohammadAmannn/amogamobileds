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
  Calendar as CalendarIcon,
  CalendarDays,
  Clock,
  Check,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Sparkles,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import type { GalleryEntry } from '../../types'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatDate(date: Date) {
  return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function formatFullDate(date: Date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

// ─── 1. SINGLE SELECTION CALENDAR ──────────────────────────────────────────
export function CalendarSinglePreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [date, setDate] = useState<Date>(new Date(2026, 7, 19))
  const [viewYear, setViewYear] = useState(2026)
  const [viewMonth, setViewMonth] = useState(7)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  return (
    <View style={styles.cardContainer}>
      <View
        style={[
          styles.previewCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Calendar
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
              Interactive date picker grid
            </Text>
          </View>
          <View
            style={[
              styles.tagPill,
              {
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
              },
            ]}
          >
            <Text
              style={[
                styles.tagPillText,
                { color: isDark ? '#93c5fd' : '#1d4ed8' },
              ]}
            >
              {formatDate(date)}
            </Text>
          </View>
        </View>

        {/* Calendar Box */}
        <View
          style={[
            styles.calendarBox,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Month Nav */}
          <View style={styles.monthNavRow}>
            <Text style={[styles.monthNavTitle, { color: colors.foreground }]}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <View style={styles.navArrowsGroup}>
              <Pressable
                onPress={handlePrevMonth}
                style={[styles.navBtn, { borderColor: colors.border }]}
                hitSlop={8}
              >
                <ChevronLeft size={14} color={colors.foreground} />
              </Pressable>
              <Pressable
                onPress={handleNextMonth}
                style={[styles.navBtn, { borderColor: colors.border }]}
                hitSlop={8}
              >
                <ChevronRight size={14} color={colors.foreground} />
              </Pressable>
            </View>
          </View>

          {/* Day Names */}
          <View style={styles.daysHeaderRow}>
            {DAY_NAMES.map((d) => (
              <Text key={d} style={[styles.dayHeaderCell, { color: colors.mutedForeground }]}>
                {d}
              </Text>
            ))}
          </View>

          {/* Grid */}
          <View style={styles.calendarGrid}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.calendarCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const isSelected =
                date.getFullYear() === viewYear &&
                date.getMonth() === viewMonth &&
                date.getDate() === dayNum
              const isToday = dayNum === 19 && viewMonth === 7 && viewYear === 2026

              return (
                <Pressable
                  key={`day-${dayNum}`}
                  onPress={() => setDate(new Date(viewYear, viewMonth, dayNum))}
                  style={[
                    styles.calendarCell,
                    styles.calendarCellBtn,
                    isSelected && {
                      backgroundColor: colors.primary,
                      borderRadius: 8,
                    },
                    isToday && !isSelected && {
                      borderWidth: 1,
                      borderColor: colors.primary,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarCellText,
                      {
                        color: isSelected ? '#ffffff' : colors.foreground,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {dayNum}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>
      </View>
    </View>
  )
}

// ─── 2. RANGE SELECTION CALENDAR ───────────────────────────────────────────
export function CalendarRangePreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [startDay, setStartDay] = useState(10)
  const [endDay, setEndDay] = useState(24)
  const viewYear = 2026
  const viewMonth = 7

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const handleDayClick = (day: number) => {
    if (day <= startDay) {
      setStartDay(day)
    } else {
      setEndDay(day)
    }
  }

  const duration = endDay - startDay + 1

  return (
    <View style={styles.cardContainer}>
      <View
        style={[
          styles.previewCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Date Range Grid
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
              Select start and end dates directly
            </Text>
          </View>
        </View>

        {/* Range Calendar Box */}
        <View
          style={[
            styles.calendarBox,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.monthNavRow}>
            <Text style={[styles.monthNavTitle, { color: colors.foreground }]}>
              August 2026
            </Text>
          </View>

          <View style={styles.daysHeaderRow}>
            {DAY_NAMES.map((d) => (
              <Text key={d} style={[styles.dayHeaderCell, { color: colors.mutedForeground }]}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.calendarCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const isStart = dayNum === startDay
              const isEnd = dayNum === endDay
              const isInRange = dayNum > startDay && dayNum < endDay

              return (
                <Pressable
                  key={`day-${dayNum}`}
                  onPress={() => handleDayClick(dayNum)}
                  style={[
                    styles.calendarCell,
                    styles.calendarCellBtn,
                    (isStart || isEnd) && {
                      backgroundColor: colors.primary,
                      borderRadius: 8,
                    },
                    isInRange && {
                      backgroundColor: isDark
                        ? 'rgba(59, 130, 246, 0.2)'
                        : '#dbeafe',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarCellText,
                      {
                        color: isStart || isEnd ? '#ffffff' : colors.foreground,
                        fontWeight: isStart || isEnd ? '700' : '500',
                      },
                    ]}
                  >
                    {dayNum}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Summary Footer */}
        <View
          style={[
            styles.rangeSummaryBanner,
            {
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
              borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
            },
          ]}
        >
          <Text
            style={[
              styles.rangeSummaryText,
              { color: isDark ? '#93c5fd' : '#1d4ed8' },
            ]}
          >
            Aug {startDay} – Aug {endDay}, 2026
          </Text>
          <Text
            style={[
              styles.rangeDurationBadge,
              { color: isDark ? '#93c5fd' : '#1d4ed8' },
            ]}
          >
            {duration} Days Selected
          </Text>
        </View>
      </View>
    </View>
  )
}

// ─── 3. EVENT & AGENDA SCHEDULE VIEW ────────────────────────────────────────
export function CalendarEventsPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const { width } = useWindowDimensions()
  const isWide = width >= 768

  const [date, setDate] = useState<Date>(new Date(2026, 7, 19))
  const [events, setEvents] = useState([
    {
      time: '10:00 AM',
      title: 'Design Review & Sync',
      type: 'Design',
      team: 'UI Team',
    },
    {
      time: '02:30 PM',
      title: 'Sprint Board Planning',
      type: 'Dev',
      team: 'Frontend',
    },
    {
      time: '05:00 PM',
      title: 'Client Release Demo',
      type: 'Release',
      team: 'Product',
    },
  ])

  const daysInMonth = getDaysInMonth(2026, 7)
  const firstDay = getFirstDayOfMonth(2026, 7)

  const handleAddEvent = () => {
    const newEvent = {
      time: '03:45 PM',
      title: 'Expo Web Architecture Review',
      type: 'Architecture',
      team: 'Core Team',
    }
    setEvents((prev) => [newEvent, ...prev])
  }

  return (
    <View style={styles.eventsCardContainer}>
      <View
        style={[
          styles.eventsMasterCard,
          isWide && styles.eventsMasterCardWide,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Left Side: Calendar Mini */}
        <View
          style={[
            styles.eventsLeftPane,
            isWide && styles.eventsLeftPaneWide,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.monthNavRow}>
            <Text style={[styles.monthNavTitle, { color: colors.foreground }]}>
              August 2026
            </Text>
          </View>

          <View style={styles.daysHeaderRow}>
            {DAY_NAMES.map((d) => (
              <Text key={d} style={[styles.dayHeaderCell, { color: colors.mutedForeground }]}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.calendarCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const isSelected = date.getDate() === dayNum

              return (
                <Pressable
                  key={`day-${dayNum}`}
                  onPress={() => setDate(new Date(2026, 7, dayNum))}
                  style={[
                    styles.calendarCell,
                    styles.calendarCellBtn,
                    isSelected && {
                      backgroundColor: colors.primary,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarCellText,
                      {
                        color: isSelected ? '#ffffff' : colors.foreground,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {dayNum}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Right Side: Agenda Events List */}
        <View style={styles.eventsRightPane}>
          <View style={styles.agendaHeaderRow}>
            <View>
              <View style={styles.agendaTitleGroup}>
                <CalendarDays size={16} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                  {formatFullDate(date)}
                </Text>
              </View>
              <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
                {events.length} scheduled events
              </Text>
            </View>

            <Pressable
              onPress={handleAddEvent}
              style={[
                styles.addEventBtn,
                { backgroundColor: colors.primary },
              ]}
            >
              <Plus size={13} color='#ffffff' />
              <Text style={styles.addEventBtnText}>Add Event</Text>
            </Pressable>
          </View>

          {/* Event items */}
          <View style={styles.eventList}>
            {events.map((ev, i) => (
              <View
                key={i}
                style={[
                  styles.eventItemCard,
                  {
                    backgroundColor: isDark ? colors.background : colors.secondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.eventItemLeft}>
                  <View
                    style={[
                      styles.eventTimeIconBox,
                      {
                        backgroundColor: isDark
                          ? 'rgba(59, 130, 246, 0.15)'
                          : '#dbeafe',
                      },
                    ]}
                  >
                    <Clock size={14} color={colors.primary} />
                  </View>
                  <View style={styles.eventInfoText}>
                    <Text
                      style={[
                        styles.eventItemTitle,
                        { color: colors.foreground },
                      ]}
                    >
                      {ev.title}
                    </Text>
                    <View style={styles.eventMetaRow}>
                      <Text
                        style={[
                          styles.eventTimeText,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {ev.time}
                      </Text>
                      <Text style={{ color: colors.mutedForeground }}>•</Text>
                      <View style={styles.teamTagGroup}>
                        <Users size={11} color={colors.mutedForeground} />
                        <Text
                          style={[
                            styles.eventTimeText,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {ev.team}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.tagPill,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagPillText,
                      { color: colors.primary },
                    ]}
                  >
                    {ev.type}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Sync status footer */}
          <View
            style={[
              styles.syncStatusFooter,
              { borderTopColor: colors.border },
            ]}
          >
            <Text style={[styles.syncText, { color: colors.mutedForeground }]}>
              Google Calendar Sync
            </Text>
            <View style={styles.syncBadge}>
              <Check size={12} color='#10b981' strokeWidth={2.5} />
              <Text style={styles.syncBadgeText}>Synced</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

// ─── MASTER CALENDAR PREVIEWS EXPORT ────────────────────────────────────────
export function CalendarPreviews({ entry }: { entry?: GalleryEntry }) {
  const { colors } = useTheme()

  if (entry?.id === 'calendar-single') {
    return <CalendarSinglePreview />
  }
  if (entry?.id === 'calendar-range') {
    return <CalendarRangePreview />
  }
  if (entry?.id === 'calendar-events') {
    return <CalendarEventsPreview />
  }

  // Default overview
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <CalendarEventsPreview />
      <CalendarSinglePreview />
      <CalendarRangePreview />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    padding: 20,
    gap: 20,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 8,
  },
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
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
    paddingBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    marginTop: 2,
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
  calendarBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  monthNavTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  navArrowsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  dayHeaderCell: {
    width: 32,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCellBtn: {
    borderRadius: 6,
  },
  calendarCellText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  rangeSummaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  rangeSummaryText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  rangeDurationBadge: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  eventsCardContainer: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 8,
  },
  eventsMasterCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  eventsMasterCardWide: {
    flexDirection: 'row',
  },
  eventsLeftPane: {
    padding: 16,
    borderBottomWidth: 1,
  },
  eventsLeftPaneWide: {
    width: 290,
    borderBottomWidth: 0,
    borderRightWidth: 1,
  },
  eventsRightPane: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  agendaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  agendaTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addEventBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  eventList: {
    gap: 8,
  },
  eventItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  eventItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  eventTimeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfoText: {
    flex: 1,
    gap: 2,
  },
  eventItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventTimeText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  teamTagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  syncStatusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  syncText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
    fontFamily: 'Open Sans',
  },
})
