import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import * as Notifications from 'expo-notifications';
import { useStats } from './useStats';
import { useTranslation } from 'react-i18next';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useTimer = () => {
  useKeepAwake();
  const { t } = useTranslation();

  const { stats, prefs, toggleAutoStart, setNextBreakType, setWorkDuration, setShortBreakDuration, setLongBreakDuration, setAlarmSound, setAlarmVibrate, recordSession } = useStats();

  // Get duration in seconds based on mode and user preferences
  const getModeDuration = useCallback((mode: TimerMode): number => {
    switch (mode) {
      case 'work':
        return prefs.workDuration * 60;
      case 'shortBreak':
        return prefs.shortBreakDuration * 60;
      case 'longBreak':
        return prefs.longBreakDuration * 60;
      default:
        return 25 * 60;
    }
  }, [prefs.workDuration, prefs.shortBreakDuration, prefs.longBreakDuration]);

  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(prefs.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const expectedTimeRef = useRef<number>(0);

  // Update timeLeft when prefs change and timer is not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(getModeDuration(mode));
    }
  }, [prefs.workDuration, prefs.shortBreakDuration, prefs.longBreakDuration, mode, isActive, getModeDuration]);

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

      await recordSession(prefs.workDuration);

      // Use user preference for break type
      const breakType = prefs.nextBreakType || 'short';

      if (newCompleted % 4 === 0) {
        // After 4 pomodoros, always take a long break
        nextMode = 'longBreak';
        setMode('longBreak');
        setTimeLeft(getModeDuration('longBreak'));
        Alert.alert(
          t('congratulations') || "Congratulations!",
          t('pomodoroSetComplete') || "You completed a Pomodoro set! 🎉"
        );
      } else {
        // Use user's preferred break type
        nextMode = breakType === 'long' ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setTimeLeft(getModeDuration(nextMode));
      }
    } else {
      nextMode = 'work';
      setMode('work');
      setTimeLeft(getModeDuration('work'));
    }

    if (prefs.autoStart) {
      setTimeout(() => {
        setIsActive(true);
        startTimeRef.current = Date.now();
        expectedTimeRef.current = getModeDuration(nextMode);
      }, 1000);
    }
  }, [mode, pomodorosCompleted, prefs.autoStart, prefs.nextBreakType, prefs.workDuration, playAlarm, recordSession, t, getModeDuration]);

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
    setTimeLeft(getModeDuration(mode));
  }, [mode, getModeDuration]);

  const fullReset = useCallback(() => {
    setIsActive(false);
    startTimeRef.current = null;
    setMode('work');
    setTimeLeft(getModeDuration('work'));
    setPomodorosCompleted(0);
  }, [getModeDuration]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    startTimeRef.current = null;
    setTimeLeft(getModeDuration(newMode));
  }, [getModeDuration]);

  const skipBreak = useCallback(() => {
    if (mode === 'shortBreak' || mode === 'longBreak') {
      setIsActive(false);
      startTimeRef.current = null;
      setMode('work');
      setTimeLeft(getModeDuration('work'));
    }
  }, [mode, getModeDuration]);

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
    progress: timeLeft / getModeDuration(mode),
    stats,
    prefs,
    toggleAutoStart,
    setNextBreakType,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setAlarmSound,
    setAlarmVibrate
  };
};
