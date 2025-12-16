import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { TimerMode } from '../hooks/useTimer';
import { FlameIcon, CoffeeIcon, PalmIcon } from './icons/ModeIcons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerDisplayProps {
  time: string;
  progress: number;
  mode: TimerMode;
  pomodorosCompleted: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  time, 
  progress, 
  mode,
  pomodorosCompleted 
}) => {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  
  const size = Math.min(width, height) * 0.72;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(1);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - animatedProgress.value),
    };
  });

  const renderModeIcon = () => {
    const iconSize = 36;
    switch (mode) {
      case 'work':
        return <FlameIcon size={iconSize} color={colors.accent} />;
      case 'shortBreak':
        return <CoffeeIcon size={iconSize} color={colors.accent} />;
      case 'longBreak':
        return <PalmIcon size={iconSize} color={colors.accent} />;
    }
  };

  const renderPomodoroIndicators = () => {
    const indicators = [];
    const total = 4;
    const completed = pomodorosCompleted % 4;
    
    for (let i = 0; i < total; i++) {
      indicators.push(
        <View
          key={i}
          style={[
            styles.pomodoroIndicator,
            {
              backgroundColor: i < completed ? colors.accent : 'rgba(255,255,255,0.2)',
              shadowColor: i < completed ? colors.accent : 'transparent',
              shadowOpacity: i < completed ? 0.6 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 0 },
            }
          ]}
        />
      );
    }
    return indicators;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.timerWrapper, { width: size, height: size }]}>
        {/* Outer Glow */}
        <View style={[styles.glowOuter, { 
          width: size + 20, 
          height: size + 20,
          borderRadius: (size + 20) / 2,
          backgroundColor: colors.cardBackground,
        }]} />
        
        <Svg width={size} height={size} style={styles.svg}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.accent} />
              <Stop offset="100%" stopColor={colors.primary} />
            </LinearGradient>
          </Defs>
          
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.text}
            strokeWidth={strokeWidth}
            opacity={0.1}
            fill="none"
          />
          
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            fill="none"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            {renderModeIcon()}
          </View>
          <Text style={[styles.timeText, { 
            color: colors.text,
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }]}>
            {time}
          </Text>
          
          {/* Pomodoro Progress Indicators */}
          <View style={styles.pomodoroContainer}>
            {renderPomodoroIndicators()}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowOuter: {
    position: 'absolute',
  },
  svg: {
    position: 'absolute',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  timeText: {
    fontSize: 56,
    fontWeight: '200',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  pomodoroContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  pomodoroIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
