import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// Define types for our data
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  image: string;
  description: string;
  workingHours: string;
}

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Aziza Karimova',
    specialization: 'Ortodont',
    experienceYears: 15,
    image: 'https://example.com/doctor1.jpg',
    description: 'Ortodontiya bo\'yicha mutaxassis. Tishlarni to\'g\'rilash, implantatsiya va boshqa muolajalarni amalga oshiradi.',
    workingHours: 'Dushanba - Juma: 09:00 - 18:00',
  },
  {
    id: '2',
    name: 'Dr. Jamshid Rahimov',
    specialization: 'Stomatolog',
    experienceYears: 10,
    image: 'https://example.com/doctor2.jpg',
    description: 'Umumiy stomatologiya bo\'yicha mutaxassis. Tishlarni davolash, protezlash va estetik stomatologiya bo\'yicha tajribaga ega.',
    workingHours: 'Dushanba - Shanba: 10:00 - 19:00',
  },
];

export default function DoctorProfileScreen() {
  const { id } = useLocalSearchParams();
  const doctor = mockDoctors.find(d => d.id === id);

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Shifokor topilmadi</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shifokor profili</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: doctor.image }}
          style={styles.doctorImage}
          defaultSource={require('../../assets/images/default-doctor.jpg')}
        />
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <FontAwesome name="briefcase" size={16} color="#666" />
          <Text style={styles.infoText}>{doctor.experienceYears} yillik tajriba</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="clock-o" size={16} color="#666" />
          <Text style={styles.infoText}>{doctor.workingHours}</Text>
        </View>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Haqida</Text>
        <Text style={styles.description}>{doctor.description}</Text>
      </View>

      <TouchableOpacity
        style={styles.appointmentButton}
        onPress={() => router.push({
          pathname: '/appointment/new',
          params: { doctorId: doctor.id }
        })}
      >
        <Text style={styles.appointmentButtonText}>Navbat olish</Text>
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
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  doctorSpecialization: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  descriptionSection: {
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
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  appointmentButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 