import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop, G } from 'react-native-svg';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

interface SplashProps {
  onFinish: () => void;
}

const AnimatedLogo = () => {
  const ringProgress = useSharedValue(0);
  const playScale = useSharedValue(0);
  const playOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate ring drawing
    ringProgress.value = withTiming(265, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });

    // Animate play button
    playOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    playScale.value = withDelay(
      600,
      withSequence(
        withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 150 })
      )
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    strokeDashoffset: 353 - ringProgress.value,
  }));

  const playStyle = useAnimatedStyle(() => ({
    opacity: playOpacity.value,
    transform: [{ scale: playScale.value }],
  }));

  return (
    <View style={styles.logoContainer}>
      <Svg width={180} height={180} viewBox="0 0 200 200">
        <Defs>
          <SvgGradient id="splashRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F4D03F" />
            <Stop offset="100%" stopColor="#FF6B6B" />
          </SvgGradient>
        </Defs>

        {/* Background Ring */}
        <Circle
          cx="100"
          cy="100"
          r="75"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeOpacity="0.1"
        />

        {/* Animated Progress Ring */}
        <Animated.View style={ringStyle}>
          <Svg width={180} height={180} viewBox="0 0 200 200" style={StyleSheet.absoluteFill}>
            <Circle
              cx="100"
              cy="100"
              r="75"
              fill="none"
              stroke="url(#splashRingGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="353"
              strokeDashoffset="88"
              transform="rotate(-90 100 100)"
            />
          </Svg>
        </Animated.View>

        {/* Inner Circle */}
        <Circle cx="100" cy="100" r="55" fill="rgba(11, 13, 23, 0.5)" />
      </Svg>

      {/* Animated Play Button */}
      <Animated.View style={[styles.playContainer, playStyle]}>
        <Svg width={50} height={50} viewBox="0 0 50 50">
          <Path d="M10 5 L45 25 L10 45 Z" fill="#F4D03F" />
        </Svg>
      </Animated.View>
    </View>
  );
};

export const AnimatedSplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  const containerOpacity = useSharedValue(1);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);

  const handleAnimationComplete = useCallback(() => {
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    // Title animation
    titleOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(800, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));

    // Subtitle animation
    subtitleOpacity.value = withDelay(1100, withTiming(1, { duration: 400 }));

    // Fade out entire splash
    containerOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(handleAnimationComplete)();
        }
      })
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={['#0B0D17', '#1B1E3F', '#2D1B4E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Decorative Stars */}
      <View style={styles.starsContainer}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <AnimatedLogo />

        <Animated.Text style={[styles.title, titleStyle]}>Timero</Animated.Text>

        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Focus. Breathe. Achieve.
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playContainer: {
    position: 'absolute',
    marginLeft: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: 8,
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#A9A9A9',
    letterSpacing: 2,
    marginTop: 12,
  },
});

