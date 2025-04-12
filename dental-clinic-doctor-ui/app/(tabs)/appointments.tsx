import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

// Define types for our data
interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  address: string;
  date: string;
  ticketNumber: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

// Mock data for appointments
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientName: 'Aziza Karimova',
    patientPhone: '+998 90 123 4567',
    address: 'Toshkent shaxar, Chilonzor tumani, 12-uy',
    date: '2023-06-15',
    ticketNumber: 'M21',
    status: 'upcoming',
    notes: 'Oldingi tashrifida qattiq og\'riq bo\'lgan. Antibiotiklar tavsiya etilgan.',
  },
  {
    id: '2',
    patientName: 'Bobur Toshmatov',
    patientPhone: '+998 90 765 4321',
    address: 'Toshkent shaxar, Chilonzor tumani, 12-uy',
    date: '2023-06-15',
    ticketNumber: 'M22',
    status: 'upcoming',
  },
  {
    id: '3',
    patientName: 'Malika Rahimova',
    patientPhone: '+998 90 111 2222',
    address: 'Toshkent shaxar, Chilonzor tumani, 12-uy',
    date: '2023-06-15',
    ticketNumber: 'M23',
    status: 'upcoming',
  },
  {
    id: '4',
    patientName: 'Javohir Alimov',
    patientPhone: '+998 90 333 4444',
    address: 'Toshkent shaxar, Chilonzor tumani, 12-uy',
    date: '2023-06-14',
    ticketNumber: 'M24',
    status: 'completed',
    notes: 'Tishlarning umumiy holati yaxshi. 6 oydan so\'ng navbatdagi tashrif tavsiya etildi.',
  },
  {
    id: '5',
    patientName: 'Kamola Usmonova',
    patientPhone: '+998 90 555 6666',
    address: 'Toshkent shaxar, Chilonzor tumani, 12-uy',
    date: '2023-06-13',
    ticketNumber: 'M25',
    status: 'cancelled',
    notes: 'Bemor tashrif buyurmadi.',
  },
];

export default function AppointmentsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(appointment => appointment.status === activeFilter));
    }
  }, [activeFilter, appointments]);

  const handleFilterChange = (filter: 'all' | 'upcoming' | 'completed' | 'cancelled') => {
    setActiveFilter(filter);
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleStatusChange = (appointmentId: string, newStatus: 'upcoming' | 'completed' | 'cancelled') => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
    );
    setAppointments(updatedAppointments);
    closeModal();
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
    setAppointments(updatedAppointments);
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const renderAppointmentCard = ({ item }: { item: Appointment }) => {
    let statusColor = '#0A7EA4'; // Default blue for upcoming
    if (item.status === 'completed') statusColor = '#4CAF50'; // Green for completed
    if (item.status === 'cancelled') statusColor = '#F44336'; // Red for cancelled

    return (
      <TouchableOpacity 
        style={styles.appointmentCard}
        onPress={() => handleAppointmentPress(item)}
      >
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        <View style={styles.appointmentInfo}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.appointmentTime}>{formatDate(item.date)}</Text>
          <Text style={styles.appointmentTicket}>{item.ticketNumber}</Text>
        </View>
        <FontAwesome name="chevron-right" size={16} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Navbatlar</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={[styles.filterButtonText, 
              activeFilter === 'all' && styles.activeFilterText]}>Barchasi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'upcoming' && styles.activeFilterButton]}
            onPress={() => handleFilterChange('upcoming')}
          >
            <Text style={[styles.filterButtonText, 
              activeFilter === 'upcoming' && styles.activeFilterText]}>Navbatdagi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'completed' && styles.activeFilterButton]}
            onPress={() => handleFilterChange('completed')}
          >
            <Text style={[styles.filterButtonText, 
              activeFilter === 'completed' && styles.activeFilterText]}>Yakunlangan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'cancelled' && styles.activeFilterButton]}
            onPress={() => handleFilterChange('cancelled')}
          >
            <Text style={[styles.filterButtonText, 
              activeFilter === 'cancelled' && styles.activeFilterText]}>Bekor qilingan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.appointmentList}
      />

      {/* Appointment Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAppointment && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Navbat ma'lumotlari</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <FontAwesome name="times" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bemor:</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.patientName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Telefon:</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.patientPhone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Manzil:</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Sana:</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedAppointment.date)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bilet raqami:</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.ticketNumber}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Holat:</Text>
                    <Text style={[
                      styles.detailValue, 
                      { 
                        color: selectedAppointment.status === 'upcoming' ? '#0A7EA4' : 
                         selectedAppointment.status === 'completed' ? '#4CAF50' : '#F44336' 
                      }
                    ]}>
                      {selectedAppointment.status === 'upcoming' ? 'Navbatdagi' : 
                       selectedAppointment.status === 'completed' ? 'Yakunlangan' : 'Bekor qilingan'}
                    </Text>
                  </View>
                  {selectedAppointment.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.detailLabel}>Qo'shimcha ma'lumot:</Text>
                      <Text style={styles.notes}>{selectedAppointment.notes}</Text>
                    </View>
                  )}
                </ScrollView>

                <View style={styles.modalActions}>
                  {selectedAppointment.status === 'upcoming' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => handleStatusChange(selectedAppointment.id, 'completed')}
                      >
                        <Text style={styles.actionButtonText}>Yakunlash</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                        onPress={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
                      >
                        <Text style={styles.actionButtonText}>Bekor qilish</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#666' }]}
                    onPress={() => handleDeleteAppointment(selectedAppointment.id)}
                  >
                    <Text style={styles.actionButtonText}>O'chirish</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
    filterScrollView: {
    flexGrow: 0,
    maxHeight: 50,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    height: 40,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#0A7EA4',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  appointmentList: {
    padding: 15,
    paddingBottom: 100, // Add padding to avoid content being hidden behind tab bar
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
    width: 10,
    height: '100%',
    borderRadius: 5,
    marginRight: 15,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  appointmentTicket: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 15,
    maxHeight: 400,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  notesContainer: {
    marginTop: 10,
  },
  notes: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 15,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 