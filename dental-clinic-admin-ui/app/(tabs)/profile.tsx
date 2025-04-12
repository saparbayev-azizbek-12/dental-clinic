import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

// Mock admin data
const initialAdminData = {
  id: 'admin1',
  name: 'Admin Supervisor',
  email: 'admin@example.com',
  phone: '+998 90 777 8888',
  position: 'Bosh administrator',
  registrationDate: '2023-01-01',
  lastLogin: '2023-06-15',
  avatar: null, // No avatar for now
};

export default function AdminProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [adminData, setAdminData] = useState(initialAdminData);
  
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Admin Profil</Text>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEditProfile}
        >
          <FontAwesome name="edit" size={20} color="#0A7EA4" />
          <Text style={styles.editButtonText}>Tahrirlash</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={60} color="#ddd" />
          </View>
        </View>
        
        <Text style={styles.adminName}>{adminData.name}</Text>
        <Text style={styles.adminRole}>{adminData.position}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Kontakt ma'lumotlari</Text>
        
        <View style={styles.infoItem}>
          <FontAwesome name="envelope" size={20} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{adminData.email}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <FontAwesome name="phone" size={20} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{adminData.phone}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Tizim ma'lumotlari</Text>
        
        <View style={styles.infoItem}>
          <FontAwesome name="id-badge" size={20} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>ID: {adminData.id}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <FontAwesome name="calendar" size={20} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>Ro'yxatdan o'tgan sana: {adminData.registrationDate}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <FontAwesome name="clock-o" size={20} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>Oxirgi kirish: {adminData.lastLogin}</Text>
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
    paddingBottom: 80, // Add padding for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    marginLeft: 5,
    color: '#0A7EA4',
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  adminName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  adminRole: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
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
    width: 30,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
}); 