import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

// Mock doctor data
const initialDoctorData = {
  id: 'doc1',
  name: 'Dr. Jamshid Rahimov',
  specialization: 'Stomatolog',
  bio: 'Umumiy stomatologiya bo\'yicha mutaxassis. Tishlarni davolash, protezlash va estetik stomatologiya bo\'yicha tajribaga ega.',
  education: 'Toshkent Tibbiyot Akademiyasi',
  email: 'jamshid.rahimov@example.com',
  phone: '+998 90 123 4567',
  languages: ['O\'zbek', 'Rus'],
  experience: [
    { id: '1', field: 'Tish davolash', years: 10 },
    { id: '2', field: 'Protezlash', years: 8 },
    { id: '3', field: 'Estetik stomatologiya', years: 5 },
  ],
  notifications: true,
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [doctorData, setDoctorData] = useState(initialDoctorData);
  const [editing, setEditing] = useState(false);
  const [newExperienceField, setNewExperienceField] = useState('');
  const [newExperienceYears, setNewExperienceYears] = useState('');

  const handleInputChange = (field, value) => {
    setDoctorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setDoctorData(prevData => ({
      ...prevData,
      experience: prevData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addExperience = () => {
    if (!newExperienceField.trim() || !newExperienceYears.trim()) {
      Alert.alert('Xatolik', 'Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    const years = parseInt(newExperienceYears);
    if (isNaN(years) || years <= 0) {
      Alert.alert('Xatolik', 'Yillar soni musbat son bo\'lishi kerak');
      return;
    }

    const newExperience = {
      id: Date.now().toString(),
      field: newExperienceField,
      years: years,
    };

    setDoctorData(prevData => ({
      ...prevData,
      experience: [...prevData.experience, newExperience],
    }));

    setNewExperienceField('');
    setNewExperienceYears('');
  };

  const removeExperience = (id) => {
    setDoctorData(prevData => ({
      ...prevData,
      experience: prevData.experience.filter(exp => exp.id !== id),
    }));
  };

  const saveProfile = () => {
    // Here you would send this data to your backend/database
    console.log('Saving profile:', doctorData);
    Alert.alert('Muvaffaqiyatli', 'Profil ma\'lumotlari saqlandi');
    setEditing(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mening profilim</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setEditing(!editing)}
        >
          <Text style={styles.editButtonText}>{editing ? 'Bekor qilish' : 'Tahrirlash'}</Text>
          <FontAwesome name={editing ? 'times' : 'edit'} size={16} color="#0A7EA4" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Asosiy ma'lumotlar</Text>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>To'liq ism</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={doctorData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="To'liq ismingiz"
            />
          ) : (
            <Text style={styles.fieldValue}>{doctorData.name}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Mutaxassislik</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={doctorData.specialization}
              onChangeText={(value) => handleInputChange('specialization', value)}
              placeholder="Mutaxassisligingiz"
            />
          ) : (
            <Text style={styles.fieldValue}>{doctorData.specialization}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>O'zingiz haqingizda</Text>
          {editing ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={doctorData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="O'zingiz haqingizdagi qisqacha ma'lumot"
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.fieldValue}>{doctorData.bio}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tajriba</Text>
        
        {doctorData.experience.map((exp, index) => (
          <View key={exp.id} style={styles.experienceItem}>
            {editing ? (
              <>
                <View style={styles.experienceInputContainer}>
                  <TextInput
                    style={[styles.input, { flex: 2 }]}
                    value={exp.field}
                    onChangeText={(value) => handleExperienceChange(exp.id, 'field', value)}
                    placeholder="Soha"
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 10 }]}
                    value={exp.years.toString()}
                    onChangeText={(value) => handleExperienceChange(exp.id, 'years', parseInt(value) || 0)}
                    placeholder="Yil"
                    keyboardType="numeric"
                  />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeExperience(exp.id)}
                >
                  <FontAwesome name="trash" size={16} color="#F44336" />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.fieldValue}>
                {exp.field}: <Text style={styles.experienceYears}>{exp.years} yil</Text>
              </Text>
            )}
          </View>
        ))}

        {editing && (
          <View style={styles.addExperienceContainer}>
            <View style={styles.experienceInputContainer}>
              <TextInput
                style={[styles.input, { flex: 2 }]}
                value={newExperienceField}
                onChangeText={setNewExperienceField}
                placeholder="Yangi soha"
              />
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 10 }]}
                value={newExperienceYears}
                onChangeText={setNewExperienceYears}
                placeholder="Yil"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={addExperience}
            >
              <FontAwesome name="plus" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bog'lanish ma'lumotlari</Text>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={doctorData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Email manzilingiz"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.fieldValue}>{doctorData.email}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Telefon</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={doctorData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Telefon raqamingiz"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.fieldValue}>{doctorData.phone}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sozlamalar</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Bildirishnomalar</Text>
          <Switch
            value={doctorData.notifications}
            onValueChange={(value) => handleInputChange('notifications', value)}
            trackColor={{ false: '#767577', true: '#E6F7FF' }}
            thumbColor={doctorData.notifications ? '#0A7EA4' : '#f4f3f4'}
            disabled={!editing}
          />
        </View>
      </View>

      {editing && (
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Saqlash</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  contentContainer: {
    paddingBottom: 100,
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#0A7EA4',
    marginRight: 5,
  },
  editIcon: {
    marginTop: 2,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  experienceInputContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  experienceYears: {
    fontWeight: 'bold',
  },
  addExperienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    padding: 10,
    marginLeft: 10,
  },
  removeButton: {
    padding: 10,
    marginLeft: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#0A7EA4',
    borderRadius: 12,
    padding: 15,
    margin: 20,
    marginBottom: 50,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 