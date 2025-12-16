import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { X, TrendingUp, Clock, Calendar, Zap, Award, Target, Flame } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
            {/* Today Section */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {t('today') || 'Today'}
            </Text>
            <View style={styles.grid}>
              {/* Daily Count */}
              <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(244, 208, 63, 0.15)' }]}>
                  <Calendar size={20} color="#F4D03F" />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{todayStats.count}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t('todaySessions') || 'Sessions'}
                </Text>
              </View>

              {/* Total Minutes Today */}
              <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
                  <Clock size={20} color="#4ECDC4" />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatHours(todayStats.totalMinutes)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t('todayMinutes') || 'Focus Time'}
                </Text>
              </View>
            </View>

            {/* Streaks Section */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
              {t('streaks') || 'Streaks'}
            </Text>
            <View style={styles.grid}>
              {/* Current Streak */}
              <LinearGradient
                colors={['rgba(255, 107, 107, 0.2)', 'rgba(255, 107, 107, 0.05)']}
                style={styles.streakCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 107, 107, 0.2)' }]}>
                  <Flame size={20} color="#FF6B6B" />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.streak.current}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t('currentStreak') || 'Current'}
                </Text>
                <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>
                  {stats.streak.current === 1 ? (t('day') || 'day') : (t('days') || 'days')}
                </Text>
              </LinearGradient>

              {/* Max Streak */}
              <LinearGradient
                colors={['rgba(244, 208, 63, 0.2)', 'rgba(244, 208, 63, 0.05)']}
                style={styles.streakCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(244, 208, 63, 0.2)' }]}>
                  <Award size={20} color="#F4D03F" />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.streak.max}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t('maxStreak') || 'Best'}
                </Text>
                <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>
                  {stats.streak.max === 1 ? (t('day') || 'day') : (t('days') || 'days')}
                </Text>
              </LinearGradient>
            </View>

            {/* All Time Section */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
              {t('allTime') || 'All Time'}
            </Text>
            <View style={styles.allTimeContainer}>
              {/* Total Sessions All Time */}
              <LinearGradient
                colors={['rgba(107, 76, 154, 0.3)', 'rgba(45, 27, 78, 0.2)']}
                style={styles.allTimeCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.allTimeRow}>
                  <View style={[styles.iconCircleLarge, { backgroundColor: 'rgba(107, 76, 154, 0.3)' }]}>
                    <Target size={28} color="#9B6FD4" />
                  </View>
                  <View style={styles.allTimeInfo}>
                    <Text style={[styles.allTimeValue, { color: colors.text }]}>
                      {stats.totalSessions}
                    </Text>
                    <Text style={[styles.allTimeLabel, { color: colors.textSecondary }]}>
                      {t('totalSessionsAllTime') || 'Total Sessions'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Total Focus Time All Time */}
              <LinearGradient
                colors={['rgba(78, 205, 196, 0.2)', 'rgba(78, 205, 196, 0.05)']}
                style={styles.allTimeCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.allTimeRow}>
                  <View style={[styles.iconCircleLarge, { backgroundColor: 'rgba(78, 205, 196, 0.2)' }]}>
                    <Clock size={28} color="#4ECDC4" />
                  </View>
                  <View style={styles.allTimeInfo}>
                    <Text style={[styles.allTimeValue, { color: colors.text }]}>
                      {formatHours(totalMinutesAllTime)}
                    </Text>
                    <Text style={[styles.allTimeLabel, { color: colors.textSecondary }]}>
                      {t('totalFocusTime') || 'Total Focus Time'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Best Hour */}
              <LinearGradient
                colors={['rgba(255, 193, 7, 0.2)', 'rgba(255, 193, 7, 0.05)']}
                style={styles.allTimeCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.allTimeRow}>
                  <View style={[styles.iconCircleLarge, { backgroundColor: 'rgba(255, 193, 7, 0.2)' }]}>
                    <TrendingUp size={28} color="#FFC107" />
                  </View>
                  <View style={styles.allTimeInfo}>
                    <Text style={[styles.allTimeValue, { color: colors.text }]}>
                      {maxHour >= 0 ? `${maxHour.toString().padStart(2, '0')}:00` : '--:--'}
                    </Text>
                    <Text style={[styles.allTimeLabel, { color: colors.textSecondary }]}>
                      {t('bestHour') || 'Most Productive Hour'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
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
    maxHeight: '85%',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
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
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  streakCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircleLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  streakUnit: {
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  allTimeContainer: {
    gap: 10,
  },
  allTimeCard: {
    padding: 16,
    borderRadius: 16,
  },
  allTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allTimeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  allTimeValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  allTimeLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
