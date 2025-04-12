import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function NewUserScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form validation
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      password: '',
    };

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Ism kiritish majburiy';
      isValid = false;
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Telefon raqam kiritish majburiy';
      isValid = false;
    } else if (!/^\+?[0-9\s]{9,}$/.test(phone)) {
      newErrors.phone = 'Noto\'g\'ri telefon raqam formati';
      isValid = false;
    }

    // Email validation
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Noto\'g\'ri email formati';
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Parol kiritish majburiy';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, this would be an API call to create the user
      
      // Show success message
      Alert.alert(
        'Muvaffaqiyatli',
        'Yangi bemor foydalanuvchi yaratildi',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>To'liq ism <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.input,
                errors.name ? styles.inputError : null
              ]}
              placeholder="Ism Familiya"
              value={name}
              onChangeText={setName}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Telefon raqam <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.input,
                errors.phone ? styles.inputError : null
              ]}
              placeholder="+998 XX XXX XX XX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                errors.email ? styles.inputError : null
              ]}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Parol <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[
                styles.input,
                errors.password ? styles.inputError : null
              ]}
              placeholder="Kamida 6 ta belgi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <View style={styles.infoBox}>
            <FontAwesome name="info-circle" size={20} color="#0A7EA4" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Shifokor yaratish uchun, avval bemor sifatida qo'shing, keyin foydalanuvchilar bo'limidan uning rolini o'zgartiring.
            </Text>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Saqlash</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // Add bottom padding to avoid overlapping with tab bar
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#F44336',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: '#E6F7FF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    color: '#0A7EA4',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#0A7EA4',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});