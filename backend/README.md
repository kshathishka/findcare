# FindCare Backend API Documentation

## Overview
FindCare is a healthcare web application backend built with **Spring Boot 4.0.3**, **MySQL**, and **JWT authentication**. It provides REST APIs for managing hospitals, doctors, appointments, and role-based access control for patients, doctors, receptionists, and administrators.

## Tech Stack
- **Java 21**
- **Spring Boot 4.0.3**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL 8**
- **Maven**
- **Lombok**

## Getting Started

### Prerequisites
- Java 21 or higher
- MySQL 8 or higher
- Maven 3.6+

### Database Setup
1. Create a MySQL database:
```sql
CREATE DATABASE findcare;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### Running the Application

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Project Structure

```
backend/
├── src/main/java/com/findcare/backend/
│   ├── controller/          # REST Controllers
│   ├── service/             # Business Logic
│   ├── repository/          # Data Access Layer
│   ├── entity/              # JPA Entities
│   ├── dto/                 # Data Transfer Objects
│   ├── security/            # JWT & Security Config
│   ├── exception/           # Exception Handling
│   └── DemoApplication.java # Main Application
└── src/main/resources/
    └── application.properties
```

## API Endpoints

### Authentication APIs

#### POST /api/auth/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "PATIENT"
}
```
**Roles**: `PATIENT`, `DOCTOR`, `RECEPTIONIST`, `ADMIN`

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "token": "jwt_token_here",
  "type": "Bearer",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "PATIENT"
}
```

---

### Hospital APIs

#### GET /api/hospitals
Get all hospitals (Public)

#### GET /api/hospitals/{id}
Get hospital by ID (Public)

#### GET /api/hospitals/search?keyword={keyword}
Search hospitals by name, city, or address (Public)

#### GET /api/hospitals/type/{type}
Get hospitals by type: `GOVERNMENT`, `PRIVATE`, `NGO` (Public)

#### GET /api/hospitals/city/{city}
Get hospitals by city (Public)

#### POST /api/hospitals
Create a new hospital (Admin only)
```json
{
  "name": "City Hospital",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "type": "PRIVATE",
  "rating": 4.5,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "phone": "1234567890",
  "email": "info@cityhospital.com",
  "description": "Leading healthcare facility",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### PUT /api/hospitals/{id}
Update hospital (Admin only)

#### DELETE /api/hospitals/{id}
Delete hospital (Admin only)

---

### Department APIs

#### GET /api/departments
Get all departments (Public)

#### GET /api/departments/{id}
Get department by ID (Public)

#### GET /api/departments/hospital/{hospitalId}
Get departments by hospital (Public)

#### POST /api/departments
Create department (Admin only)
```json
{
  "name": "Cardiology",
  "description": "Heart and cardiovascular care",
  "hospitalId": 1
}
```

#### PUT /api/departments/{id}
Update department (Admin only)

#### DELETE /api/departments/{id}
Delete department (Admin only)

---

### Doctor APIs

#### GET /api/doctors
Get all doctors (Public)

#### GET /api/doctors/{id}
Get doctor by ID (Public)

#### GET /api/doctors/hospital/{hospitalId}
Get doctors by hospital (Public)

#### GET /api/doctors/department/{departmentId}
Get doctors by department (Public)

#### GET /api/doctors/search?keyword={keyword}
Search doctors by name or specialization (Public)

#### POST /api/doctors
Create doctor profile (Admin only)
```json
{
  "userId": 2,
  "departmentId": 1,
  "specialization": "Cardiologist",
  "qualification": "MD, FACC",
  "yearsOfExperience": 15,
  "consultationFee": 500.00,
  "licenseNumber": "DOC123456",
  "bio": "Experienced cardiologist",
  "profileImageUrl": "https://example.com/profile.jpg",
  "isAvailable": true
}
```

#### PUT /api/doctors/{id}
Update doctor (Admin only)

#### DELETE /api/doctors/{id}
Delete doctor (Admin only)

---

### Time Slot APIs

#### GET /api/timeslots/doctor/{doctorId}
Get all time slots for a doctor (Public)

#### GET /api/timeslots/doctor/{doctorId}/available?date=2024-03-15
Get available time slots for a doctor on a specific date (Public)

#### POST /api/timeslots
Create time slot (Admin/Doctor only)
```json
{
  "doctorId": 1,
  "date": "2024-03-15",
  "startTime": "09:00:00",
  "endTime": "10:00:00",
  "maxPatients": 3
}
```

#### DELETE /api/timeslots/{id}
Delete time slot (Admin/Doctor only)

---

### Appointment APIs

#### POST /api/appointments
Book an appointment (Patient only)
```json
{
  "doctorId": 1,
  "timeSlotId": 5,
  "patientNotes": "Chest pain for 2 days",
  "symptoms": "Chest pain, shortness of breath"
}
```

#### GET /api/appointments/patient/{patientId}
Get patient's appointments (Patient only)

#### GET /api/appointments/doctor/{doctorId}
Get doctor's appointments (Doctor/Admin only)

#### GET /api/appointments/today
Get today's appointments (Receptionist/Admin only)

#### GET /api/appointments/search?keyword={keyword}
Search appointments by patient name or phone (Receptionist/Admin only)

#### PUT /api/appointments/{id}/cancel
Cancel appointment (Patient only)

#### PUT /api/appointments/{id}/checkin
Check-in patient (Receptionist only)

#### PUT /api/appointments/{id}/complete?notes={notes}
Complete appointment (Doctor only)

---

### Dashboard APIs

#### GET /api/dashboard/admin/stats
Get admin dashboard statistics (Admin only)
```json
{
  "totalHospitals": 25,
  "totalDoctors": 150,
  "totalPatients": 5000,
  "totalAppointments": 10000,
  "todayAppointments": 45,
  "pendingAppointments": 12
}
```

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Role-Based Access Control

| Endpoint | Public | Patient | Doctor | Receptionist | Admin |
|----------|--------|---------|--------|--------------|-------|
| Auth APIs | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Hospitals/Doctors | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Hospitals | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Doctors | ❌ | ❌ | ❌ | ❌ | ✅ |
| Book Appointment | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Patient Appointments | ❌ | ✅ | ❌ | ❌ | ❌ |
| Check-in Appointment | ❌ | ❌ | ❌ | ✅ | ❌ |
| Complete Appointment | ❌ | ❌ | ✅ | ❌ | ❌ |
| Dashboard Stats | ❌ | ❌ | ❌ | ❌ | ✅ |

## Database Schema

### Key Entities:
- **User**: Base user entity with roles
- **Hospital**: Hospital information
- **Department**: Hospital departments
- **Doctor**: Doctor profiles linked to users and departments
- **TimeSlot**: Available time slots for doctors
- **Appointment**: Patient appointments with doctors

### Relationships:
- Hospital → Department (One-to-Many)
- Department → Doctor (One-to-Many)
- Doctor → TimeSlot (One-to-Many)
- Doctor → Appointment (One-to-Many)
- User (Patient) → Appointment (One-to-Many)

## Testing with Postman

1. **Register a user** (POST /api/auth/signup)
2. **Login** (POST /api/auth/login) - Copy the JWT token
3. **Set Authorization header** in Postman: `Bearer <your_jwt_token>`
4. **Test protected endpoints**

## Common Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## Features Implemented

✅ User authentication with JWT  
✅ Role-based authorization  
✅ Hospital management (CRUD)  
✅ Doctor management (CRUD)  
✅ Department management (CRUD)  
✅ Appointment booking system  
✅ Time slot management  
✅ Patient dashboard  
✅ Doctor dashboard  
✅ Receptionist check-in system  
✅ Admin dashboard with statistics  
✅ Search functionality  
✅ Exception handling  
✅ CORS configuration  

## Next Steps

### Backend:
1. Add email notifications for appointments
2. Implement password reset functionality
3. Add file upload for images
4. Implement pagination for list endpoints
5. Add appointment reminders
6. Implement rating and review system

### Frontend Integration:
Connect your React frontend to these endpoints using the JWT token for authentication.

## Contributing

This is a college project for the FindCare healthcare platform.

## License

Academic Project - 2024
