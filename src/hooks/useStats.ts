import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_STORAGE_KEY = '@timero_stats';
const PREFS_STORAGE_KEY = '@timero_prefs';
const PREFS_VERSION_KEY = '@timero_prefs_version';
const CURRENT_PREFS_VERSION = 3; // Increment for new duration fields

export interface DailyStats {
  date: string;
  count: number;
  totalMinutes: number;
}

export interface StatsData {
  daily: Record<string, DailyStats>;
  hourly: Record<number, number>; // hour (0-23) -> count
  streak: {
    current: number;
    max: number;
    lastDate: string | null;
  };
  totalSessions: number;
}

export type NextBreakType = 'short' | 'long';
export type AlarmSound = 'default' | 'bell' | 'chime' | 'digital' | 'none';

export interface UserPrefs {
  autoStart: boolean;
  nextBreakType: NextBreakType;
  // Customizable durations (in minutes)
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  // Sound settings
  alarmSound: AlarmSound;
  alarmVibrate: boolean;
}

const INITIAL_STATS: StatsData = {
  daily: {},
  hourly: {},
  streak: { current: 0, max: 0, lastDate: null },
  totalSessions: 0,
};

const INITIAL_PREFS: UserPrefs = {
  autoStart: true,
  nextBreakType: 'short',
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  alarmSound: 'default',
  alarmVibrate: true,
};

export const useStats = () => {
  const [stats, setStats] = useState<StatsData>(INITIAL_STATS);
  const [prefs, setPrefs] = useState<UserPrefs>(INITIAL_PREFS);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsStr, prefsStr, versionStr] = await Promise.all([
        AsyncStorage.getItem(STATS_STORAGE_KEY),
        AsyncStorage.getItem(PREFS_STORAGE_KEY),
        AsyncStorage.getItem(PREFS_VERSION_KEY),
      ]);

      if (statsStr) setStats(JSON.parse(statsStr));

      const savedVersion = versionStr ? parseInt(versionStr, 10) : 0;

      // If prefs version is outdated, reset to new defaults
      if (savedVersion < CURRENT_PREFS_VERSION) {
        setPrefs(INITIAL_PREFS);
        await AsyncStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(INITIAL_PREFS));
        await AsyncStorage.setItem(PREFS_VERSION_KEY, CURRENT_PREFS_VERSION.toString());
      } else if (prefsStr) {
        // Load saved prefs and merge with defaults for any new fields
        const loadedPrefs = JSON.parse(prefsStr);
        setPrefs({ ...INITIAL_PREFS, ...loadedPrefs });
      }
    } catch (error) {
      console.error('Failed to load stats/prefs:', error);
    }
  };

  const saveStats = async (newStats: StatsData) => {
    setStats(newStats);
    try {
      await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  };

  const savePrefs = async (newPrefs: UserPrefs) => {
    setPrefs(newPrefs);
    try {
      await AsyncStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Failed to save prefs:', error);
    }
  };

  const toggleAutoStart = async () => {
    const newPrefs = { ...prefs, autoStart: !prefs.autoStart };
    await savePrefs(newPrefs);
  };

  const setNextBreakType = async (type: NextBreakType) => {
    const newPrefs = { ...prefs, nextBreakType: type };
    await savePrefs(newPrefs);
  };

  const setWorkDuration = async (minutes: number) => {
    const newPrefs = { ...prefs, workDuration: minutes };
    await savePrefs(newPrefs);
  };

  const setShortBreakDuration = async (minutes: number) => {
    const newPrefs = { ...prefs, shortBreakDuration: minutes };
    await savePrefs(newPrefs);
  };

  const setLongBreakDuration = async (minutes: number) => {
    const newPrefs = { ...prefs, longBreakDuration: minutes };
    await savePrefs(newPrefs);
  };

  const setAlarmSound = async (sound: AlarmSound) => {
    const newPrefs = { ...prefs, alarmSound: sound };
    await savePrefs(newPrefs);
  };

  const setAlarmVibrate = async (vibrate: boolean) => {
    const newPrefs = { ...prefs, alarmVibrate: vibrate };
    await savePrefs(newPrefs);
  };

  const recordSession = async (durationMinutes: number) => {
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0];
    const hour = now.getHours();

    const newStats = { ...stats };

    // Update Daily
    if (!newStats.daily[todayKey]) {
      newStats.daily[todayKey] = { date: todayKey, count: 0, totalMinutes: 0 };
    }
    newStats.daily[todayKey].count += 1;
    newStats.daily[todayKey].totalMinutes += durationMinutes;

    // Update Hourly
    newStats.hourly[hour] = (newStats.hourly[hour] || 0) + 1;

    // Update Streak
    const lastDate = newStats.streak.lastDate;
    if (lastDate) {
      const last = new Date(lastDate);
      const diffTime = Math.abs(now.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split('T')[0];

      if (todayKey === lastDate) {
        // Same day, streak doesn't increase, but maintained
      } else if (lastDate === yesterdayKey) {
        newStats.streak.current += 1;
      } else {
        // Broken streak
        newStats.streak.current = 1;
      }
    } else {
      newStats.streak.current = 1;
    }

    newStats.streak.lastDate = todayKey;
    if (newStats.streak.current > newStats.streak.max) {
      newStats.streak.max = newStats.streak.current;
    }

    // Total
    newStats.totalSessions += 1;

    await saveStats(newStats);
  };

  return {
    stats,
    prefs,
    toggleAutoStart,
    setNextBreakType,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setAlarmSound,
    setAlarmVibrate,
    recordSession,
  };
};
