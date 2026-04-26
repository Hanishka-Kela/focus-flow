# Focus Flow 🎯

A beautiful and intuitive Pomodoro timer app built with React Native and Expo. Focus Flow helps you manage your time, track your productivity, and maintain a healthy work-life balance with interactive focus sessions, breaks, and real-time flow state monitoring.

## About the App

**Focus Flow** is a productivity app designed to help you stay focused and track your work sessions using the Pomodoro Technique. Whether you're studying, working, or tackling creative projects, Focus Flow provides a distraction-free environment with:

- **Circular Animated Timer** - A beautiful, easy-to-read timer that shows your focus progress at a glance
- **Pomodoro Sessions** - 25-minute focus sessions with 5-minute short breaks and 15-minute long breaks
- **Task Tracking** - Add, manage, and track tasks for your focus sessions
- **Flow State Monitor** - Real-time feedback on your focus level to help you achieve deep work
- **Focus Mode** - A distraction-free mode that locks you into your session
- **Session Statistics** - Track your daily sessions, flow metrics, and productivity trends
- **Persistent Storage** - Your tasks and statistics are saved locally on your device

## Features

✅ **Pomodoro Timer** - 25 min focus, 5 min short break, 15 min long break  
✅ **Task Management** - Create and track tasks for each session  
✅ **Flow Meter** - Visual indicator of your focus flow level  
✅ **Statistics Dashboard** - Track sessions completed, flow levels, and completion rates  
✅ **Beautiful UI** - Clean, modern interface with smooth animations  
✅ **Focus Mode** - Distraction-free full-screen mode  
✅ **Persistent Data** - All data saved locally using AsyncStorage  

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development and distribution platform
- **TypeScript** - Type-safe JavaScript
- **Zustand** - State management
- **React Navigation** - Navigation between screens
- **React Native Reanimated** - Smooth animations
- **AsyncStorage** - Local data persistence

## Installation & Setup

### Prerequisites

You'll need:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Expo Go app** on your phone - [iOS App Store](https://apps.apple.com/us/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd focus-flow
```

### Step 2: Install Dependencies

```bash
npm install
```

Or if you use yarn:
```bash
yarn install
```

### Step 3: Start the Development Server

```bash
npm start
```

You'll see a QR code in the terminal.

### Step 4: Open in Expo Go

**On iOS:**
- Open the Camera app
- Scan the QR code from the terminal
- Tap the notification to open in Expo Go

**On Android:**
- Open Expo Go app
- Tap "Scan QR Code"
- Scan the QR code from the terminal

## Project Structure

```
focus-flow/
├── components/          # Reusable UI components
│   ├── Timer.tsx       # Main circular timer component
│   ├── TaskCard.tsx    # Task display component
│   └── FlowMeter.tsx   # Flow state visualization
├── screens/            # App screens
│   ├── FocusScreen.tsx # Main focus screen
│   ├── TasksScreen.tsx # Task management screen
│   └── StatsScreen.tsx # Statistics dashboard
├── store/             # State management
│   └── useStore.ts    # Zustand store
├── hooks/             # Custom React hooks
│   └── useInactivity.ts
├── utils/             # Utility functions
│   ├── storage.ts     # AsyncStorage helpers
│   └── timerUtils.ts  # Timer utilities
├── App.tsx            # Root component
├── app.json           # Expo config
├── index.js           # Entry point
└── package.json       # Dependencies
```

## How to Use

### 1. **Start a Focus Session**
   - Open the app and tap the **Play** button
   - The timer will count down from 25 minutes
   - Stay focused on your task!

### 2. **Manage Tasks**
   - Go to the **Tasks** tab
   - Add new tasks you want to work on
   - Select a task before starting your session
   - Mark tasks as complete when done

### 3. **Monitor Your Flow**
   - The **Flow Meter** shows your focus level
   - It increases as you complete sessions
   - Track your daily flow in the **Stats** tab

### 4. **Use Focus Mode**
   - Tap the **🧘** button to activate Focus Mode
   - This hides the tabs and statistics for minimal distraction
   - Tap again to exit

### 5. **Break Sessions**
   - After a focus session, take a short 5-minute break
   - Tap "Break" to switch between short and long breaks
   - Use your break to rest and recharge

## Available Scripts

```bash
# Start the development server
npm start

# Build for Android (requires EAS account)
npm run android

# Build for iOS (requires EAS account)  
npm run ios

# Build for web
npm run web
```

## Requirements

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **Expo Go**: Latest version on your mobile device
- **Mobile Device or Emulator**: iPhone, iPad, or Android device
