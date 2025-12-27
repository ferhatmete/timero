import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { X, Plus, Check, Trash2, Target, Play } from 'lucide-react-native';
import { Task } from '../hooks/useTasks';

interface TasksModalProps {
  visible: boolean;
  onClose: () => void;
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (title: string, estimatedPomodoros: number) => Promise<Task>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onSetActiveTask: (taskId: string | null) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<void>;
}

export const TasksModal: React.FC<TasksModalProps> = ({
  visible,
  onClose,
  tasks,
  activeTaskId,
  onAddTask,
  onDeleteTask,
  onSetActiveTask,
  onCompleteTask,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await onAddTask(newTaskTitle.trim(), newTaskPomodoros);
    setNewTaskTitle('');
    setNewTaskPomodoros(1);
    setShowAddForm(false);
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      t('deleteTask') || 'Delete Task',
      t('deleteTaskConfirm') || 'Are you sure you want to delete this task?',
      [
        { text: t('cancel') || 'Cancel', style: 'cancel' },
        { text: t('delete') || 'Delete', style: 'destructive', onPress: () => onDeleteTask(task.id) },
      ]
    );
  };

  const incompleteTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('tasks') || 'Tasks'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.contentList} showsVerticalScrollIndicator={false}>
            {/* Add Task Button */}
            {!showAddForm ? (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.accent + '20' }]}
                onPress={() => setShowAddForm(true)}
              >
                <Plus size={20} color={colors.accent} />
                <Text style={[styles.addButtonText, { color: colors.accent }]}>
                  {t('addTask') || 'Add Task'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.addForm, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.textSecondary }]}
                  placeholder={t('taskTitle') || 'Task title...'}
                  placeholderTextColor={colors.textSecondary}
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  autoFocus
                />
                <View style={styles.pomodoroSelector}>
                  <Text style={[styles.pomodoroLabel, { color: colors.textSecondary }]}>
                    {t('estimatedPomodoros') || 'Pomodoros'}:
                  </Text>
                  <View style={styles.pomodoroControls}>
                    <TouchableOpacity
                      style={[styles.pomodoroButton, { backgroundColor: colors.accent + '20' }]}
                      onPress={() => setNewTaskPomodoros(Math.max(1, newTaskPomodoros - 1))}
                    >
                      <Text style={[styles.pomodoroButtonText, { color: colors.accent }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.pomodoroValue, { color: colors.text }]}>{newTaskPomodoros}</Text>
                    <TouchableOpacity
                      style={[styles.pomodoroButton, { backgroundColor: colors.accent + '20' }]}
                      onPress={() => setNewTaskPomodoros(newTaskPomodoros + 1)}
                    >
                      <Text style={[styles.pomodoroButtonText, { color: colors.accent }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.cancelButton]}
                    onPress={() => { setShowAddForm(false); setNewTaskTitle(''); }}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                      {t('cancel') || 'Cancel'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.accent }]}
                    onPress={handleAddTask}
                  >
                    <Text style={styles.saveButtonText}>{t('save') || 'Save'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Active Tasks */}
            {incompleteTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  {t('activeTasks') || 'Active Tasks'}
                </Text>
                {incompleteTasks.map((task) => (
                  <View
                    key={task.id}
                    style={[
                      styles.taskItem,
                      { backgroundColor: 'rgba(255,255,255,0.05)' },
                      activeTaskId === task.id && { borderColor: colors.accent, borderWidth: 2 }
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.taskContent}
                      onPress={() => onSetActiveTask(activeTaskId === task.id ? null : task.id)}
                    >
                      <View style={styles.taskInfo}>
                        <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
                        <View style={styles.taskProgress}>
                          <Target size={14} color={colors.textSecondary} />
                          <Text style={[styles.taskProgressText, { color: colors.textSecondary }]}>
                            {task.completedPomodoros}/{task.estimatedPomodoros}
                          </Text>
                        </View>
                      </View>
                      {activeTaskId === task.id && (
                        <View style={[styles.activeIndicator, { backgroundColor: colors.accent }]}>
                          <Play size={12} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                    <View style={styles.taskActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onCompleteTask(task.id)}
                      >
                        <Check size={18} color="#4CAF50" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteTask(task)}
                      >
                        <Trash2 size={18} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  {t('completedTasks') || 'Completed'}
                </Text>
                {completedTasks.map((task) => (
                  <View
                    key={task.id}
                    style={[styles.taskItem, { backgroundColor: 'rgba(255,255,255,0.03)', opacity: 0.7 }]}
                  >
                    <View style={styles.taskContent}>
                      <View style={styles.taskInfo}>
                        <Text style={[styles.taskTitle, { color: colors.textSecondary, textDecorationLine: 'line-through' }]}>
                          {task.title}
                        </Text>
                        <View style={styles.taskProgress}>
                          <Check size={14} color="#4CAF50" />
                          <Text style={[styles.taskProgressText, { color: colors.textSecondary }]}>
                            {task.completedPomodoros}/{task.estimatedPomodoros}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteTask(task)}
                    >
                      <Trash2 size={18} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Target size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {t('noTasks') || 'No tasks yet. Add your first task!'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  contentList: {
    paddingBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addForm: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  pomodoroSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pomodoroLabel: {
    fontSize: 14,
  },
  pomodoroControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pomodoroButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pomodoroButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  pomodoroValue: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskProgressText: {
    fontSize: 12,
  },
  activeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
});
