import React from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  gradientColors?: string[];
}

// Modern Brain Icon - Cognitive Focus
export const BrainIcon: React.FC<IconProps> = ({ size = 32, color = '#F4D03F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4.5C10.5 4.5 9 5.5 9 7C9 7 7 7 7 9C7 10.5 8 11 8 11C8 11 7 12 7 13.5C7 15 8.5 16 10 16C10 16 10 17.5 12 17.5C14 17.5 14 16 14 16C15.5 16 17 15 17 13.5C17 12 16 11 16 11C16 11 17 10.5 17 9C17 7 15 7 15 7C15 5.5 13.5 4.5 12 4.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 7V17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M9 9.5H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M9.5 13H14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M12 17.5V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// Flame Icon - Energy/Focus
export const FlameIcon: React.FC<IconProps> = ({ size = 32, color = '#F4D03F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#FF6B6B" />
        <Stop offset="100%" stopColor="#F4D03F" />
      </LinearGradient>
    </Defs>
    <Path
      d="M12 22C16.4183 22 20 18.4183 20 14C20 10 17 7.5 16 6C16 9 14 10 14 10C14 10 15 7 13 3C11.5 5.5 11 7 10 8C8.5 9.5 8 10 8 12C8 12 6 11 6 9C4.5 10.5 4 13 4 14C4 18.4183 7.58172 22 12 22Z"
      fill="url(#flameGrad)"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sparkle/Star Icon - Achievement
export const SparkleIcon: React.FC<IconProps> = ({ size = 32, color = '#F4D03F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="19" cy="5" r="1.5" fill={color} opacity="0.6" />
    <Circle cx="5" cy="18" r="1" fill={color} opacity="0.4" />
  </Svg>
);

// Minimal Focus Ring - Clean & Modern
export const FocusRingIcon: React.FC<IconProps> = ({ size = 32, color = '#F4D03F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" opacity="0.6" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// Zen Circle - Meditation style
export const ZenCircleIcon: React.FC<IconProps> = ({ size = 32, color = '#F4D03F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 4"
      opacity="0.5"
    />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// Lightning Bolt - Power/Energy
export const BoltIcon: React.FC<IconProps> = ({ size = 32, color = '#F4D03F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L4 14H11L10 22L20 9H13L14 2H13Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Coffee Cup Icon - Break time
export const CoffeeIcon: React.FC<IconProps> = ({ size = 32, color = '#4ECDC4' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 8H18C19.1046 8 20 8.89543 20 10V11C20 12.1046 19.1046 13 18 13H17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M5 8H17V15C17 17.2091 15.2091 19 13 19H9C6.79086 19 5 17.2091 5 15V8Z"
      stroke={color}
      strokeWidth="1.5"
      fill={color}
      fillOpacity="0.2"
    />
    <Path d="M8 5V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M11 5V2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M14 5V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// Palm Tree Icon - Long Break / Vacation
export const PalmIcon: React.FC<IconProps> = ({ size = 32, color = '#2ECC71' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21V10"
      stroke="#8B4513"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M12 10C12 10 8 6 4 7C4 7 8 9 12 10Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 10C12 10 16 6 20 7C20 7 16 9 12 10Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 10C12 10 12 4 12 3C12 3 14 7 12 10Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 10C12 10 8 4 6 4C6 4 10 7 12 10Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      opacity="0.8"
    />
    <Path
      d="M12 10C12 10 16 4 18 4C18 4 14 7 12 10Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      opacity="0.8"
    />
  </Svg>
);

// Lotus Flower - Meditation/Calm
export const LotusIcon: React.FC<IconProps> = ({ size = 32, color = '#E91E63' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20C12 20 8 16 8 12C8 8 12 6 12 6C12 6 16 8 16 12C16 16 12 20 12 20Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 6C12 6 6 6 4 10C4 10 8 10 12 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M12 6C12 6 18 6 20 10C20 10 16 10 12 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

