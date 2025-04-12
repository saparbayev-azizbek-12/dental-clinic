import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

// Mock data for appointments
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    patientName: 'Aziza Karimova',
    date: '2023-06-15',
    ticketNumber: 'M21',
    status: 'upcoming',
  },
  {
    id: '2',
    patientName: 'Bobur Toshmatov',
    date: '2023-06-15',
    ticketNumber: 'M22',
    status: 'upcoming',
  },
  {
    id: '3',
    patientName: 'Malika Rahimova',
    date: '2023-06-15',
    ticketNumber: 'M23',
    status: 'upcoming',
  },
];

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const today = new Date().toLocaleDateString('uz-UZ', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>Salom, Dr. Rahimov</Text>
        <Text style={[styles.date, { color: colors.text }]}>{today}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E6F7FF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statNumber}>8</Text>
            <FontAwesome name="calendar" size={20} color="#0A7EA4" style={styles.statHeaderIcon} />
          </View>
          <Text style={styles.statTitle}>Bugungi navbatlar</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF2E6' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statNumber}>32</Text>
            <FontAwesome name="calendar-check-o" size={20} color="#FFA64D" style={styles.statHeaderIcon} />
          </View>
          <Text style={styles.statTitle}>Haftalik navbatlar</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Bugungi navbatlar</Text>
          <TouchableOpacity onPress={() => router.push('/appointments')}>
            <Text style={[styles.seeAll, { color: colors.tint }]}>Barchasini ko'rish</Text>
          </TouchableOpacity>
        </View>

        {MOCK_APPOINTMENTS.map((appointment) => (
          <TouchableOpacity 
            key={appointment.id}
            style={styles.appointmentCard}
            onPress={() => router.push(`/appointments`)}
          >
            <View style={styles.appointmentTimeContainer}>
              <Text style={styles.appointmentTime}>{appointment.ticketNumber}</Text>
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.patientName}>{appointment.patientName}</Text>
              <Text style={styles.appointmentTime}>{appointment.date}</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.quickActionTitle, { color: colors.text }]}>Tezkor amallar</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#E6F7FF' }]}
            onPress={() => router.push('/schedule')}
          >
            <FontAwesome name="calendar-plus-o" size={24} color="#0A7EA4" />
            <Text style={styles.quickActionText}>Ish jadval</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#F2E6FF' }]}
            onPress={() => router.push('/profile')}
          >
            <FontAwesome name="user-md" size={24} color="#A64DFF" />
            <Text style={styles.quickActionText}>Profilni yangilash</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#E6FFE6' }]}
            onPress={() => router.push('/appointments')}
          >
            <FontAwesome name="list-alt" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>Navbatlar</Text>
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
  date: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    position: 'relative',
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
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  appointmentTimeContainer: {
    backgroundColor: '#E6F7FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  appointmentTime: {
    color: '#0A7EA4',
    fontWeight: 'bold',
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  appointmentReason: {
    color: '#666',
    fontSize: 14,
    marginTop: 3,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  quickActionButton: {
    width: '31%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    marginTop: 10,
    color: '#333',
    fontSize: 13,
    textAlign: 'center',
  },
});
