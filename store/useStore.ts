import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Priority = 'low' | 'medium' | 'high';
export type TimerPhase = 'focus' | 'short_break' | 'long_break';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  focusMinutes: number; // total minutes focused on this task
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
  sessionsCompleted: number;
  tasksCompleted: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  unlockedAt?: number;
}

interface AppState {
  // Timer state
  timerPhase: TimerPhase;
  timerSeconds: number;
  isRunning: boolean;
  focusDuration: number;     // in seconds
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  currentSessionCount: number;
  totalSessionsToday: number;

  // Task state
  tasks: Task[];
  activeTaskId: string | null;

  // Flow meter (0–100)
  flowLevel: number;
  lastInteractionAt: number;

  // Focus mode
  focusModeActive: boolean;

  // Stats
  dailyStats: DailyStat[];
  streak: number;
  lastActiveDate: string | null;
  badges: Badge[];

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  setTimerPhase: (phase: TimerPhase) => void;

  addTask: (title: string, priority: Priority) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  setActiveTask: (id: string | null) => void;

  updateFlowLevel: (delta: number) => void;
  recordInteraction: () => void;
  decayFlow: () => void;

  toggleFocusMode: () => void;

  recordSession: () => void;
  updateStreak: () => void;
}

const TODAY = () => new Date().toISOString().split('T')[0];

const BADGES: Badge[] = [
  { id: 'first_session', name: 'First Step', emoji: '🌱' },
  { id: 'streak_3',     name: '3-Day Streak', emoji: '🔥' },
  { id: 'streak_7',     name: 'Week Warrior', emoji: '⚡' },
  { id: 'sessions_10',  name: 'Focused Ten', emoji: '🎯' },
  { id: 'tasks_20',     name: 'Task Master', emoji: '🏆' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Timer defaults
      timerPhase: 'focus',
      timerSeconds: 25 * 60,
      isRunning: false,
      focusDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      sessionsBeforeLongBreak: 4,
      currentSessionCount: 0,
      totalSessionsToday: 0,

      // Tasks
      tasks: [],
      activeTaskId: null,

      // Flow
      flowLevel: 0,
      lastInteractionAt: Date.now(),

      // Focus mode
      focusModeActive: false,

      // Stats
      dailyStats: [],
      streak: 0,
      lastActiveDate: null,
      badges: BADGES,

      // ── Timer Actions ──────────────────────────────────
      startTimer: () => set({ isRunning: true }),
      pauseTimer: () => set({ isRunning: false }),

      resetTimer: () => {
        const { timerPhase, focusDuration, shortBreakDuration, longBreakDuration } = get();
        const secs =
          timerPhase === 'focus'       ? focusDuration :
          timerPhase === 'short_break' ? shortBreakDuration :
                                         longBreakDuration;
        set({ isRunning: false, timerSeconds: secs });
      },

      tickTimer: () => {
        const {
          timerSeconds, timerPhase, currentSessionCount,
          sessionsBeforeLongBreak, focusDuration, shortBreakDuration,
          longBreakDuration, recordSession,
        } = get();

        if (timerSeconds <= 1) {
          // Session ended
          if (timerPhase === 'focus') {
            recordSession();
            const nextCount = currentSessionCount + 1;
            const nextPhase: TimerPhase =
              nextCount % sessionsBeforeLongBreak === 0 ? 'long_break' : 'short_break';
            set({
              timerPhase: nextPhase,
              timerSeconds: nextPhase === 'long_break' ? longBreakDuration : shortBreakDuration,
              currentSessionCount: nextCount,
              isRunning: false,
            });
          } else {
            set({
              timerPhase: 'focus',
              timerSeconds: focusDuration,
              isRunning: false,
            });
          }
        } else {
          set({ timerSeconds: timerSeconds - 1 });
        }
      },

      setTimerPhase: (phase) => {
        const { focusDuration, shortBreakDuration, longBreakDuration } = get();
        const secs =
          phase === 'focus'       ? focusDuration :
          phase === 'short_break' ? shortBreakDuration :
                                    longBreakDuration;
        set({ timerPhase: phase, timerSeconds: secs, isRunning: false });
      },

      // ── Task Actions ───────────────────────────────────
      addTask: (title, priority) => {
        const newTask: Task = {
          id: Date.now().toString(),
          title,
          priority,
          completed: false,
          createdAt: Date.now(),
          focusMinutes: 0,
        };
        set((s) => ({ tasks: [...s.tasks, newTask] }));
      },

      deleteTask: (id) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
          activeTaskId: s.activeTaskId === id ? null : s.activeTaskId,
        })),

      completeTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      setActiveTask: (id) => set({ activeTaskId: id }),

      // ── Flow Actions ───────────────────────────────────
      updateFlowLevel: (delta) =>
        set((s) => ({ flowLevel: Math.max(0, Math.min(100, s.flowLevel + delta)) })),

      recordInteraction: () =>
        set((s) => ({
          lastInteractionAt: Date.now(),
          flowLevel: Math.min(100, s.flowLevel + 2),
        })),

      decayFlow: () =>
        set((s) => {
          const idleMs = Date.now() - s.lastInteractionAt;
          const decayAmount = idleMs > 60000 ? 3 : 0.5;
          return { flowLevel: Math.max(0, s.flowLevel - decayAmount) };
        }),

      // ── Focus Mode ─────────────────────────────────────
      toggleFocusMode: () =>
        set((s) => ({ focusModeActive: !s.focusModeActive })),

      // ── Stats & Streak ────────────────────────────────
      recordSession: () => {
        const today = TODAY();
        set((s) => {
          const existing = s.dailyStats.find((d) => d.date === today);
          const updatedStats = existing
            ? s.dailyStats.map((d) =>
                d.date === today
                  ? { ...d, focusMinutes: d.focusMinutes + 25, sessionsCompleted: d.sessionsCompleted + 1 }
                  : d
              )
            : [
                ...s.dailyStats,
                { date: today, focusMinutes: 25, sessionsCompleted: 1, tasksCompleted: 0 },
              ];

          // Update badges
          const totalSessions = updatedStats.reduce((sum, d) => sum + d.sessionsCompleted, 0);
          const badges = s.badges.map((b) => {
            if (b.unlockedAt) return b;
            if (b.id === 'first_session' && totalSessions >= 1)
              return { ...b, unlockedAt: Date.now() };
            if (b.id === 'sessions_10' && totalSessions >= 10)
              return { ...b, unlockedAt: Date.now() };
            return b;
          });

          return {
            dailyStats: updatedStats,
            totalSessionsToday: s.totalSessionsToday + 1,
            badges,
          };
        });
        get().updateStreak();
      },

      updateStreak: () => {
        const today = TODAY();
        set((s) => {
          if (s.lastActiveDate === today) return s;

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().split('T')[0];

          const newStreak = s.lastActiveDate === yStr ? s.streak + 1 : 1;

          const badges = s.badges.map((b) => {
            if (b.unlockedAt) return b;
            if (b.id === 'streak_3' && newStreak >= 3)
              return { ...b, unlockedAt: Date.now() };
            if (b.id === 'streak_7' && newStreak >= 7)
              return { ...b, unlockedAt: Date.now() };
            return b;
          });

          return { streak: newStreak, lastActiveDate: today, badges };
        });
      },
    }),
    {
      name: 'focus-flow-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        tasks: s.tasks,
        dailyStats: s.dailyStats,
        streak: s.streak,
        lastActiveDate: s.lastActiveDate,
        badges: s.badges,
        focusDuration: s.focusDuration,
        shortBreakDuration: s.shortBreakDuration,
        longBreakDuration: s.longBreakDuration,
      }),
    }
  )
);
