import React, { useState } from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  ChatSidebar,
  ChatCardItem,
  ChatInput,
  ChatHeader,
  ChatBubble,
  ChatMessageList,
  TypingIndicator,
  ChatEmptyState,
  ContactManager,
  GroupManager,
  ChatActionMenu,
  ChatIconBar,
  FileUploadProgress,
  UploadedFileCard,
  ChatAttachmentMenu,
  ChatLocationCard,
  ChatProfileModal,
  ContactInfoView,
} from '../../chat'
import { Button } from '../../ui/button'
import { useTheme } from '../../../providers/theme-provider'

export interface GalleryEntry {
  id: string
  [key: string]: any
}

interface ChatPreviewsProps {
  entry?: GalleryEntry
}

export function ChatPreviews({ entry }: ChatPreviewsProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const entryId = entry?.id || 'chat-sidebar'

  // State for interactive sidebar preview
  const [sidebarTab, setSidebarTab] = useState('chats')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [selectedChatId, setSelectedChatId] = useState('c1')

  // State for interactive chat input
  const [typedInputText, setTypedInputText] = useState('')

  // State for contacts manager
  const [contacts, setContacts] = useState([
    {
      id: '1',
      name: 'Aman',
      email: 'amanmicropay@gmail.com',
      initials: 'AM',
      isEnabled: true,
    },
  ])

  // State for groups manager
  const [groups, setGroups] = useState([
    {
      id: 'g1',
      name: 'jj',
      membersCount: 3,
      ownerEmail: 'itsaman00786@gmail.com',
      isEnabled: true,
      description: 'Project discussions',
    },
    {
      id: 'g2',
      name: 'demo',
      membersCount: 3,
      ownerEmail: 'itsaman00786@gmail.com',
      isEnabled: true,
      description: 'General announcements',
    },
  ])

  // ──────────────────────── 1. CHAT SIDEBAR ────────────────────────
  if (entryId === 'chat-sidebar') {
    return (
      <View
        style={[
          styles.fillWrapper,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.stageCard,
            {
              backgroundColor: isDark ? '#09090b' : '#ffffff',
              borderColor: colors.border,
            },
          ]}
        >
          {/* Left Pane: Chat Sidebar */}
          <View
            style={[
              styles.sidebarPane,
              {
                backgroundColor: colors.background,
                borderRightColor: colors.border,
              },
            ]}
          >
            <ChatSidebar
              tabs={[
                { id: 'chats', label: 'Chats' },
                { id: 'contact', label: 'Contact' },
                { id: 'groups', label: 'Groups' },
                { id: 'folder', label: 'Folder' },
              ]}
              activeTab={sidebarTab}
              onTabChange={(t) => setSidebarTab(t)}
              searchValue={sidebarSearch}
              onSearchChange={(q) => setSidebarSearch(q)}
              searchPlaceholder="Search..."
              sectionLabel="CHATS"
              sectionCount={2}
            >
              <ChatCardItem
                id="c1"
                title="Aman"
                badgeLabel="Chat"
                time="about 3 hours ago"
                membersCount={2}
                onlineCount={0}
                lastMessage="images (1).jpg"
                isActive={selectedChatId === 'c1'}
                onClick={() => setSelectedChatId('c1')}
              />
              <ChatCardItem
                id="c2"
                title="DB Alerts"
                badgeLabel="Chat"
                time="10 days ago"
                membersCount={3}
                onlineCount={0}
                lastMessage="Contact Created 🟢 Contact Added By: Bhanuprasad..."
                isActive={selectedChatId === 'c2'}
                onClick={() => setSelectedChatId('c2')}
              />
            </ChatSidebar>
          </View>

          {/* Right Preview Viewport */}
          <View
            style={[
              styles.rightViewport,
              { backgroundColor: isDark ? '#121215' : '#f8fafc' },
            ]}
          >
            <ChatHeader
              title={selectedChatId === 'c1' ? 'Aman' : 'DB Alerts'}
              subtitle={
                selectedChatId === 'c1'
                  ? 'Last seen today at 04:58 PM'
                  : '3 members'
              }
              status="online"
              isGroup={selectedChatId === 'c2'}
              memberCount={selectedChatId === 'c2' ? 3 : undefined}
            />

            <ChatMessageList>
              {selectedChatId === 'c1' ? (
                <>
                  <ChatBubble
                    senderName="Aman"
                    time="01:05 PM"
                    status="read"
                    attachments={[
                      {
                        id: 'doc1',
                        name: 'Dev_ops resume.pdf',
                        size: 507904,
                        type: 'pdf',
                        statusText: 'Parsed',
                      },
                    ]}
                  />
                  <ChatBubble
                    senderName="Aman"
                    content="images (1).jpg"
                    time="01:10 PM"
                    status="read"
                  />
                  <ChatBubble
                    senderName="Mohammed Aman"
                    content="checking from amogds"
                    time="01:12 PM"
                    status="read"
                  />
                </>
              ) : (
                <ChatBubble
                  senderName="System Bot"
                  content="Contact Created 🟢 Contact Added By: Bhanuprasad..."
                  time="10 days ago"
                  status="read"
                />
              )}
            </ChatMessageList>

            <View style={styles.chatInputWrapper}>
              <ChatInput
                value=""
                onChange={() => {}}
                onSend={() => {}}
                placeholder="Message"
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  // ──────────────────────── 2. CHAT CARD ITEM ────────────────────────
  if (entryId === 'chat-card-item') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={styles.singleCardWrap}>
          <ChatCardItem
            id="c1"
            title="Aman"
            badgeLabel="Chat"
            time="about 3 hours ago"
            membersCount={2}
            onlineCount={0}
            lastMessage="images (1).jpg"
            isActive={true}
          />
        </View>
      </View>
    )
  }

  // ──────────────────────── 3. CHAT INPUT (COMPOSER) ────────────────────────
  if (entryId === 'chat-input') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={styles.singleInputWrap}>
          <ChatInput
            value={typedInputText}
            onChange={setTypedInputText}
            onSend={() => setTypedInputText('')}
            placeholder="Message"
          />
        </View>
      </View>
    )
  }

  // ──────────────────────── 4. CHAT HEADER ────────────────────────
  if (entryId === 'chat-header') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={styles.singleHeaderWrap}>
          <ChatHeader
            title="Mohammed Aman"
            subtitle="Last seen today at 04:58 PM"
            status="online"
          />
        </View>
      </View>
    )
  }

  // ──────────────────────── 5. CHAT MESSAGE LIST ────────────────────────
  if (entryId === 'chat-message-list') {
    return (
      <View style={styles.singleComponentContainer}>
        <View
          style={[
            styles.singleMessageListWrap,
            { backgroundColor: colors.background },
          ]}
        >
          <ChatMessageList>
            {/* Message 1: Document attachment */}
            <ChatBubble
              senderName="Mohammed Aman"
              time="01:05 PM"
              status="read"
              attachments={[
                {
                  id: 'doc1',
                  name: 'Dev_ops resume.pdf',
                  size: 507904,
                  type: 'pdf',
                  statusText: 'Parsed',
                },
              ]}
            />

            {/* Message 2: hy */}
            <ChatBubble
              senderName="Mohammed Aman"
              content="hy"
              time="09:06 AM"
              status="read"
            />

            {/* Message 3: heello */}
            <ChatBubble
              senderName="Aman"
              content="heello"
              time="09:07 AM"
            />

            {/* Message 4: hyy */}
            <ChatBubble
              senderName="Aman"
              content="hyy"
              time="09:52 AM"
            />

            {/* Message 5: checking from amogds (left-aligned as requested) */}
            <ChatBubble
              senderName="Mohammed Aman"
              content="checking from amogds"
              time="09:52 AM"
              status="read"
            />
          </ChatMessageList>
        </View>
      </View>
    )
  }

  // ──────────────────────── 6. MESSAGE BUBBLE ────────────────────────
  if (entryId === 'message-bubble' || entryId === 'chat-bubble') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={styles.singleBubbleWrap}>
          <ChatBubble
            senderName="Aman"
            content="Got it! Looks super clean and matches the designs."
            time="09:55 AM"
            status="read"
            reactions={[
              { emoji: '👍', count: 2 },
              { emoji: '🚀', count: 1 },
            ]}
          />
        </View>
      </View>
    )
  }

  // ──────────────────────── 7. TYPING INDICATOR ────────────────────────
  if (entryId === 'typing-indicator') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={styles.cleanIndicatorWrap}>
          <TypingIndicator label="Aman is typing..." />
        </View>
      </View>
    )
  }

  // ──────────────────────── 8. CHAT EMPTY STATE ────────────────────────
  if (entryId === 'chat-empty-state') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={styles.cleanEmptyWrap}>
          <ChatEmptyState
            title="No conversation selected"
            description="Choose a chat from the sidebar or start a new conversation to begin messaging."
          />
        </View>
      </View>
    )
  }

  // ──────────────────────── 9. CONTACT MANAGER ────────────────────────
  if (entryId === 'contact-manager') {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.centeredContent}
        showsVerticalScrollIndicator={false}
      >
        <ContactManager
          contacts={contacts}
          onToggleStatus={(c, checked) => {
            setContacts((prev) =>
              prev.map((item) =>
                item.id === c.id ? { ...item, isEnabled: checked } : item
              )
            )
          }}
          onDeleteClick={(c) => {
            setContacts((prev) => prev.filter((item) => item.id !== c.id))
          }}
          onAddContact={(newC) => {
            setContacts((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                name: newC.name,
                email: newC.email,
                initials: newC.name.slice(0, 2).toUpperCase(),
                isEnabled: true,
              },
            ])
          }}
        />
      </ScrollView>
    )
  }

  // ──────────────────────── 10. GROUP MANAGER ────────────────────────
  if (entryId === 'group-manager') {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.centeredContent}
        showsVerticalScrollIndicator={false}
      >
        <GroupManager
          groups={groups}
          onToggleStatus={(g, checked) => {
            setGroups((prev) =>
              prev.map((item) =>
                item.id === g.id ? { ...item, isEnabled: checked } : item
              )
            )
          }}
          onDeleteClick={(g) => {
            setGroups((prev) => prev.filter((item) => item.id !== g.id))
          }}
          onAddGroup={(newG) => {
            setGroups((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                name: newG.name,
                ownerEmail: 'itsaman00786@gmail.com',
                membersCount: 3,
                isEnabled: true,
                description: newG.description || 'General discussions',
              },
            ])
          }}
        />
      </ScrollView>
    )
  }

  // ──────────────────────── 11. 3-DOT ACTION MENU ────────────────────────
  if (entryId === 'chat-action-menu' || entryId === 'three-dot-menu') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={{ gap: 16, alignItems: 'center' }}>
          <ChatActionMenu onSelect={() => {}} />
        </View>
      </View>
    );
  }

  // ──────────────────────── 12. CHAT ICON BAR ────────────────────────
  if (entryId === 'chat-icon-bar' || entryId === 'message-action-bar') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={{ alignItems: 'center' }}>
          <ChatIconBar initialLiked={false} />
        </View>
      </View>
    );
  }

  // ──────────────────────── 13. FILE UPLOAD WITH PROGRESS BAR ────────────────────────
  if (entryId === 'file-upload-progress') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={{ width: '100%', maxWidth: 380, alignItems: 'center' }}>
          <FileUploadProgress
            fileName="quarterly_financial_report.pdf"
            fileSize="3.6 MB"
            fileType="PDF"
            initialProgress={68}
            status="uploading"
          />
        </View>
      </View>
    );
  }

  // ──────────────────────── 14. UPLOADED FILE CARD ────────────────────────
  if (entryId === 'uploaded-file-card' || entryId === 'chat-file-card') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={{ width: '100%', maxWidth: 380, alignItems: 'center' }}>
          <UploadedFileCard
            fileName="bank-full.csv"
            fileSize="3.6 MB"
            fileType="CSV"
            extension="csv"
          />
        </View>
      </View>
    );
  }

  // ──────────────────────── 15. ATTACHMENT MENU ────────────────────────
  if (entryId === 'chat-attachment-menu' || entryId === 'attachment-menu') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={{ alignItems: 'center' }}>
          <ChatAttachmentMenu selectedId="location" />
        </View>
      </View>
    );
  }

  // ──────────────────────── 16. LOCATION SHARING CARD ────────────────────────
  if (entryId === 'chat-location-card' || entryId === 'location-sharing-card') {
    return (
      <View style={styles.singleComponentContainer}>
        <View style={{ width: '100%', maxWidth: 380, alignItems: 'center' }}>
          <ChatLocationCard
            title="Amoga Tech Hub"
            address="Building 10, Cyber City, Gurugram, India"
            latitude={28.4595}
            longitude={77.0266}
            isLive={true}
          />
        </View>
      </View>
    );
  }

  // ──────────────────────── 17. CHAT PROFILE MODAL (MEDIA, DOCS, AUDIO, LINKS) ────────────────────────
  if (entryId === 'chat-profile-modal' || entryId === 'profile-header-ui') {
    const mockConversation = {
      id: 'demo-conv-1',
      name: 'Amoga Product Team',
      title: 'Amoga Product Team',
      is_group: true,
      avatar_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
      description: 'Design system, mobile chat primitives, and cross-platform UI sync.',
      members_count: 8,
      participant_count: 8,
      otherMember: {
        name: 'Amoga Product Team',
        email: 'team@amoga.io',
        online: true,
      },
    };

    const mockMessages = [
      {
        id: 'msg-1',
        conversation_id: 'demo-conv-1',
        sender_id: 'user-1',
        message: 'Check out our new documentation link: https://amoga.io/docs and the repository https://github.com/amoga-corp',
        content: 'Check out our new documentation link: https://amoga.io/docs and the repository https://github.com/amoga-corp',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        sender: { name: 'Aman' },
        file_name: 'Mobile_Design_System_Spec.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_size: 1420000,
        message_type: 'file',
        attachments: [
          {
            id: 'att-1',
            name: 'Mobile_Design_System_Spec.pdf',
            size: 1420000,
            type: 'pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
        ],
      },
      {
        id: 'msg-2',
        conversation_id: 'demo-conv-1',
        sender_id: 'user-2',
        message: 'Here is the UI screenshot and the new voice note briefing!',
        content: 'Here is the UI screenshot and the new voice note briefing!',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        sender: { name: 'Sarah' },
        file_name: 'app_preview.png',
        file_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
        file_size: 850000,
        message_type: 'image',
        attachments: [
          {
            id: 'att-2',
            name: 'app_preview.png',
            size: 850000,
            type: 'image',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
          },
        ],
      },
      {
        id: 'msg-3',
        conversation_id: 'demo-conv-1',
        sender_id: 'user-3',
        message: 'Voice note briefing update',
        content: 'Voice note briefing update',
        created_at: new Date(Date.now() - 900000).toISOString(),
        sender: { name: 'Alex' },
        file_name: 'voice_note_update.m4a',
        file_url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
        file_size: 320000,
        message_type: 'audio',
        attachments: [
          {
            id: 'att-3',
            name: 'voice_note_update.m4a',
            size: 320000,
            type: 'audio',
            url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
          },
        ],
      },
    ];

    return (
      <View style={{ width: '100%', flex: 1, minHeight: 620 }}>
        <ContactInfoView
          onClose={() => {}}
          conversation={mockConversation as any}
          messages={mockMessages as any}
          onOpenMedia={(url) => console.log('Open media:', url)}
          onOpenDoc={(url) => console.log('Open doc:', url)}
        />
      </View>
    );
  }

  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fillWrapper: {
    flex: 1,
    padding: 16,
  },
  centeredContent: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleComponentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stageCard: {
    flexDirection: 'row',
    height: 520,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sidebarPane: {
    width: 320,
    height: '100%',
    borderRightWidth: 1,
  },
  rightViewport: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
  },
  chatInputWrapper: {
    padding: 12,
  },
  singleCardWrap: {
    width: '100%',
    maxWidth: 340,
  },
  singleInputWrap: {
    width: '100%',
    maxWidth: 580,
  },
  singleHeaderWrap: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 14,
    overflow: 'hidden',
  },
  singleMessageListWrap: {
    width: '100%',
    maxWidth: 560,
    height: 500,
  },
  singleBubbleWrap: {
    width: '100%',
    maxWidth: 420,
  },
  cleanIndicatorWrap: {
    width: '100%',
    maxWidth: 320,
  },
  cleanEmptyWrap: {
    width: '100%',
    maxWidth: 480,
    height: 280,
  },
})
