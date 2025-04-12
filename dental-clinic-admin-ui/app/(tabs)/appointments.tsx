import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

// Mock data for appointments
interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  address: string;
  date: string;
  ticketNumber: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientName: 'Aziza Karimova',
    patientPhone: '+998 90 123 4567',
    doctorName: 'Dr. Jamshid Rahimov',
    address: 'Toshkent shaxar, Toshkent tumani, Toshkent shaxar',
    date: '2023-06-20',
    ticketNumber: 'M21',
    status: 'scheduled',
  },
  {
    id: '2',
    patientName: 'Malika Rahimova',
    patientPhone: '+998 90 111 2222',
    doctorName: 'Dr. Jamshid Rahimov',
    address: 'Toshkent shaxar, Toshkent tumani, Toshkent shaxar',
    date: '2023-06-20',
    ticketNumber: 'M22',
    status: 'scheduled',
  },
  {
    id: '3',
    patientName: 'Davron Zokirov',
    patientPhone: '+998 90 444 3333',
    doctorName: 'Dr. Jamshid Rahimov',
    address: 'Toshkent shaxar, Toshkent tumani, Toshkent shaxar',
    date: '2023-06-19',
    ticketNumber: 'M23',
    status: 'completed',
  },
  {
    id: '4',
    patientName: 'Nargiza Berdiyeva',
    patientPhone: '+998 90 555 6666',
    doctorName: 'Dr. Sanjar Qosimov',
    address: 'Toshkent shaxar, Toshkent tumani, Toshkent shaxar',
    date: '2023-06-21',
    ticketNumber: 'M24',
    status: 'scheduled',
  },
  {
    id: '5',
    patientName: 'Shavkat Toshev',
    patientPhone: '+998 90 777 8888',
    doctorName: 'Dr. Sanjar Qosimov',
    address: 'Toshkent shaxar, Toshkent tumani, Toshkent shaxar',
    date: '2023-06-18',
    ticketNumber: 'M25',
    status: 'canceled',
  },
];

export default function AppointmentsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scheduled' | 'completed' | 'canceled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter appointments based on search query and selected filter
  const filteredAppointments = MOCK_APPOINTMENTS.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          appointment.patientPhone.includes(searchQuery);
    
    const matchesFilter = selectedFilter === 'all' || appointment.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleAppointmentPress = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleStatusChange = (status: 'scheduled' | 'completed' | 'canceled') => {
    if (!selectedAppointment) return;
    
    // In a real app, this would be an API call
    Alert.alert(
      'Status o\'zgartirish',
      `Navbat statusi "${status === 'scheduled' ? 'Rejalashtirilgan' : status === 'completed' ? 'Bajarilgan' : 'Bekor qilingan'}" ga o'zgartirilsinmi?`,
      [
        {
          text: 'Bekor qilish',
          style: 'cancel',
        },
        {
          text: 'Tasdiqlash',
          onPress: () => {
            // Update appointment status logic would go here
            Alert.alert('Muvaffaqiyatli', 'Navbat statusi o\'zgartirildi');
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const handleDeleteAppointment = () => {
    if (!selectedAppointment) return;
    
    Alert.alert(
      'Navbatni o\'chirish',
      `${selectedAppointment.patientName} uchun navbatni o'chirishni tasdiqlaysizmi?`,
      [
        {
          text: 'Bekor qilish',
          style: 'cancel',
        },
        {
          text: 'O\'chirish',
          style: 'destructive',
          onPress: () => {
            // Delete appointment logic would go here
            Alert.alert('Muvaffaqiyatli', 'Navbat o\'chirildi');
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const dateParts = dateString.split('-');
    return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#0A7EA4';
      case 'completed':
        return '#4CAF50';
      case 'canceled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Kutilmoqda';
      case 'completed':
        return 'Bajarilgan';
      case 'canceled':
        return 'Bekor qilingan';
      default:
        return status;
    }
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => handleAppointmentPress(item)}
    >
      <View style={styles.appointmentHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: getStatusColor(item.status) }
          ]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.appointmentInfo}>
        <View style={styles.infoItem}>
          <FontAwesome name="user-md" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.doctorName}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="calendar" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{formatDate(item.date)} - {item.ticketNumber}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="phone" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.patientPhone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Navbatlar</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push('/appointments/new')}
        >
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Yangi navbat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Qidirish..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilterButton]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterButtonText, 
              selectedFilter === 'all' && styles.activeFilterText]}>Barchasi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'scheduled' && styles.activeFilterButton]}
            onPress={() => setSelectedFilter('scheduled')}
          >
            <Text style={[styles.filterButtonText, 
              selectedFilter === 'scheduled' && styles.activeFilterText]}>Kutilmoqda</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'completed' && styles.activeFilterButton]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text style={[styles.filterButtonText, 
              selectedFilter === 'completed' && styles.activeFilterText]}>Bajarilgan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'canceled' && styles.activeFilterButton]}
            onPress={() => setSelectedFilter('canceled')}
          >
            <Text style={[styles.filterButtonText, 
              selectedFilter === 'canceled' && styles.activeFilterText]}>Bekor qilingan</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.appointmentList}
      />

      {/* Appointment Actions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAppointment && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Navbat ma'lumotlari</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <FontAwesome name="times" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalPatientName}>{selectedAppointment.patientName}</Text>
                  <Text style={styles.modalStatus}>
                    {getStatusText(selectedAppointment.status)}
                  </Text>

                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Shifokor:</Text>
                    <Text style={styles.modalInfoValue}>{selectedAppointment.doctorName}</Text>
                  </View>

                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Sana va vaqt:</Text>
                    <Text style={styles.modalInfoValue}>
                      {formatDate(selectedAppointment.date)} {selectedAppointment.ticketNumber }
                    </Text>
                  </View>

                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Telefon raqam:</Text>
                    <Text style={styles.modalInfoValue}>{selectedAppointment.patientPhone}</Text>
                  </View>

                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Manzil:</Text>
                    <Text style={styles.modalInfoValue}>{selectedAppointment.address}</Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <Text style={styles.actionTitle}>Statusni o'zgartirish:</Text>
                    <View style={styles.statusButtons}>
                      <TouchableOpacity 
                        style={[styles.statusButton, { backgroundColor: '#E6F7FF' }]}
                        onPress={() => handleStatusChange('scheduled')}
                      >
                        <Text style={[styles.statusButtonText, { color: '#0A7EA4' }]}>Kutilmoqda</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.statusButton, { backgroundColor: '#E6FFE6' }]}
                        onPress={() => handleStatusChange('completed')}
                      >
                        <Text style={[styles.statusButtonText, { color: '#4CAF50' }]}>Bajarilgan</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.statusButton, { backgroundColor: '#FFE6E6' }]}
                        onPress={() => handleStatusChange('canceled')}
                      >
                        <Text style={[styles.statusButtonText, { color: '#F44336' }]}>Bekor qilingan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#F44336', marginTop: 20 }]}
                    onPress={handleDeleteAppointment}
                  >
                    <Text style={styles.actionButtonText}>Navbatni o'chirish</Text>
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
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 15,
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
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
    paddingBottom: 100,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentInfo: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoIcon: {
    width: 25,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
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
    padding: 20,
  },
  modalPatientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalStatus: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  modalInfoItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  modalInfoLabel: {
    fontSize: 16,
    color: '#666',
    width: 120,
  },
  modalInfoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusButtons: {
    flexDirection: 'column',
  },
  statusButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  statusButtonText: {
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 