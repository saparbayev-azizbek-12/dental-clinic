# 🦷 Dental Clinic App

This is a mobile application designed for dental clinics to manage appointments, doctors' schedules, and patient interactions. The app includes three types of users: **Patient**, **Doctor**, and **Admin**.

## 📱 Technologies Used

- **Frontend**: React Native (Expo)
- **Backend**: Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Email & Google Sign-In

---

## 👥 User Roles

### 👤 Patient
- View available doctors and their schedules
- See available services and prices
- Book and cancel appointments

### 👨‍⚕️ Doctor
- Manage personal schedule
- Set available services and pricing
- View upcoming appointments

### 🛠️ Admin
- Add or remove doctors
- Monitor and manage appointments
- View system analytics

---

## 🛠️ Project Structure

```bash
.
├── backend/
│   ├── services/
│   ├── appointments/
│   ├── schedules/
│   └── users/
├── mobile/
│   └── react-native-app/
└── README.md
