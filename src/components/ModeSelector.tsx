import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { TimerMode } from '../hooks/useTimer';
import { useTranslation } from 'react-i18next';
import { Settings, BarChart2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  onSettingsPress: () => void;
  onStatsPress: () => void;
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
  onStatsPress 
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

      <View style={styles.iconGroup}>
        <TouchableOpacity 
          onPress={() => handlePress(onStatsPress)}
          activeOpacity={0.7}
          style={[styles.iconButton, { backgroundColor: colors.cardBackground }]}
        >
          <BarChart2 color={colors.text} size={20} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handlePress(onSettingsPress)}
          activeOpacity={0.7}
          style={[styles.iconButton, { backgroundColor: colors.cardBackground }]}
        >
          <Settings color={colors.text} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  modesRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
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
  iconGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
