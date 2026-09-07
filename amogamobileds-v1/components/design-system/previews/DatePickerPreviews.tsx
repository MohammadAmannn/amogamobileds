import React, { useMemo, useState } from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Calendar as CalendarIcon,
  CalendarDays,
  Clock,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Sliders,
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

// ─── 1. SIMPLE DATE PICKER ──────────────────────────────────────────────────
export function DatePickerSimplePreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [date, setDate] = useState<Date | null>(new Date(2026, 7, 19))
  const [isOpen, setIsOpen] = useState(false)
  const [viewYear, setViewYear] = useState(2026)
  const [viewMonth, setViewMonth] = useState(7) // August

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
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Select Date
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
            Choose a single date for your appointment or task.
          </Text>
        </View>

        {/* Trigger Button */}
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={[
            styles.inputTrigger,
            {
              backgroundColor: colors.background,
              borderColor: isOpen ? colors.primary : colors.border,
            },
          ]}
        >
          <CalendarIcon size={16} color={colors.primary} style={styles.triggerIcon} />
          <Text
            style={[
              styles.triggerText,
              { color: date ? colors.foreground : colors.mutedForeground },
            ]}
          >
            {date ? formatDate(date) : 'Pick a date'}
          </Text>
        </Pressable>

        {/* Inline Popover Calendar Grid */}
        {isOpen && (
          <View
            style={[
              styles.popoverGrid,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Month Nav */}
            <View style={styles.monthNavRow}>
              <Pressable
                onPress={handlePrevMonth}
                style={[styles.navBtn, { borderColor: colors.border }]}
                hitSlop={8}
              >
                <ChevronLeft size={14} color={colors.foreground} />
              </Pressable>

              <Text style={[styles.monthNavTitle, { color: colors.foreground }]}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </Text>

              <Pressable
                onPress={handleNextMonth}
                style={[styles.navBtn, { borderColor: colors.border }]}
                hitSlop={8}
              >
                <ChevronRight size={14} color={colors.foreground} />
              </Pressable>
            </View>

            {/* Day Header */}
            <View style={styles.daysHeaderRow}>
              {DAY_NAMES.map((d) => (
                <Text key={d} style={[styles.dayHeaderCell, { color: colors.mutedForeground }]}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Calendar Cells */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.calendarCell} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1
                const isSelected =
                  date &&
                  date.getFullYear() === viewYear &&
                  date.getMonth() === viewMonth &&
                  date.getDate() === dayNum

                return (
                  <Pressable
                    key={`day-${dayNum}`}
                    onPress={() => {
                      setDate(new Date(viewYear, viewMonth, dayNum))
                      setIsOpen(false)
                    }}
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
                          color: isSelected
                            ? '#ffffff'
                            : colors.foreground,
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
        )}

        {/* Selected pill */}
        {date && (
          <View
            style={[
              styles.selectedBanner,
              {
                backgroundColor: isDark ? 'rgba(20, 184, 166, 0.15)' : '#ccfbf1',
                borderColor: isDark ? 'rgba(20, 184, 166, 0.3)' : '#99f6e4',
              },
            ]}
          >
            <Text
              style={[
                styles.selectedBannerText,
                { color: isDark ? '#2dd4bf' : '#0f766e' },
              ]}
            >
              Selected: {formatFullDate(date)}
            </Text>
            <Pressable onPress={() => setDate(null)} hitSlop={6}>
              <Text
                style={[
                  styles.clearLink,
                  { color: isDark ? '#2dd4bf' : '#0f766e' },
                ]}
              >
                Clear
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  )
}

// ─── 2. GRAPHICAL / SWIFTUI STYLE DATEPICKER ────────────────────────────────
export function DatePickerGraphicalPreview() {
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
        <View style={styles.swiftuiHeader}>
          <View>
            <View style={styles.badgeRow}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                Graphical DatePicker
              </Text>
              <View
                style={[
                  styles.tagPill,
                  {
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#e0e7ff',
                    borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : '#c7d2fe',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagPillText,
                    { color: isDark ? '#a5b4fc' : '#4338ca' },
                  ]}
                >
                  SwiftUI style
                </Text>
              </View>
            </View>
            <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
              Inline calendar matching Expo SwiftUI DatePicker specifications.
            </Text>
          </View>
        </View>

        {/* Graphical Calendar Box */}
        <View
          style={[
            styles.graphicalBox,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header Controls */}
          <View style={styles.monthNavRow}>
            <View style={styles.swiftuiMonthHeader}>
              <Text style={[styles.graphicalMonthText, { color: colors.foreground }]}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </Text>
            </View>

            <View style={styles.navArrowsGroup}>
              <Pressable
                onPress={handlePrevMonth}
                style={[styles.navBtn, { borderColor: colors.border }]}
                hitSlop={8}
              >
                <ChevronLeft size={15} color={colors.foreground} />
              </Pressable>
              <Pressable
                onPress={handleNextMonth}
                style={[styles.navBtn, { borderColor: colors.border }]}
                hitSlop={8}
              >
                <ChevronRight size={15} color={colors.foreground} />
              </Pressable>
            </View>
          </View>

          {/* Weekday labels */}
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
                    styles.graphicalCellBtn,
                    isSelected && {
                      backgroundColor: colors.primary,
                      borderRadius: 20,
                    },
                    isToday && !isSelected && {
                      borderColor: colors.primary,
                      borderWidth: 1,
                      borderRadius: 20,
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

        {/* Footer info readout */}
        <View style={styles.graphicalFooter}>
          <View style={styles.dateChip}>
            <CalendarDays size={14} color={colors.primary} />
            <Text style={[styles.dateChipText, { color: colors.foreground }]}>
              {formatFullDate(date)}
            </Text>
          </View>
          <Pressable
            onPress={() => setDate(new Date(2026, 7, 19))}
            style={[
              styles.todayBtn,
              {
                backgroundColor: isDark ? colors.card : colors.secondary,
                borderColor: colors.border,
              },
            ]}
          >
            <RotateCcw size={12} color={colors.mutedForeground} />
            <Text style={[styles.todayBtnText, { color: colors.foreground }]}>
              Today
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

// ─── 3. WHEEL & TIME DATEPICKER (iOS / Expo Style) ──────────────────────────
export function DatePickerWheelPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [selectedHour, setSelectedHour] = useState('09')
  const [selectedMinute, setSelectedMinute] = useState('30')
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM')
  const [selectedDay, setSelectedDay] = useState('Wed, Aug 19')

  const daysList = [
    'Mon, Aug 17',
    'Tue, Aug 18',
    'Wed, Aug 19',
    'Thu, Aug 20',
    'Fri, Aug 21',
  ]
  const hours = ['08', '09', '10', '11', '12', '01', '02', '03', '04', '05']
  const minutes = ['00', '15', '30', '45']

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
        <View style={styles.cardHeader}>
          <View style={styles.badgeRow}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Wheel Time & Date Picker
            </Text>
            <View
              style={[
                styles.tagPill,
                {
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#d1fae5',
                  borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0',
                },
              ]}
            >
              <Text
                style={[
                  styles.tagPillText,
                  { color: isDark ? '#6ee7b7' : '#047857' },
                ]}
              >
                Wheel UI
              </Text>
            </View>
          </View>
          <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
            Scrollable column selector for appointments & schedules.
          </Text>
        </View>

        {/* Wheel Display Columns */}
        <View
          style={[
            styles.wheelContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Day column */}
          <View style={styles.wheelCol}>
            <Text style={[styles.wheelColLabel, { color: colors.mutedForeground }]}>
              DATE
            </Text>
            <ScrollView style={styles.wheelColScroll} showsVerticalScrollIndicator={false}>
              {daysList.map((d) => {
                const isSelected = selectedDay === d
                return (
                  <Pressable
                    key={d}
                    onPress={() => setSelectedDay(d)}
                    style={[
                      styles.wheelItem,
                      isSelected && {
                        backgroundColor: colors.primary,
                        borderRadius: 6,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.wheelItemText,
                        {
                          color: isSelected ? '#ffffff' : colors.foreground,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {d}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>

          {/* Hour column */}
          <View style={[styles.wheelCol, styles.wheelColSmall]}>
            <Text style={[styles.wheelColLabel, { color: colors.mutedForeground }]}>
              HOUR
            </Text>
            <ScrollView style={styles.wheelColScroll} showsVerticalScrollIndicator={false}>
              {hours.map((h) => {
                const isSelected = selectedHour === h
                return (
                  <Pressable
                    key={h}
                    onPress={() => setSelectedHour(h)}
                    style={[
                      styles.wheelItem,
                      isSelected && {
                        backgroundColor: colors.primary,
                        borderRadius: 6,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.wheelItemText,
                        {
                          color: isSelected ? '#ffffff' : colors.foreground,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {h}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>

          {/* Minute column */}
          <View style={[styles.wheelCol, styles.wheelColSmall]}>
            <Text style={[styles.wheelColLabel, { color: colors.mutedForeground }]}>
              MIN
            </Text>
            <ScrollView style={styles.wheelColScroll} showsVerticalScrollIndicator={false}>
              {minutes.map((m) => {
                const isSelected = selectedMinute === m
                return (
                  <Pressable
                    key={m}
                    onPress={() => setSelectedMinute(m)}
                    style={[
                      styles.wheelItem,
                      isSelected && {
                        backgroundColor: colors.primary,
                        borderRadius: 6,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.wheelItemText,
                        {
                          color: isSelected ? '#ffffff' : colors.foreground,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {m}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>

          {/* Period column */}
          <View style={[styles.wheelCol, styles.wheelColSmall]}>
            <Text style={[styles.wheelColLabel, { color: colors.mutedForeground }]}>
              AM/PM
            </Text>
            <View style={styles.periodColGroup}>
              {(['AM', 'PM'] as const).map((p) => {
                const isSelected = selectedPeriod === p
                return (
                  <Pressable
                    key={p}
                    onPress={() => setSelectedPeriod(p)}
                    style={[
                      styles.periodBtn,
                      isSelected && {
                        backgroundColor: colors.primary,
                        borderRadius: 6,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.wheelItemText,
                        {
                          color: isSelected ? '#ffffff' : colors.foreground,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        </View>

        {/* Readout banner */}
        <View
          style={[
            styles.wheelResultBox,
            {
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : '#eef2ff',
              borderColor: isDark ? 'rgba(99, 102, 241, 0.25)' : '#c7d2fe',
            },
          ]}
        >
          <Clock size={16} color={colors.primary} />
          <Text
            style={[
              styles.wheelResultText,
              { color: isDark ? '#a5b4fc' : '#4338ca' },
            ]}
          >
            Scheduled for {selectedDay} at {selectedHour}:{selectedMinute} {selectedPeriod}
          </Text>
        </View>
      </View>
    </View>
  )
}

// ─── 4. DATE RANGE PICKER ───────────────────────────────────────────────────
export function DatePickerRangePreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [startDay, setStartDay] = useState(10)
  const [endDay, setEndDay] = useState(24)
  const viewYear = 2026
  const viewMonth = 7 // August
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
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Date Range Selection
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
            Select start and end dates for your project sprint or vacation.
          </Text>
        </View>

        {/* Trigger range summary */}
        <View
          style={[
            styles.inputTrigger,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <CalendarDays size={16} color={colors.primary} style={styles.triggerIcon} />
          <Text style={[styles.triggerText, { color: colors.foreground }]}>
            Aug {startDay}, 2026 — Aug {endDay}, 2026
          </Text>
        </View>

        {/* Range Calendar Grid */}
        <View
          style={[
            styles.popoverGrid,
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
                        ? 'rgba(20, 184, 166, 0.2)'
                        : '#ccfbf1',
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

        {/* Duration pill */}
        <View
          style={[
            styles.selectedBanner,
            {
              backgroundColor: isDark ? 'rgba(20, 184, 166, 0.15)' : '#ccfbf1',
              borderColor: isDark ? 'rgba(20, 184, 166, 0.3)' : '#99f6e4',
            },
          ]}
        >
          <Text
            style={[
              styles.selectedBannerText,
              { color: isDark ? '#2dd4bf' : '#0f766e' },
            ]}
          >
            Duration: {duration} days
          </Text>
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
                { color: isDark ? '#2dd4bf' : '#0f766e' },
              ]}
            >
              Active Range
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// ─── 5. QUICK PRESETS DATE PICKER ───────────────────────────────────────────
export function DatePickerPresetsPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [date, setDate] = useState<Date>(new Date(2026, 7, 19))
  const [selectedPreset, setSelectedPreset] = useState('Today')

  const presets = [
    { label: 'Today', dayOffset: 0 },
    { label: 'Tomorrow', dayOffset: 1 },
    { label: 'In 3 days', dayOffset: 3 },
    { label: 'In 1 week', dayOffset: 7 },
    { label: 'In 1 month', dayOffset: 30 },
  ]

  const handleSelectPreset = (p: { label: string; dayOffset: number }) => {
    setSelectedPreset(p.label)
    const base = new Date(2026, 7, 19)
    base.setDate(base.getDate() + p.dayOffset)
    setDate(base)
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
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Quick Presets Date Picker
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
            Select a date quickly using predefined shortcuts.
          </Text>
        </View>

        <View style={styles.presetsRow}>
          {presets.map((p) => {
            const isSelected = selectedPreset === p.label
            return (
              <Pressable
                key={p.label}
                onPress={() => handleSelectPreset(p)}
                style={[
                  styles.presetChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                      ? colors.background
                      : colors.secondary,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    {
                      color: isSelected ? '#ffffff' : colors.foreground,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* Readout */}
        <View
          style={[
            styles.inputTrigger,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Clock size={16} color={colors.primary} style={styles.triggerIcon} />
          <Text style={[styles.triggerText, { color: colors.foreground }]}>
            {formatFullDate(date)}
          </Text>
        </View>
      </View>
    </View>
  )
}

// ─── 6. DATE PICKER FORM FIELD ──────────────────────────────────────────────
export function DatePickerFormPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [date, setDate] = useState<Date | null>(new Date(1995, 4, 15))
  const [hasError, setHasError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!date) {
      setHasError(true)
      setSubmitted(false)
    } else {
      setHasError(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
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
        <View style={styles.formHeaderRow}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Date of Birth *
          </Text>
          <Text style={[styles.requiredLabel, { color: colors.mutedForeground }]}>
            Required
          </Text>
        </View>

        <Pressable
          onPress={() => {
            if (!date) setDate(new Date(1995, 4, 15))
            else setDate(null)
          }}
          style={[
            styles.inputTrigger,
            {
              backgroundColor: colors.background,
              borderColor: hasError && !date ? '#ef4444' : colors.border,
            },
          ]}
        >
          <CalendarIcon size={16} color={colors.primary} style={styles.triggerIcon} />
          <Text
            style={[
              styles.triggerText,
              { color: date ? colors.foreground : colors.mutedForeground },
            ]}
          >
            {date ? formatDate(date) : 'Pick your date of birth'}
          </Text>
        </Pressable>

        {hasError && !date ? (
          <View style={styles.errorRow}>
            <AlertCircle size={13} color='#ef4444' />
            <Text style={styles.errorText}>Please select your date of birth.</Text>
          </View>
        ) : (
          <Text style={[styles.helperText, { color: colors.mutedForeground }]}>
            Your date of birth is used to verify account eligibility.
          </Text>
        )}

        <Pressable
          onPress={handleSubmit}
          style={[
            styles.submitBtn,
            { backgroundColor: colors.primary },
          ]}
        >
          {submitted ? (
            <View style={styles.submitSuccessRow}>
              <Check size={14} color='#ffffff' strokeWidth={3} />
              <Text style={styles.submitBtnText}>Profile Saved!</Text>
            </View>
          ) : (
            <Text style={styles.submitBtnText}>Submit Profile</Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}

// ─── MASTER DATE PICKER PREVIEWS EXPORT ─────────────────────────────────────
export function DatePickerPreviews({ entry }: { entry?: GalleryEntry }) {
  const { colors } = useTheme()

  if (entry?.id === 'date-picker-graphical') {
    return <DatePickerGraphicalPreview />
  }
  if (entry?.id === 'date-picker-wheel') {
    return <DatePickerWheelPreview />
  }
  if (entry?.id === 'date-picker-range') {
    return <DatePickerRangePreview />
  }
  if (entry?.id === 'date-picker-presets') {
    return <DatePickerPresetsPreview />
  }
  if (entry?.id === 'date-picker-form') {
    return <DatePickerFormPreview />
  }
  if (entry?.id === 'date-picker-simple') {
    return <DatePickerSimplePreview />
  }

  // Default: Overview of all Date Picker variations
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <DatePickerGraphicalPreview />
      <DatePickerSimplePreview />
      <DatePickerWheelPreview />
      <DatePickerRangePreview />
      <DatePickerPresetsPreview />
      <DatePickerFormPreview />
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
  cardHeader: {
    gap: 4,
  },
  swiftuiHeader: {
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
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
    lineHeight: 17,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  inputTrigger: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  triggerIcon: {
    marginRight: 2,
  },
  triggerText: {
    fontSize: 13,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  popoverGrid: {
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
  swiftuiMonthHeader: {
    flex: 1,
  },
  graphicalMonthText: {
    fontSize: 14,
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
  graphicalCellBtn: {
    borderRadius: 18,
  },
  calendarCellText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedBannerText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  clearLink: {
    fontSize: 11,
    textDecorationLine: 'underline',
    fontFamily: 'Open Sans',
    fontWeight: '600',
  },
  graphicalBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  graphicalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  todayBtnText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  wheelContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    height: 140,
    overflow: 'hidden',
  },
  wheelCol: {
    flex: 1.8,
    borderRightWidth: 1,
    borderRightColor: 'rgba(150, 150, 150, 0.2)',
    paddingVertical: 6,
  },
  wheelColSmall: {
    flex: 1,
  },
  wheelColLabel: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Open Sans',
    letterSpacing: 0.5,
  },
  wheelColScroll: {
    flex: 1,
    paddingHorizontal: 4,
  },
  wheelItem: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginVertical: 1,
  },
  wheelItemText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  periodColGroup: {
    flex: 1,
    padding: 4,
    gap: 4,
    justifyContent: 'center',
  },
  periodBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  wheelResultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  wheelResultText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    flex: 1,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  formHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requiredLabel: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  helperText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#ef4444',
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  submitBtn: {
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
})
