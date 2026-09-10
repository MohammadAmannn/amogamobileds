import React, { useState, useRef, useEffect } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Camera,
  X,
  Trash2,
  Image as ImageIcon,
  Video,
  FileText,
  MapPin,
  FileImage,
  RefreshCw,
  Scan,
  ScanLine,
  FileCode2,
} from 'lucide-react-native'
import { useTheme } from '../../providers/theme-provider'
import { AudioWaveform } from '../ui/audio-waveform'
import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio'

export type AttachmentOptionType =
  | 'images'
  | 'videos'
  | 'documents'
  | 'location'
  | 'image-converter'
  | 'doc-converter'
  | 'doc-scanner'
  | 'scan-document'
  | 'extract-text'

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  maxLength?: number
  replyMessage?: {
    senderName?: string
    content?: string
    onClear?: () => void
  }
  showAttachments?: boolean
  showEmoji?: boolean
  showCamera?: boolean
  showVoice?: boolean
  onAttachmentClick?: () => void
  onSelectAttachmentType?: (type: AttachmentOptionType) => void
  onEmojiClick?: () => void
  onCameraClick?: () => void
  onVoiceClick?: () => void
  onTyping?: (isTyping: boolean) => void
  onVoiceRecordComplete?: (uri: string, durationSec: number) => void
  customActions?: React.ReactNode
  style?: any
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Message',
  disabled = false,
  isLoading = false,
  maxLength,
  replyMessage,
  showAttachments = true,
  showEmoji = true,
  showCamera = true,
  showVoice = true,
  onAttachmentClick,
  onSelectAttachmentType,
  onEmojiClick,
  onCameraClick,
  onVoiceClick,
  onTyping,
  onVoiceRecordComplete,
  customActions,
  style,
}: ChatInputProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordDuration, setRecordDuration] = useState(0)
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<TextInput>(null)

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const hasText = value.trim().length > 0

  useEffect(() => {
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current)
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [])

  const handleStartVoice = async () => {
    if (onVoiceClick) onVoiceClick()
    try {
      if (Platform.OS !== 'web') {
        const status = await AudioModule.requestRecordingPermissionsAsync()
        if (!status.granted) {
          console.warn('Microphone permission not granted')
          return
        }
      }
      await recorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY)
      await recorder.record()
      setIsRecording(true)
      setRecordDuration(0)
      durationTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.warn('Voice record start failed:', err)
      setIsRecording(false)
    }
  }

  const handleCancelVoice = async () => {
    if (durationTimerRef.current) clearInterval(durationTimerRef.current)
    try {
      await recorder.stop()
    } catch (e) {}
    setIsRecording(false)
    setRecordDuration(0)
  }

  const handleSendVoice = async () => {
    if (durationTimerRef.current) clearInterval(durationTimerRef.current)
    const dur = recordDuration
    setIsRecording(false)
    setRecordDuration(0)
    try {
      await recorder.stop()
      const uri = recorder.uri
      console.log('[voice] Recorded audio URI:', uri, 'duration:', dur)
      if (uri) {
        onVoiceRecordComplete?.(uri, dur)
      } else {
        console.warn('[voice] No URI returned from recorder.stop()')
      }
    } catch (e) {
      console.warn('Voice record stop failed:', e)
    }
  }

  const handleTextChange = (text: string) => {
    onChange(text)
    if (onTyping) {
      onTyping(true)
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      typingTimerRef.current = setTimeout(() => {
        onTyping(false)
      }, 2000)
    }
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (type: AttachmentOptionType) => {
    setIsAttachMenuOpen(false)
    onSelectAttachmentType?.(type)
    if (type === 'images' || type === 'documents') {
      onAttachmentClick?.()
    }
  }

  const attachmentOptions: Array<{
    type: AttachmentOptionType
    label: string
    icon: any
  }> = [
    { type: 'images', label: 'Images', icon: ImageIcon },
    { type: 'videos', label: 'Videos', icon: Video },
    { type: 'documents', label: 'Documents', icon: FileText },
    { type: 'location', label: 'Location', icon: MapPin },
    { type: 'image-converter', label: 'Image Converter', icon: FileImage },
    { type: 'doc-converter', label: 'Doc Converter', icon: RefreshCw },
    { type: 'doc-scanner', label: 'Doc Scanner', icon: Scan },
    { type: 'scan-document', label: 'Scan Document', icon: ScanLine },
    { type: 'extract-text', label: 'Extract Text', icon: FileCode2 },
  ]

  return (
    <View style={[styles.container, style]}>
      {/* Replying Banner */}
      {replyMessage ? (
        <View
          style={[
            styles.replyBanner,
            {
              backgroundColor: isDark ? colors.card : '#f1f5f9',
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.replyContent}>
            <Text
              style={[
                styles.replyTitle,
                { color: isDark ? '#a5b4fc' : '#4f46e5' },
              ]}
            >
              Replying to {replyMessage.senderName || 'Message'}:
            </Text>
            <Text
              style={[styles.replyText, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {replyMessage.content}
            </Text>
          </View>
          {replyMessage.onClear ? (
            <Pressable
              onPress={replyMessage.onClear}
              hitSlop={8}
              style={styles.replyClearBtn}
            >
              <X size={14} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {/* Main Row */}
      {isRecording ? (
        <View style={styles.mainRow}>
          <View
            style={[
              styles.recordingBar,
              {
                backgroundColor: isDark ? colors.card : colors.background,
                borderColor: '#ef4444',
              },
            ]}
          >
            <View style={styles.recordingLeft}>
              <View style={styles.redDot} />
              <Text style={[styles.timerText, { color: colors.foreground }]}>
                {formatDuration(recordDuration)}
              </Text>
            </View>

            <View style={styles.waveformWrap}>
              <AudioWaveform
                animated
                isPlaying={true}
                height={22}
                barCount={20}
                activeColor="#ef4444"
                inactiveColor={isDark ? '#3f3f46' : '#e4e4e7'}
              />
            </View>

            <Pressable
              onPress={handleCancelVoice}
              hitSlop={6}
              style={styles.cancelBtn}
              accessibilityLabel="Cancel recording"
            >
              <Trash2 size={18} color="#ef4444" />
            </Pressable>
          </View>

          <Pressable
            onPress={handleSendVoice}
            style={({ pressed }) => [
              styles.actionCircle,
              { backgroundColor: '#059669' },
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Send recording"
          >
            <Send size={16} color="#ffffff" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.mainRow}>
          {/* Rounded Pill Input Bar */}
          <View
            style={[
              styles.inputPill,
              {
                backgroundColor: isDark ? colors.card : colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Emoji Button */}
            {showEmoji ? (
              <Pressable
                onPress={onEmojiClick}
                hitSlop={6}
                style={styles.iconBtn}
                accessibilityLabel="Emoji"
              >
                <Smile size={18} color={colors.mutedForeground} />
              </Pressable>
            ) : null}

            {/* Text Input */}
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={handleTextChange}
              placeholder={placeholder}
              placeholderTextColor={colors.mutedForeground}
              editable={!disabled}
              maxLength={maxLength}
              multiline
              style={[
                styles.textInput,
                { color: colors.foreground },
              ]}
            />

            {/* Paperclip Button */}
            {showAttachments ? (
              <Pressable
                onPress={() => setIsAttachMenuOpen(true)}
                hitSlop={6}
                style={styles.iconBtn}
                accessibilityLabel="Attach files"
              >
                <Paperclip size={18} color={colors.mutedForeground} />
              </Pressable>
            ) : null}

            {/* Camera Button */}
            {showCamera ? (
              <Pressable
                onPress={onCameraClick}
                hitSlop={6}
                style={styles.iconBtn}
                accessibilityLabel="Camera"
              >
                <Camera size={18} color={colors.mutedForeground} />
              </Pressable>
            ) : null}

            {customActions}
          </View>

          {/* Circular Action Button on Right (Send / Mic) */}
          {hasText ? (
            <Pressable
              onPress={() => {
                onSend();
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 50);
              }}
              disabled={disabled || isLoading}
              style={({ pressed }) => [
                styles.actionCircle,
                { backgroundColor: colors.primary },
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Send size={16} color="#ffffff" />
            </Pressable>
          ) : showVoice ? (
            <Pressable
              onPress={handleStartVoice}
              disabled={disabled || isLoading}
              style={({ pressed }) => [
                styles.actionCircle,
                { backgroundColor: colors.primary },
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Voice message"
            >
              <Mic size={18} color="#ffffff" />
            </Pressable>
          ) : (
            <View
              style={[
                styles.actionCircle,
                { backgroundColor: colors.primary, opacity: 0.5 },
              ]}
            >
              <Send size={16} color="#ffffff" />
            </View>
          )}
        </View>
      )}

      {/* Attachment Options Modal / Dropdown Menu */}
      <Modal
        visible={isAttachMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAttachMenuOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsAttachMenuOpen(false)}
        >
          <View
            style={[
              styles.attachMenuCard,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            {attachmentOptions.map((opt) => {
              const Icon = opt.icon
              return (
                <Pressable
                  key={opt.type}
                  onPress={() => handleSelectOption(opt.type)}
                  style={({ pressed }) => [
                    styles.attachMenuItem,
                    pressed && {
                      backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                    },
                  ]}
                >
                  <Icon
                    size={16}
                    color={colors.mutedForeground}
                    strokeWidth={2}
                  />
                  <Text
                    style={[
                      styles.attachMenuText,
                      { color: colors.foreground },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    gap: 4,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 2,
  },
  replyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  replyTitle: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  replyText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    flex: 1,
  },
  replyClearBtn: {
    padding: 4,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  inputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    paddingHorizontal: 8,
    paddingVertical: 8,
    maxHeight: 100,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        borderWidth: 0,
        borderStyle: 'none',
        boxShadow: 'none',
      } as any,
    }),
  },
  actionCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingBottom: 68,
  },
  attachMenuCard: {
    width: 210,
    borderRadius: 14,
    borderWidth: 1,
    padding: 6,
    gap: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      default: {},
    }),
  },
  attachMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  attachMenuText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  recordingBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 44,
    gap: 8,
  },
  recordingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  waveformWrap: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cancelBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
