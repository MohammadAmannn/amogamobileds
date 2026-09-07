import React, { useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  Users,
  Search,
  Plus,
  MessageSquare,
  Pencil,
  Trash2,
  X,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

export interface ContactItem {
  id: string
  name: string
  email: string
  avatarUrl?: string
  initials?: string
  isEnabled?: boolean
  mobile?: string
  contactUserId?: string
}

export interface ContactManagerProps {
  contacts?: ContactItem[]
  title?: string
  description?: string
  searchPlaceholder?: string
  onChatClick?: (contact: ContactItem) => void
  onToggleStatus?: (contact: ContactItem, enabled: boolean) => void
  onEditClick?: (contact: ContactItem) => void
  onDeleteClick?: (contact: ContactItem) => void
  onAddContact?: (newContact: { name: string; email: string }) => void
  style?: any
}

function BlackToggle({
  value,
  onValueChange,
}: {
  value: boolean
  onValueChange: (val: boolean) => void
}) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[
        styles.toggleTrack,
        { backgroundColor: value ? '#000000' : '#cbd5e1' },
      ]}
    >
      <View
        style={[
          styles.toggleThumb,
          { transform: [{ translateX: value ? 15 : 0 }] },
        ]}
      />
    </Pressable>
  )
}

export function ContactManager({
  contacts = [],
  title = 'Contact Manager',
  description = 'Manage your saved contacts and start direct chat conversations.',
  searchPlaceholder = 'Search contacts by name or email...',
  onChatClick,
  onToggleStatus,
  onEditClick,
  onDeleteClick,
  onAddContact,
  style,
}: ContactManagerProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddSubmit = () => {
    if (!newEmail.trim()) return
    onAddContact?.({
      name: newName.trim() || newEmail.split('@')[0],
      email: newEmail.trim(),
    })
    setNewName('')
    setNewEmail('')
    setIsAddOpen(false)
  }

  const getInitials = (contact: ContactItem) => {
    if (contact.initials) return contact.initials
    return (
      contact.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U'
    )
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : '#ffffff',
          borderColor: isDark ? colors.border : '#f1f5f9',
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Users size={18} color={isDark ? '#818cf8' : '#4f46e5'} strokeWidth={1.8} />
          <Text style={[styles.title, { color: colors.foreground }]}>
            {title}
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {description}
        </Text>
      </View>

      {/* Search Input */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            borderColor: isDark ? colors.border : '#e2e8f0',
          },
        ]}
      >
        <Search size={15} color={colors.mutedForeground} strokeWidth={1.8} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
        />
      </View>

      {/* Contact Cards List */}
      <View style={styles.contactsContent}>
        {filteredContacts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              No contacts found matching your search.
            </Text>
          </View>
        ) : (
          filteredContacts.map((contact) => (
            <View
              key={contact.id}
              style={[
                styles.contactCard,
                {
                  backgroundColor: isDark ? '#18181b' : '#ffffff',
                  borderColor: isDark ? colors.border : '#e2e8f0',
                },
              ]}
            >
              {/* Left Details */}
              <View style={styles.contactLeft}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: isDark
                        ? 'rgba(59, 130, 246, 0.2)'
                        : '#dbeafe',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      { color: isDark ? '#60a5fa' : '#2563eb' },
                    ]}
                  >
                    {getInitials(contact)}
                  </Text>
                </View>

                <View style={styles.contactDetails}>
                  <Text
                    style={[styles.contactName, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {contact.name}
                  </Text>
                  <Text
                    style={[
                      styles.contactEmail,
                      { color: colors.mutedForeground },
                    ]}
                    numberOfLines={1}
                  >
                    {contact.email}
                  </Text>
                </View>
              </View>

              {/* Right Actions */}
              <View style={styles.contactActions}>
                {/* Chat Action */}
                <Pressable
                  onPress={() => onChatClick?.(contact)}
                  hitSlop={8}
                  style={styles.actionBtn}
                >
                  <MessageSquare size={16} color={isDark ? '#a5b4fc' : '#6366f1'} strokeWidth={1.8} />
                </Pressable>

                {/* Switch for status - Solid Black Toggle */}
                <BlackToggle
                  value={contact.isEnabled !== false}
                  onValueChange={(val) => onToggleStatus?.(contact, val)}
                />

                {/* Edit */}
                <Pressable
                  onPress={() => onEditClick?.(contact)}
                  hitSlop={8}
                  style={styles.actionBtn}
                >
                  <Pencil size={15} color="#3b82f6" strokeWidth={1.8} />
                </Pressable>

                {/* Delete */}
                <Pressable
                  onPress={() => onDeleteClick?.(contact)}
                  hitSlop={8}
                  style={styles.actionBtn}
                >
                  <Trash2 size={15} color="#ef4444" strokeWidth={1.8} />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Bottom Thin Add New Contact Button */}
      <Pressable
        onPress={() => setIsAddOpen(true)}
        style={({ pressed }) => [
          styles.bottomAddBtn,
          { backgroundColor: isDark ? '#4338ca' : '#4f46e5' },
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
      >
        <Plus size={13} color="#ffffff" strokeWidth={2} />
        <Text style={styles.bottomAddBtnText}>Add New Contact</Text>
      </Pressable>

      {/* Add Contact Modal */}
      <Modal
        visible={isAddOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsAddOpen(false)}
        >
          <View
            style={[
              styles.dialogCard,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.dialogHeader}>
              <Text
                style={[styles.dialogTitle, { color: colors.foreground }]}
              >
                Add New Contact
              </Text>
              <Pressable onPress={() => setIsAddOpen(false)} hitSlop={8}>
                <X size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <View style={styles.dialogBody}>
              <Text
                style={[styles.inputLabel, { color: colors.mutedForeground }]}
              >
                Name (Optional)
              </Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="e.g. Aman"
                placeholderTextColor={colors.mutedForeground}
                style={[
                  styles.dialogInput,
                  {
                    backgroundColor: isDark ? '#27272a' : '#f8fafc',
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
              />

              <Text
                style={[styles.inputLabel, { color: colors.mutedForeground }]}
              >
                Email Address *
              </Text>
              <TextInput
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="e.g. aman@example.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.dialogInput,
                  {
                    backgroundColor: isDark ? '#27272a' : '#f8fafc',
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
              />
            </View>

            <View style={styles.dialogFooter}>
              <Pressable
                onPress={() => setIsAddOpen(false)}
                style={[
                  styles.cancelBtn,
                  { borderColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.cancelBtnText,
                    { color: colors.foreground },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleAddSubmit}
                style={[
                  styles.confirmBtn,
                  { backgroundColor: isDark ? '#4338ca' : '#4f46e5' },
                ]}
              >
                <Text style={styles.confirmBtnText}>Save Contact</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    marginTop: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    padding: 0,
  },
  contactsContent: {
    gap: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
  },
  contactDetails: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  contactName: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  contactEmail: {
    fontSize: 11.5,
    fontWeight: '400',
    fontFamily: 'Open Sans',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    padding: 3,
  },
  toggleTrack: {
    width: 34,
    height: 19,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 2,
    cursor: 'pointer',
  },
  toggleThumb: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  bottomAddBtn: {
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  bottomAddBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
  },
  emptyBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: 340,
    maxWidth: '92%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogTitle: {
    fontSize: 13.5,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  dialogBody: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '400',
    fontFamily: 'Open Sans',
  },
  dialogInput: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  confirmBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  confirmBtnText: {
    fontSize: 11.5,
    fontWeight: '400',
    color: '#ffffff',
    fontFamily: 'Open Sans',
  },
})
