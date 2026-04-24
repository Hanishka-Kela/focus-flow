/**
 * StatsScreen.tsx
 * Weekly focus bar chart, streak counter, badges, and today's stats.
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useStore } from '../store/useStore';
import { getLast7Days, shortDay, minsToDisplay } from '../utils/timerUtils';

const StatsScreen: React.FC = () => {
  const { dailyStats, streak, tasks, badges, totalSessionsToday } = useStore();

  const last7 = getLast7Days();
  const today = new Date().toISOString().split('T')[0];
  const todayStat = dailyStats.find((d) => d.date === today);

  // Build chart data
  const chartData = last7.map((date) => {
    const stat = dailyStats.find((d) => d.date === date);
    return { date, label: shortDay(date), mins: stat?.focusMinutes ?? 0 };
  });
  const maxMins = Math.max(...chartData.map((d) => d.mins), 1);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const unlockedBadges = badges.filter((b) => b.unlockedAt);
  const lockedBadges   = badges.filter((b) => !b.unlockedAt);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Stats</Text>

        {/* Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <Text style={styles.streakSub}>Keep going!</Text>
            </View>
          </View>
          <Text style={styles.streakCount}>{streak}</Text>
          <Text style={styles.streakDays}>days</Text>
        </View>

        {/* Today summary */}
        <View style={styles.row}>
          <View style={[styles.summaryCard, { backgroundColor: '#EEF0FF' }]}>
            <Text style={styles.summaryEmoji}>⏱</Text>
            <Text style={[styles.summaryValue, { color: '#7B8FF7' }]}>
              {minsToDisplay(todayStat?.focusMinutes ?? 0)}
            </Text>
            <Text style={styles.summaryLabel}>Today's Focus</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#E8FBF6' }]}>
            <Text style={styles.summaryEmoji}>🎯</Text>
            <Text style={[styles.summaryValue, { color: '#06D6A0' }]}>
              {totalSessionsToday}
            </Text>
            <Text style={styles.summaryLabel}>Sessions</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#FFF8E6' }]}>
            <Text style={styles.summaryEmoji}>✅</Text>
            <Text style={[styles.summaryValue, { color: '#FFB703' }]}>
              {completedCount}
            </Text>
            <Text style={styles.summaryLabel}>Tasks Done</Text>
          </View>
        </View>

        {/* Weekly bar chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly Focus</Text>
          <View style={styles.chart}>
            {chartData.map((d, i) => {
              const pct = d.mins / maxMins;
              const isToday = d.date === today;
              return (
                <View key={i} style={styles.barCol}>
                  {d.mins > 0 && (
                    <Text style={styles.barLabel}>
                      {d.mins >= 60
                        ? `${Math.floor(d.mins / 60)}h`
                        : `${d.mins}m`}
                    </Text>
                  )}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${Math.max(pct * 100, d.mins > 0 ? 8 : 0)}%`,
                          backgroundColor: isToday ? '#7B8FF7' : '#D1D5FF',
                          opacity: isToday ? 1 : 0.7,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.dayLabel, isToday && { color: '#7B8FF7', fontWeight: '700' }]}>
                    {d.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Task completion */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Tasks Completed</Text>
            <Text style={styles.progressRatio}>
              {completedCount}/{totalCount}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' },
              ]}
            />
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesCard}>
          <Text style={styles.sectionTitle}>Badges</Text>

          {unlockedBadges.length > 0 && (
            <>
              <Text style={styles.badgeSubtitle}>Unlocked</Text>
              <View style={styles.badgesRow}>
                {unlockedBadges.map((b) => (
                  <View key={b.id} style={[styles.badge, styles.badgeUnlocked]}>
                    <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                    <Text style={styles.badgeName}>{b.name}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {lockedBadges.length > 0 && (
            <>
              <Text style={styles.badgeSubtitle}>Locked</Text>
              <View style={styles.badgesRow}>
                {lockedBadges.map((b) => (
                  <View key={b.id} style={[styles.badge, styles.badgeLocked]}>
                    <Text style={[styles.badgeEmoji, { opacity: 0.3 }]}>{b.emoji}</Text>
                    <Text style={[styles.badgeName, { color: '#AEAEB2' }]}>{b.name}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8FF' },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  streakLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakEmoji: { fontSize: 36 },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  streakSub: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  streakCount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FF6B6B',
    letterSpacing: -2,
  },
  streakDays: {
    fontSize: 14,
    color: '#8E8E93',
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  summaryEmoji: { fontSize: 22 },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barLabel: {
    fontSize: 9,
    color: '#AEAEB2',
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#F5F5FA',
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressRatio: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7B8FF7',
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#F0F0F5',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7B8FF7',
    borderRadius: 99,
  },
  badgesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  badgeSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#AEAEB2',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  badge: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    width: 80,
  },
  badgeUnlocked: {
    backgroundColor: '#EEF0FF',
  },
  badgeLocked: {
    backgroundColor: '#F5F5FA',
  },
  badgeEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#48484A',
    textAlign: 'center',
    lineHeight: 13,
  },
});
