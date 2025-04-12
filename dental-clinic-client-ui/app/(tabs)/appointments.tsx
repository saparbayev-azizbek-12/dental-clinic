import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Define types for our data
interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  ticketNumber: string;
  status: 'upcoming' | 'completed';
}

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Aziza Karimova',
    date: '2024-04-15',
    ticketNumber: 'M21',
    status: 'upcoming',
  },
  {
    id: '2',
    doctorName: 'Dr. Jamshid Rahimov',
    date: '2024-04-10',
    ticketNumber: 'M22',
    status: 'completed',
  },
];

const daysOfWeek = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

export default function AppointmentsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate next 7 days starting from today
  const getNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const renderAppointmentCard = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      style={[
        styles.appointmentCard,
        item.status === 'completed' && styles.completedAppointment,
      ]}
      onPress={() => router.push({
        pathname: '/appointment/[id]',
        params: { id: item.id }
      })}
    >
      <View style={styles.appointmentHeader}>
        <Text style={styles.doctorName}>{item.doctorName}</Text>
        <Text
          style={[
            styles.status,
            item.status === 'completed' ? styles.completedStatus : styles.upcomingStatus,
          ]}
        >
          {item.status === 'completed' ? 'Bajarilgan' : 'Kutilmoqda'}
        </Text>
      </View>
      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.infoRow}>
                <FontAwesome name="ticket" size={16} color="#666" />
                <Text style={styles.infoText}>{item.ticketNumber}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCalendarDay = (date: Date, index: number) => {
    const dayName = date.toLocaleDateString('uz-UZ', { weekday: 'short' });
    const dayNumber = date.getDate();
    const month = date.toLocaleDateString('uz-UZ', { month: 'short' });
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate.toDateString() === date.toDateString();
    const hasAppointments = mockAppointments.some(
      (appointment) => appointment.date === date.toISOString().split('T')[0]
    );

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          isToday && styles.today,
          isSelected && styles.selectedDay,
        ]}
        onPress={() => setSelectedDate(date)}
      >
        <Text
          style={[
            styles.dayName,
            isToday && styles.todayText,
            isSelected && styles.selectedDayText,
          ]}
        >
          {dayName}
        </Text>
        <Text
          style={[
            styles.dayNumber,
            isToday && styles.todayText,
            isSelected && styles.selectedDayText,
          ]}
        >
          {dayNumber}
        </Text>
        <Text
          style={[
            styles.month,
            isToday && styles.todayText,
            isSelected && styles.selectedDayText,
          ]}
        >
          {month}
        </Text>
        {hasAppointments && (
          <View style={styles.appointmentDot} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.calendarContainer}
      >
        {getNext7Days().map((date, index) => renderCalendarDay(date, index))}
      </ScrollView>

      <View style={styles.appointmentsContainer}>
        <Text style={styles.sectionTitle}>Navbatlar</Text>
        <FlatList
          data={mockAppointments}
          renderItem={renderAppointmentCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.appointmentsList}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/appointment/new')}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    maxHeight: 150,
  },
  calendarDay: {
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    minWidth: 60,
    maxHeight: 120,
    borderColor: 'blue',
    borderWidth: 1,
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  dayName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
  },
  appointmentsContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  appointmentsList: {
    paddingBottom: 80,
  },
  appointmentCard: {
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
  completedAppointment: {
    opacity: 0.7,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  upcomingStatus: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
  },
  completedStatus: {
    backgroundColor: '#E8F5E9',
    color: '#388E3C',
  },
  appointmentDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  today: {
    backgroundColor: '#E3F2FD',
  },
  todayText: {
    color: '#1976D2',
  },
  appointmentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  month: {
    fontSize: 12,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
}); 