import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const quickActions = [
  {
    id: '1',
    title: 'Navbat olish',
    icon: 'calendar-plus-o',
    route: '/appointment/new',
  },
  {
    id: '2',
    title: 'Shifokorlar',
    icon: 'user-md',
    route: '/doctors',
  },
  {
    id: '3',
    title: 'Mening navbatlarim',
    icon: 'calendar-check-o',
    route: '/appointments',
  },
  {
    id: '4',
    title: 'Profil',
    icon: 'user-circle-o',
    route: '/profile',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Xush kelibsiz!</Text>
          <Text style={styles.nameText}>Aziz Karimov</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image
            source={require('../../assets/images/default-doctor.jpg')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Tezkor amallar</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => router.push(action.route)}
            >
              <View style={styles.iconContainer}>
                <FontAwesome name={action.icon} size={24} color="#007AFF" />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.upcomingAppointmentsContainer}>
        <Text style={styles.sectionTitle}>Yaqinlashayotgan navbatlar</Text>
        <TouchableOpacity
          style={styles.appointmentCard}
          onPress={() => router.push('/appointment/1')}
        >
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>Dr. Aziza Karimova</Text>
            <Text style={styles.appointmentTime}>15 Aprel</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  upcomingAppointmentsContainer: {
    padding: 20,
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
  },
});
