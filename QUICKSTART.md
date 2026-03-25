# FindCare - Quick Start Guide

## ✅ What Has Been Completed

### Backend (Spring Boot + MySQL)

**Complete implementation of all features:**

#### 1. **Entity Models** (7 entities)
- ✅ User (with roles: PATIENT, DOCTOR, RECEPTIONIST, ADMIN)
- ✅ Hospital (with type: GOVERNMENT, PRIVATE, NGO)
- ✅ Department
- ✅ Doctor
- ✅ TimeSlot
- ✅ Appointment (with status: PENDING, CONFIRMED, CANCELLED, COMPLETED)

#### 2. **Repositories** (6 repositories)
- All with custom query methods for searching and filtering

#### 3. **Services** (6 services)
- AuthService - Registration & Login with JWT
- HospitalService - Full CRUD operations
- DoctorService - Full CRUD operations
- AppointmentService - Booking, cancellation, check-in
- TimeSlotService - Doctor availability management
- DashboardService - Statistics for admin

#### 4. **Controllers** (7 REST APIs)
- AuthController - `/api/auth/*`
- HospitalController - `/api/hospitals/*`
- DoctorController - `/api/doctors/*`
- DepartmentController - `/api/departments/*`
- AppointmentController - `/api/appointments/*`
- TimeSlotController - `/api/timeslots/*`
- DashboardController - `/api/dashboard/*`

#### 5. **Security**
- JWT-based authentication
- Role-based authorization
- Password encryption (BCrypt)
- CORS configuration for React frontend

#### 6. **Exception Handling**
- Global exception handler
- Custom exceptions
- Validation error handling

---

## 🚀 How to Run the Backend

### Prerequisites
Make sure you have:
- ✅ Java 21 installed
- ✅ MySQL 8 running
- ✅ Maven installed

### Step 1: Create Database
```sql
CREATE DATABASE findcare;
```

### Step 2: Update Database Credentials
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Step 3: Run the Application

**Option A: Using Maven**
```bash
cd backend
mvn spring-boot:run
```

**Option B: Using Java directly**
```bash
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The backend will start on: **http://localhost:8080**

---

## 🧪 Testing the APIs

### 1. Register a User
```bash
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "PATIENT"
}
```

### 2. Login
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Copy the `token` from the response

### 3. Access Protected Endpoints
Add the token to your requests:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 📋 Complete API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/hospitals` | Get all hospitals | Public |
| GET | `/api/hospitals/{id}` | Get hospital by ID | Public |
| GET | `/api/hospitals/search?keyword=` | Search hospitals | Public |
| POST | `/api/hospitals` | Create hospital | Admin |
| PUT | `/api/hospitals/{id}` | Update hospital | Admin |
| DELETE | `/api/hospitals/{id}` | Delete hospital | Admin |
| GET | `/api/departments/hospital/{id}` | Get hospital departments | Public |
| POST | `/api/departments` | Create department | Admin |
| GET | `/api/doctors` | Get all doctors | Public |
| GET | `/api/doctors/hospital/{id}` | Get hospital doctors | Public |
| POST | `/api/doctors` | Create doctor | Admin |
| GET | `/api/timeslots/doctor/{id}/available?date=` | Get available slots | Public |
| POST | `/api/appointments` | Book appointment | Patient |
| GET | `/api/appointments/patient/{id}` | Get patient appointments | Patient |
| PUT | `/api/appointments/{id}/cancel` | Cancel appointment | Patient |
| GET | `/api/appointments/today` | Today's appointments | Receptionist |
| PUT | `/api/appointments/{id}/checkin` | Check-in patient | Receptionist |
| GET | `/api/dashboard/admin/stats` | Dashboard statistics | Admin |

---

## 🔧 Troubleshooting

### VS Code Lombok Errors
The red errors you see in VS Code for Lombok are **IDE-only issues**. The Maven build works fine.

**To fix VS Code errors:**
1. Install the "Lombok Annotations Support" extension in VS Code
2. Or run: `mvn clean compile` - the build will succeed

### Database Connection Error
Make sure MySQL is running and credentials in `application.properties` are correct.

### Port Already in Use
If port 8080 is busy, change it in `application.properties`:
```properties
server.port=8081
```

---

## 📁 Project Structure Summary

```
backend/
├── entity/          # 7 database entities
├── repository/      # 6 data access repositories
├── dto/             # 13 data transfer objects
├── service/         # 6 business logic services
├── controller/      # 7 REST API controllers
├── security/        # 4 security configuration files
├── exception/       # 3 exception handling files
└── resources/
    └── application.properties
```

**Total Files Created: 49 Java files**

---

## ✨ Key Features Implemented

### Patient Features
- ✅ Browse and search hospitals
- ✅ View hospital details and departments
- ✅ Browse doctors by hospital/department
- ✅ View doctor profiles
- ✅ View available time slots
- ✅ Book appointments
- ✅ View upcoming appointments
- ✅ Cancel appointments

### Doctor Features
- ✅ View personal schedule
- ✅ View upcoming appointments
- ✅ Complete appointments with notes

### Receptionist Features
- ✅ View today's appointments
- ✅ Search patients by name/phone
- ✅ Check-in patients

### Admin Features
- ✅ Manage hospitals (Add, Edit, Delete)
- ✅ Manage departments (Add, Edit, Delete)
- ✅ Manage doctors (Add, Edit, Delete)
- ✅ View dashboard statistics
- ✅ View all appointments

---

## 🎯 Next Steps

### 1. **Test the Backend**
Use Postman or cURL to test all endpoints

### 2. **Connect React Frontend**
Update your React app to call these APIs:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';

// Example: Login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### 3. **Add JWT to Axios/Fetch**
```javascript
// Add token to all requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

---

## 📖 Documentation

Full API documentation is available in:
- **backend/README.md** - Complete API reference with all endpoints

---

## ✅ System Status

**Backend:** ✅ Complete and ready to run  
**Database Schema:** ✅ Auto-created by Hibernate  
**Authentication:** ✅ JWT implemented  
**Authorization:** ✅ Role-based access control  
**CRUD Operations:** ✅ All implemented  
**Search & Filter:** ✅ Working  
**Exception Handling:** ✅ Global handler  

**You're ready to run the backend and start building your frontend!** 🚀
