import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Ticket, mockTickets } from '../../constants/tickets';

// Define types for our data
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  image: string;
}

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Aziza Karimova',
    specialization: 'Ortodont',
    experience: '15 yillik tajriba',
    rating: 4.8,
    image: 'https://example.com/doctor1.jpg',
  },
  {
    id: '2',
    name: 'Dr. Jamshid Rahimov',
    specialization: 'Stomatolog',
    experience: '10 yillik tajriba',
    rating: 4.9,
    image: 'https://example.com/doctor2.jpg',
  },
];

export default function NewAppointmentScreen() {
  const { doctorId } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (doctorId) {
      const doctor = mockDoctors.find(d => d.id === doctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
      }
    }
  }, [doctorId]);

  const generateTicketNumber = () => {
    const letter = 'M'; // You can make this dynamic based on doctor or department
    const number = Math.floor(Math.random() * 90) + 10; // Generates number between 10-99
    return `${letter}${number}`;
  };

  const calculateWaitingNumber = (doctorName: string, date: string) => {
    return mockTickets.filter(
      (app: Ticket) => app.doctorName === doctorName && 
      app.appointmentDate === date && 
      app.status === 'Kutilmoqda'
    ).length;
  };

  const handleSubmit = () => {
    if (!selectedDoctor) {
      Alert.alert('Xatolik', 'Iltimos, shifokor tanlang');
      return;
    }

    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    const waitingNumber = calculateWaitingNumber(selectedDoctor.name, formattedDate);
    const estimatedWaitTime = `${waitingNumber} soat`;

    // Create a new ticket
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ticketNumber: generateTicketNumber(),
      doctorName: selectedDoctor.name,
      appointmentDate: formattedDate,
      waitingNumber,
      estimatedWaitTime,
      status: 'Kutilmoqda',
    };

    // Add the new ticket to mockTickets array
    mockTickets.push(newTicket);
    
    // Show success message
    Alert.alert(
      'Muvaffaqiyatli',
      'Navbat muvaffaqiyatli yaratildi',
      [
        {
          text: 'OK',
          onPress: () => router.push({
            pathname: '/appointment/[id]',
            params: { id: newTicket.id }
          }),
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
        <Text style={styles.title}>Yangi navbat</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shifokor tanlash</Text>
        <TouchableOpacity
          style={styles.doctorSelector}
          onPress={() => router.push('/doctors')}
        >
          {selectedDoctor ? (
            <Text style={styles.selectedDoctor}>{selectedDoctor.name}</Text>
          ) : (
            <Text style={styles.placeholder}>Shifokor tanlang</Text>
          )}
          <FontAwesome name="chevron-right" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sana tanlash</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateSelector}
        >
          {[...Array(7)].map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const dayName = date.toLocaleDateString('uz-UZ', { weekday: 'short' });

            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateButton, isSelected && styles.selectedDate]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayText, isSelected && styles.selectedDateText]}>
                  {dayName}
                </Text>
                <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                  {date.getDate()}
                </Text>
                <Text style={[styles.monthText, isSelected && styles.selectedDateText]}>
                  {date.toLocaleString('default', { month: 'short' })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Navbat olish</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  doctorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  placeholder: {
    color: '#666',
  },
  selectedDoctor: {
    color: '#333',
    fontWeight: '500',
  },
  dateSelector: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  dateButton: {
    alignItems: 'center',
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
  },
  selectedDate: {
    backgroundColor: '#1976D2',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  monthText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDateText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#1976D2',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 