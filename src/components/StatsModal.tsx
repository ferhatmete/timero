import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { X, TrendingUp, Clock, Calendar, Award, Target, Flame } from 'lucide-react-native';
import { StatsData } from '../hooks/useStats';

interface StatsModalProps {
  visible: boolean;
  onClose: () => void;
  stats: StatsData;
}

export const StatsModal: React.FC<StatsModalProps> = ({ visible, onClose, stats }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const todayKey = new Date().toISOString().split('T')[0];
  const todayStats = stats.daily[todayKey] || { count: 0, totalMinutes: 0 };

  // Calculate most productive hour
  let maxHour = -1;
  let maxCount = 0;
  Object.entries(stats.hourly).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxHour = parseInt(hour);
    }
  });

  // Calculate total minutes all time
  const totalMinutesAllTime = Object.values(stats.daily).reduce(
    (acc, day) => acc + day.totalMinutes, 0
  );

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    let sessions = 0;
    let minutes = 0;
    let daysWithSessions = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const key = date.toISOString().split('T')[0];
      const dayStats = stats.daily[key];
      if (dayStats) {
        sessions += dayStats.count;
        minutes += dayStats.totalMinutes;
        if (dayStats.count > 0) daysWithSessions++;
      }
    }
    
    return { sessions, minutes, daysWithSessions };
  };

  // Calculate monthly stats
  const getMonthlyStats = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    let sessions = 0;
    let minutes = 0;
    
    Object.entries(stats.daily).forEach(([dateStr, dayStats]) => {
      const date = new Date(dateStr);
      if (date.getFullYear() === year && date.getMonth() === month) {
        sessions += dayStats.count;
        minutes += dayStats.totalMinutes;
      }
    });
    
    return { sessions, minutes };
  };

  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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
              {t('statistics') || 'Statistics'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.contentList} showsVerticalScrollIndicator={false}>
            {/* Today & Streak Row - Compact */}
            <View style={styles.compactRow}>
              {/* Today Sessions */}
              <View style={[styles.compactCard, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <Calendar size={16} color="#F4D03F" />
                <Text style={[styles.compactValue, { color: colors.text }]}>{todayStats.count}</Text>
                <Text style={[styles.compactLabel, { color: colors.textSecondary }]}>
                  {t('today') || 'Today'}
                </Text>
              </View>

              {/* Today Time */}
              <View style={[styles.compactCard, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <Clock size={16} color="#4ECDC4" />
                <Text style={[styles.compactValue, { color: colors.text }]}>
                  {formatHours(todayStats.totalMinutes)}
                </Text>
                <Text style={[styles.compactLabel, { color: colors.textSecondary }]}>
                  {t('todayMinutes') || 'Focus'}
                </Text>
              </View>

              {/* Current Streak */}
              <View style={[styles.compactCard, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
                <Flame size={16} color="#FF6B6B" />
                <Text style={[styles.compactValue, { color: colors.text }]}>{stats.streak.current}</Text>
                <Text style={[styles.compactLabel, { color: colors.textSecondary }]}>
                  {t('currentStreak') || 'Streak'}
                </Text>
              </View>

              {/* Max Streak */}
              <View style={[styles.compactCard, { backgroundColor: 'rgba(244, 208, 63, 0.1)' }]}>
                <Award size={16} color="#F4D03F" />
                <Text style={[styles.compactValue, { color: colors.text }]}>{stats.streak.max}</Text>
                <Text style={[styles.compactLabel, { color: colors.textSecondary }]}>
                  {t('maxStreak') || 'Best'}
                </Text>
              </View>
            </View>

            {/* Weekly Stats */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
              {t('thisWeek') || 'This Week'}
            </Text>
            <View style={styles.reportCard}>
              <View style={styles.reportRow}>
                <View style={styles.reportItem}>
                  <Target size={18} color="#9B6FD4" />
                  <View style={styles.reportText}>
                    <Text style={[styles.reportValue, { color: colors.text }]}>{weeklyStats.sessions}</Text>
                    <Text style={[styles.reportLabel, { color: colors.textSecondary }]}>
                      {t('todaySessions') || 'Sessions'}
                    </Text>
                  </View>
                </View>
                <View style={styles.reportItem}>
                  <Clock size={18} color="#4ECDC4" />
                  <View style={styles.reportText}>
                    <Text style={[styles.reportValue, { color: colors.text }]}>{formatHours(weeklyStats.minutes)}</Text>
                    <Text style={[styles.reportLabel, { color: colors.textSecondary }]}>
                      {t('totalFocusTime') || 'Focus Time'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Monthly Stats */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
              {t('thisMonth') || 'This Month'}
            </Text>
            <View style={styles.reportCard}>
              <View style={styles.reportRow}>
                <View style={styles.reportItem}>
                  <Target size={18} color="#9B6FD4" />
                  <View style={styles.reportText}>
                    <Text style={[styles.reportValue, { color: colors.text }]}>{monthlyStats.sessions}</Text>
                    <Text style={[styles.reportLabel, { color: colors.textSecondary }]}>
                      {t('todaySessions') || 'Sessions'}
                    </Text>
                  </View>
                </View>
                <View style={styles.reportItem}>
                  <Clock size={18} color="#4ECDC4" />
                  <View style={styles.reportText}>
                    <Text style={[styles.reportValue, { color: colors.text }]}>{formatHours(monthlyStats.minutes)}</Text>
                    <Text style={[styles.reportLabel, { color: colors.textSecondary }]}>
                      {t('totalFocusTime') || 'Focus Time'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* All Time Stats - Compact */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
              {t('allTime') || 'All Time'}
            </Text>
            <View style={styles.reportCard}>
              <View style={styles.reportRow}>
                <View style={styles.reportItem}>
                  <Target size={18} color="#9B6FD4" />
                  <View style={styles.reportText}>
                    <Text style={[styles.reportValue, { color: colors.text }]}>{stats.totalSessions}</Text>
                    <Text style={[styles.reportLabel, { color: colors.textSecondary }]}>
                      {t('totalSessionsAllTime') || 'Sessions'}
                    </Text>
                  </View>
                </View>
                <View style={styles.reportItem}>
                  <Clock size={18} color="#4ECDC4" />
                  <View style={styles.reportText}>
                    <Text style={[styles.reportValue, { color: colors.text }]}>{formatHours(totalMinutesAllTime)}</Text>
                    <Text style={[styles.reportLabel, { color: colors.textSecondary }]}>
                      {t('totalFocusTime') || 'Focus Time'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.reportRow, { marginTop: 12 }]}>
                <View style={styles.reportItem}>
                  <TrendingUp size={18} color="#FFC107" />
                  <View style={styles.reportText}>
                    <Text style={[styles.reportValue, { color: colors.text }]}>
                      {maxHour >= 0 ? `${maxHour.toString().padStart(2, '0')}:00` : '--:--'}
                    </Text>
                    <Text style={[styles.reportLabel, { color: colors.textSecondary }]}>
                      {t('bestHour') || 'Best Hour'}
                    </Text>
                  </View>
                </View>
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  contentList: {
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  // Compact 4-column row
  compactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  compactCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  compactValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  compactLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  // Report card styles
  reportCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 14,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportText: {
    marginLeft: 10,
  },
  reportValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  reportLabel: {
    fontSize: 11,
  },
});
