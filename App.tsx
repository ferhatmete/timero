import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AnimatedSplashScreen } from './src/components/SplashScreen';
import { Background } from './src/components/backgrounds/Background';
import { TimerDisplay } from './src/components/TimerDisplay';
import { Controls } from './src/components/Controls';
import { ModeSelector } from './src/components/ModeSelector';
import { ThemeSelector } from './src/components/ThemeSelector';
import { SettingsModal } from './src/components/SettingsModal';
import { StatsModal } from './src/components/StatsModal';
import { useTimer } from './src/hooks/useTimer';
import './src/i18n';

// Prevent auto-hide of native splash
SplashScreen.preventAutoHideAsync().catch(() => {});

const MainScreen = () => {
  const { colors } = useTheme();
  const { 
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
    progress, 
    stats, 
    prefs, 
    toggleAutoStart,
    setNextBreakType
  } = useTimer();
  
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  const statusBarStyle = colors.background.startsWith('#0') || 
                         colors.background.startsWith('#1') || 
                         colors.background.startsWith('#2') 
                         ? 'light' : 'dark';

  return (
    <View style={styles.container}>
      <Background />
      <ExpoStatusBar style={statusBarStyle} />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <ModeSelector 
            currentMode={mode} 
            onSelectMode={switchMode} 
            onSettingsPress={() => setIsSettingsVisible(true)}
            onStatsPress={() => setIsStatsVisible(true)}
          />
          
          <View style={styles.timerContainer}>
            <TimerDisplay 
              time={formatTime(timeLeft)} 
              progress={progress} 
              mode={mode}
              pomodorosCompleted={pomodorosCompleted}
            />
          </View>

          <Controls 
            isActive={isActive} 
            mode={mode}
            onToggle={toggleTimer} 
            onReset={resetTimer}
            onFullReset={fullReset}
            onSkip={skipBreak}
          />
          
          <View style={styles.footer}>
            <ThemeSelector />
          </View>
        </View>
        
        <SettingsModal 
          visible={isSettingsVisible} 
          onClose={() => setIsSettingsVisible(false)}
          autoStart={prefs.autoStart}
          onToggleAutoStart={toggleAutoStart}
          nextBreakType={prefs.nextBreakType || 'short'}
          onChangeNextBreakType={setNextBreakType}
        />

        <StatsModal
          visible={isStatsVisible}
          onClose={() => setIsStatsVisible(false)}
          stats={stats}
        />
      </SafeAreaView>
    </View>
  );
};

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load any assets or data here
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
        // Hide native splash once our app is ready
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!isAppReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <MainScreen />
          {showSplash && <AnimatedSplashScreen onFinish={handleSplashFinish} />}
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  footer: {
    paddingBottom: 45,
    marginTop: 40,
  },
});
