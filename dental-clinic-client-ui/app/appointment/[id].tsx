import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Ticket, mockTickets } from '../../constants/tickets';

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [waitingNumber, setWaitingNumber] = useState<number>(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<string>('');

  useEffect(() => {
    // Find the ticket in mockTickets
    const foundTicket = mockTickets.find(t => t.id === id);
    if (foundTicket) {
      setTicket(foundTicket);
      setWaitingNumber(foundTicket.waitingNumber);
      setEstimatedWaitTime(foundTicket.estimatedWaitTime);
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (foundTicket) {
        // Update waiting number and estimated time
        const newWaitingNumber = Math.max(0, foundTicket.waitingNumber - 1);
        setWaitingNumber(newWaitingNumber);
        setEstimatedWaitTime(`${newWaitingNumber} soat`);
        
        // Update the ticket in mockTickets
        const ticketIndex = mockTickets.findIndex(t => t.id === id);
        if (ticketIndex !== -1) {
          mockTickets[ticketIndex] = {
            ...mockTickets[ticketIndex],
            waitingNumber: newWaitingNumber,
            estimatedWaitTime: `${newWaitingNumber} soat`
          };
        }
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [id]);

  if (!ticket) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bilet ma'lumotlari</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Bilet topilmadi</Text>
          <TouchableOpacity
            style={styles.newTicketButton}
            onPress={() => router.push('/appointment/new')}
          >
            <Text style={styles.newTicketButtonText}>Yangi navbat olish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Kutilmoqda':
        return '#1976D2';
      case 'Jarayonda':
        return '#FFA000';
      case 'Bajarilgan':
        return '#388E3C';
      case 'Bekor qilingan':
        return '#D32F2F';
      default:
        return '#666';
    }
  };

  const handleCancel = () => {
    // Update ticket status in mockTickets
    const ticketIndex = mockTickets.findIndex(t => t.id === id);
    if (ticketIndex !== -1) {
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        status: 'Bekor qilingan'
      };
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bilet ma'lumotlari</Text>
      </View>

      <View style={styles.ticketContainer}>
        {/* Ticket Header */}
        <View style={styles.ticketHeader}>
          <View style={styles.ticketNumberContainer}>
            <Text style={styles.ticketNumberLabel}>Bilet raqami</Text>
            <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            <Text style={styles.statusText}>{ticket.status}</Text>
          </View>
        </View>

        {/* Doctor Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="user-md" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Shifokor</Text>
          </View>
          <Text style={styles.doctorName}>{ticket.doctorName}</Text>
        </View>

        {/* Appointment Date */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="calendar" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Sana</Text>
          </View>
          <Text style={styles.dateText}>{ticket.appointmentDate}</Text>
        </View>

        {/* Waiting Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="clock-o" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Navbat holati</Text>
          </View>
          <View style={styles.waitingInfo}>
            <View style={styles.waitingItem}>
              <Text style={styles.waitingLabel}>Sizdan oldingi navbatlar</Text>
              <Text style={styles.waitingValue}>{waitingNumber} kishi</Text>
            </View>
            <View style={styles.waitingItem}>
              <Text style={styles.waitingLabel}>Taxminiy kutish vaqti</Text>
              <Text style={styles.waitingValue}>{estimatedWaitTime}</Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        {ticket.status === 'Kutilmoqda' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Navbatni bekor qilish</Text>
          </TouchableOpacity>
        )}

        {/* Ticket Footer */}
        <View style={styles.ticketFooter}>
          <Text style={styles.footerText}>Klinika nomi</Text>
          <Text style={styles.footerText}>© 2024 Dental Clinic</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ticketNumberContainer: {
    flex: 1,
  },
  ticketNumberLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ticketNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  waitingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  waitingItem: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  waitingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  waitingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#FFE0E0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
  ticketFooter: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  newTicketButton: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
  },
  newTicketButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 