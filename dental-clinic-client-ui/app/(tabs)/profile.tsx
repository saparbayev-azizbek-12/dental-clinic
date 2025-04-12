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

// Mock user data
const userData = {
  name: 'Aziz Karimov',
  email: 'aziz.karimov@example.com',
  phone: '+998 90 123 45 67',
  address: 'Tashkent, Chilonzor tumani',
  joinDate: '2023-01-15',
  totalAppointments: 8,
  upcomingAppointments: 2,
  completedAppointments: 6,
};

export default function ProfileScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={() => router.push('/profile/edit')}>
          <FontAwesome name="edit" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/images/default-doctor.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userPhone}>{userData.phone}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.totalAppointments}</Text>
          <Text style={styles.statLabel}>Jami navbatlar</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.upcomingAppointments}</Text>
          <Text style={styles.statLabel}>Kutilayotgan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.completedAppointments}</Text>
          <Text style={styles.statLabel}>Bajarilgan</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shaxsiy ma'lumotlar</Text>
        <View style={styles.infoItem}>
          <FontAwesome name="user" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{userData.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="envelope" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{userData.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="phone" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{userData.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="map-marker" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{userData.address}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="calendar" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>A'zo bo'lgan sana: {userData.joinDate}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => router.replace('/login')}
      >
        <FontAwesome name="sign-out" size={20} color="#D32F2F" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Chiqish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 80, // Add padding to avoid tab bar overlap
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
}); 