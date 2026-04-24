# ⚡ Focus Flow — Anti-Procrastination Engine

A premium React Native (Expo) productivity app with Pomodoro timer, flow state tracking, task management, and streak system.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Expo
npx expo start

# 3. Run on device
# Press 'i' for iOS simulator, 'a' for Android
```

---

## 📦 Stack

| Layer      | Tech                              |
|------------|-----------------------------------|
| Framework  | React Native + Expo SDK 51        |
| Language   | TypeScript                        |
| State      | Zustand + AsyncStorage (persist)  |
| Animation  | React Native Reanimated 3         |
| SVG Timer  | react-native-svg                  |
| Navigation | React Navigation v6 (bottom tabs) |
| Notifs     | Expo Notifications                |

---

## 📂 Folder Structure

```
focus-flow/
├── App.tsx                    # Root + custom bottom tab bar
│
├── components/
│   ├── Timer.tsx              # SVG circular animated Pomodoro timer
│   ├── TaskCard.tsx           # Swipe-to-delete task card
│   └── FlowMeter.tsx          # Animated horizontal flow state bar
│
├── screens/
│   ├── FocusScreen.tsx        # Main screen: timer + flow + task display
│   ├── TasksScreen.tsx        # Add / complete / delete tasks
│   └── StatsScreen.tsx        # Charts, streak, badges
│
├── store/
│   └── useStore.ts            # Zustand store (full app state)
│
├── hooks/
│   └── useInactivity.ts       # Idle detection + notification trigger
│
└── utils/
    ├── timerUtils.ts          # Time formatting, progress calc, chart helpers
    └── storage.ts             # AsyncStorage helpers
```

---

## ✨ Features

### ⏱ Pomodoro Timer
- 25 min focus / 5 min short break / 15 min long break
- Auto-switches sessions after completion
- Animated SVG progress ring with gradient per phase

### ⚡ Flow State Meter
- Increases on user interaction (+2 per tap/scroll)
- Decays every 5s while timer is running
- Three color states: 🔴 Low → 🟡 Building → 🟢 Deep Focus

### 🔔 Inactivity Detection
- Polls every 5 seconds during active timer
- After 60s idle: fires "Get back to work ⚡" notification
- Automatically resets when user interacts again

### 🏆 Streak System
- Tracks consecutive days with completed sessions
- Auto-updates on first session of each day
- Badges unlock automatically (First Step, 3-Day, 7-Day, etc.)

### 🧘 Focus Mode
- Toggle in Focus Screen header
- Hides tabs and extra UI for minimal distraction
- Exit requires confirmation alert

### 📊 Stats
- Weekly bar chart (last 7 days)
- Today's focus time, session count, completed tasks
- Badge collection with locked/unlocked states

---

## 🎨 Design System

| Token         | Value                |
|---------------|----------------------|
| Background    | `#F8F8FF`            |
| Primary       | `#7B8FF7` (indigo)   |
| Success/Flow  | `#06D6A0` (mint)     |
| Warning       | `#FFB703` (amber)    |
| Danger        | `#FF6B6B` (coral)    |
| Card BG       | `#FFFFFF`            |
| Card radius   | `20px`               |
| Shadow        | `#8B9EC7` at 8% opacity |

---

## 🔧 Customization

Timer durations are stored in the Zustand store and persisted. You can expose a settings screen by reading/writing:

```ts
useStore.getState().focusDuration        // default: 25 * 60
useStore.getState().shortBreakDuration   // default: 5 * 60
useStore.getState().longBreakDuration    // default: 15 * 60
```

---

## 📝 Notes

- `babel.config.js` includes `react-native-reanimated/plugin` as the **last** plugin (required)
- Notification permissions are requested on first render of `FocusScreen`
- All data is persisted via `@react-native-async-storage/async-storage` through Zustand's `persist` middleware
