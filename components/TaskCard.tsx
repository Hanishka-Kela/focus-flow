/**
 * TaskCard.tsx
 * Swipe-to-delete task card with priority indicator.
 */
import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import { Task, Priority } from '../store/useStore';

interface Props {
  task: Task;
  isActive: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; label: string }> = {
  high:   { color: '#FF6B6B', bg: '#FFF0F0', label: 'High' },
  medium: { color: '#FFB703', bg: '#FFF8E6', label: 'Med'  },
  low:    { color: '#06D6A0', bg: '#E8FBF6', label: 'Low'  },
};

const SWIPE_THRESHOLD = -80;

const TaskCard: React.FC<Props> = ({ task, isActive, onComplete, onDelete, onSetActive }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;
  const pConfig = PRIORITY_CONFIG[task.priority];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && g.dx < 0,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) {
          translateX.setValue(g.dx);
          deleteOpacity.setValue(Math.min(1, Math.abs(g.dx) / 80));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_THRESHOLD) {
          Alert.alert('Delete Task', `Delete "${task.title}"?`, [
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => onDelete(task.id),
            },
            {
              text: 'Cancel',
              onPress: () => {
                Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
                Animated.timing(deleteOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
              },
            },
          ]);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          Animated.timing(deleteOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.wrapper}>
      {/* Delete background */}
      <Animated.View style={[styles.deleteBg, { opacity: deleteOpacity }]}>
        <Text style={styles.deleteText}>🗑</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          isActive && styles.cardActive,
          task.completed && styles.cardCompleted,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Priority dot */}
        <View style={[styles.priorityDot, { backgroundColor: pConfig.color }]} />

        {/* Content */}
        <TouchableOpacity
          style={styles.content}
          onPress={() => onSetActive(task.id)}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={styles.meta}>
            <View style={[styles.priorityBadge, { backgroundColor: pConfig.bg }]}>
              <Text style={[styles.priorityText, { color: pConfig.color }]}>
                {pConfig.label}
              </Text>
            </View>
            {task.focusMinutes > 0 && (
              <Text style={styles.focusTime}>⏱ {task.focusMinutes}m</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Complete toggle */}
        <TouchableOpacity
          style={[styles.checkBtn, task.completed && styles.checkBtnDone]}
          onPress={() => onComplete(task.id)}
        >
          <Text style={styles.checkIcon}>{task.completed ? '✓' : ''}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  deleteBg: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 22,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardActive: {
    borderWidth: 2,
    borderColor: '#7B8FF7',
    shadowOpacity: 0.15,
  },
  cardCompleted: {
    opacity: 0.55,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: 0.1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#AEAEB2',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  focusTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  checkBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBtnDone: {
    backgroundColor: '#7B8FF7',
    borderColor: '#7B8FF7',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
