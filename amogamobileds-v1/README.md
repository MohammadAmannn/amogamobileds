# Amoga Design System & Mobile App

A production-grade, unified cross-platform codebase built with **Expo (React Native)**, **TypeScript**, **Expo Router**, and **Supabase**.

This repository powers two distinct experiences from a single codebase:
1. **Native Mobile App (iOS & Android)**: Mobile application with authentication, tabs, UI components, and native gestures.
2. **Web Design System Playground**: Desktop-first interactive Design System previewer, device simulator (iPhone, Pixel, Galaxy, iPad), responsive breakpoint switcher, syntax-highlighted code inspector, and full-screen modal previews.

---

## Table of Contents
1. [Architecture & Platform Separation](#1-architecture--platform-separation)
2. [How Web and App are Kept Separate](#2-how-web-and-app-are-kept-separate)
3. [How to Add a Feature ONLY for Web (Safe from Mobile)](#3-how-to-add-a-feature-only-for-web-safe-from-mobile)
4. [How Expo Router (File-Based Routing) Works](#4-how-expo-router-file-based-routing-works)
5. [How to Add a New Page to the Mobile App](#5-how-to-add-a-new-page-to-the-mobile-app)
6. [How to Add a Page on Both Web and App with Different UI](#6-how-to-add-a-page-on-both-web-and-app-with-different-ui)
7. [Project Directory Structure](#7-project-directory-structure)
8. [Setup & Commands](#8-setup--commands)

---

## 1. Architecture & Platform Separation

In React Native and Expo, you write shared TypeScript/React code, but you often need desktop web users and mobile phone users to have completely tailored interfaces.

```
                     ┌───────────────────────────────┐
                     │    Single Shared Codebase     │
                     └───────────────┬───────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
       ┌────────────────────────┐        ┌────────────────────────┐
       │     WEB PLATFORM       │        │  MOBILE APP (iOS/APK)  │
       ├────────────────────────┤        ├────────────────────────┤
       │ • Desktop Playground   │        │ • Native Mobile UI     │
       │ • Device Simulator     │        │ • Bottom Tab Bar       │
       │ • Responsive Breakpts  │        │ • Native Gestures      │
       │ • Code Viewer & Copy   │        │ • Keyboard Avoidance   │
       │ • Centered Auth Cards  │        │ • Native Biometrics    │
       └────────────────────────┘        └────────────────────────┘
```

---

## 2. How Web and App are Kept Separate

Metro (the JavaScript bundler for Expo / React Native) uses **platform file extensions** to resolve modules at build time.

### The 3 Separation Mechanisms:

### A. Platform File Extensions (`.web.tsx` vs `.tsx`) — *Recommended*
Metro resolves files in order of platform specificity:
- On **Web**: Metro looks for `filename.web.tsx` first. If found, it uses it and **completely ignores** `filename.tsx`.
- On **iOS / Android**: Metro looks for `filename.ios.tsx` / `filename.android.tsx` / `filename.native.tsx`, and falls back to `filename.tsx`. Metro **never** includes `.web.tsx` in native bundles.

**Example from this project:**
- `app/(tabs)/(home)/index.web.tsx`: Renders the desktop sidebar + device frame playground.
- `app/(tabs)/(home)/index.tsx`: Renders the mobile component cards list for Android/iOS APK.
- `components/auth/auth-screen.web.tsx`: Renders a centered 440px desktop card container with brand badge.
- `app/(tabs)/settings/index.web.tsx`: Renders responsive desktop settings with `maxWidth: 680`.

### B. Runtime Platform Checks (`Platform.OS`)
For smaller differences inside a shared component:
```tsx
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-only logic or styles
} else {
  // Native mobile (iOS & Android) logic or styles
}
```

### C. Dedicated Web Folders
Components that only ever exist on web (like `DeviceFrame`, `DeviceSelector`, `PreviewToolbar`, `CodePanel`) are placed in:
```
components/web/
├── DeviceFrame.web.tsx
├── DeviceSelector.web.tsx
├── PreviewToolbar.web.tsx
├── CodePanel.web.tsx
├── FullscreenModal.web.tsx
├── devices.ts
└── types.ts
```

---

## 3. How to Add a Feature ONLY for Web (Safe from Mobile)

Follow these rules to guarantee that new web features never break or alter the native mobile app:

### Rule 1: Always use `.web.tsx` for new web-only screens or components
If you want to create a web-only dashboard, analytics panel, or banner:
1. Create your component with `.web.tsx`, e.g., `components/web/AnalyticsBanner.web.tsx`.
2. Import and use it **only** inside `.web.tsx` files (e.g., in `app/(tabs)/(home)/index.web.tsx`).
3. Since native mobile only bundles `.tsx` files, your web code is 100% physically excluded from the mobile APK/iOS app bundle.

### Rule 2: If modifying a shared screen, branch with `Platform.OS === 'web'`
If you need to add a web-only element inside a shared file:
```tsx
import { Platform, View, Text } from 'react-native';

export default function MyScreen() {
  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' && (
        <View style={{ padding: 16, backgroundColor: '#059669' }}>
          <Text style={{ color: '#fff' }}>Web-Only Banner</Text>
        </View>
      )}

      {/* Shared content below */}
      <Text>Screen content for both app and web</Text>
    </View>
  );
}
```

---

## 4. How Expo Router (File-Based Routing) Works

Expo Router maps the filesystem directly to routes (similar to Next.js).

### Key Routing Concepts:
| Folder / File Pattern | What it does | Example |
| :--- | :--- | :--- |
| `app/index.tsx` | Root URL (`/`) | Home page |
| `app/about.tsx` | Route URL (`/about`) | About page |
| `app/(group)/` | Group folder (does **not** appear in URL) | `app/(tabs)/home.tsx` -> `/home` |
| `app/_layout.tsx` | Wraps all sibling & child routes with navigation (Stack, Tabs, etc.) | Global Layout |
| `app/[id].tsx` | Dynamic parameter route | `/products/123` |

### Layout Hierarchy in this Project:
```
app/
├── _layout.tsx           <-- Root layout (Auth provider, splash screen, theme)
├── (auth)/               <-- Authentication route group (URL: /sign-in, /sign-up, etc.)
│   ├── _layout.tsx       <-- Stack navigation for native mobile auth
│   ├── _layout.web.tsx   <-- Full-height layout for web auth
│   ├── sign-in.tsx       <-- Sign In screen
│   ├── sign-up.tsx       <-- Sign Up screen
│   ├── forgot-password.tsx
│   ├── magic-link.tsx
│   ├── reset-password.tsx
│   └── verify-otp.tsx
└── (tabs)/               <-- Main application bottom tabs group
    ├── _layout.tsx       <-- Tab bar navigation for mobile
    ├── (home)/
    │   ├── index.tsx     <-- Mobile home screen
    │   └── index.web.tsx <-- Web Design System Playground
    └── settings/
        ├── index.tsx     <-- Mobile settings
        └── index.web.tsx <-- Web settings (desktop-constrained)
```

---

## 5. How to Add a New Page to the Mobile App

### Scenario A: Add a new standalone screen (e.g. "Profile Details")
1. **Create the file**: Create `app/profile-details.tsx`.
   ```tsx
   import { View, Text } from 'react-native';

   export default function ProfileDetailsScreen() {
     return (
       <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile Details</Text>
       </View>
     );
   }
   ```
2. **Navigate to it**: Anywhere in your mobile app, use `router.push`:
   ```tsx
   import { router } from 'expo-router';
   import { Button } from '@/components/ui/button';

   <Button onPress={() => router.push('/profile-details')}>
     View Profile Details
   </Button>
   ```

### Scenario B: Add a new tab to the bottom tab bar on mobile
1. Create the new folder and file inside `app/(tabs)/`:
   `app/(tabs)/notifications/index.tsx`
2. Register the tab in `app/(tabs)/_layout.tsx`:
   ```tsx
   <Tabs.Screen
     name="notifications/index"
     options={{
       title: 'Notifications',
       tabBarIcon: ({ color, size }) => (
         <Bell size={size} color={color} />
       ),
     }}
   />
   ```

---

## 6. How to Add a Page on Both Web and App with Different UI

When you want a single URL (e.g. `/analytics`) to be accessible on both Web and Mobile, but look like a **native phone screen on mobile** and a **wide desktop dashboard on web**, use the **Split-File Pattern**.

### Step 1: Create the Mobile Native version
Create `app/analytics.tsx`:
```tsx
// app/analytics.tsx -> Bundled for iOS and Android
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function AnalyticsMobileScreen() {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>
        Mobile Analytics
      </Text>
      {/* Mobile-optimized single column card list */}
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6', marginBottom: 12 }}>
        <Text style={{ fontSize: 16 }}>Total Users: 1,240</Text>
      </View>
      <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 16 }}>Active Sessions: 85</Text>
      </View>
    </ScrollView>
  );
}
```

### Step 2: Create the Web Desktop version
Create `app/analytics.web.tsx`:
```tsx
// app/analytics.web.tsx -> Bundled EXCLUSIVELY for Web
import React from 'react';
import { View, Text } from 'react-native';

export default function AnalyticsWebScreen() {
  return (
    <View style={{ flex: 1, padding: 40, maxWidth: 1200, marginHorizontal: 'auto', width: '100%' }}>
      <Text style={{ fontSize: 32, fontWeight: '800', marginBottom: 24 }}>
        Web Analytics Dashboard
      </Text>
      {/* Desktop-optimized multi-column grid layout */}
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ flex: 1, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>TOTAL USERS</Text>
          <Text style={{ fontSize: 28, fontWeight: '700' }}>1,240</Text>
        </View>
        <View style={{ flex: 1, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>ACTIVE SESSIONS</Text>
          <Text style={{ fontSize: 28, fontWeight: '700' }}>85</Text>
        </View>
        <View style={{ flex: 1, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>CONVERSION RATE</Text>
          <Text style={{ fontSize: 28, fontWeight: '700' }}>4.8%</Text>
        </View>
      </View>
    </View>
  );
}
```

### Why this pattern is best-practice:
1. **Zero Bundle Bloat**: Mobile app users download 0 bytes of web dashboard code.
2. **Zero Risk of Regressions**: You can edit `analytics.web.tsx` freely without testing mobile APK.
3. **Identical Navigation**: Navigating to `router.push('/analytics')` automatically loads the right screen on each device.

---

## 7. Project Directory Structure

```
amogamobileds-v1/
├── app/                             # Expo Router file-based routes
│   ├── (auth)/                      # Authentication route group
│   │   ├── _layout.tsx              # Native mobile auth stack
│   │   ├── _layout.web.tsx          # Desktop web auth layout
│   │   ├── sign-in.tsx              # Sign In route
│   │   ├── sign-up.tsx              # Sign Up route
│   │   └── ...                      # Reset password, magic link, OTP
│   ├── (tabs)/                      # Main bottom tabs group
│   │   ├── _layout.tsx              # Bottom tab bar definition
│   │   ├── (home)/
│   │   │   ├── index.tsx            # Native Mobile component card list
│   │   │   └── index.web.tsx        # Web Design System Playground (Desktop)
│   │   └── settings/
│   │       ├── index.tsx            # Native Mobile settings
│   │       └── index.web.tsx        # Desktop-constrained web settings
│   └── _layout.tsx                  # Global app root layout
├── components/
│   ├── auth/                        # Auth presentation components
│   │   ├── auth-screen.tsx          # Mobile native frame & web card dispatcher
│   │   ├── auth-screen.web.tsx      # Web centered card implementation
│   │   └── oauth-buttons.tsx        # OAuth providers (Google, Apple, GitHub)
│   ├── design-system/               # Component registry & showcase data
│   │   ├── registry.tsx             # Interactive preview registry for primitives
│   │   └── component-preview-modal.tsx # Mobile preview modal
│   ├── ui/                          # Reusable Primitive UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── toast.tsx
│   │   ├── icon.tsx
│   │   └── ...
│   └── web/                         # Web-only Design System Playground tools
│       ├── DeviceFrame.web.tsx      # High-fidelity iPhone & Android frames
│       ├── DeviceSelector.web.tsx   # Device dropdown switcher
│       ├── PreviewToolbar.web.tsx   # View Mode, theme toggle, zoom controls
│       ├── CodePanel.web.tsx        # TSX syntax code preview with 1-click copy
│       ├── FullscreenModal.web.tsx  # Immersive full-window preview
│       ├── devices.ts               # Device dimensions and specs
│       └── types.ts                 # TypeScript types for playground
├── hooks/                           # Custom React hooks (colors, theme, haptics)
├── theme/                           # Color tokens and design constants
└── lib/                             # Supabase client and utilities
```

---

## 8. Setup & Commands

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Navigate to the project
cd amogamobileds-v1

# Install dependencies
npm install
```

### Running Locally
```bash
# Start on Web (Design System Playground)
npm run web

# Start on Android (Emulator or physical device)
npm run android

# Start on iOS (Simulator - macOS only)
npm run ios

# Clear cache and restart Metro bundler
npm run start -c
```

### Verification & Quality Checks
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Run Jest unit tests
npm run test
```

### Web Deployment (Vercel)
The project exports to static web assets for Vercel deployment:
```bash
# Export static web bundle
npm run build
```
Vercel is configured via `vercel.json` to route all incoming requests to the exported static files with SPA client-side routing.
