import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { TimerMode } from '../hooks/useTimer';
import { Task } from '../hooks/useTasks';
import { useTranslation } from 'react-i18next';
import { Settings, BarChart2, ListTodo } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  onSettingsPress: () => void;
  onStatsPress: () => void;
  onTasksPress: () => void;
  activeTask?: Task | null;
}

const MODES: { key: TimerMode; labelKey: string }[] = [
  { key: 'work', labelKey: 'work' },
  { key: 'shortBreak', labelKey: 'shortBreak' },
  { key: 'longBreak', labelKey: 'longBreak' },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  currentMode, 
  onSelectMode, 
  onSettingsPress, 
  onStatsPress,
  onTasksPress,
  activeTask 
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handlePress = async (action: () => void) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    action();
  };

  return (
    <View style={styles.container}>
      <View style={styles.modesRow}>
        {MODES.map((mode) => {
          const isSelected = currentMode === mode.key;
          return (
            <TouchableOpacity
              key={mode.key}
              onPress={() => handlePress(() => onSelectMode(mode.key))}
              activeOpacity={0.7}
              style={[
                styles.modeButton,
                { 
                  backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                  borderColor: isSelected ? colors.accent : 'transparent',
                }
              ]}
            >
              <Text
                style={[
                  styles.modeText,
                  { 
                    color: colors.text, 
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
              >
                {t(mode.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2x2 Grid for action buttons */}
      <View style={styles.iconGrid}>
        <View style={styles.iconRow}>
          <TouchableOpacity 
            onPress={() => handlePress(onStatsPress)}
            activeOpacity={0.7}
            style={[styles.iconButton, { backgroundColor: colors.cardBackground }]}
          >
            <BarChart2 color={colors.text} size={18} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handlePress(onSettingsPress)}
            activeOpacity={0.7}
            style={[styles.iconButton, { backgroundColor: colors.cardBackground }]}
          >
            <Settings color={colors.text} size={18} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.iconRow, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity 
            onPress={() => handlePress(onTasksPress)}
            activeOpacity={0.7}
            style={[
              styles.iconButton, 
              { backgroundColor: colors.cardBackground },
              activeTask && { borderColor: colors.accent, borderWidth: 2 }
            ]}
          >
            <ListTodo color={activeTask ? colors.accent : colors.text} size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  modesRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  modeText: {
    fontSize: 13,
  },
  iconGrid: {
    gap: 4,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonWide: {
    flexDirection: 'row',
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  iconButtonText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
