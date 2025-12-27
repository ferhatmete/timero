import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { X, Check, Minus, Plus, Clock, Volume2 } from 'lucide-react-native';
import { NextBreakType, AlarmSound } from '../hooks/useStats';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  autoStart: boolean;
  onToggleAutoStart: () => void;
  nextBreakType: NextBreakType;
  onChangeNextBreakType: (type: NextBreakType) => void;
  // Duration settings
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  onChangeWorkDuration: (minutes: number) => void;
  onChangeShortBreakDuration: (minutes: number) => void;
  onChangeLongBreakDuration: (minutes: number) => void;
  // Sound settings
  alarmSound: AlarmSound;
  alarmVibrate: boolean;
  onChangeAlarmSound: (sound: AlarmSound) => void;
  onChangeAlarmVibrate: (vibrate: boolean) => void;
}

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
];

const DURATION_LIMITS = {
  work: { min: 5, max: 60 },
  shortBreak: { min: 1, max: 15 },
  longBreak: { min: 5, max: 30 },
};

const ALARM_SOUNDS: { key: AlarmSound; labelKey: string }[] = [
  { key: 'default', labelKey: 'soundDefault' },
  { key: 'bell', labelKey: 'soundBell' },
  { key: 'chime', labelKey: 'soundChime' },
  { key: 'digital', labelKey: 'soundDigital' },
  { key: 'none', labelKey: 'soundNone' },
];

interface DurationPickerProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  colors: any;
  unit: string;
}

const DurationPicker: React.FC<DurationPickerProps> = ({ label, value, min, max, onChange, colors, unit }) => {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };
  
  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <View style={styles.durationRow}>
      <Text style={[styles.durationLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.durationControls}>
        <TouchableOpacity 
          onPress={decrease} 
          style={[styles.durationButton, { backgroundColor: colors.accent + '20' }]}
          disabled={value <= min}
        >
          <Minus size={18} color={value <= min ? colors.textSecondary : colors.accent} />
        </TouchableOpacity>
        <Text style={[styles.durationValue, { color: colors.text }]}>
          {value} {unit}
        </Text>
        <TouchableOpacity 
          onPress={increase} 
          style={[styles.durationButton, { backgroundColor: colors.accent + '20' }]}
          disabled={value >= max}
        >
          <Plus size={18} color={value >= max ? colors.textSecondary : colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  visible, 
  onClose, 
  autoStart, 
  onToggleAutoStart,
  nextBreakType,
  onChangeNextBreakType,
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  onChangeWorkDuration,
  onChangeShortBreakDuration,
  onChangeLongBreakDuration,
  alarmSound,
  alarmVibrate,
  onChangeAlarmSound,
  onChangeAlarmVibrate,
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
          
          <ScrollView contentContainerStyle={styles.contentList} showsVerticalScrollIndicator={false}>
            {/* Duration Settings Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[styles.sectionTitleWithIcon, { color: colors.textSecondary }]}>
                  {t('durationSettings') || 'Duration Settings'}
                </Text>
              </View>
              
              <DurationPicker
                label={t('focusDuration') || 'Focus Duration'}
                value={workDuration}
                min={DURATION_LIMITS.work.min}
                max={DURATION_LIMITS.work.max}
                onChange={onChangeWorkDuration}
                colors={colors}
                unit={t('minutes') || 'min'}
              />
              
              <DurationPicker
                label={t('shortBreakDuration') || 'Short Break'}
                value={shortBreakDuration}
                min={DURATION_LIMITS.shortBreak.min}
                max={DURATION_LIMITS.shortBreak.max}
                onChange={onChangeShortBreakDuration}
                colors={colors}
                unit={t('minutes') || 'min'}
              />
              
              <DurationPicker
                label={t('longBreakDuration') || 'Long Break'}
                value={longBreakDuration}
                min={DURATION_LIMITS.longBreak.min}
                max={DURATION_LIMITS.longBreak.max}
                onChange={onChangeLongBreakDuration}
                colors={colors}
                unit={t('minutes') || 'min'}
              />
            </View>

            {/* Sound Settings Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Volume2 size={14} color={colors.textSecondary} />
                <Text style={[styles.sectionTitleWithIcon, { color: colors.textSecondary }]}>
                  {t('soundSettings') || 'Sound Settings'}
                </Text>
              </View>

              {/* Alarm Sound Picker */}
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('alarmSound') || 'Alarm Sound'}
              </Text>
              <View style={styles.soundOptions}>
                {ALARM_SOUNDS.map((sound) => {
                  const isSelected = alarmSound === sound.key;
                  return (
                    <TouchableOpacity
                      key={sound.key}
                      style={[
                        styles.soundOption,
                        { backgroundColor: isSelected ? colors.accent + '30' : 'rgba(255,255,255,0.05)' },
                        isSelected && { borderColor: colors.accent, borderWidth: 1 }
                      ]}
                      onPress={() => onChangeAlarmSound(sound.key)}
                    >
                      <Text style={[
                        styles.soundOptionText,
                        { color: isSelected ? colors.accent : colors.text }
                      ]}>
                        {t(sound.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Vibration Toggle */}
              <View style={[styles.settingItem, { borderBottomColor: colors.textSecondary }]}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t('vibration') || 'Vibration'}
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: colors.accent }}
                  thumbColor={alarmVibrate ? "#ffffff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={onChangeAlarmVibrate}
                  value={alarmVibrate}
                />
              </View>
            </View>

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
                      <Text style={[styles.radioLabel, { color: colors.text }]}>
                        {`${t('shortBreak') || 'Short Break'} (${shortBreakDuration} ${t('minutes') || 'min'})`}
                      </Text>
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
                      <Text style={[styles.radioLabel, { color: colors.text }]}>
                        {`${t('longBreak') || 'Long Break'} (${longBreakDuration} ${t('minutes') || 'min'})`}
                      </Text>
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
    maxHeight: '85%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitleWithIcon: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  settingLabel: {
    fontSize: 15,
    marginBottom: 10,
  },
  soundOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  soundOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  soundOptionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  durationLabel: {
    fontSize: 15,
    flex: 1,
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 55,
    textAlign: 'center',
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
