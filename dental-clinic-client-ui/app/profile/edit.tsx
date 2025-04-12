import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mock user data - in a real app, this would come from an API or local storage
const initialUserData = {
  name: 'Aziz Karimov',
  email: 'aziz.karimov@example.com',
  phone: '+998 90 123 45 67',
  address: 'Tashkent, Chilonzor tumani',
};

export default function ProfileEditScreen() {
  const [userData, setUserData] = useState(initialUserData);

  // In a real app, you would fetch user data from an API or local storage
  useEffect(() => {
    // This is where you would fetch user data
    // For now, we're using the mock data
  }, []);

  const handleSave = () => {
    // Validate inputs
    if (!userData.name.trim()) {
      Alert.alert('Xatolik', 'Iltimos, ismingizni kiriting');
      return;
    }

    if (!userData.email.trim()) {
      Alert.alert('Xatolik', 'Iltimos, email manzilingizni kiriting');
      return;
    }

    if (!userData.phone.trim()) {
      Alert.alert('Xatolik', 'Iltimos, telefon raqamingizni kiriting');
      return;
    }

    // In a real app, you would save this to a database or API
    console.log('User data updated:', userData);
    
    // Show success message
    Alert.alert(
      'Muvaffaqiyatli',
      'Ma\'lumotlar muvaffaqiyatli yangilandi',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profilni tahrirlash</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Saqlash</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ism va familiya</Text>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            placeholder="Ism va familiya"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
            placeholder="Email manzil"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefon raqam</Text>
          <TextInput
            style={styles.input}
            value={userData.phone}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
            placeholder="Telefon raqam"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Manzil</Text>
          <TextInput
            style={styles.input}
            value={userData.address}
            onChangeText={(text) => setUserData({ ...userData, address: text })}
            placeholder="Manzil"
          />
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
}); 