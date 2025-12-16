import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme, ThemeKey } from '../context/ThemeContext';
import { THEMES } from '../constants/themes';
import { Palette } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface ThemeSelectorProps {
  onClose?: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { theme, setTheme, colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Palette size={20} color={colors.text} />
        <Text style={[styles.title, { color: colors.text }]}>{t('selectTheme')}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
          const themeColors = THEMES[key];
          const isSelected = theme === key;

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.themeItem,
                isSelected && { borderColor: colors.accent, borderWidth: 2 },
              ]}
              onPress={() => setTheme(key)}
            >
              <View style={[styles.previewCircle, { backgroundColor: themeColors.primary }]}>
                <View style={[styles.previewInner, { backgroundColor: themeColors.accent }]} />
              </View>
              <Text style={[styles.themeName, { color: colors.text }]}>{t(`themes.${key}`)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 15,
    gap: 15,
  },
  themeItem: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 12,
  },
  previewCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  previewInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  themeName: {
    fontSize: 12,
  },
});

