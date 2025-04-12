import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

// Interface for our patient data
interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  medicalHistory: string;
}

// Mock data for patients
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Aziza Karimova',
    phone: '+998 90 123 4567',
    age: 28,
    medicalHistory: 'Allergiya yo\'q, oldingi tashrif: 15/03/2023',
  },
  {
    id: '2',
    name: 'Bobur Toshmatov',
    phone: '+998 90 765 4321',
    age: 45,
    medicalHistory: 'Qand kasalligi, oldingi tashrif: 22/05/2023',
  },
  {
    id: '3',
    name: 'Malika Rahimova',
    phone: '+998 90 111 2222',
    age: 32,
    medicalHistory: 'Allergiya: Penitsillin, oldingi tashrif: 10/04/2023',
  },
  {
    id: '4',
    name: 'Sanjar Qosimov',
    phone: '+998 90 333 4444',
    age: 50,
    medicalHistory: 'Yurak kasalligi, oldingi tashrif: 05/06/2023',
  },
  {
    id: '5',
    name: 'Nargiza Berdiyeva',
    phone: '+998 90 555 6666',
    age: 22,
    medicalHistory: 'Sog\'lom, oldingi tashrif: 30/04/2023',
  },
  {
    id: '6',
    name: 'Jahongir Aliyev',
    phone: '+998 90 777 8888',
    age: 37,
    medicalHistory: 'Allergiya: Sulfonamidlar, oldingi tashrif: 12/05/2023',
  },
];

export default function PatientsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = mockPatients.filter(
        patient => patient.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(mockPatients);
    }
  };

  const selectPatient = (patient: Patient) => {
    // If coming from appointment/new, navigate back with the patient id
    if (router.canGoBack()) {
      router.push({
        pathname: '/appointment/new',
        params: { patientId: patient.id }
      });
    } else {
      // Otherwise navigate to patient detail
      router.push(`/patients/${patient.id}`);
    }
  };

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity 
      style={styles.patientCard}
      onPress={() => selectPatient(item)}
    >
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientPhone}>{item.phone}</Text>
        <Text style={styles.patientAge}>{item.age} yosh</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bemorlar</Text>
        <TouchableOpacity style={styles.addPatientButton}>
          <FontAwesome name="plus" size={24} color={colors.tint} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Bemor qidirish..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.patientList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addPatientButton: {
    width: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  patientList: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Add bottom padding to prevent tab bar overlap
  },
  patientCard: {
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
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  patientPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  patientAge: {
    fontSize: 14,
    color: '#666',
  },
}); 