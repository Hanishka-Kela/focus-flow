/**
 * App.tsx
 * Root component: sets up notification handler and bottom tab navigation.
 */
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';

import FocusScreen from './screens/FocusScreen';
import TasksScreen from './screens/TasksScreen';
import StatsScreen from './screens/StatsScreen';
import { useStore } from './store/useStore';

// ─── Notification handler ───────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Tab config ─────────────────────────────────────────
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Focus: '⏱',
  Tasks: '✅',
  Stats: '📊',
};

interface TabBarProps {
  state: { index: number; routes: { name: string }[] };
  descriptors: Record<string, { options: { tabBarLabel?: string } }>;
  navigation: { emit: (a: any) => any; navigate: (n: string) => void };
}

function CustomTabBar({ state, descriptors: _d, navigation }: TabBarProps) {
  const { flowLevel, isRunning } = useStore();

  const flowColor =
    flowLevel < 33 ? '#FF6B6B' :
    flowLevel < 66 ? '#FFB703' :
                     '#06D6A0';

  return (
    <View style={tabStyles.container}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const icon = TAB_ICONS[route.name] ?? '●';

        return (
          <TouchableOpacity
            key={route.name}
            style={tabStyles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
              <Text style={tabStyles.icon}>{icon}</Text>
            </View>
            <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Flow indicator dot */}
      {isRunning && (
        <View style={[tabStyles.flowDot, { backgroundColor: flowColor }]} />
      )}
    </View>
  );
}

// ─── App ────────────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...(props as any)} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Focus" component={FocusScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: {
    width: 44,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#EEF0FF',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#AEAEB2',
  },
  labelActive: {
    color: '#7B8FF7',
    fontWeight: '700',
  },
  flowDot: {
    position: 'absolute',
    top: 8,
    right: 28,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
