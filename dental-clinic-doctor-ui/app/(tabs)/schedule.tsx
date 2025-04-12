import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Switch, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Dushanba' },
  { id: 1, name: 'Seshanba' },
  { id: 2, name: 'Chorshanba' },
  { id: 3, name: 'Payshanba' },
  { id: 4, name: 'Juma' },
  { id: 5, name: 'Shanba' },
  { id: 6, name: 'Yakshanba' },
];

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Initial schedule state
  const [schedule, setSchedule] = useState(
    DAYS_OF_WEEK.map(day => ({
      id: day.id,
      name: day.name,
      isWorking: day.id < 5, // Monday to Friday by default
      startTime: '09:00',
      endTime: '18:00',
      lunchStart: '13:00',
      lunchEnd: '14:00',
      maxAppointments: 10,
    }))
  );

  const [editingDay, setEditingDay] = useState(null);

  const handleDayToggle = (dayId) => {
    setSchedule(schedule.map(day => 
      day.id === dayId ? { ...day, isWorking: !day.isWorking } : day
    ));
  };

  const handleTimeChange = (dayId, field, value) => {
    setSchedule(schedule.map(day => 
      day.id === dayId ? { ...day, [field]: value } : day
    ));
  };

  const handleMaxAppointmentsChange = (dayId, value) => {
    const numValue = parseInt(value) || 0;
    setSchedule(schedule.map(day => 
      day.id === dayId ? { ...day, maxAppointments: numValue } : day
    ));
  };

  const saveSchedule = () => {
    // Here you would save this to your backend/database
    console.log('Saving schedule:', schedule);
    alert('Jadval saqlandi!');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ish jadvali</Text>
        <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
          O'zingizning ish kunlaringizni va soatlaringizni tanlang
        </Text>
      </View>

      <View style={styles.scheduleContainer}>
        {schedule.map((day) => (
          <View key={day.id} style={styles.dayRow}>
            <View style={styles.dayNameContainer}>
              <Text style={[styles.dayName, { color: colors.text }]}>{day.name}</Text>
              <Switch
                value={day.isWorking}
                onValueChange={() => handleDayToggle(day.id)}
                trackColor={{ false: '#767577', true: '#E6F7FF' }}
                thumbColor={day.isWorking ? '#0A7EA4' : '#f4f3f4'}
              />
            </View>

            {day.isWorking && (
              <View style={styles.timeContainer}>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>Ish boshlash:</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={day.startTime}
                    onChangeText={(value) => handleTimeChange(day.id, 'startTime', value)}
                    placeholder="09:00"
                    keyboardType="default"
                  />
                </View>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>Ish tugash:</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={day.endTime}
                    onChangeText={(value) => handleTimeChange(day.id, 'endTime', value)}
                    placeholder="18:00"
                    keyboardType="default"
                  />
                </View>
              </View>
            )}

            {day.isWorking && (
              <View style={styles.timeContainer}>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>Tushlik boshlash:</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={day.lunchStart}
                    onChangeText={(value) => handleTimeChange(day.id, 'lunchStart', value)}
                    placeholder="13:00"
                    keyboardType="default"
                  />
                </View>
                <View style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>Tushlik tugash:</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={day.lunchEnd}
                    onChangeText={(value) => handleTimeChange(day.id, 'lunchEnd', value)}
                    placeholder="14:00"
                    keyboardType="default"
                  />
                </View>
              </View>
            )}

            {day.isWorking && (
              <View style={styles.appointmentLimitContainer}>
                <Text style={styles.timeLabel}>Maksimal navbatlar soni:</Text>
                <TextInput
                  style={styles.numberInput}
                  value={day.maxAppointments.toString()}
                  onChangeText={(value) => handleMaxAppointmentsChange(day.id, value)}
                  keyboardType="numeric"
                />
              </View>
            )}

            {day.isWorking && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSchedule}>
        <Text style={styles.saveButtonText}>Jadvalini saqlash</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  contentContainer: {
    paddingBottom: 100, // Add bottom padding to ensure content is visible above tab bar
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  scheduleContainer: {
    padding: 20,
  },
  dayRow: {
    marginBottom: 20,
  },
  dayNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeSlot: {
    width: '48%',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  appointmentLimitContainer: {
    marginBottom: 10,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#0A7EA4',
    borderRadius: 12,
    padding: 15,
    margin: 20,
    marginBottom: 50, // Add extra margin at the bottom
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 