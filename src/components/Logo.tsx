import React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

interface LogoProps {
  size?: number;
  showBackground?: boolean;
}

export const TimeroLogo: React.FC<LogoProps> = ({ size = 200, showBackground = true }) => {
  const scale = size / 200;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        {/* Background Gradient */}
        <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#6B4C9A" />
          <Stop offset="50%" stopColor="#2D1B4E" />
          <Stop offset="100%" stopColor="#0B0D17" />
        </LinearGradient>
        
        {/* Timer Ring Gradient */}
        <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F4D03F" />
          <Stop offset="100%" stopColor="#FF6B6B" />
        </LinearGradient>
        
        {/* Inner Glow */}
        <LinearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      {showBackground && (
        <Circle cx="100" cy="100" r="95" fill="url(#bgGradient)" />
      )}
      
      {/* Outer Ring (Timer Progress) */}
      <Circle
        cx="100"
        cy="100"
        r="75"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeOpacity="0.15"
      />
      
      {/* Active Progress Arc (75% filled) */}
      <Circle
        cx="100"
        cy="100"
        r="75"
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="353"
        strokeDashoffset="88"
        transform="rotate(-90 100 100)"
      />
      
      {/* Inner Circle */}
      <Circle
        cx="100"
        cy="100"
        r="55"
        fill="#0B0D17"
        fillOpacity="0.6"
      />
      
      {/* Timer Icon - Play Triangle */}
      <G transform="translate(85, 75)">
        <Path
          d="M0 0 L40 25 L0 50 Z"
          fill="#F4D03F"
          opacity="0.95"
        />
      </G>
      
      {/* Small decorative dots (stars) */}
      <Circle cx="45" cy="45" r="3" fill="#FFFFFF" opacity="0.6" />
      <Circle cx="155" cy="60" r="2" fill="#FFFFFF" opacity="0.4" />
      <Circle cx="50" cy="150" r="2" fill="#FFFFFF" opacity="0.5" />
      <Circle cx="160" cy="145" r="2.5" fill="#FFFFFF" opacity="0.3" />
    </Svg>
  );
};

// Minimal version for notifications/small icons
export const TimeroLogoMinimal: React.FC<LogoProps> = ({ size = 48 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <LinearGradient id="miniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F4D03F" />
          <Stop offset="100%" stopColor="#FF6B6B" />
        </LinearGradient>
      </Defs>
      
      {/* Timer Ring */}
      <Circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke="url(#miniGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="94"
        strokeDashoffset="24"
        transform="rotate(-90 24 24)"
      />
      
      {/* Play Icon */}
      <Path
        d="M19 14 L34 24 L19 34 Z"
        fill="#F4D03F"
      />
    </Svg>
  );
};

