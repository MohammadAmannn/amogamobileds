import React, { useState } from 'react'
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
  Wand2,
  Calendar as CalendarIcon,
  Clock,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Sliders,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import type { GalleryEntry } from '../../types'

const ROLES = [
  'Product Manager',
  'Engineering Lead',
  'UI/UX Designer',
  'Founder / CEO',
  'Growth Marketer',
]

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM',
]

const FEATURE_OPTIONS = [
  {
    id: 'ai',
    label: 'AI Assistance & Summarization',
    desc: 'Automatic email drafting & chat summaries',
  },
  {
    id: 'analytics',
    label: 'Advanced Analytics',
    desc: 'Real-time response rate and task completion metrics',
  },
  {
    id: 'automation',
    label: 'Workflow Automations',
    desc: 'Custom triggers and automated notifications',
  },
  {
    id: 'custom',
    label: 'Custom Integrations',
    desc: 'Connect with existing CRM and calendar tools',
  },
]

export function QuestionnaireWizardPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [step, setStep] = useState(1)
  const [name, setName] = useState('Alex Morgan')
  const [selectedRole, setSelectedRole] = useState('Product Manager')
  const [selectedDateDay, setSelectedDateDay] = useState(21)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    '11:00 AM - 12:00 PM'
  )
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'ai',
    'analytics',
  ])
  const [completed, setCompleted] = useState(false)

  const totalSteps = 3
  const progressPercent = completed
    ? 100
    : Math.round(((step - 1) / totalSteps) * 100)

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => s + 1)
    } else {
      setCompleted(true)
    }
  }

  const handleBack = () => {
    if (completed) {
      setCompleted(false)
      setStep(3)
    } else if (step > 1) {
      setStep((s) => s - 1)
    }
  }

  const handleReset = () => {
    setStep(1)
    setName('')
    setSelectedRole('')
    setSelectedFeatures([])
    setCompleted(false)
  }

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.wizardCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Wizard Header */}
        <View style={styles.wizardHeader}>
          <View style={styles.headerTitleRow}>
            <View style={styles.titleWithIcon}>
              <View
                style={[
                  styles.sparkleIconBox,
                  {
                    backgroundColor: isDark
                      ? 'rgba(139, 92, 246, 0.15)'
                      : '#f3e8ff',
                  },
                ]}
              >
                <Wand2 size={18} color='#8b5cf6' />
              </View>
              <View>
                <Text style={[styles.wizardMainTitle, { color: colors.foreground }]}>
                  Workspace Onboarding
                </Text>
                <Text style={[styles.wizardSubtitle, { color: colors.mutedForeground }]}>
                  Configure your team profile in 3 simple steps.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.stepPill,
                {
                  backgroundColor: isDark
                    ? 'rgba(139, 92, 246, 0.15)'
                    : '#f3e8ff',
                  borderColor: isDark
                    ? 'rgba(139, 92, 246, 0.3)'
                    : '#e9d5ff',
                },
              ]}
            >
              <Text style={styles.stepPillText}>
                {completed ? 'Complete' : `Step ${step} of ${totalSteps}`}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: isDark ? '#27272a' : '#f4f4f5' },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: '#8b5cf6',
                },
              ]}
            />
          </View>
        </View>

        {/* Wizard Content Body */}
        <View style={styles.wizardBody}>
          {/* STEP 1: PERSONAL & ROLE */}
          {!completed && step === 1 && (
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                  1. Personal & Role Details
                </Text>
                <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
                  Tell us what role you will be leading in this organization.
                </Text>
              </View>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Full Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder='e.g. Alex Morgan'
                  placeholderTextColor={colors.mutedForeground}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />
              </View>

              {/* Role Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Select Your Primary Role
                </Text>
                <View style={styles.roleGrid}>
                  {ROLES.map((r) => {
                    const isSelected = selectedRole === r
                    return (
                      <Pressable
                        key={r}
                        onPress={() => setSelectedRole(r)}
                        style={[
                          styles.roleChip,
                          isSelected
                            ? {
                                backgroundColor: isDark
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : '#f3e8ff',
                                borderColor: '#8b5cf6',
                              }
                            : {
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                              },
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleChipText,
                            {
                              color: isSelected ? '#8b5cf6' : colors.foreground,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {r}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: SCHEDULE ONBOARDING SESSION */}
          {!completed && step === 2 && (
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                  2. Schedule Sync Session
                </Text>
                <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
                  Pick a 1-on-1 walkthrough date and time with your team.
                </Text>
              </View>

              {/* Date Day Selector */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Select Date (August 2026)
                </Text>
                <View style={styles.daysRow}>
                  {[18, 19, 20, 21, 22, 23, 24].map((d) => {
                    const isSelected = selectedDateDay === d
                    return (
                      <Pressable
                        key={d}
                        onPress={() => setSelectedDateDay(d)}
                        style={[
                          styles.dayButton,
                          isSelected
                            ? {
                                backgroundColor: '#8b5cf6',
                                borderColor: '#8b5cf6',
                              }
                            : {
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                              },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
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
                </View>
              </View>

              {/* Time slot pills */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  Select Time Slot
                </Text>
                <View style={styles.timeSlotsGrid}>
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot
                    return (
                      <Pressable
                        key={slot}
                        onPress={() => setSelectedTimeSlot(slot)}
                        style={[
                          styles.timeSlotCard,
                          isSelected
                            ? {
                                backgroundColor: isDark
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : '#f3e8ff',
                                borderColor: '#8b5cf6',
                              }
                            : {
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                              },
                        ]}
                      >
                        <Clock
                          size={13}
                          color={isSelected ? '#8b5cf6' : colors.mutedForeground}
                        />
                        <Text
                          style={[
                            styles.timeSlotText,
                            {
                              color: isSelected ? '#8b5cf6' : colors.foreground,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {slot}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: FEATURE SELECTION */}
          {!completed && step === 3 && (
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                  3. Key Workspace Features
                </Text>
                <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
                  Choose which capabilities to enable in your workspace.
                </Text>
              </View>

              <View style={styles.featureList}>
                {FEATURE_OPTIONS.map((f) => {
                  const isChecked = selectedFeatures.includes(f.id)
                  return (
                    <Pressable
                      key={f.id}
                      onPress={() => toggleFeature(f.id)}
                      style={[
                        styles.featureCard,
                        isChecked
                          ? {
                              backgroundColor: isDark
                                ? 'rgba(139, 92, 246, 0.15)'
                                : '#f5f3ff',
                              borderColor: '#8b5cf6',
                            }
                          : {
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                            },
                      ]}
                    >
                      <View
                        style={[
                          styles.checkboxBox,
                          isChecked
                            ? { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }
                            : { borderColor: colors.border, backgroundColor: colors.card },
                        ]}
                      >
                        {isChecked && (
                          <Check size={11} color='#ffffff' strokeWidth={3} />
                        )}
                      </View>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text
                          style={[
                            styles.featureCardTitle,
                            { color: colors.foreground },
                          ]}
                        >
                          {f.label}
                        </Text>
                        <Text
                          style={[
                            styles.featureCardDesc,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {f.desc}
                        </Text>
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          )}

          {/* STEP 4: COMPLETED SUMMARY */}
          {completed && (
            <View style={styles.completedContent}>
              <View style={styles.completedSuccessIconBox}>
                <CheckCircle2 size={48} color='#10b981' />
              </View>

              <Text style={[styles.completedTitle, { color: colors.foreground }]}>
                Setup Completed!
              </Text>
              <Text
                style={[
                  styles.completedSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                Your workspace is ready. Here is a summary of your profile:
              </Text>

              <View
                style={[
                  styles.summaryInfoBox,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Name:
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    {name || 'Not provided'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Role:
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    {selectedRole || 'None'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Sync Date:
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    Aug {selectedDateDay}, 2026 ({selectedTimeSlot})
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Features:
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    {selectedFeatures.length} active
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleReset}
                style={[
                  styles.resetBtn,
                  {
                    backgroundColor: isDark ? colors.card : colors.secondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <RotateCcw size={14} color={colors.foreground} />
                <Text style={[styles.resetBtnText, { color: colors.foreground }]}>
                  Start Over
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Wizard Footer Navigation */}
        {!completed && (
          <View
            style={[
              styles.wizardFooter,
              { borderTopColor: colors.border },
            ]}
          >
            <Pressable
              onPress={handleBack}
              disabled={step === 1}
              style={[
                styles.footerBackBtn,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: step === 1 ? 0.4 : 1,
                },
              ]}
            >
              <ChevronLeft size={14} color={colors.foreground} />
              <Text style={[styles.footerBtnText, { color: colors.foreground }]}>
                Back
              </Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={[styles.footerNextBtn, { backgroundColor: '#8b5cf6' }]}
            >
              <Text style={styles.footerNextBtnText}>
                {step === 3 ? 'Complete Setup' : 'Continue'}
              </Text>
              <ChevronRight size={14} color='#ffffff' />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  )
}

export function WizardPreviews({ entry }: { entry?: GalleryEntry }) {
  const { colors } = useTheme()

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <QuestionnaireWizardPreview />
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
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    padding: 4,
  },
  wizardCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  wizardHeader: {
    padding: 20,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sparkleIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wizardMainTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  wizardSubtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  stepPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  stepPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8b5cf6',
    fontFamily: 'Open Sans',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  wizardBody: {
    padding: 20,
  },
  stepContent: {
    gap: 16,
  },
  stepHeader: {
    gap: 4,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  stepSubtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  textInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    fontFamily: 'Open Sans',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleChipText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayButton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  timeSlotsGrid: {
    gap: 8,
  },
  timeSlotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeSlotText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  featureList: {
    gap: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  featureCardDesc: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  completedContent: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  completedSuccessIconBox: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Open Sans',
  },
  completedSubtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  summaryInfoBox: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  wizardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  footerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  footerBtnText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  footerNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  footerNextBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
})
