import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { X, Check } from 'lucide-react-native';
import { useStats } from '../hooks/useStats';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  // We can pass stats hook functions if needed, or use the hook inside if context allows.
  // Since useStats uses AsyncStorage and local state, using it here might create a separate instance state 
  // if not lifted. For simple prefs it's fine, but to sync with timer logic, 
  // we might want to pass the toggle function from parent or use a Context.
  // For this MVP, let's just use the hook here for prefs toggling, assuming AsyncStorage is the source of truth.
  // However, updating prefs here won't update the timer's copy if it loaded once. 
  // Better to pass prefs/toggle from App -> SettingsModal or use a Context. 
  // Refactoring to Context is safer but let's stick to props for simplicity first.
  autoStart: boolean;
  onToggleAutoStart: () => void;
}

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'sv', label: 'Svenska' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose, autoStart, onToggleAutoStart }) => {
  const { colors } = useTheme();
  const { i18n, t } = useTranslation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('settings') || 'Settings'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.contentList}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('preferences') || 'Preferences'}</Text>
              <View style={[styles.settingItem, { borderBottomColor: colors.textSecondary }]}>
                <Text style={[styles.settingText, { color: colors.text }]}>{t('autoStart') || 'Auto-start next cycle'}</Text>
                <Switch
                  trackColor={{ false: "#767577", true: colors.accent }}
                  thumbColor={autoStart ? colors.primary : "#f4f3f4"}
                  onValueChange={onToggleAutoStart}
                  value={autoStart}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('language') || 'Language'}</Text>
              {LANGUAGES.map((lang) => {
                const isSelected = i18n.language === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageItem,
                      { borderBottomColor: colors.textSecondary }
                    ]}
                    onPress={() => changeLanguage(lang.code)}
                  >
                    <Text style={[styles.languageText, { color: colors.text, fontWeight: isSelected ? 'bold' : 'normal' }]}>
                      {lang.label}
                    </Text>
                    {isSelected && <Check size={20} color={colors.accent} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  contentList: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingText: {
    fontSize: 16,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  languageText: {
    fontSize: 16,
  },
});
