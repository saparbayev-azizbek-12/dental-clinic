import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ticket, mockTickets } from '../../constants/tickets';

// Mock data for patients and doctors
const MOCK_PATIENTS = [
  { id: '1', name: 'Aziza Karimova', phone: '+998 90 123 4567' },
  { id: '2', name: 'Malika Rahimova', phone: '+998 90 111 2222' },
  { id: '3', name: 'Davron Zokirov', phone: '+998 90 444 3333' },
  { id: '4', name: 'Nargiza Berdiyeva', phone: '+998 90 555 6666' },
  { id: '5', name: 'Shavkat Toshev', phone: '+998 90 777 8888' },
  { id: '6', name: 'Gulnora Azimova', phone: '+998 90 999 0000' },
];

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Jamshid Rahimov', specialization: 'Stomatolog' },
  { id: '2', name: 'Dr. Sanjar Qosimov', specialization: 'Tish jarrohi' },
  { id: '3', name: 'Dr. Nodira Sharipova', specialization: 'Ortodont' },
  { id: '4', name: 'Dr. Olim Karimov', specialization: 'Terapevt' },
  { id: '5', name: 'Dr. Kamola Umarova', specialization: 'Bolalar stomatoligi' },
];


export default function NewAppointmentScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: string; name: string; specialization: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState<Ticket | null>(null);

  // Filter patients and doctors based on search
  const filteredPatients = MOCK_PATIENTS.filter(patient => 
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.phone.includes(patientSearch)
  );

  const filteredDoctors = MOCK_DOCTORS.filter(doctor => 
    doctor.name.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const generateTicketNumber = () => {
    const letter = 'M';
    const number = Math.floor(Math.random() * 90) + 10;
    return `${letter}${number}`;
  };

  const calculateWaitingNumber = (doctorName: string, date: string) => {
    return mockTickets.filter(
      (app: Ticket) => app.doctorName === doctorName && 
      app.appointmentDate === date && 
      app.status === 'Kutilmoqda'
    ).length;
  };

  const handlePatientSelect = (patient: { id: string; name: string; phone: string }) => {
    setSelectedPatient(patient);
    setShowPatientDropdown(false);
  };

  const handleDoctorSelect = (doctor: { id: string; name: string; specialization: string }) => {
    setSelectedDoctor(doctor);
    setShowDoctorDropdown(false);
  };

  const handleSubmit = () => {
    if (!selectedPatient || !selectedDoctor) {
      Alert.alert('Xatolik', 'Iltimos, bemor va shifokorni tanlang');
      return;
    }

    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    const waitingNumber = calculateWaitingNumber(selectedDoctor.name, formattedDate);
    const estimatedWaitTime = `${waitingNumber} soat`;

    // Create a new ticket
    const ticket: Ticket = {
      id: Date.now().toString(),
      ticketNumber: generateTicketNumber(),
      doctorName: selectedDoctor.name,
      appointmentDate: formattedDate,
      waitingNumber,
      estimatedWaitTime,
      status: 'Kutilmoqda',
    };

    // Add the new ticket to mockTickets array
    mockTickets.push(ticket);
    setNewTicket(ticket);
    setShowTicketModal(true);

    // Navigate to ticket details screen
    router.push({
      pathname: '/appointments/ticket',
      params: {
        ticket: JSON.stringify(ticket),
        patientName: selectedPatient.name
      }
    });
  };

  const closeAllDropdowns = () => {
    setShowPatientDropdown(false);
    setShowDoctorDropdown(false);
  };

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={closeAllDropdowns}
      style={{ flex: 1 }}
    >
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Yangi navbat</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bemor tanlash</Text>
            <View style={styles.selectorContainer}>
              <TouchableOpacity
                style={styles.selector}
                onPress={(e) => {
                  e.stopPropagation();
                  closeAllDropdowns();
                  setShowPatientDropdown(true);
                }}
              >
                <Text style={selectedPatient ? styles.selectedText : styles.placeholderText}>
                  {selectedPatient ? selectedPatient.name : 'Bemorni tanlang'}
                </Text>
                <FontAwesome name="chevron-down" size={14} color="#999" />
              </TouchableOpacity>

              {showPatientDropdown && (
                <View style={styles.dropdownContainer}>
                  <View style={styles.searchContainer}>
                    <FontAwesome name="search" size={14} color="#999" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Qidirish..."
                      value={patientSearch}
                      onChangeText={setPatientSearch}
                    />
                  </View>
                  <ScrollView style={styles.dropdownList}>
                    {filteredPatients.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        onPress={(e) => {
                          e.stopPropagation();
                          handlePatientSelect(item);
                        }}
                      >
                        <Text style={styles.dropdownItemName}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shifokor tanlash</Text>
            <View style={styles.selectorContainer}>
              <TouchableOpacity
                style={styles.selector}
                onPress={(e) => {
                  e.stopPropagation();
                  closeAllDropdowns();
                  setShowDoctorDropdown(true);
                }}
              >
                <Text style={selectedDoctor ? styles.selectedText : styles.placeholderText}>
                  {selectedDoctor ? selectedDoctor.name : 'Shifokorni tanlang'}
                </Text>
                <FontAwesome name="chevron-down" size={14} color="#999" />
              </TouchableOpacity>

              {showDoctorDropdown && (
                <View style={styles.dropdownContainer}>
                  <View style={styles.searchContainer}>
                    <FontAwesome name="search" size={14} color="#999" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Qidirish..."
                      value={doctorSearch}
                      onChangeText={setDoctorSearch}
                    />
                  </View>
                  <ScrollView style={styles.dropdownList}>
                    {filteredDoctors.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDoctorSelect(item);
                        }}
                      >
                        <Text style={styles.dropdownItemName}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
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
                    onPress={(e) => {
                      e.stopPropagation();
                      setSelectedDate(date);
                    }}
                  >
                    <Text style={[styles.dayText, isSelected && styles.selectedDateText]}>
                      {dayName}
                    </Text>
                    <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <Text style={styles.submitButtonText}>Saqlash</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  selectorContainer: {
    position: 'relative',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  placeholderText: {
    color: '#666',
    fontSize: 15,
  },
  selectedText: {
    color: '#333',
    fontSize: 15,
  },
  dropdownContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemName: {
    fontSize: 14,
    color: '#333',
  },
  dateSelector: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  dateButton: {
    alignItems: 'center',
    paddingVertical: 20,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDate: {
    backgroundColor: '#0A7EA4',
    borderColor: '#0A7EA4',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
}); 