import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { X, Check, Circle } from 'lucide-react-native';
import { NextBreakType } from '../hooks/useStats';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  autoStart: boolean;
  onToggleAutoStart: () => void;
  nextBreakType: NextBreakType;
  onChangeNextBreakType: (type: NextBreakType) => void;
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

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  visible, 
  onClose, 
  autoStart, 
  onToggleAutoStart,
  nextBreakType,
  onChangeNextBreakType 
}) => {
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
              
              {/* Auto-start setting */}
              <View style={[styles.settingItem, { borderBottomColor: colors.textSecondary }]}>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: colors.text }]}>{t('autoStart') || 'Auto-start next cycle'}</Text>
                  <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{t('autoStartDesc')}</Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: colors.accent }}
                  thumbColor={autoStart ? "#ffffff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={onToggleAutoStart}
                  value={autoStart}
                />
              </View>

              {/* Next break type setting */}
              <View style={[styles.settingItemColumn, { borderBottomColor: colors.textSecondary }]}>
                <Text style={[styles.settingText, { color: colors.text }]}>{t('nextBreakType') || 'Break type after focus'}</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary, marginBottom: 12 }]}>{t('nextBreakTypeDesc')}</Text>
                
                {/* Short Break Option */}
                <TouchableOpacity 
                  style={[styles.radioOption, nextBreakType === 'short' && { backgroundColor: colors.accent + '20' }]}
                  onPress={() => onChangeNextBreakType('short')}
                >
                  <View style={styles.radioLeft}>
                    <View style={[styles.radioCircle, { borderColor: colors.accent }]}>
                      {nextBreakType === 'short' && <View style={[styles.radioFill, { backgroundColor: colors.accent }]} />}
                    </View>
                    <View style={styles.radioTextContainer}>
                      <Text style={[styles.radioLabel, { color: colors.text }]}>{t('shortBreakOption') || 'Short Break (5 min)'}</Text>
                      <Text style={[styles.radioDesc, { color: colors.textSecondary }]}>{t('shortBreakDesc')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Long Break Option */}
                <TouchableOpacity 
                  style={[styles.radioOption, nextBreakType === 'long' && { backgroundColor: colors.accent + '20' }]}
                  onPress={() => onChangeNextBreakType('long')}
                >
                  <View style={styles.radioLeft}>
                    <View style={[styles.radioCircle, { borderColor: colors.accent }]}>
                      {nextBreakType === 'long' && <View style={[styles.radioFill, { backgroundColor: colors.accent }]} />}
                    </View>
                    <View style={styles.radioTextContainer}>
                      <Text style={[styles.radioLabel, { color: colors.text }]}>{t('longBreakOption') || 'Long Break (15 min)'}</Text>
                      <Text style={[styles.radioDesc, { color: colors.textSecondary }]}>{t('longBreakDesc')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
  settingItemColumn: {
    flexDirection: 'column',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingText: {
    fontSize: 16,
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  radioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioTextContainer: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  radioDesc: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
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
