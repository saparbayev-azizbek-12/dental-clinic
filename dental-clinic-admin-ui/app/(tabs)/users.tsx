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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

// Define user types
type UserRole = 'patient' | 'doctor' | 'admin';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending';
  registrationDate: string;
}

// Mock data for users
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Aziza Karimova',
    phone: '+998 90 123 4567',
    email: 'aziza@example.com',
    role: 'patient',
    status: 'active',
    registrationDate: '2023-05-15',
  },
  {
    id: '2',
    name: 'Dr. Jamshid Rahimov',
    phone: '+998 90 765 4321',
    email: 'jamshid@example.com',
    role: 'doctor',
    status: 'active',
    registrationDate: '2023-04-20',
  },
  {
    id: '3',
    name: 'Malika Rahimova',
    phone: '+998 90 111 2222',
    email: 'malika@example.com',
    role: 'patient',
    status: 'active',
    registrationDate: '2023-06-01',
  },
  {
    id: '4',
    name: 'Dr. Sanjar Qosimov',
    phone: '+998 90 333 4444',
    email: 'sanjar@example.com',
    role: 'doctor',
    status: 'active',
    registrationDate: '2023-06-10',
  },
  {
    id: '5',
    name: 'Nargiza Berdiyeva',
    phone: '+998 90 555 6666',
    email: 'nargiza@example.com',
    role: 'patient',
    status: 'active',
    registrationDate: '2023-05-25',
  },
  {
    id: '6',
    name: 'Admin Supervisor',
    phone: '+998 90 777 8888',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    registrationDate: '2023-01-01',
  },
  {
    id: '7',
    name: 'Gulnora Azimova',
    phone: '+998 90 999 0000',
    email: 'gulnora@example.com',
    role: 'patient',
    status: 'active',
    registrationDate: '2023-06-12',
  },
];

export default function UsersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter users based on search query and selected role
  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleRoleChange = (role: UserRole) => {
    if (!selectedUser) return;
    
    // Prevent changing role to admin
    if (role === 'admin') {
      Alert.alert(
        'Ruxsat yo\'q',
        'Admin hisobini yaratish mumkin emas.'
      );
      return;
    }

    // Only allow changing patients to doctors, not vice versa
    if (selectedUser.role === 'doctor' && role === 'patient') {
      Alert.alert(
        'Ruxsat yo\'q',
        'Shifokor rolini bemorga o\'zgartirish mumkin emas.'
      );
      return;
    }
    
    // In a real app, this would be an API call
    Alert.alert(
      'Rol o\'zgartirish',
      `${selectedUser.name} ning roli "${role}" ga o'zgartiriladi.`,
      [
        {
          text: 'Bekor qilish',
          style: 'cancel',
        },
        {
          text: 'Tasdiqlash',
          onPress: () => {
            // Update user role logic would go here
            Alert.alert('Muvaffaqiyatli', 'Foydalanuvchi roli o\'zgartirildi');
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    Alert.alert(
      'Foydalanuvchini o\'chirish',
      `${selectedUser.name} ni o'chirishni tasdiqlaysizmi?`,
      [
        {
          text: 'Bekor qilish',
          style: 'cancel',
        },
        {
          text: 'O\'chirish',
          style: 'destructive',
          onPress: () => {
            // Delete user logic would go here
            Alert.alert('Muvaffaqiyatli', 'Foydalanuvchi o\'chirildi');
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(item)}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userPhone}>{item.phone}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.userMeta}>
        <View style={[
          styles.roleBadge,
          { 
            backgroundColor: 
              item.role === 'doctor' ? '#E6F7FF' : 
              item.role === 'admin' ? '#F0E6FF' : '#E6FFE6'
          }
        ]}>
          <Text style={[
            styles.roleText, 
            { 
              color: 
                item.role === 'doctor' ? '#0A7EA4' : 
                item.role === 'admin' ? '#8A63D2' : '#4CAF50' 
            }
          ]}>
            {item.role === 'doctor' ? 'Shifokor' : 
             item.role === 'admin' ? 'Admin' : 'Bemor'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Foydalanuvchilar</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push('/users/new')}
        >
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Qo'shish</Text>
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
        <TouchableOpacity
          style={[styles.filterButton, selectedRole === 'all' && styles.activeFilterButton]}
          onPress={() => setSelectedRole('all')}
        >
          <Text style={[styles.filterButtonText, 
            selectedRole === 'all' && styles.activeFilterText]}>Barchasi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedRole === 'doctor' && styles.activeFilterButton]}
          onPress={() => setSelectedRole('doctor')}
        >
          <Text style={[styles.filterButtonText, 
            selectedRole === 'doctor' && styles.activeFilterText]}>Shifokorlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedRole === 'patient' && styles.activeFilterButton]}
          onPress={() => setSelectedRole('patient')}
        >
          <Text style={[styles.filterButtonText, 
            selectedRole === 'patient' && styles.activeFilterText]}>Bemorlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedRole === 'admin' && styles.activeFilterButton]}
          onPress={() => setSelectedRole('admin')}
        >
          <Text style={[styles.filterButtonText, 
            selectedRole === 'admin' && styles.activeFilterText]}>Adminlar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.userList}
      />

      {/* User Actions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Foydalanuvchi amallar</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <FontAwesome name="times" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalUserName}>{selectedUser.name}</Text>
                  <Text style={styles.modalUserRole}>
                    {selectedUser.role === 'doctor' ? 'Shifokor' : 
                     selectedUser.role === 'admin' ? 'Admin' : 'Bemor'}
                  </Text>

                  {selectedUser.role === 'patient' && (
                    <View style={styles.actionButtons}>
                      <Text style={styles.actionTitle}>Rolni o'zgartirish:</Text>
                      <View style={styles.roleButtons}>
                        <TouchableOpacity 
                          style={[styles.roleButton, { backgroundColor: '#E6F7FF' }]}
                          onPress={() => handleRoleChange('doctor')}
                        >
                          <Text style={[styles.roleButtonText, { color: '#0A7EA4' }]}>Shifokorga o'zgartirish</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#F44336', marginTop: 20 }]}
                    onPress={handleDeleteUser}
                  >
                    <Text style={styles.actionButtonText}>Foydalanuvchini o'chirish</Text>
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
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
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
  userList: {
    padding: 15,
    paddingBottom: 100,
  },
  userCard: {
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
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 5,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
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
  modalUserName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalUserRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  actionButtons: {
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    padding: 12,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  roleButtonText: {
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