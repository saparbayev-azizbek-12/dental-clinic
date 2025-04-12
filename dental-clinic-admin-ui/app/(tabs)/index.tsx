import React from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

// Mock data for statistics
const STATS = {
  totalUsers: 245,
  doctors: 12,
  patients: 233,
  todayAppointments: 18,
  pendingDoctorApprovals: 3,
};

export default function AdminDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const handleQuickAccess = (route: string) => {
    router.push(route);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>Admin Boshqaruv Paneli</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>Tish shifoxonasi</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E6F7FF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statNumber}>{STATS.totalUsers}</Text>
            <FontAwesome name="users" size={20} color="#0A7EA4" style={styles.statHeaderIcon} />
          </View>
          <Text style={styles.statTitle}>Jami foydalanuvchilar</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF2E6' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statNumber}>{STATS.doctors}</Text>
            <FontAwesome name="user-md" size={20} color="#FFA64D" style={styles.statHeaderIcon} />
          </View>
          <Text style={styles.statTitle}>Shifokorlar</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E6FFE6' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statNumber}>{STATS.patients}</Text>
            <FontAwesome name="user" size={20} color="#4CAF50" style={styles.statHeaderIcon} />
          </View>
          <Text style={styles.statTitle}>Bemorlar</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F0E6FF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statNumber}>{STATS.todayAppointments}</Text>
            <FontAwesome name="calendar" size={20} color="#8A63D2" style={styles.statHeaderIcon} />
          </View>
          <Text style={styles.statTitle}>Bugungi navbatlar</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tezkor amallar</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#E6F7FF' }]}
            onPress={() => handleQuickAccess('/users/new')}
          >
            <FontAwesome name="user-plus" size={24} color="#0A7EA4" />
            <Text style={styles.quickActionText}>Yangi foydalanuvchi</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#E6F7FF' }]}
            onPress={() => handleQuickAccess('/appointments/new')}
          >
            <FontAwesome name="calendar-plus-o" size={24} color="#0A7EA4" />
            <Text style={styles.quickActionText}>Yangi navbat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  statsContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statHeaderIcon: {
    opacity: 0.8,
  },
  statTitle: {
    color: '#666',
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  quickActionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    minHeight: 100,
  },
  quickActionText: {
    marginTop: 10,
    color: '#333',
    fontSize: 13,
    textAlign: 'center',
  },
});
