import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

// Interface for appointment data
interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
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
];

// Mock data for patient's appointments
const mockAppointments: Appointment[] = [
  {
    id: '1001',
    patientName: 'Aziza Karimova',
    date: '2023-06-15',
    time: '09:30',
    reason: 'Tish og\'riq',
    status: 'completed',
  },
  {
    id: '1002',
    patientName: 'Aziza Karimova',
    date: '2023-07-20',
    time: '10:00',
    reason: 'Nazorat ko\'rigi',
    status: 'upcoming',
  },
  {
    id: '2001',
    patientName: 'Bobur Toshmatov',
    date: '2023-05-22',
    time: '11:30',
    reason: 'Implantatsiya maslahat',
    status: 'completed',
  },
];

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Find patient by ID
    const foundPatient = mockPatients.find(p => p.id === id);
    if (foundPatient) {
      setPatient(foundPatient);
      
      // Find patient's appointments
      const appointments = mockAppointments.filter(
        a => a.patientName === foundPatient.name
      );
      setPatientAppointments(appointments);
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (!patient) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Bemor</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <Text style={{ color: colors.text }}>Bemor topilmadi</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bemor tafsilotlari</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.patientInfoCard}>
          <View style={styles.patientAvatar}>
            <Text style={styles.patientInitials}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          
          <Text style={styles.patientName}>{patient.name}</Text>
          
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{patient.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <FontAwesome name="user" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{patient.age} yosh</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tibbiy tarix</Text>
            <Text style={styles.medicalHistory}>{patient.medicalHistory}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Navbatlar tarixi</Text>
            <TouchableOpacity 
              style={styles.addAppointmentButton}
              onPress={() => router.push({
                pathname: '/appointment/new',
                params: { patientId: patient.id }
              })}
            >
              <Text style={styles.addAppointmentText}>Yangi navbat</Text>
              <FontAwesome name="plus" size={14} color="#0A7EA4" />
            </TouchableOpacity>
          </View>

          {patientAppointments.length > 0 ? (
            patientAppointments.map((appointment) => (
              <TouchableOpacity 
                key={appointment.id}
                style={styles.appointmentCard}
                onPress={() => router.push(`/appointment/${appointment.id}`)}
              >
                <View style={[
                  styles.statusIndicator, 
                  { 
                    backgroundColor: 
                      appointment.status === 'upcoming' ? '#0A7EA4' : 
                      appointment.status === 'completed' ? '#4CAF50' : '#F44336' 
                  }
                ]} />
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentDate}>
                    {formatDate(appointment.date)} - {appointment.time}
                  </Text>
                  <Text style={styles.appointmentReason}>{appointment.reason}</Text>
                  <Text style={[
                    styles.appointmentStatus,
                    {
                      color: 
                        appointment.status === 'upcoming' ? '#0A7EA4' : 
                        appointment.status === 'completed' ? '#4CAF50' : '#F44336'
                    }
                  ]}>
                    {appointment.status === 'upcoming' ? 'Navbatdagi' : 
                     appointment.status === 'completed' ? 'Yakunlangan' : 'Bekor qilingan'}
                  </Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noAppointments}>Bemor navbatlari mavjud emas</Text>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  patientInfoCard: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  patientAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A7EA4',
  },
  patientName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  medicalHistory: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  addAppointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addAppointmentText: {
    fontSize: 14,
    color: '#0A7EA4',
    marginRight: 5,
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
  statusIndicator: {
    width: 8,
    height: '80%',
    borderRadius: 4,
    marginRight: 15,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  appointmentReason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  appointmentStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  noAppointments: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
}); 