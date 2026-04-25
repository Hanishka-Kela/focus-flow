/**
 * FocusScreen.tsx
 * Main focus screen with circular timer, task display, and flow meter.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import Timer from '../components/Timer';
import FlowMeter from '../components/FlowMeter';
import { useStore } from '../store/useStore';
import { useInactivity } from '../hooks/useInactivity';

const FocusScreen: React.FC = () => {
  const {
    timerSeconds, timerPhase, isRunning,
    focusDuration, shortBreakDuration, longBreakDuration,
    tasks, activeTaskId,
    startTimer, pauseTimer, resetTimer, tickTimer, setTimerPhase,
    flowLevel, focusModeActive, toggleFocusMode,
    totalSessionsToday,
  } = useStore();

  const { recordInteraction } = useInactivity();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tickTimer(), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tickTimer]);

  const totalSeconds =
    timerPhase === 'focus'       ? focusDuration :
    timerPhase === 'short_break' ? shortBreakDuration :
                                   longBreakDuration;

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  const handleFocusModeToggle = () => {
    if (focusModeActive) {
      Alert.alert(
        'Exit Focus Mode?',
        'Are you sure you want to leave Focus Mode?',
        [
          { text: 'Stay Focused', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: toggleFocusMode },
        ]
      );
    } else {
      toggleFocusMode();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={recordInteraction}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Focus Flow</Text>
            <Text style={styles.subGreeting}>
              {totalSessionsToday > 0
                ? `${totalSessionsToday} session${totalSessionsToday > 1 ? 's' : ''} today 🎯`
                : 'Ready to focus?'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.focusModeBtn, focusModeActive && styles.focusModeBtnActive]}
            onPress={handleFocusModeToggle}
          >
            <Text style={[styles.focusModeBtnText, focusModeActive && { color: '#FFF' }]}>
              {focusModeActive ? '🧘 ON' : '🧘'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Phase Tabs */}
        {!focusModeActive && (
          <View style={styles.tabs}>
            {(['focus', 'short_break', 'long_break'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.tab, timerPhase === p && styles.tabActive]}
                onPress={() => { setTimerPhase(p); recordInteraction(); }}
              >
                <Text style={[styles.tabText, timerPhase === p && styles.tabTextActive]}>
                  {p === 'focus' ? 'Focus' : p === 'short_break' ? 'Break' : 'Long'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Timer */}
        <View style={styles.timerWrapper}>
          <Timer
            seconds={timerSeconds}
            totalSeconds={totalSeconds}
            isRunning={isRunning}
            phase={timerPhase}
            onStart={() => { startTimer(); recordInteraction(); }}
            onPause={() => { pauseTimer(); recordInteraction(); }}
            onReset={() => { resetTimer(); recordInteraction(); }}
          />
        </View>

        {/* Active Task Card */}
        <View style={styles.taskCard}>
          <Text style={styles.taskCardLabel}>Current Task</Text>
          {activeTask ? (
            <Text style={styles.taskCardTitle}>{activeTask.title}</Text>
          ) : (
            <Text style={styles.taskCardEmpty}>No task selected — go to Tasks tab</Text>
          )}
        </View>

        {/* Flow Meter */}
        {!focusModeActive && (
          <View style={styles.flowCard}>
            <FlowMeter />
          </View>
        )}

        {/* Quick Stats Row */}
        {!focusModeActive && (
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{totalSessionsToday}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{Math.round(flowLevel)}%</Text>
              <Text style={styles.statLabel}>Flow</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{tasks.filter((t) => !t.completed).length}</Text>
              <Text style={styles.statLabel}>Tasks Left</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FocusScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8FF' },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  focusModeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: '#F0F0F5',
  },
  focusModeBtnActive: {
    backgroundColor: '#7B8FF7',
  },
  focusModeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#48484A',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F5',
    borderRadius: 14,
    padding: 4,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  timerWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  taskCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AEAEB2',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  taskCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  taskCardEmpty: {
    fontSize: 14,
    color: '#AEAEB2',
    fontStyle: 'italic',
  },
  flowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
});
