# amogamobileds-v1

> **Amoga Mobile UI Design System & Component Library** for Expo and React Native applications.

A production-ready UI/UX component library and chat design system featuring rich themes, haptics, Telegram/WhatsApp-style interactive chat interfaces, voice notes with inline waveforms, dynamic swipe-to-reply, sheet modals, and accessible UI primitives.

---

## 📦 Installation

In any Expo or React Native project, install `amogamobileds-v1`:

```bash
# If installing from local path or monorepo:
npm install ../amogamobileds-v1

# Or from npm registry (when published):
npm install amogamobileds-v1
```

### Peer Dependencies
Ensure you have the core Expo / React Native packages installed:
```bash
npx expo install react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens react-native-svg lucide-react-native expo-font expo-audio expo-video expo-image expo-haptics
```

---

## 🚀 Quick Start

### 1. Wrap Your App with Providers
In your root layout (`app/_layout.tsx` or `App.tsx`):

```tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  ColorThemeProvider,
  ThemeProvider,
  AuthProvider,
  ToastProvider,
} from 'amogamobileds-v1';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ColorThemeProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {/* Your Screens / Navigation */}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </ColorThemeProvider>
    </GestureHandlerRootView>
  );
}
```

---

## 💬 Chat System Components

`amogamobileds-v1` includes a full-featured real-time chat kit:

```tsx
import {
  ChatBubble,
  ChatHeader,
  ChatInput,
  ChatSidebar,
  ChatProfileModal,
  ChatActionMenu,
  ChatLocationCard,
  useChat,
} from 'amogamobileds-v1';

// Chat Header with group member count and online indicator
<ChatHeader
  title="Project Team"
  isGroup={true}
  memberCount={8}
  onlineCount={3}
  onOpenProfile={() => setProfileOpen(true)}
  onSearch={() => setSearching(true)}
/>

// Interactive Chat Bubble with Voice Note player, swipe-to-reply, double blue ticks
<ChatBubble
  id={message.id}
  isOwn={message.sender_id === currentUserId}
  senderName={message.sender?.name}
  content={message.content}
  timestamp={message.created_at}
  status="read" // 'sending' | 'sent' | 'read'
  attachments={message.attachments}
  replyTo={message.reply_to}
  onReply={(msg) => setReplyingTo(msg)}
/>

// WhatsApp-style Input with Voice Note recording waveform & reply preview
<ChatInput
  value={text}
  onChangeText={setText}
  onSend={handleSend}
  replyingTo={replyingTo}
  onCancelReply={() => setReplyingTo(null)}
  onSendVoiceNote={handleSendVoice}
  onAttachFile={handleAttachment}
/>

// Telegram-style Shared Media & Profile Drawer Modal
<ChatProfileModal
  visible={profileOpen}
  onClose={() => setProfileOpen(false)}
  chatTitle="Project Team"
  isGroup={true}
  memberCount={8}
  sharedMedia={sharedMediaList}
  sharedAudio={sharedAudioList}
  sharedDocs={sharedDocsList}
/>
```

---

## 🎨 UI Primitives

Import UI components directly:

```tsx
import {
  Button,
  Input,
  Avatar,
  Badge,
  Card,
  Modal,
  Sheet,
  Spinner,
  Toast,
  Tabs,
  Switch,
  Slider,
  Radio,
  Checkbox,
  DatePicker,
  AudioPlayer,
  Video,
} from 'amogamobileds-v1';
```

### Granular Subpath Imports
You can also import specific submodules:
```tsx
import { ChatBubble, ChatInput } from 'amogamobileds-v1/chat';
import { Button, Input, Spinner } from 'amogamobileds-v1/ui';
import { ThemeProvider, useTheme } from 'amogamobileds-v1/providers';
import { Colors, THEMES } from 'amogamobileds-v1/theme';
import { useColorScheme, useHaptics } from 'amogamobileds-v1/hooks';
```

---

## 🛠️ Modifying & Extending

When you make changes to components inside `amogamobileds-v1`, any app referencing it via `npm install ../amogamobileds-v1` or package dependencies will automatically have access to the latest UI/UX features.

---

## 📄 License
MIT © Amoga
