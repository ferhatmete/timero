export type ThemeKey = 
  | 'space'
  | 'sea'
  | 'coast'
  | 'forest'
  | 'desert'
  | 'city'
  | 'sunset'
  | 'mountain'
  | 'polar'
  | 'night';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textSecondary: string;
  accent: string;
  cardBackground: string;
}

export const THEMES: Record<ThemeKey, ThemeColors> = {
  space: {
    primary: '#6B4C9A',
    secondary: '#2D1B4E',
    background: '#0B0D17',
    text: '#FFFFFF',
    textSecondary: '#B8B8D1',
    accent: '#F4D03F',
    cardBackground: 'rgba(107, 76, 154, 0.3)',
  },
  sea: {
    primary: '#1E90FF',
    secondary: '#000080',
    background: '#001F3F',
    text: '#FFFFFF',
    textSecondary: '#87CEEB',
    accent: '#00CED1',
    cardBackground: 'rgba(30, 144, 255, 0.25)',
  },
  coast: {
    primary: '#2E8B8B',
    secondary: '#8B4513',
    background: '#E8DCC4',
    text: '#1A3A3A',
    textSecondary: '#3D6B6B',
    accent: '#FF6B35',
    cardBackground: 'rgba(46, 139, 139, 0.2)',
  },
  forest: {
    primary: '#228B22',
    secondary: '#006400',
    background: '#1B4D3E',
    text: '#E8F5E9',
    textSecondary: '#A5D6A7',
    accent: '#8BC34A',
    cardBackground: 'rgba(34, 139, 34, 0.3)',
  },
  desert: {
    primary: '#C2703E',
    secondary: '#8B4513',
    background: '#2C1810',
    text: '#FFF8E7',
    textSecondary: '#D4A574',
    accent: '#FF8C42',
    cardBackground: 'rgba(194, 112, 62, 0.3)',
  },
  city: {
    primary: '#5C6BC0',
    secondary: '#3949AB',
    background: '#121212',
    text: '#FAFAFA',
    textSecondary: '#B0BEC5',
    accent: '#00E676',
    cardBackground: 'rgba(92, 107, 192, 0.25)',
  },
  sunset: {
    primary: '#FF6B6B',
    secondary: '#C0392B',
    background: '#1A0A14',
    text: '#FFF5F0',
    textSecondary: '#FFB8A8',
    accent: '#FFD93D',
    cardBackground: 'rgba(255, 107, 107, 0.25)',
  },
  mountain: {
    primary: '#546E7A',
    secondary: '#37474F',
    background: '#1C2833',
    text: '#ECEFF1',
    textSecondary: '#90A4AE',
    accent: '#4FC3F7',
    cardBackground: 'rgba(84, 110, 122, 0.35)',
  },
  polar: {
    primary: '#4DD0E1',
    secondary: '#0097A7',
    background: '#E0F7FA',
    text: '#004D5A',
    textSecondary: '#00838F',
    accent: '#FF4081',
    cardBackground: 'rgba(77, 208, 225, 0.2)',
  },
  night: {
    primary: '#7C4DFF',
    secondary: '#651FFF',
    background: '#0D0D1A',
    text: '#E8E8FF',
    textSecondary: '#9FA8DA',
    accent: '#FFEB3B',
    cardBackground: 'rgba(124, 77, 255, 0.25)',
  },
};
