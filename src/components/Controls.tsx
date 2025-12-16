import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';
import { TimerMode } from '../hooks/useTimer';

interface ControlsProps {
  isActive: boolean;
  mode: TimerMode;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  isActive, 
  mode,
  onToggle, 
  onReset,
  onSkip 
}) => {
  const { colors } = useTheme();

  const handlePress = async (action: () => void, feedbackType: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      if (feedbackType === 'light') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (feedbackType === 'medium') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (e) {
      // Haptics not available on this device
    }
    action();
  };

  const isBreak = mode === 'shortBreak' || mode === 'longBreak';

  return (
    <View style={styles.container}>
      {/* Reset Button */}
      <TouchableOpacity
        style={[styles.secondaryButton, { backgroundColor: colors.cardBackground }]}
        onPress={() => handlePress(onReset, 'light')}
        activeOpacity={0.7}
      >
        <RotateCcw size={22} color={colors.text} />
      </TouchableOpacity>

      {/* Main Play/Pause Button */}
      <TouchableOpacity
        style={[styles.mainButton, { backgroundColor: colors.accent }]}
        onPress={() => handlePress(onToggle, 'heavy')}
        activeOpacity={0.8}
      >
        {isActive ? (
          <Pause size={36} color={colors.background} fill={colors.background} />
        ) : (
          <Play size={36} color={colors.background} fill={colors.background} style={{ marginLeft: 4 }} />
        )}
      </TouchableOpacity>

      {/* Skip Button (only visible during breaks) */}
      <TouchableOpacity
        style={[
          styles.secondaryButton, 
          { 
            backgroundColor: isBreak ? colors.cardBackground : 'transparent',
            opacity: isBreak ? 1 : 0
          }
        ]}
        onPress={() => isBreak && handlePress(onSkip, 'light')}
        activeOpacity={0.7}
        disabled={!isBreak}
      >
        <SkipForward size={22} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 16,
    marginBottom: 6,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 12,
  },
});
