import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

const SpaceBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#0B0D17', '#1B1E3F', '#2D1B4E']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Circle cx={width * 0.8} cy={height * 0.15} r={40} fill="#F4D03F" opacity={0.8} />
      <Circle cx={width * 0.2} cy={height * 0.6} r={10} fill="#FFFFFF" opacity={0.4} />
      <Circle cx={width * 0.7} cy={height * 0.8} r={4} fill="#FFFFFF" opacity={0.6} />
      <Circle cx={width * 0.5} cy={height * 0.4} r={2} fill="#FFFFFF" opacity={0.8} />
      <Circle cx={width * 0.9} cy={height * 0.3} r={3} fill="#FFFFFF" opacity={0.5} />
      <Circle cx={width * 0.1} cy={height * 0.2} r={2} fill="#FFFFFF" opacity={0.7} />
      <Circle cx={width * 0.3} cy={height * 0.9} r={60} fill="#6B4C9A" opacity={0.3} />
    </Svg>
  </View>
  );
};

const SeaBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#001F3F', '#000080', '#1E90FF']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Path
        d={`M0 ${height * 0.7} Q ${width * 0.5} ${height * 0.6} ${width} ${height * 0.7} V ${height} H 0 Z`}
        fill="#00CED1"
        opacity={0.3}
      />
      <Path
        d={`M0 ${height * 0.8} Q ${width * 0.5} ${height * 0.75} ${width} ${height * 0.8} V ${height} H 0 Z`}
        fill="#00CED1"
        opacity={0.5}
      />
      <Circle cx={width * 0.5} cy={height * 0.9} r={10} fill="rgba(255,255,255,0.2)" />
      <Circle cx={width * 0.6} cy={height * 0.85} r={5} fill="rgba(255,255,255,0.2)" />
    </Svg>
  </View>
  );
};

const CoastBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#87CEEB', '#FFF8DC', '#F4A460']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Circle cx={width * 0.9} cy={height * 0.1} r={50} fill="#FFD700" opacity={0.6} />
      <Path
        d={`M0 ${height * 0.6} Q ${width * 0.5} ${height * 0.55} ${width} ${height * 0.6} V ${height} H 0 Z`}
        fill="#20B2AA"
        opacity={0.4}
      />
      <Path
        d={`M0 ${height * 0.8} Q ${width * 0.5} ${height * 0.75} ${width} ${height * 0.8} V ${height} H 0 Z`}
        fill="#F4A460"
      />
    </Svg>
  </View>
  );
};

const ForestBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#1B4D3E', '#228B22', '#ADFF2F']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Path
        d={`M0 ${height} L ${width * 0.3} ${height * 0.6} L ${width * 0.6} ${height} Z`}
        fill="#006400"
        opacity={0.6}
      />
      <Path
        d={`M${width * 0.4} ${height} L ${width * 0.7} ${height * 0.5} L ${width} ${height} Z`}
        fill="#006400"
        opacity={0.5}
      />
       <Path
        d={`M${width * -0.2} ${height} L ${width * 0.2} ${height * 0.4} L ${width * 0.6} ${height} Z`}
        fill="#004d00"
        opacity={0.4}
      />
    </Svg>
  </View>
  );
};

const DesertBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#87CEEB', '#FFD700', '#D2691E']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
       <Circle cx={width * 0.8} cy={height * 0.1} r={40} fill="#FF4500" opacity={0.8} />
      <Path
        d={`M0 ${height * 0.7} Q ${width * 0.5} ${height * 0.6} ${width} ${height * 0.7} V ${height} H 0 Z`}
        fill="#D2691E"
        opacity={0.7}
      />
      <Path
        d={`M0 ${height * 0.85} Q ${width * 0.5} ${height * 0.8} ${width} ${height * 0.85} V ${height} H 0 Z`}
        fill="#8B4513"
      />
    </Svg>
  </View>
  );
};

const CityBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#1C1C1C', '#2F4F4F', '#708090']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Rect x={width * 0.1} y={height * 0.6} width={width * 0.2} height={height * 0.4} fill="#000" opacity={0.5} />
      <Rect x={width * 0.4} y={height * 0.5} width={width * 0.25} height={height * 0.5} fill="#000" opacity={0.6} />
      <Rect x={width * 0.75} y={height * 0.55} width={width * 0.2} height={height * 0.45} fill="#000" opacity={0.5} />
      <Rect x={width * 0.15} y={height * 0.65} width={10} height={10} fill="#FFD700" opacity={0.8} />
      <Rect x={width * 0.2} y={height * 0.75} width={10} height={10} fill="#FFD700" opacity={0.6} />
      <Rect x={width * 0.5} y={height * 0.6} width={10} height={10} fill="#FFD700" opacity={0.7} />
    </Svg>
  </View>
  );
};

const SunsetBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#2C001E', '#8B0000', '#FF4500', '#FFD700']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
       <Circle cx={width * 0.5} cy={height * 0.6} r={80} fill="#FFD700" opacity={0.4} />
       <Path
        d={`M0 ${height * 0.8} L ${width} ${height * 0.8} L ${width} ${height} L 0 ${height} Z`}
        fill="#000"
        opacity={0.3}
       />
    </Svg>
  </View>
  );
};

const MountainBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#F5F5F5', '#778899', '#2F4F4F']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Path
        d={`M0 ${height} L ${width * 0.4} ${height * 0.4} L ${width * 0.8} ${height} Z`}
        fill="#708090"
        opacity={0.8}
      />
      <Path
        d={`M${width * 0.3} ${height} L ${width * 0.7} ${height * 0.3} L ${width * 1.2} ${height} Z`}
        fill="#2F4F4F"
        opacity={0.9}
      />
    </Svg>
  </View>
  );
};

const PolarBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#F0FFFF', '#B0E0E6', '#4682B4']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
     <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
      <Path
        d={`M0 ${height * 0.7} Q ${width * 0.5} ${height * 0.6} ${width} ${height * 0.7} V ${height} H 0 Z`}
        fill="#FFFFFF"
        opacity={0.6}
      />
      <Circle cx={width * 0.8} cy={height * 0.2} r={30} fill="#FFFFFF" opacity={0.8} />
    </Svg>
  </View>
  );
};

const NightBackground = () => {
  const { width, height } = useWindowDimensions();
  return (
  <View style={StyleSheet.absoluteFill}>
    <ExpoLinearGradient
      colors={['#000000', '#191970', '#483D8B']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
       <Circle cx={width * 0.8} cy={height * 0.15} r={30} fill="#FFFF00" opacity={0.9} />
       <Circle cx={width * 0.85} cy={height * 0.15} r={25} fill="#000" opacity={0.9} />
       <Circle cx={width * 0.1} cy={height * 0.1} r={2} fill="#FFF" />
       <Circle cx={width * 0.3} cy={height * 0.3} r={1.5} fill="#FFF" />
       <Circle cx={width * 0.5} cy={height * 0.2} r={2} fill="#FFF" />
       <Circle cx={width * 0.7} cy={height * 0.4} r={1} fill="#FFF" />
    </Svg>
  </View>
  );
};

export const Background = () => {
  const { theme } = useTheme();

  switch (theme) {
    case 'space': return <SpaceBackground />;
    case 'sea': return <SeaBackground />;
    case 'coast': return <CoastBackground />;
    case 'forest': return <ForestBackground />;
    case 'desert': return <DesertBackground />;
    case 'city': return <CityBackground />;
    case 'sunset': return <SunsetBackground />;
    case 'mountain': return <MountainBackground />;
    case 'polar': return <PolarBackground />;
    case 'night': return <NightBackground />;
    default: return <SpaceBackground />;
  }
};

