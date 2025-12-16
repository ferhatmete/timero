import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { useStats } from './useStats';
import { useTranslation } from 'react-i18next';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_MODES: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const useTimer = () => {
  useKeepAwake();
  const { t } = useTranslation();
  
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.work);
  const [isActive, setIsActive] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  
  const { stats, prefs, toggleAutoStart, recordSession } = useStats();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const expectedTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle app state changes for accurate timing
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isActive && startTimeRef.current) {
        // Recalculate time left based on actual elapsed time
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const remaining = Math.max(0, expectedTimeRef.current - elapsed);
        setTimeLeft(remaining);
      }
    });

    return () => subscription.remove();
  }, [isActive]);

  const playAlarm = useCallback(async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Multiple haptic pulses for attention
      for (let i = 0; i < 4; i++) {
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, i * 400);
      }
    } catch (error) {
      console.error('Error playing alarm:', error);
    }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        expectedTimeRef.current = timeLeft;
      }
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = useCallback(async () => {
    setIsActive(false);
    startTimeRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    await playAlarm();

    if (mode === 'work') {
      const newCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newCompleted);
      
      await recordSession(TIMER_MODES.work / 60);

      if (newCompleted % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(TIMER_MODES.longBreak);
        Alert.alert(
          t('congratulations') || "Congratulations!",
          t('pomodoroSetComplete') || "You completed a Pomodoro set! 🎉"
        );
      } else {
        setMode('shortBreak');
        setTimeLeft(TIMER_MODES.shortBreak);
      }
    } else {
      setMode('work');
      setTimeLeft(TIMER_MODES.work);
    }

    if (prefs.autoStart) {
      setTimeout(() => {
        setIsActive(true);
        startTimeRef.current = Date.now();
        expectedTimeRef.current = TIMER_MODES[mode === 'work' ? 'shortBreak' : 'work'];
      }, 1000);
    }
  }, [mode, pomodorosCompleted, prefs.autoStart, playAlarm, recordSession, t]);

  const toggleTimer = useCallback(() => {
    if (!isActive) {
      startTimeRef.current = Date.now();
      expectedTimeRef.current = timeLeft;
    } else {
      startTimeRef.current = null;
    }
    setIsActive(!isActive);
  }, [isActive, timeLeft]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    startTimeRef.current = null;
    setTimeLeft(TIMER_MODES[mode]);
  }, [mode]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    startTimeRef.current = null;
    setTimeLeft(TIMER_MODES[newMode]);
  }, []);

  const skipBreak = useCallback(() => {
    if (mode === 'shortBreak' || mode === 'longBreak') {
      setIsActive(false);
      startTimeRef.current = null;
      setMode('work');
      setTimeLeft(TIMER_MODES.work);
    }
  }, [mode]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    isActive,
    mode,
    pomodorosCompleted,
    toggleTimer,
    resetTimer,
    switchMode,
    skipBreak,
    formatTime,
    progress: timeLeft / TIMER_MODES[mode],
    stats,
    prefs,
    toggleAutoStart
  };
};
