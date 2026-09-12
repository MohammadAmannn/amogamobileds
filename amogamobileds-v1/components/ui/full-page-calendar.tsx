import React, { useState, useMemo, useCallback } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  useWindowDimensions,
} from 'react-native';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Search,
  X,
  MapPin,
  Users,
  Check,
  CalendarDays,
  ListFilter,
  Layers,
  Trash2,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';

export type CalendarViewMode = 'day' | 'threeDay' | 'week' | 'month' | 'agenda' | 'resource';

export interface CalendarEventItem {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO String or 'YYYY-MM-DDTHH:mm:ss'
  end: string;
  color?: string;
  category?: 'Work' | 'Meeting' | 'Design' | 'Personal' | 'Health';
  location?: string;
  attendees?: string[];
  isAllDay?: boolean;
  resourceId?: string;
}

export interface CalendarResourceItem {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
}

export const DEFAULT_CALENDAR_RESOURCES: CalendarResourceItem[] = [
  { id: 'res-1', name: 'Dr. Sarah Johnson', role: 'Room 101 · Surgery', avatarColor: '#3b82f6' },
  { id: 'res-2', name: 'Dr. Alex Rivera', role: 'Room 102 · Cardiology', avatarColor: '#10b981' },
  { id: 'res-3', name: 'Dr. Priya Patel', role: 'Room 103 · Pediatrics', avatarColor: '#8b5cf6' },
  { id: 'res-4', name: 'Design Studio A', role: 'Main Workshop', avatarColor: '#f59e0b' },
];

export const DEFAULT_CALENDAR_EVENTS: CalendarEventItem[] = [
  {
    id: 'evt-1',
    title: 'Product Design Sprint & Review',
    description: 'Weekly design critique and design system token sync with frontend team.',
    start: '2026-09-12T09:00:00',
    end: '2026-09-12T10:30:00',
    color: '#3b82f6',
    category: 'Design',
    location: 'Conference Room Alpha / Virtual',
    attendees: ['Mohammed Aman', 'Sarah Miller', 'Alex Chen'],
    resourceId: 'res-1',
  },
  {
    id: 'evt-2',
    title: 'Client Stakeholder Sync',
    description: 'Quarterly roadmap presentation and project delivery demo.',
    start: '2026-09-12T11:00:00',
    end: '2026-09-12T12:15:00',
    color: '#10b981',
    category: 'Meeting',
    location: 'Zoom Meeting Room #4',
    attendees: ['Mohammed Aman', 'James Taylor', 'Emma Watson'],
    resourceId: 'res-2',
  },
  {
    id: 'evt-3',
    title: 'Design System Architecture Workshop',
    description: 'Deep dive into responsive cross-platform tokens and theme engine.',
    start: '2026-09-12T14:00:00',
    end: '2026-09-12T15:30:00',
    color: '#8b5cf6',
    category: 'Work',
    location: 'Design Lab Studio B',
    attendees: ['Aman', 'Priya', 'David'],
    resourceId: 'res-3',
  },
  {
    id: 'evt-4',
    title: 'Daily Standup & Sync',
    description: 'Fast round-robin sync on active blockers and pull requests.',
    start: '2026-09-12T16:00:00',
    end: '2026-09-12T16:45:00',
    color: '#f59e0b',
    category: 'Work',
    location: 'Google Meet',
    attendees: ['Engineering Team'],
    resourceId: 'res-4',
  },
  {
    id: 'evt-5',
    title: 'Company All-Hands Q3',
    description: 'Quarterly vision, team recognitions, and keynote.',
    start: '2026-09-13T10:00:00',
    end: '2026-09-13T11:30:00',
    color: '#ec4899',
    category: 'Meeting',
    location: 'Main Auditorium',
    attendees: ['All Employees'],
    resourceId: 'res-1',
  },
  {
    id: 'evt-6',
    title: 'Mobile DS v2 Core Refactor',
    description: 'Performance benchmarking and memory optimizations for list rendering.',
    start: '2026-09-14T13:00:00',
    end: '2026-09-14T15:00:00',
    color: '#06b6d4',
    category: 'Work',
    location: 'Virtual Office',
    attendees: ['Core DS Team'],
    resourceId: 'res-2',
  },
  {
    id: 'evt-7',
    title: 'Annual Team Retreat & Dinner',
    description: 'Celebration dinner with the engineering and design orgs.',
    start: '2026-09-15T18:00:00',
    end: '2026-09-15T21:00:00',
    color: '#eab308',
    category: 'Personal',
    location: 'Grand Plaza Hotel',
    attendees: ['All Team Members'],
    resourceId: 'res-3',
  },
  {
    id: 'evt-8',
    title: 'Public Holiday · Community Day',
    description: 'All offices closed for community outreach and service day.',
    start: '2026-09-16T00:00:00',
    end: '2026-09-16T23:59:59',
    color: '#6366f1',
    category: 'Personal',
    isAllDay: true,
    resourceId: 'res-4',
  },
];

const CATEGORIES = ['All', 'Work', 'Meeting', 'Design', 'Personal'] as const;

const VIEW_MODES: { key: CalendarViewMode; label: string; icon: any }[] = [
  { key: 'day', label: 'Day', icon: Clock },
  { key: 'threeDay', label: '3 Days', icon: CalendarDays },
  { key: 'week', label: 'Week', icon: CalendarIcon },
  { key: 'month', label: 'Month', icon: Layers },
  { key: 'agenda', label: 'Agenda', icon: ListFilter },
  { key: 'resource', label: 'Resource', icon: Users },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface FullPageCalendarProps {
  initialDate?: Date;
  initialViewMode?: CalendarViewMode;
  events?: CalendarEventItem[];
  resources?: CalendarResourceItem[];
  onEventClick?: (event: CalendarEventItem) => void;
  onAddEvent?: (event: CalendarEventItem) => void;
  height?: number | string;
  style?: any;
}

export function FullPageCalendar({
  initialDate = new Date(2026, 8, 12), // Sep 12, 2026
  initialViewMode = 'week',
  events: initialEvents = DEFAULT_CALENDAR_EVENTS,
  resources = DEFAULT_CALENDAR_RESOURCES,
  onEventClick,
  onAddEvent,
  height = '100%',
  style,
}: FullPageCalendarProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 640;

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialViewMode);
  const [eventsList, setEventsList] = useState<CalendarEventItem[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Work' | 'Meeting' | 'Design' | 'Personal'>('Work');
  const [newEventStartHour, setNewEventStartHour] = useState('10');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsList.filter((evt) => {
      const matchQuery =
        !searchQuery.trim() ||
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.description && evt.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (evt.location && evt.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat =
        selectedCategory === 'All' || evt.category === selectedCategory;

      return matchQuery && matchCat;
    });
  }, [eventsList, searchQuery, selectedCategory]);

  // Navigate Date
  const handlePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === 'day') next.setDate(next.getDate() - 1);
      else if (viewMode === 'threeDay') next.setDate(next.getDate() - 3);
      else if (viewMode === 'week') next.setDate(next.getDate() - 7);
      else if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
      else next.setDate(next.getDate() - 7);
      return next;
    });
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === 'day') next.setDate(next.getDate() + 1);
      else if (viewMode === 'threeDay') next.setDate(next.getDate() + 3);
      else if (viewMode === 'week') next.setDate(next.getDate() + 7);
      else if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
      else next.setDate(next.getDate() + 7);
      return next;
    });
  }, [viewMode]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date(2026, 8, 12));
  }, []);

  // Format header title range
  const headerDateLabel = useMemo(() => {
    const month = MONTHS_FULL[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const day = currentDate.getDate();

    if (viewMode === 'day') {
      return `${month} ${day}, ${year}`;
    }
    if (viewMode === 'threeDay') {
      const d2 = new Date(currentDate);
      d2.setDate(d2.getDate() + 2);
      return `${month} ${day} – ${d2.getDate()}, ${year}`;
    }
    if (viewMode === 'week') {
      const start = new Date(currentDate);
      const dayIdx = start.getDay();
      start.setDate(start.getDate() - dayIdx);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${MONTHS_FULL[start.getMonth()].slice(0, 3)} ${start.getDate()} – ${MONTHS_FULL[end.getMonth()].slice(0, 3)} ${end.getDate()}, ${year}`;
    }
    if (viewMode === 'month') {
      return `${month} ${year}`;
    }
    return `${month} ${year}`;
  }, [currentDate, viewMode]);

  // Create Event Handler
  const handleSaveEvent = () => {
    if (!newEventTitle.trim()) return;

    const startH = parseInt(newEventStartHour, 10) || 10;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateStr = `${currentDate.getFullYear()}-${pad(currentDate.getMonth() + 1)}-${pad(currentDate.getDate())}`;

    const colorMap: Record<string, string> = {
      Work: '#3b82f6',
      Meeting: '#10b981',
      Design: '#8b5cf6',
      Personal: '#f59e0b',
    };

    const newEvt: CalendarEventItem = {
      id: `custom-${Date.now()}`,
      title: newEventTitle.trim(),
      description: newEventDescription.trim() || 'Created event',
      category: newEventCategory,
      color: colorMap[newEventCategory] || '#3b82f6',
      start: `${dateStr}T${pad(startH)}:00:00`,
      end: `${dateStr}T${pad(Math.min(23, startH + 1))}:30:00`,
      location: newEventLocation.trim() || 'Office / Online',
      attendees: ['Mohammed Aman'],
    };

    setEventsList((prev) => [newEvt, ...prev]);
    onAddEvent?.(newEvt);
    setIsAddModalOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventLocation('');
  };

  const handleDeleteSelectedEvent = () => {
    if (!selectedEvent) return;
    setEventsList((prev) => prev.filter((e) => e.id !== selectedEvent.id));
    setSelectedEvent(null);
  };

  // Compute Days Array for Week/3-Day
  const activeDays = useMemo(() => {
    if (viewMode === 'day') {
      return [new Date(currentDate)];
    }
    if (viewMode === 'threeDay') {
      return [0, 1, 2].map((offset) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + offset);
        return d;
      });
    }
    if (viewMode === 'week') {
      const start = new Date(currentDate);
      const dayIdx = start.getDay();
      start.setDate(start.getDate() - dayIdx);
      return [0, 1, 2, 3, 4, 5, 6].map((offset) => {
        const d = new Date(start);
        d.setDate(d.getDate() + offset);
        return d;
      });
    }
    return [new Date(currentDate)];
  }, [currentDate, viewMode]);

  // Compute Month Matrix
  const monthMatrix = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month tail days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month head days to complete grid
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentDate]);

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.background }, style, { height }]}>
      {/* ── 1. Top Control Bar (Toolbar) ────────────────────────────────────────── */}
      <View
        style={[
          styles.topToolbar,
          {
            backgroundColor: isDark ? '#11131a' : '#ffffff',
            borderBottomColor: colors.border,
          },
        ]}
      >
        {/* Left: Date Title & Nav Controls */}
        <View style={styles.topLeftSection}>
          <Text style={[styles.dateTitleText, { color: colors.foreground }]}>
            {headerDateLabel}
          </Text>

          <View style={styles.navButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePrev}
              style={[
                styles.arrowBtn,
                {
                  backgroundColor: isDark ? '#1a1d27' : '#f4f4f6',
                  borderColor: colors.border,
                },
              ]}
              accessibilityLabel="Previous date"
            >
              <ChevronLeft size={16} color={colors.foreground} strokeWidth={2.2} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleToday}
              style={[
                styles.todayBtn,
                {
                  backgroundColor: isDark ? '#1a1d27' : '#f4f4f6',
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.todayBtnText, { color: colors.foreground }]}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleNext}
              style={[
                styles.arrowBtn,
                {
                  backgroundColor: isDark ? '#1a1d27' : '#f4f4f6',
                  borderColor: colors.border,
                },
              ]}
              accessibilityLabel="Next date"
            >
              <ChevronRight size={16} color={colors.foreground} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right: View Type Switcher & Add Button */}
        <View style={styles.topRightSection}>
          {/* View Modes Selector Pill */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.viewModeScroll}
          >
            {VIEW_MODES.map((mode) => {
              const isSelected = viewMode === mode.key;
              const IconComp = mode.icon;

              return (
                <TouchableOpacity
                  key={mode.key}
                  activeOpacity={0.8}
                  onPress={() => setViewMode(mode.key)}
                  style={[
                    styles.viewModeTab,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? '#2563eb'
                          : '#18181b'
                        : isDark
                        ? '#1a1d27'
                        : '#f1f5f9',
                      borderColor: isSelected
                        ? isDark
                          ? '#3b82f6'
                          : '#18181b'
                        : colors.border,
                    },
                  ]}
                >
                  <IconComp
                    size={12.5}
                    color={isSelected ? '#ffffff' : colors.mutedForeground}
                    strokeWidth={isSelected ? 2.4 : 1.8}
                  />
                  <Text
                    style={[
                      styles.viewModeTabText,
                      {
                        color: isSelected ? '#ffffff' : colors.mutedForeground,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {mode.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* New Event Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsAddModalOpen(true)}
            style={[styles.addEventBtn, { backgroundColor: '#2563eb' }]}
            accessibilityRole="button"
            accessibilityLabel="Add New Event"
          >
            <Plus size={15} color="#ffffff" strokeWidth={2.5} />
            {!isMobile && <Text style={styles.addEventBtnText}>New Event</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 2. Filter & Search Sub-bar ────────────────────────────────────────── */}
      <View
        style={[
          styles.subFilterBar,
          {
            backgroundColor: isDark ? '#141721' : '#f8fafc',
            borderBottomColor: colors.border,
          },
        ]}
      >
        {/* Search Input */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: isDark ? '#1a1d27' : '#ffffff',
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={14} color={colors.mutedForeground} strokeWidth={2} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Filter scheduled events..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
              <X size={13} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, alignItems: 'center' }}
        >
          {CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isSel
                      ? isDark
                        ? '#3b82f630'
                        : '#eff6ff'
                      : 'transparent',
                    borderColor: isSel ? '#3b82f6' : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catPillText,
                    { color: isSel ? '#3b82f6' : colors.mutedForeground },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── 3. Main Calendar Views Body ───────────────────────────────────────── */}
      <View style={styles.calendarBodyArea}>
        {/* VIEW 1: TIMELINE (Day / 3-Day / Week) */}
        {(viewMode === 'day' || viewMode === 'threeDay' || viewMode === 'week') && (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
            {/* Header row with Days */}
            <View
              style={[
                styles.timelineHeaderRow,
                {
                  backgroundColor: isDark ? '#11131a' : '#ffffff',
                  borderBottomColor: colors.border,
                },
              ]}
            >
              {/* Time Column Placeholder */}
              <View style={styles.timeGutterCol} />

              {/* Day Columns */}
              {activeDays.map((day, idx) => {
                const isToday =
                  day.getDate() === 12 &&
                  day.getMonth() === 8 &&
                  day.getFullYear() === 2026;

                return (
                  <View key={idx} style={styles.dayHeaderCol}>
                    <Text style={[styles.dayHeaderName, { color: colors.mutedForeground }]}>
                      {DAYS_SHORT[day.getDay()]}
                    </Text>
                    <View
                      style={[
                        styles.dayHeaderNumberBadge,
                        isToday && { backgroundColor: '#2563eb' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayHeaderNumberText,
                          { color: isToday ? '#ffffff' : colors.foreground },
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Time Grid Matrix */}
            <View style={styles.timelineGridContainer}>
              {/* Time labels column */}
              <View style={styles.timeLabelsColumn}>
                {HOURS.map((hour) => (
                  <View key={hour} style={styles.hourLabelRow}>
                    <Text style={[styles.hourLabelText, { color: colors.mutedForeground }]}>
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Day Columns Grid */}
              <View style={styles.columnsContainer}>
                {activeDays.map((day, dayIdx) => {
                  const dayDateStr = `2026-09-${day.getDate() < 10 ? `0${day.getDate()}` : day.getDate()}`;
                  const dayEvents = filteredEvents.filter((e) => e.start.startsWith(dayDateStr));

                  return (
                    <View
                      key={dayIdx}
                      style={[
                        styles.dayTimelineCol,
                        { borderRightColor: colors.border },
                      ]}
                    >
                      {/* Hour background lines */}
                      {HOURS.map((h) => (
                        <View
                          key={h}
                          style={[
                            styles.hourGridSlot,
                            { borderBottomColor: isDark ? '#1e222e' : '#f1f5f9' },
                          ]}
                        />
                      ))}

                      {/* Current Time Red Marker (on Today Sep 12) */}
                      {day.getDate() === 12 && (
                        <View style={[styles.nowIndicatorLine, { top: 11 * 54 + 20 }]}>
                          <View style={styles.nowDot} />
                          <View style={styles.nowBar} />
                        </View>
                      )}

                      {/* Render Day Event Blocks */}
                      {dayEvents.map((evt) => {
                        const startH = parseInt(evt.start.split('T')[1].split(':')[0], 10);
                        const startM = parseInt(evt.start.split('T')[1].split(':')[1], 10);
                        const endH = parseInt(evt.end.split('T')[1].split(':')[0], 10);
                        const endM = parseInt(evt.end.split('T')[1].split(':')[1], 10);

                        const top = startH * 54 + (startM / 60) * 54;
                        const durationHours = endH - startH + (endM - startM) / 60;
                        const height = Math.max(34, durationHours * 54);

                        return (
                          <TouchableOpacity
                            key={evt.id}
                            activeOpacity={0.88}
                            onPress={() => {
                              setSelectedEvent(evt);
                              onEventClick?.(evt);
                            }}
                            style={[
                              styles.timelineEventCard,
                              {
                                top,
                                height,
                                backgroundColor: isDark
                                  ? `${evt.color || '#3b82f6'}26`
                                  : `${evt.color || '#3b82f6'}18`,
                                borderLeftColor: evt.color || '#3b82f6',
                              },
                            ]}
                          >
                            <Text
                              style={[styles.eventCardTitle, { color: colors.foreground }]}
                              numberOfLines={1}
                            >
                              {evt.title}
                            </Text>
                            <View style={styles.eventCardTimeRow}>
                              <Clock size={10} color={colors.mutedForeground} />
                              <Text
                                style={[styles.eventCardTimeText, { color: colors.mutedForeground }]}
                                numberOfLines={1}
                              >
                                {evt.start.split('T')[1].slice(0, 5)} – {evt.end.split('T')[1].slice(0, 5)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}

        {/* VIEW 2: MONTH MATRIX VIEW */}
        {viewMode === 'month' && (
          <View style={styles.monthMatrixContainer}>
            {/* Weekday headers */}
            <View
              style={[
                styles.monthWeekdayHeaderRow,
                {
                  backgroundColor: isDark ? '#11131a' : '#f8fafc',
                  borderBottomColor: colors.border,
                },
              ]}
            >
              {DAYS_SHORT.map((name, i) => (
                <View key={i} style={styles.monthWeekdayCell}>
                  <Text style={[styles.monthWeekdayText, { color: colors.mutedForeground }]}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>

            {/* 6x7 Month Grid */}
            <View style={styles.monthGridCellsWrap}>
              {monthMatrix.map((cell, idx) => {
                const dayNum = cell.date.getDate();
                const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
                const dateKey = `2026-09-${pad(dayNum)}`;
                const cellEvents = cell.isCurrentMonth
                  ? filteredEvents.filter((e) => e.start.startsWith(dateKey))
                  : [];

                const isToday =
                  cell.isCurrentMonth &&
                  dayNum === 12 &&
                  cell.date.getMonth() === 8;

                return (
                  <View
                    key={idx}
                    style={[
                      styles.monthGridCell,
                      {
                        backgroundColor: cell.isCurrentMonth
                          ? isDark
                            ? '#0f1117'
                            : '#ffffff'
                          : isDark
                          ? '#0a0c10'
                          : '#f9fafb',
                        borderColor: isDark ? '#1e222e' : '#f1f5f9',
                      },
                    ]}
                  >
                    <View style={styles.monthCellTopRow}>
                      <View
                        style={[
                          styles.monthDateNumberCircle,
                          isToday && { backgroundColor: '#2563eb' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.monthDateNumberText,
                            {
                              color: isToday
                                ? '#ffffff'
                                : cell.isCurrentMonth
                                ? colors.foreground
                                : isDark
                                ? '#475569'
                                : '#cbd5e1',
                              fontWeight: isToday ? '700' : '500',
                            },
                          ]}
                        >
                          {dayNum}
                        </Text>
                      </View>
                    </View>

                    {/* Event indicators in month cell */}
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                      {cellEvents.slice(0, 3).map((evt) => (
                        <TouchableOpacity
                          key={evt.id}
                          activeOpacity={0.8}
                          onPress={() => setSelectedEvent(evt)}
                          style={[
                            styles.monthEventPill,
                            {
                              backgroundColor: isDark
                                ? `${evt.color || '#3b82f6'}30`
                                : `${evt.color || '#3b82f6'}20`,
                              borderLeftColor: evt.color || '#3b82f6',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.monthEventPillText,
                              { color: colors.foreground },
                            ]}
                            numberOfLines={1}
                          >
                            {evt.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      {cellEvents.length > 3 && (
                        <Text style={[styles.moreEventsText, { color: colors.mutedForeground }]}>
                          +{cellEvents.length - 3} more
                        </Text>
                      )}
                    </ScrollView>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* VIEW 3: AGENDA / SCHEDULE LIST VIEW */}
        {viewMode === 'agenda' && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.agendaScrollContainer}
            showsVerticalScrollIndicator={true}
          >
            {filteredEvents.length === 0 ? (
              <View style={styles.emptyAgendaContainer}>
                <CalendarIcon size={38} color={colors.mutedForeground} strokeWidth={1.5} />
                <Text style={[styles.emptyAgendaTitle, { color: colors.foreground }]}>
                  No events scheduled
                </Text>
                <Text style={[styles.emptyAgendaSub, { color: colors.mutedForeground }]}>
                  Try clearing your search query or add a new event using the button above.
                </Text>
              </View>
            ) : (
              filteredEvents.map((evt) => (
                <TouchableOpacity
                  key={evt.id}
                  activeOpacity={0.88}
                  onPress={() => setSelectedEvent(evt)}
                  style={[
                    styles.agendaEventCard,
                    {
                      backgroundColor: isDark ? '#131620' : '#ffffff',
                      borderColor: colors.border,
                      borderLeftColor: evt.color || '#3b82f6',
                    },
                  ]}
                >
                  <View style={styles.agendaCardHeader}>
                    <View style={styles.agendaTitleRow}>
                      <Text
                        style={[styles.agendaEventTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {evt.title}
                      </Text>
                      {evt.category && (
                        <View
                          style={[
                            styles.agendaCategoryBadge,
                            {
                              backgroundColor: `${evt.color || '#3b82f6'}20`,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.agendaCategoryText,
                              { color: evt.color || '#3b82f6' },
                            ]}
                          >
                            {evt.category}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {evt.description ? (
                    <Text
                      style={[styles.agendaEventDesc, { color: colors.mutedForeground }]}
                      numberOfLines={2}
                    >
                      {evt.description}
                    </Text>
                  ) : null}

                  <View style={styles.agendaCardFooter}>
                    <View style={styles.agendaMetaItem}>
                      <Clock size={12} color={colors.mutedForeground} />
                      <Text style={[styles.agendaMetaText, { color: colors.mutedForeground }]}>
                        {evt.start.replace('T', ' ')} – {evt.end.split('T')[1]}
                      </Text>
                    </View>

                    {evt.location && (
                      <View style={styles.agendaMetaItem}>
                        <MapPin size={12} color={colors.mutedForeground} />
                        <Text
                          style={[styles.agendaMetaText, { color: colors.mutedForeground }]}
                          numberOfLines={1}
                        >
                          {evt.location}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        {/* VIEW 4: RESOURCE / MULTI-STAFF CALENDAR VIEW */}
        {viewMode === 'resource' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
              {/* Top Resource Column Headers */}
              <View
                style={[
                  styles.resourceHeaderRow,
                  {
                    backgroundColor: isDark ? '#11131a' : '#ffffff',
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.timeGutterCol} />
                {resources.map((res) => (
                  <View key={res.id} style={styles.resourceHeaderCol}>
                    <View
                      style={[
                        styles.resourceAvatarBadge,
                        { backgroundColor: res.avatarColor },
                      ]}
                    >
                      <Text style={styles.resourceAvatarText}>
                        {res.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </Text>
                    </View>
                    <Text
                      style={[styles.resourceNameText, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {res.name}
                    </Text>
                    <Text
                      style={[styles.resourceRoleText, { color: colors.mutedForeground }]}
                      numberOfLines={1}
                    >
                      {res.role}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Resource Timeline Grid */}
              <View style={styles.timelineGridContainer}>
                {/* Time labels column */}
                <View style={styles.timeLabelsColumn}>
                  {HOURS.map((hour) => (
                    <View key={hour} style={styles.hourLabelRow}>
                      <Text style={[styles.hourLabelText, { color: colors.mutedForeground }]}>
                        {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Resource Columns */}
                <View style={styles.columnsContainer}>
                  {resources.map((res) => {
                    const resEvents = filteredEvents.filter(
                      (e) => e.resourceId === res.id || (!e.resourceId && res.id === 'res-1')
                    );

                    return (
                      <View
                        key={res.id}
                        style={[
                          styles.resourceTimelineCol,
                          { borderRightColor: colors.border },
                        ]}
                      >
                        {HOURS.map((h) => (
                          <View
                            key={h}
                            style={[
                              styles.hourGridSlot,
                              { borderBottomColor: isDark ? '#1e222e' : '#f1f5f9' },
                            ]}
                          />
                        ))}

                        {resEvents.map((evt) => {
                          const startH = parseInt(evt.start.split('T')[1].split(':')[0], 10);
                          const startM = parseInt(evt.start.split('T')[1].split(':')[1], 10);
                          const endH = parseInt(evt.end.split('T')[1].split(':')[0], 10);
                          const endM = parseInt(evt.end.split('T')[1].split(':')[1], 10);

                          const top = startH * 54 + (startM / 60) * 54;
                          const durationHours = endH - startH + (endM - startM) / 60;
                          const height = Math.max(34, durationHours * 54);

                          return (
                            <TouchableOpacity
                              key={evt.id}
                              activeOpacity={0.88}
                              onPress={() => setSelectedEvent(evt)}
                              style={[
                                styles.timelineEventCard,
                                {
                                  top,
                                  height,
                                  backgroundColor: isDark
                                    ? `${evt.color || res.avatarColor}26`
                                    : `${evt.color || res.avatarColor}18`,
                                  borderLeftColor: evt.color || res.avatarColor,
                                },
                              ]}
                            >
                              <Text
                                style={[styles.eventCardTitle, { color: colors.foreground }]}
                                numberOfLines={1}
                              >
                                {evt.title}
                              </Text>
                              <Text
                                style={[styles.eventCardTimeText, { color: colors.mutedForeground }]}
                                numberOfLines={1}
                              >
                                {evt.start.split('T')[1].slice(0, 5)} – {evt.end.split('T')[1].slice(0, 5)}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </View>

      {/* ── 4. Event Detail Modal Dialog ──────────────────────────────────────── */}
      {selectedEvent && (
        <Modal
          visible={!!selectedEvent}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={styles.modalBackdropOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setSelectedEvent(null)}
            />
            <View
              style={[
                styles.eventDetailCard,
                {
                  backgroundColor: isDark ? '#181b26' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Top Accent Gradient Bar */}
              <View style={styles.gradientAccentBar}>
                <View style={[styles.accentSegment, { backgroundColor: '#3b82f6' }]} />
                <View style={[styles.accentSegment, { backgroundColor: '#a855f7' }]} />
                <View style={[styles.accentSegment, { backgroundColor: '#ec4899' }]} />
              </View>

              <View style={styles.eventDetailBody}>
                {/* Header */}
                <View style={styles.eventDetailHeaderRow}>
                  <View style={styles.eventDetailTitleGroup}>
                    <View
                      style={[
                        styles.categoryIconSquare,
                        { backgroundColor: selectedEvent.color || '#3b82f6' },
                      ]}
                    >
                      <CalendarIcon size={14} color="#ffffff" strokeWidth={2.4} />
                    </View>
                    <Text
                      style={[styles.eventDetailTitleText, { color: colors.foreground }]}
                      numberOfLines={2}
                    >
                      {selectedEvent.title}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setSelectedEvent(null)}
                    style={styles.closeModalBtn}
                    accessibilityLabel="Close event details"
                  >
                    <X size={16} color={colors.mutedForeground} strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                {/* Event Metadata Rows */}
                <View style={styles.eventMetaRowsContainer}>
                  <View style={styles.eventMetaDetailRow}>
                    <Clock size={14} color={colors.mutedForeground} />
                    <Text style={[styles.eventMetaDetailText, { color: colors.foreground }]}>
                      {selectedEvent.start.replace('T', ' ')} – {selectedEvent.end.split('T')[1]}
                    </Text>
                  </View>

                  {selectedEvent.location && (
                    <View style={styles.eventMetaDetailRow}>
                      <MapPin size={14} color={colors.mutedForeground} />
                      <Text style={[styles.eventMetaDetailText, { color: colors.foreground }]}>
                        {selectedEvent.location}
                      </Text>
                    </View>
                  )}

                  {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                    <View style={styles.eventMetaDetailRow}>
                      <Users size={14} color={colors.mutedForeground} />
                      <Text style={[styles.eventMetaDetailText, { color: colors.foreground }]}>
                        {selectedEvent.attendees.join(', ')}
                      </Text>
                    </View>
                  )}
                </View>

                {selectedEvent.description ? (
                  <View
                    style={[
                      styles.eventDescBox,
                      {
                        backgroundColor: isDark ? '#11131a' : '#f8fafc',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.eventDescText, { color: colors.mutedForeground }]}>
                      {selectedEvent.description}
                    </Text>
                  </View>
                ) : null}

                {/* Actions Bottom Bar */}
                <View style={styles.eventDetailActionsRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleDeleteSelectedEvent}
                    style={[
                      styles.deleteEventBtn,
                      {
                        backgroundColor: isDark ? '#3f1a1a' : '#fef2f2',
                        borderColor: isDark ? '#7f1d1d' : '#fecaca',
                      },
                    ]}
                  >
                    <Trash2 size={14} color="#ef4444" strokeWidth={2} />
                    <Text style={{ color: '#ef4444', fontSize: 12.5, fontWeight: '600' }}>
                      Delete
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setSelectedEvent(null)}
                    style={[styles.confirmDoneBtn, { backgroundColor: '#2563eb' }]}
                  >
                    <Check size={14} color="#ffffff" strokeWidth={2.4} />
                    <Text style={{ color: '#ffffff', fontSize: 12.5, fontWeight: '700' }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ── 5. Add New Event Modal Dialog ─────────────────────────────────────── */}
      {isAddModalOpen && (
        <Modal
          visible={isAddModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsAddModalOpen(false)}
        >
          <View style={styles.modalBackdropOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setIsAddModalOpen(false)}
            />
            <View
              style={[
                styles.addModalCard,
                {
                  backgroundColor: isDark ? '#181b26' : '#ffffff',
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Header */}
              <View
                style={[
                  styles.addModalHeader,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      backgroundColor: '#2563eb',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={16} color="#ffffff" strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.addModalTitle, { color: colors.foreground }]}>
                    New Calendar Event
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setIsAddModalOpen(false)}
                  style={styles.closeModalBtn}
                >
                  <X size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>

              {/* Form Body */}
              <ScrollView style={styles.addModalFormBody} showsVerticalScrollIndicator={false}>
                {/* Event Title */}
                <Text style={[styles.formLabel, { color: colors.foreground }]}>Title</Text>
                <TextInput
                  value={newEventTitle}
                  onChangeText={setNewEventTitle}
                  placeholder="e.g. Design System Review"
                  placeholderTextColor={colors.mutedForeground}
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#11131a' : '#f8fafc',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />

                {/* Category Selector */}
                <Text style={[styles.formLabel, { color: colors.foreground, marginTop: 12 }]}>
                  Category
                </Text>
                <View style={styles.formCategoryRow}>
                  {(['Work', 'Meeting', 'Design', 'Personal'] as const).map((cat) => {
                    const isSel = newEventCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        activeOpacity={0.8}
                        onPress={() => setNewEventCategory(cat)}
                        style={[
                          styles.formCatBtn,
                          {
                            backgroundColor: isSel
                              ? '#2563eb'
                              : isDark
                              ? '#11131a'
                              : '#f1f5f9',
                            borderColor: isSel ? '#2563eb' : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.formCatBtnText,
                            { color: isSel ? '#ffffff' : colors.foreground },
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Start Hour */}
                <Text style={[styles.formLabel, { color: colors.foreground, marginTop: 12 }]}>
                  Start Time (Hour 0-23)
                </Text>
                <TextInput
                  value={newEventStartHour}
                  onChangeText={setNewEventStartHour}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={colors.mutedForeground}
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#11131a' : '#f8fafc',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />

                {/* Location */}
                <Text style={[styles.formLabel, { color: colors.foreground, marginTop: 12 }]}>
                  Location
                </Text>
                <TextInput
                  value={newEventLocation}
                  onChangeText={setNewEventLocation}
                  placeholder="e.g. Lab 4 or Zoom link"
                  placeholderTextColor={colors.mutedForeground}
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? '#11131a' : '#f8fafc',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />

                {/* Description */}
                <Text style={[styles.formLabel, { color: colors.foreground, marginTop: 12 }]}>
                  Notes / Agenda
                </Text>
                <TextInput
                  value={newEventDescription}
                  onChangeText={setNewEventDescription}
                  multiline
                  numberOfLines={3}
                  placeholder="Additional event details..."
                  placeholderTextColor={colors.mutedForeground}
                  style={[
                    styles.formInput,
                    styles.formTextArea,
                    {
                      backgroundColor: isDark ? '#11131a' : '#f8fafc',
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />
              </ScrollView>

              {/* Bottom Actions */}
              <View
                style={[
                  styles.addModalFooter,
                  { borderTopColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsAddModalOpen(false)}
                  style={[
                    styles.cancelBtn,
                    {
                      backgroundColor: isDark ? '#1a1d27' : '#f1f5f9',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: colors.mutedForeground, fontSize: 13, fontWeight: '600' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSaveEvent}
                  style={[styles.saveEventBtn, { backgroundColor: '#2563eb' }]}
                >
                  <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }}>
                    Save Event
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  topToolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    zIndex: 10,
  },
  topLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  dateTitleText: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.3,
  },
  navButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  arrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBtn: {
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBtnText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  topRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  viewModeScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewModeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewModeTabText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  addEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
      } as any,
    }),
  },
  addEventBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  subFilterBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 9,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    width: 200,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Open Sans',
    paddingVertical: 0,
  },
  catPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  calendarBodyArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  // Timeline styles (Day, 3-Day, Week)
  timelineHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    position: 'relative',
    zIndex: 5,
  },
  timeGutterCol: {
    width: 60,
  },
  dayHeaderCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayHeaderName: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Open Sans',
    marginBottom: 3,
  },
  dayHeaderNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayHeaderNumberText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  timelineGridContainer: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
  timeLabelsColumn: {
    width: 60,
  },
  hourLabelRow: {
    height: 54,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingTop: 4,
  },
  hourLabelText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
  },
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  dayTimelineCol: {
    flex: 1,
    position: 'relative',
    borderRightWidth: StyleSheet.hairlineWidth,
    minHeight: 24 * 54,
  },
  hourGridSlot: {
    height: 54,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nowIndicatorLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginLeft: -4,
  },
  nowBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#ef4444',
  },
  timelineEventCard: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 6,
    borderLeftWidth: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    zIndex: 10,
    overflow: 'hidden',
  },
  eventCardTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  eventCardTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  eventCardTimeText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  // Month Grid styles
  monthMatrixContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  monthWeekdayHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  monthWeekdayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthWeekdayText: {
    fontSize: 11.5,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Open Sans',
  },
  monthGridCellsWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthGridCell: {
    width: '14.285%',
    height: '16.666%',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
  },
  monthCellTopRow: {
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  monthDateNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthDateNumberText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  monthEventPill: {
    borderRadius: 4,
    borderLeftWidth: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 2,
  },
  monthEventPillText: {
    fontSize: 9.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  moreEventsText: {
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    paddingLeft: 2,
  },
  // Agenda styles
  agendaScrollContainer: {
    padding: 16,
    gap: 10,
  },
  agendaEventCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      } as any,
    }),
  },
  agendaCardHeader: {
    marginBottom: 4,
  },
  agendaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  agendaEventTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    flex: 1,
  },
  agendaCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  agendaCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  agendaEventDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: 'Open Sans',
    marginBottom: 8,
  },
  agendaCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
  },
  agendaMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  agendaMetaText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  emptyAgendaContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyAgendaTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  emptyAgendaSub: {
    fontSize: 13,
    fontFamily: 'Open Sans',
    textAlign: 'center',
    maxWidth: 320,
  },
  // Resource Calendar styles
  resourceHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  resourceHeaderCol: {
    width: 170,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  resourceAvatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  resourceAvatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  resourceNameText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  resourceRoleText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  resourceTimelineCol: {
    width: 170,
    position: 'relative',
    borderRightWidth: StyleSheet.hairlineWidth,
    minHeight: 24 * 54,
  },
  // Modals
  modalBackdropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      } as any,
    }),
  },
  eventDetailCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
      } as any,
    }),
  },
  gradientAccentBar: {
    width: '100%',
    height: 4,
    flexDirection: 'row',
  },
  accentSegment: {
    flex: 1,
    height: '100%',
  },
  eventDetailBody: {
    padding: 18,
  },
  eventDetailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  eventDetailTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  categoryIconSquare: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDetailTitleText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    flex: 1,
  },
  closeModalBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventMetaRowsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  eventMetaDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventMetaDetailText: {
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  eventDescBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  eventDescText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: 'Open Sans',
  },
  eventDetailActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteEventBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  confirmDoneBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
  },
  // Add Event Form
  addModalCard: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '90%',
    borderRadius: 16,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
      } as any,
    }),
  },
  addModalHeader: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addModalTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  addModalFormBody: {
    padding: 18,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  formTextArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  formCategoryRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  formCatBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  formCatBtnText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  addModalFooter: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveEventBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
