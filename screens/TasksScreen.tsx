/**
 * TasksScreen.tsx
 * Add, view, complete and swipe-delete tasks sorted by priority.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import TaskCard from '../components/TaskCard';
import { useStore, Priority, Task } from '../store/useStore';

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const sortTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });

const TasksScreen: React.FC = () => {
  const {
    tasks, activeTaskId,
    addTask, deleteTask, completeTask, setActiveTask,
  } = useStore();

  const [newTitle, setNewTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    addTask(trimmed, selectedPriority);
    setNewTitle('');
    Keyboard.dismiss();
  };

  const sorted = sortTasks(tasks);
  const filtered =
    filter === 'active' ? sorted.filter((t) => !t.completed) :
    filter === 'done'   ? sorted.filter((t) =>  t.completed) :
                          sorted;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {tasks.filter((t) => !t.completed).length}
            </Text>
          </View>
        </View>

        {/* Add task input */}
        <View style={styles.addCard}>
          <TextInput
            style={styles.input}
            placeholder="What are you working on?"
            placeholderTextColor="#AEAEB2"
            value={newTitle}
            onChangeText={setNewTitle}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />

          {/* Priority chips */}
          <View style={styles.chips}>
            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.chip,
                  selectedPriority === p && styles.chipSelected,
                  selectedPriority === p && {
                    backgroundColor:
                      p === 'high' ? '#FF6B6B' :
                      p === 'medium' ? '#FFB703' : '#06D6A0',
                  },
                ]}
                onPress={() => setSelectedPriority(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedPriority === p && styles.chipTextSelected,
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.addBtn, !newTitle.trim() && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={!newTitle.trim()}
            >
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {(['all', 'active', 'done'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task list */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>
                {filter === 'done' ? '🏆' : '✨'}
              </Text>
              <Text style={styles.emptyText}>
                {filter === 'done'
                  ? 'No completed tasks yet'
                  : 'No tasks — add one above!'}
              </Text>
            </View>
          ) : (
            filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isActive={task.id === activeTaskId}
                onComplete={completeTask}
                onDelete={deleteTask}
                onSetActive={(id) =>
                  setActiveTask(activeTaskId === id ? null : id)
                }
              />
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8FF' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: '#7B8FF7',
    borderRadius: 99,
    minWidth: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  addCard: {
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#8B9EC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 16,
    gap: 12,
  },
  input: {
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: 4,
    letterSpacing: 0.1,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: '#F0F0F5',
  },
  chipSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  addBtn: {
    marginLeft: 'auto',
    backgroundColor: '#7B8FF7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
  },
  addBtnDisabled: {
    backgroundColor: '#E5E5EA',
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: '#F0F0F5',
  },
  filterBtnActive: {
    backgroundColor: '#1C1C1E',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 4,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyEmoji: { fontSize: 48 },
  emptyText: {
    fontSize: 16,
    color: '#AEAEB2',
    fontWeight: '500',
  },
});
