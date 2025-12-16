import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeKey, THEMES, ThemeColors } from '../constants/themes';

export { ThemeKey } from '../constants/themes';

interface ThemeContextType {
  theme: ThemeKey;
  colors: ThemeColors;
  setTheme: (theme: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@timero_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeKey>('space');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && Object.keys(THEMES).includes(storedTheme)) {
        setThemeState(storedTheme as ThemeKey);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (newTheme: ThemeKey) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const value = {
    theme,
    colors: THEMES[theme],
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

