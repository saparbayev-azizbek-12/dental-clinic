import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Define types for our data
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  image: string;
  experienceYears: number;
}

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Aziza Karimova',
    specialization: 'Ortodont',
    experience: '15 yillik tajriba',
    experienceYears: 15,
    image: 'https://example.com/doctor1.jpg',
  },
  {
    id: '2',
    name: 'Dr. Jamshid Rahimov',
    specialization: 'Stomatolog',
    experience: '10 yillik tajriba',
    experienceYears: 10,
    image: 'https://example.com/doctor2.jpg',
  },
  // Add more mock doctors as needed
];

export default function DoctorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = mockDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => router.push({
        pathname: '/doctor/[id]',
        params: { id: item.id }
      })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.doctorImage}
        defaultSource={require('../../assets/images/default-doctor.jpg')}
      />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialization}>{item.specialization}</Text>
        <Text style={styles.doctorExperience}>{item.experienceYears} yillik tajriba</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Shifokor qidirish..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 15,
    padding: 10,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  doctorSpecialization: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  doctorExperience: {
    fontSize: 14,
    color: '#888',
  },
}); 