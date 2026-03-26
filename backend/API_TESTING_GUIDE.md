# FindCare API Testing Guide

This guide provides curl commands and instructions to test all API endpoints. Use these commands to verify that your frontend can successfully communicate with the backend.

## Base URLs

- **Local Development**: `http://localhost:8080`
- **Render Production**: `https://your-app.onrender.com`

Replace `BASE_URL` in the examples below with your actual URL.

---

## 1. Authentication Endpoints

### 1.1 User Registration (Signup)

```bash
# Register as a Patient
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "phone": "+1-555-0123",
    "role": "PATIENT"
  }'

# Register as a Doctor
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "phone": "+1-555-0456",
    "role": "DOCTOR"
  }'

# Register as an Admin
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "phone": "+1-555-0789",
    "role": "ADMIN"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### 1.2 User Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "PATIENT",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

## 2. Public Endpoints (No Authentication Required)

### 2.1 Get All Hospitals

```bash
# Get all hospitals (paginated)
curl -X GET "http://localhost:8080/api/hospitals?page=0&size=10&sort=id,desc" \
  -H "Content-Type: application/json"

# Simple request
curl -X GET http://localhost:8080/api/hospitals \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Central Hospital",
        "address": "123 Main St",
        "city": "New York",
        "hospitalType": "GENERAL",
        "phoneNumber": "+1-555-1234"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 5,
    "totalPages": 1
  },
  "message": "Hospitals retrieved successfully"
}
```

### 2.2 Get Hospital by ID

```bash
curl -X GET http://localhost:8080/api/hospitals/1 \
  -H "Content-Type: application/json"
```

### 2.3 Get All Doctors

```bash
curl -X GET "http://localhost:8080/api/doctors?page=0&size=10" \
  -H "Content-Type: application/json"
```

### 2.4 Get Doctor by ID

```bash
curl -X GET http://localhost:8080/api/doctors/1 \
  -H "Content-Type: application/json"
```

### 2.5 Get Doctors by Hospital

```bash
curl -X GET "http://localhost:8080/api/doctors/hospital/1?page=0&size=10" \
  -H "Content-Type: application/json"
```

### 2.6 Get Doctors by Department

```bash
curl -X GET "http://localhost:8080/api/doctors/department/1?page=0&size=10" \
  -H "Content-Type: application/json"
```

### 2.7 Get All Departments

```bash
curl -X GET http://localhost:8080/api/departments \
  -H "Content-Type: application/json"
```

### 2.8 Get Department by ID

```bash
curl -X GET http://localhost:8080/api/departments/1 \
  -H "Content-Type: application/json"
```

### 2.9 Get Departments by Hospital

```bash
curl -X GET http://localhost:8080/api/departments/hospital/1 \
  -H "Content-Type: application/json"
```

### 2.10 Get Time Slots for a Doctor

```bash
curl -X GET "http://localhost:8080/api/timeslots/doctor/1?page=0&size=20" \
  -H "Content-Type: application/json"
```

---

## 3. Protected Endpoints (Requires Authentication)

For protected endpoints, include the JWT token in the Authorization header:

```bash
-H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 3.1 Create an Appointment (PATIENT only)

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "doctorId": 1,
    "timeSlotId": 1,
    "symptoms": "Headache and fever",
    "appointmentDate": "2026-04-15"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patientId": 1,
    "doctorId": 1,
    "appointmentDate": "2026-04-15",
    "timeSlot": "10:00-10:30",
    "status": "SCHEDULED",
    "symptoms": "Headache and fever"
  },
  "message": "Appointment booked successfully"
}
```

### 3.2 Get Patient's Appointments

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:8080/api/appointments/patient/1?page=0&size=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

### 3.3 Get Doctor's Appointments

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:8080/api/appointments/doctor/1?page=0&size=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

### 3.4 Update Appointment Status (DOCTOR only)

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PUT http://localhost:8080/api/appointments/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "COMPLETED",
    "notes": "Patient is healthy"
  }'
```

### 3.5 Cancel an Appointment

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X DELETE http://localhost:8080/api/appointments/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

### 3.6 Dashboard Statistics (ADMIN only)

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:8080/api/dashboard/stats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Admin-Only Endpoints

### 4.1 Create Department

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8080/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Cardiology",
    "description": "Heart and cardiovascular diseases",
    "hospitalId": 1
  }'
```

### 4.2 Create Hospital

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8080/api/hospitals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "New Medical Center",
    "address": "456 Park Ave",
    "city": "Boston",
    "hospitalType": "SPECIALTY",
    "phoneNumber": "+1-555-9876"
  }'
```

### 4.3 Create Doctor

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8080/api/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Dr. Mark Johnson",
    "email": "mark@example.com",
    "specialization": "Cardiology",
    "qualification": "MD, Board Certified",
    "hospitalId": 1,
    "departmentId": 1,
    "consultationFee": 150.00
  }'
```

---

## 5. Testing CORS Configuration

### 5.1 CORS Preflight Request (OPTIONS)

```bash
curl -X OPTIONS http://localhost:8080/api/hospitals \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type" \
  -v
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, ...
Access-Control-Allow-Credentials: true
```

---

## 6. Error Responses

### 6.1 Unauthorized (401)

**Request (missing token):**
```bash
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"doctorId": 1}'
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "JWT token is expired or invalid",
  "code": "UNAUTHORIZED"
}
```

### 6.2 Forbidden (403)

**Request (wrong role):**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # Patient token

curl -X POST http://localhost:8080/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Cardiology", "hospitalId": 1}'
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "error": "Access denied: You don't have permission to access this resource",
  "code": "FORBIDDEN"
}
```

### 6.3 Not Found (404)

**Response:**
```json
{
  "success": false,
  "error": "Doctor not found with id: 999",
  "code": "NOT_FOUND"
}
```

### 6.4 Validation Error (400)

**Response:**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "BAD_REQUEST",
  "data": {
    "email": "Email should be valid",
    "password": "Password must be between 8 and 72 characters"
  }
}
```

---

## 7. Setting up Environment for Render Deployment

### Environment Variables to set on Render:

```
# Database
DB_HOST=your-mysql-host.c.aivencloud.com
DB_PORT=3306
DB_NAME=findcare_prod
DB_USERNAME=dbuser
DB_PASSWORD=your_secure_password
DB_USE_SSL=true

# JWT
JWT_SECRET=your_very_secure_jwt_secret_key_min_32_chars
JWT_EXPIRATION_MS=86400000

# CORS - Set to your Render frontend URL
CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com

# Server
PORT=8080
SPRING_PROFILES_ACTIVE=prod

# Logging
LOG_LEVEL=INFO
LOG_LEVEL_APP=DEBUG

# Rate Limiting
AUTH_RATE_LIMIT_MAX_ATTEMPTS=5
AUTH_RATE_LIMIT_WINDOW_SECONDS=60
```

---

## 8. Testing from Frontend

In your React frontend (`src/lib/api.js`), ensure your VITE environment variable is set:

```javascript
// .env (local development)
VITE_API_BASE_URL=http://localhost:8080

// .env.production (for Render deployment)
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## 9. Troubleshooting

### CORS Error: "No 'Access-Control-Allow-Origin' header"

**Solution:**
1. Check that `CORS_ALLOWED_ORIGINS` environment variable includes your frontend URL
2. Verify the frontend domain matches exactly (including protocol and port)
3. For development: use `http://localhost:5173`
4. For production: use your Render frontend URL without trailing slash

### JWT Expired Error (401)

```bash
# Token expires after 24 hours (86400000 ms)
# Get a new token by calling /api/auth/login again
```

### 403 Forbidden on Protected Endpoint

1. Verify user role has permission (check @PreAuthorize annotation)
2. Use correct Authorization header format: `Bearer <token>`
3. Token must be valid and not expired

### Connection Refused (localhost)

```bash
# Ensure backend is running:
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

---

## 10. Using Postman

1. **Create new Postman collection**
2. **Set collection variable:**
   - Name: `base_url`
   - Value: `http://localhost:8080`
   - Name: `token`
   - Value: (paste JWT from login response)

3. **Use in requests:** `{{base_url}}/api/hospitals`

4. **For protected requests:** 
   - Add header: `Authorization: Bearer {{token}}`

---

## 11. Quick Test Script

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"

# Test public endpoints
echo "Testing public endpoints..."
curl -s "$BASE_URL/api/hospitals" | jq .
curl -s "$BASE_URL/api/doctors" | jq .
curl -s "$BASE_URL/api/departments" | jq .

# Sign up and login
echo "Testing authentication..."
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "+1-555-0000",
    "role": "PATIENT"
  }')

TOKEN=$(echo $SIGNUP_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

# Test protected endpoint
echo "Testing protected endpoint..."
curl -s -X GET "$BASE_URL/api/appointments/patient/1" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Save as `test_api.sh` and run:
```bash
chmod +x test_api.sh
./test_api.sh
```
