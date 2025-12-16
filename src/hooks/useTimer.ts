import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import * as Notifications from 'expo-notifications';
import { useStats } from './useStats';
import { useTranslation } from 'react-i18next';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_MODES: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useTimer = () => {
  useKeepAwake();
  const { t } = useTranslation();
  
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.work);
  const [isActive, setIsActive] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  
  const { stats, prefs, toggleAutoStart, setNextBreakType, recordSession } = useStats();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const expectedTimeRef = useRef<number>(0);

  // Request notification permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission not granted');
      }
    })();

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

  const sendNotification = useCallback(async (title: string, body: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, []);

  const playAlarm = useCallback(async (completedMode: TimerMode) => {
    try {
      // Haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Multiple haptic pulses for attention
      for (let i = 0; i < 4; i++) {
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, i * 400);
      }

      // Send notification based on completed mode (notification includes sound)
      if (completedMode === 'work') {
        await sendNotification(
          t('notificationWorkComplete') || 'Focus session completed! 🎯',
          t('notificationWorkCompleteBody') || 'Great job! Time for a break.'
        );
      } else if (completedMode === 'shortBreak') {
        await sendNotification(
          t('notificationShortBreakComplete') || 'Short break finished! ☕',
          t('notificationShortBreakCompleteBody') || 'Ready to focus again?'
        );
      } else if (completedMode === 'longBreak') {
        await sendNotification(
          t('notificationLongBreakComplete') || 'Long break finished! 🌴',
          t('notificationLongBreakCompleteBody') || 'Refreshed and ready to work!'
        );
      }
    } catch (error) {
      console.error('Error playing alarm:', error);
    }
  }, [t, sendNotification]);

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
    
    // Store current mode before changing
    const completedMode = mode;
    
    // Play alarm (sound + haptic + notification) for completed mode
    await playAlarm(completedMode);

    let nextMode: TimerMode = 'work';

    if (mode === 'work') {
      const newCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newCompleted);
      
      await recordSession(TIMER_MODES.work / 60);

      // Use user preference for break type
      const breakType = prefs.nextBreakType || 'short';
      
      if (newCompleted % 4 === 0) {
        // After 4 pomodoros, always take a long break
        nextMode = 'longBreak';
        setMode('longBreak');
        setTimeLeft(TIMER_MODES.longBreak);
        Alert.alert(
          t('congratulations') || "Congratulations!",
          t('pomodoroSetComplete') || "You completed a Pomodoro set! 🎉"
        );
      } else {
        // Use user's preferred break type
        nextMode = breakType === 'long' ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setTimeLeft(TIMER_MODES[nextMode]);
      }
    } else {
      nextMode = 'work';
      setMode('work');
      setTimeLeft(TIMER_MODES.work);
    }

    if (prefs.autoStart) {
      setTimeout(() => {
        setIsActive(true);
        startTimeRef.current = Date.now();
        expectedTimeRef.current = TIMER_MODES[nextMode];
      }, 1000);
    }
  }, [mode, pomodorosCompleted, prefs.autoStart, prefs.nextBreakType, playAlarm, recordSession, t]);

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

  const fullReset = useCallback(() => {
    setIsActive(false);
    startTimeRef.current = null;
    setMode('work');
    setTimeLeft(TIMER_MODES.work);
    setPomodorosCompleted(0);
  }, []);

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
    fullReset,
    switchMode,
    skipBreak,
    formatTime,
    progress: timeLeft / TIMER_MODES[mode],
    stats,
    prefs,
    toggleAutoStart,
    setNextBreakType
  };
};
