import React, { useState } from 'react'
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
import { useTheme } from '@/providers/theme-provider'

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
  customActions,
  style,
}: ChatInputProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false)
  const hasText = value.trim().length > 0

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
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedForeground}
            editable={!disabled && !isLoading}
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
            onPress={onSend}
            disabled={disabled || isLoading}
            style={({ pressed }) => [
              styles.actionCircle,
              { backgroundColor: '#059669' },
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Send size={16} color="#ffffff" />
          </Pressable>
        ) : showVoice ? (
          <Pressable
            onPress={onVoiceClick}
            disabled={disabled || isLoading}
            style={({ pressed }) => [
              styles.actionCircle,
              { backgroundColor: '#059669' },
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
              { backgroundColor: 'rgba(5, 150, 105, 0.4)' },
            ]}
          >
            <Send size={16} color="#ffffff" />
          </View>
        )}
      </View>

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
    paddingHorizontal: 6,
    paddingVertical: 6,
    maxHeight: 100,
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  attachMenuCard: {
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    padding: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  attachMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  attachMenuText: {
    fontSize: 13,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
})
