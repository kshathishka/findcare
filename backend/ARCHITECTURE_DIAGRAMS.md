# FindCare Backend - Visual Architecture & Flow Diagrams

## 1. System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                           │
│            https://findcare-frontend.onrender.com             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  - HomePage, HospitalsPage, DoctorsPage               │  │
│  │  - AppointmentsPage, LoginPage, RegisterPage          │  │
│  │  - AuthContext, ToastContext                          │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┘
                        │ HTTP/HTTPS
                        │ (CORS Enabled)
                        ▼
┌───────────────────────────────────────────────────────────────┐
│                SPRING BOOT BACKEND (Java)                     │
│            https://findcare-backend.onrender.com              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  REST Controllers                                       │  │
│  │  ├── AuthController (/api/auth/*)                     │  │
│  │  ├── HospitalController (/api/hospitals/*)            │  │
│  │  ├── DoctorController (/api/doctors/*)                │  │
│  │  ├── DepartmentController (/api/departments/*)        │  │
│  │  ├── AppointmentController (/api/appointments/*)      │  │
│  │  └── TimeSlotController (/api/timeslots/*)            │  │
│  └──────────────────┬──────────────────────────────────────┘  │
│  ┌──────────────────▼──────────────────────────────────────┐  │
│  │  Security Layer                                         │  │
│  │  ├── JWT Authentication Filter (Bearer token)         │  │
│  │  ├── Role-Based Authorization (@PreAuthorize)         │  │
│  │  ├── CORS Configuration (preflight handling)          │  │
│  │  └── Rate Limiting (login attempts)                   │  │
│  └──────────────────┬──────────────────────────────────────┘  │
│  ┌──────────────────▼──────────────────────────────────────┐  │
│  │  Service Layer                                          │  │
│  │  ├── AuthService                                       │  │
│  │  ├── HospitalService                                   │  │
│  │  ├── DoctorService                                     │  │
│  │  └── AppointmentService                                │  │
│  └──────────────────┬──────────────────────────────────────┘  │
│  ┌──────────────────▼──────────────────────────────────────┐  │
│  │  Exception Handling                                     │  │
│  │  └── GlobalExceptionHandler (@RestControllerAdvice)   │  │
│  └──────────────────┬──────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┘
                        │ JDBC
                        │ (SSL/TLS)
                        ▼
┌───────────────────────────────────────────────────────────────┐
│                    MYSQL DATABASE                             │
│            your-db.c.aivencloud.com:3306                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Tables:                                                │  │
│  │  ├── user (id, email, name, password, role)           │  │
│  │  ├── hospital (id, name, address, type)               │  │
│  │  ├── doctor (id, name, email, specialization)         │  │
│  │  ├── department (id, name, hospital_id)               │  │
│  │  ├── time_slot (id, doctor_id, start_time, end_time) │  │
│  │  └── appointment (id, patient_id, doctor_id, status)  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication Flow

```
User (Browser)                Frontend (React)          Backend (Spring Boot)
     │                              │                            │
     │  1. Click Register          │                            │
     ├─────────────────────────────→│                            │
     │                              │  2. POST /api/auth/signup │
     │                              ├───────────────────────────→│
     │                              │                   3. Hash   │
     │                              │                   Password  │
     │                              │                   & Save    │
     │                              │   4. Return JWT Token      │
     │                              │←───────────────────────────┤
     │              5. Store token  │                            │
     │              in localStorage │←────────────────────────────
     │←─────────────────────────────┤                            │
     │                              │                            │
     │  6. Click Login             │                            │
     ├─────────────────────────────→│                            │
     │                              │  7. POST /api/auth/login  │
     │                              ├───────────────────────────→│
     │                              │         8. Validate        │
     │                              │         Credentials        │
     │                              │   9. Return JWT Token     │
     │                              │←───────────────────────────┤
     │              10. Send token  │                            │
     │              with requests   │←────────────────────────────
     │←─────────────────────────────┤                            │
     │                              │                            │
     │  11. Access Appointments    │                            │
     ├─────────────────────────────→│                            │
     │                              │  12. GET /api/appointments │
     │                              │  Authorization: Bearer JWT │
     │                              ├───────────────────────────→│
     │                              │  13. Validate JWT          │
     │                              │  14. Check role/permissions│
     │                              │  15. Return appointments   │
     │                              │←───────────────────────────┤
     │             16. Display      │                            │
     │             appointments     │←────────────────────────────
     │←─────────────────────────────┤                            │
     │                              │                            │
```

---

## 3. CORS Request Flow

```
Browser (http://localhost:5173)          Backend (http://localhost:8080)
         │                                        │
         │  1. User clicks "View Hospitals"      │
         │                                        │
         │  2. Browser checks if cross-origin    │
         │     Same origin? No! (different port) │
         │     Send preflight OPTIONS request... │
         │                                        │
         ├─────── OPTIONS /api/hospitals ───────→│
         │      Origin: http://localhost:5173    │
         │      Access-Control-Request-Method:   │
         │      GET                              │
         │                                        │
         │                                        │ 3. Match origin against
         │                                        │    CORS_ALLOWED_ORIGINS
         │                                        │    (http://localhost:5173)
         │                                        │
         │←─ OPTIONS Response Headers ───────────┤
         │   Access-Control-Allow-Origin:        │
         │   http://localhost:5173               │
         │   Access-Control-Allow-Methods:       │
         │   GET, POST, PUT, DELETE, PATCH      │
         │   Access-Control-Allow-Headers:       │
         │   Authorization, Content-Type         │
         │                                        │
         │  4. Browser sees origin allowed       │
         │     Permission granted! Send actual   │
         │     GET request...                    │
         │                                        │
         ├─── GET /api/hospitals ───────────────→│
         │                                        │
         │                                        │ 5. Process request
         │                                        │    Return hospitals
         │                                        │
         │←─ GET Response ─────────────────────────┤
         │   [Hospital Data]                      │
         │   Access-Control-Allow-Origin:         │
         │   http://localhost:5173                │
         │                                        │
         │  6. Origin allowed, browser accepts   │
         │     response and displays data        │
         │                                        │
```

---

## 4. Request/Response Lifecycle

```
REQUEST ──┬─→ [1. Security Filter Layer]
          │    ├─→ Check CORS headers (preflight)
          │    ├─→ Extract JWT from header
          │    └─→ Validate JWT token
          │
          ├─→ [2. Authorization Check]
          │    ├─→ Check endpoint path
          │    ├─→ Check @PreAuthorize rules
          │    ├─→ Check user role
          │    └─→ Allow/Deny access
          │
          ├─→ [3. Controller]
          │    ├─→ Extract request body
          │    ├─→ Validate parameters
          │    └─→ Call service layer
          │
          ├─→ [4. Service Layer]
          │    ├─→ Business logic
          │    ├─→ Database queries
          │    └─→ Process data
          │
          ├─→ [5. Exception Handler]
          │    ├─→ Catch any exceptions
          │    ├─→ Generate error response
          │    └─→ Return proper HTTP status
          │
          └─→ [6. Response]
               ├─→ Wrap in ApiResponse<T>
               ├─→ Add CORS headers
               ├─→ Send to client
               └─→ RESPONSE

            Status Codes:
            ✓ 200 OK           - Success (GET, PUT)
            ✓ 201 Created      - Resource created (POST)
            ✓ 204 No Content   - Success with no body (DELETE)
            ✗ 400 Bad Request  - Invalid data
            ✗ 401 Unauthorized - Missing/invalid token
            ✗ 403 Forbidden    - No permission
            ✗ 404 Not Found    - Resource doesn't exist
            ✗ 409 Conflict     - Database conflict (duplicate)
            ✗ 429 Too Many     - Rate limit exceeded
            ✗ 500 Server Error - Internal error
```

---

## 5. JWT Token Structure

```
JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI...
           ┌──────────────────┬──────────────────┬──────────────┐
           │      HEADER      │      PAYLOAD     │   SIGNATURE  │
           └──────────────────┴──────────────────┴──────────────┘
                 │                   │                  │
                 │                   │                  │
          ┌──────▼──────┐    ┌───────▼────────┐  ┌────▼─────────┐
          │{            │    │{               │  │              │
          │ "alg": "HS  │    │ "sub": "user@  │  │ HMACSHA256(  │
          │   256",     │    │     example.   │  │   base64Url  │
          │ "typ": "JWT"    │   com",         │  │ (header) + "."│
          │}            │    │ "role": "      │  │ + base64Url  │
          │             │    │   PATIENT",    │  │ (payload),   │
          │             │    │ "iat":         │  │ JWT_SECRET)  │
          │             │    │   1640000000,  │  │              │
          │             │    │ "exp":         │  │              │
          │             │    │   1640086400   │  │              │
          │             │    │}               │  │              │
          └─────────────┘    └────────────────┘  └──────────────┘
          
          Base64 Encoded     Base64 Encoded     HMAC Signature

          Decoded:
          ├─ Algorithm: HMAC SHA-256
          ├─ Type: JWT
          ├─ Subject (user): user@example.com
          ├─ Role: PATIENT
          ├─ Issued At: 1640000000
          ├─ Expires At: 1640086400 (24 hours later)
          └─ Signature: Verified using JWT_SECRET
```

---

## 6. Authorization Matrix

```
                    │ ANONYMOUS │ PATIENT │ DOCTOR │ ADMIN │ RECEPTIONIST
────────────────────┼───────────┼─────────┼────────┼───────┼─────────────
GET /hospitals      │     ✓     │    ✓    │   ✓    │   ✓   │      ✓
GET /doctors        │     ✓     │    ✓    │   ✓    │   ✓   │      ✓
GET /departments    │     ✓     │    ✓    │   ✓    │   ✓   │      ✓
POST /auth/signup   │     ✓     │    ✓    │   ✓    │   ✓   │      ✓
POST /auth/login    │     ✓     │    ✓    │   ✓    │   ✓   │      ✓
────────────────────┼───────────┼─────────┼────────┼───────┼─────────────
POST /appointments  │     ✗     │    ✓    │   ✗    │   ✗   │      ✗
GET /appointments/  │     ✗     │ ✓*only  │   ✓    │   ✓   │      ✓
  patient/{id}      │           │  own    │        │       │
GET /appointments/  │     ✗     │    ✗    │   ✓    │   ✓   │      ✓
  doctor/{id}       │           │         │        │       │
────────────────────┼───────────┼─────────┼────────┼───────┼─────────────
POST /departments   │     ✗     │    ✗    │   ✗    │   ✓   │      ✗
POST /hospitals     │     ✗     │    ✗    │   ✗    │   ✓   │      ✗
POST /doctors       │     ✗     │    ✗    │   ✗    │   ✓   │      ✗
GET /dashboard      │     ✗     │    ✗    │   ✗    │   ✓   │      ✗
────────────────────┼───────────┼─────────┼────────┼───────┼─────────────

✓ = Allowed
✗ = Forbidden (403)
✓* = Conditional (PATIENT can only see own appointments)
```

---

## 7. Error Handling Flow

```
Request
  │
  ├─→ CORS Check Failed
  │   └─→ 400/403 (CORS blocked by browser)
  │
  ├─→ Invalid JWT Token
  │   ├─→ Missing: 401 Unauthorized
  │   ├─→ Expired: 401 Unauthorized
  │   ├─→ Invalid: 401 Unauthorized
  │   └─→ Wrong Secret: 401 Unauthorized
  │
  ├─→ Missing Authorization Header
  │   ├─→ Public endpoint: ✓ Allowed
  │   └─→ Protected endpoint: 401 Unauthorized
  │
  ├─→ Insufficient Permissions
  │   └─→ 403 Forbidden (user exists but wrong role)
  │
  ├─→ Validation Failed
  │   ├─→ Invalid email: 400 Bad Request
  │   ├─→ Password too short: 400 Bad Request
  │   ├─→ Missing required field: 400 Bad Request
  │   └─→ Type mismatch: 400 Bad Request
  │
  ├─→ Resource Not Found
  │   └─→ 404 Not Found (doctor_id=999 doesn't exist)
  │
  ├─→ Database Conflict
  │   ├─→ Duplicate email: 409 Conflict
  │   └─→ Foreign key violation: 409 Conflict
  │
  ├─→ Rate Limit Exceeded
  │   └─→ 429 Too Many Requests (5 failed logins in 60 sec)
  │
  ├─→ Server Error
  │   ├─→ Database connection failed: 500 Internal Server Error
  │   ├─→ Unexpected exception: 500 Internal Server Error
  │   └─→ Null pointer, etc: 500 Internal Server Error
  │
  └─→ Response
      {
        "success": false,
        "error": "Meaningful error message",
        "code": "ERROR_CODE"
      }
```

---

## 8. Database Schema Relationships

```
┌──────────────────┐
│      USER        │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ name             │
│ password (hash)  │
│ phone            │
│ role (ENUM)      │◄─┐
│ created_at       │  │
│ updated_at       │  │
└──────────────────┘  │
        ▲             │
        │ FOREIGN KEY │
        │             │
   ┌────┴────────────────────────────┐
   │                                 │
   │                                 │
┌──┴──────────────┐      ┌───────────┴──────┐
│    APPOINTMENT  │      │    DOCTOR        │
├─────────────────┤      ├──────────────────┤
│ id (PK)         │      │ id (PK)          │
│ patient_id (FK) │──┐   │ user_id (FK)     │
│ doctor_id (FK)  ├──┼──►│ specialization   │
│ date            │  │   │ consultation_fee │
│ time_slot_id (FK)  │   │ hospital_id (FK) │
│ status (ENUM)   │  │   │ department_id└───┼────┐
│ symptoms        │  │   │ created_at       │    │
│ created_at      │  │   │ updated_at       │    │
└─────────────────┘  │   └──────────────────┘    │
                     │           │               │
                     │           ├───────────┐   │
                     │           │           │   │
                     │    ┌──────▼─────┐  ┌─┴───▼────────┐
                     │    │  HOSPITAL  │  │  DEPARTMENT  │
                     │    ├────────────┤  ├──────────────┤
                     │    │ id (PK)    │  │ id (PK)      │
                     │    │ name       │  │ name         │
                     │    │ address    │  │ description  │
                     │    │ city       │  │ hospital_id  │
                     │    │ type (ENUM)   │ (FK)         │
                     │    │ phone      │  │ created_at   │
                     │    │ created_at │  │ updated_at   │
                     │    │ updated_at │  └──────────────┘
                     │    └────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
        ▼                           ▼
    ┌──────────────┐         ┌──────────────┐
    │  TIME_SLOT   │         │ APPOINTMENT  │
    ├──────────────┤         └──────────────┘
    │ id (PK)      │
    │ doctor_id(FK)│
    │ start_time   │
    │ end_time     │
    │ is_available │
    │ created_at   │
    │ updated_at   │
    └──────────────┘
```

---

## 9. Deployment Architecture (Render)

```
┌─────────────────────────────────────────────────────────────┐
│  RENDER INFRASTRUCTURE                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FRONTEND SERVICE (React)                           │   │
│  │  https://findcare-frontend.onrender.com             │   │
│  │  ├─ Auto-deploy from GitHub (push to main)         │   │
│  │  ├─ Nginx reverse proxy                            │   │
│  │  ├─ Static file hosting                            │   │
│  │  └─ Automatic HTTPS/SSL                            │   │
│  └────────────────────────┬────────────────────────────┘   │
│                           │ HTTP/HTTPS                      │
│  ┌────────────────────────▼────────────────────────────┐   │
│  │  BACKEND SERVICE (Spring Boot)                      │   │
│  │  https://findcare-backend.onrender.com              │   │
│  │  ├─ Java 21 Runtime                                │   │
│  │  ├─ Auto-deploy from GitHub                        │   │
│  │  ├─ Environment Variables:                         │   │
│  │  │  ├─ CORS_ALLOWED_ORIGINS                       │   │
│  │  │  ├─ JWT_SECRET                                 │   │
│  │  │  ├─ DB_*                                       │   │
│  │  │  └─ SPRING_PROFILES_ACTIVE=prod                │   │
│  │  ├─ Health checks every 10 seconds                 │   │
│  │  ├─ Auto-restart on failure                        │   │
│  │  └─ Automatic HTTPS/SSL                            │   │
│  └────────────────────────┬────────────────────────────┘   │
│                           │ JDBC/SSL                        │
│  ┌────────────────────────▼────────────────────────────┐   │
│  │  DATABASE (External - Aiven/DigitalOcean/AWS RDS)  │   │
│  │  mysql://your-db.c.aivencloud.com:3306             │   │
│  │  ├─ MySQL 8.0+                                     │   │
│  │  ├─ SSL/TLS encryption                             │   │
│  │  ├─ Daily automated backups                        │   │
│  │  ├─ Connection pooling                             │   │
│  │  └─ Network security groups                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  MONITORING:                                                │
│  ├─ Render Logs (real-time)                               │
│  ├─ Health Dashboard                                       │
│  ├─ Uptime monitoring                                      │
│  └─ Performance metrics                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Typical User Journey

```
1. DISCOVERY
   ├─ User opens website
   ├─ Frontend loads React app
   └─ Calls GET /api/hospitals (public endpoint)
        └─ Displays list of hospitals ✓

2. REGISTRATION
   ├─ User clicks "Sign Up"
   ├─ Enters email, password, name, phone
   ├─ Frontend calls POST /api/auth/signup
        └─ Backend validates & creates user
        └─ Returns JWT token ✓
   └─ Token stored in localStorage

3. BROWSING
   ├─ User browses hospitals, doctors, departments
   ├─ All calls to GET /api/hospitals, /api/doctors
   ├─ Frontend includes JWT in Authorization header
   └─ All requests succeed (public endpoints) ✓

4. BOOKING APPOINTMENT
   ├─ User selects doctor and date
   ├─ Calls POST /api/appointments
        └─ Backend checks @PreAuthorize("PATIENT")
        └─ JWT token valid & role is PATIENT
        └─ Creates appointment ✓
   └─ Confirmation shown to user

5. CHECKING APPOINTMENTS
   ├─ User clicks "My Appointments"
   ├─ Frontend calls GET /api/appointments/patient/{id}
        └─ Backend checks JWT + @PreAuthorize("PATIENT")
        └─ Retrieves only this user's appointments ✓
   └─ Appointments displayed

6. DOCTOR UPDATES STATUS
   ├─ Doctor logs in
   ├─ Views their appointments
   ├─ Updates status to "COMPLETED"
   ├─ Frontend calls PUT /api/appointments/{id}/complete
        └─ Backend checks @PreAuthorize("DOCTOR") ✓
        └─ Updates appointment ✓
   └─ Confirmation sent to patient

7. LOGOUT
   ├─ User clicks "Logout"
   ├─ Token removed from localStorage
   └─ Redirected to homepage
```

---

These diagrams should help visualize how your FindCare backend works end-to-end!
