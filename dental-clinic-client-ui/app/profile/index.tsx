import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mock user data - in a real app, this would come from an API or local storage
const userData = {
  name: 'Aziz Karimov',
  email: 'aziz.karimov@example.com',
  phone: '+998 90 123 45 67',
  address: 'Tashkent, Chilonzor tumani',
};

export default function ProfileScreen() {
  const handleEdit = () => {
    router.push('/profile/edit');
  };

  const handleLogout = () => {
    Alert.alert(
      'Tizimdan chiqish',
      'Haqiqatan ham tizimdan chiqmoqchimisiz?',
      [
        {
          text: 'Yo\'q',
          style: 'cancel',
        },
        {
          text: 'Ha',
          style: 'destructive',
          onPress: () => {
            // In a real app, you would clear user session/tokens here
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <FontAwesome name="phone" size={20} color="#666" />
          <Text style={styles.infoText}>{userData.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="map-marker" size={20} color="#666" />
          <Text style={styles.infoText}>{userData.address}</Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <FontAwesome name="edit" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Profilni tahrirlash</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={20} color="#FF3B30" />
          <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>
            Tizimdan chiqish
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  actionsSection: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 15,
  },
}); 