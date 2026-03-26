# FindCare Backend - Spring Security & CORS Configuration Guide

## Overview

This document explains how the FindCare backend handles authentication, authorization, and CORS to prevent 403 Forbidden errors.

---

## 1. Current Security Configuration

### 1.1 SecurityConfig.java

The backend uses Spring Security with the following setup:

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    // JWT-based stateless security
    // CORS enabled for frontend communication
    // Rate limiting on auth endpoints
}
```

---

## 2. Authorization Rules (permitAll vs authenticated)

### 2.1 Public Endpoints (No Authentication Required)

These endpoints are accessible without a JWT token:

#### Authentication Endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/users/register` - Alternative registration endpoint

#### Read-Only Endpoints:
- `GET /api/hospitals` - List all hospitals
- `GET /api/hospitals/**` - Hospital details, search, by type
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/**` - Doctor details, by hospital, by department, search
- `GET /api/departments` - List all departments
- `GET /api/departments/**` - Department details, by hospital
- `GET /api/timeslots` - List time slots
- `GET /api/timeslots/**` - Time slot details, by doctor

#### Health Check:
- `GET /health` - Health status
- `GET /actuator/health` - Detailed health status

### 2.2 Protected Endpoints (Authentication Required)

These endpoints require a valid JWT token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Appointment Management:
- `POST /api/appointments` - Book appointment (PATIENT)
- `GET /api/appointments/patient/**` - View own appointments (PATIENT)
- `GET /api/appointments/doctor/**` - View doctor's appointments (DOCTOR)
- `PUT /api/appointments/*/status` - Update status (DOCTOR)
- `DELETE /api/appointments/**` - Cancel appointment

#### Admin Operations:
- `POST /api/departments` - Create department (ADMIN)
- `PUT /api/departments/**` - Update department (ADMIN)
- `DELETE /api/departments/**` - Delete department (ADMIN)
- `POST /api/hospitals` - Create hospital (ADMIN)
- `PUT /api/hospitals/**` - Update hospital (ADMIN)
- `DELETE /api/hospitals/**` - Delete hospital (ADMIN)
- `POST /api/doctors` - Create doctor (ADMIN)
- `PUT /api/doctors/**` - Update doctor (ADMIN)
- `DELETE /api/doctors/**` - Delete doctor (ADMIN)

#### Dashboard:
- `GET /api/dashboard/**` - Dashboard statistics (ADMIN)

---

## 3. CORS Configuration

### 3.1 How CORS Works

CORS (Cross-Origin Resource Sharing) allows your frontend (running on different domain/port) to communicate with backend.

**Browser Flow:**
1. Browser makes preflight OPTIONS request
2. Server responds with CORS headers
3. Browser allows actual request based on CORS response
4. Real request is made (GET, POST, etc.)

### 3.2 Current CORS Setup

```properties
# application.properties
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173}
```

**Allowed Methods:**
- GET, POST, PUT, DELETE, PATCH, OPTIONS

**Allowed Headers:**
- Authorization
- Content-Type
- X-Requested-With
- X-Request-ID
- Accept
- Origin

**Exposed Headers:**
- X-Request-ID
- Authorization
- Content-Disposition

**Other Settings:**
- Allow Credentials: true
- Max Age: 3600 seconds (1 hour)

### 3.3 Testing CORS

```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:8080/api/hospitals \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type" \
  -v

# Look for these headers in response:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
# Access-Control-Allow-Headers: Authorization, Content-Type, ...
# Access-Control-Allow-Credentials: true
```

---

## 4. Fixing 403 Forbidden Errors

### 4.1 Common Causes

| Error | Cause | Solution |
|-------|-------|----------|
| CORS 403 | Origin not allowed | Add frontend URL to `CORS_ALLOWED_ORIGINS` |
| Auth 403 | Invalid JWT or expired | Login again to get new token |
| Role 403 | User role doesn't have permission | Use account with correct role |
| Rate Limit 429 | Too many login attempts | Wait 60 seconds before retrying |

### 4.2 Scenario 1: CORS Error in Browser

**Error Message:**
```
Access to XMLHttpRequest at 'https://api.example.com/api/hospitals'
from origin 'https://app.example.com' has been blocked by CORS policy
```

**Fix:**
1. Check `CORS_ALLOWED_ORIGINS` includes your frontend URL
   ```bash
   # On Render, set environment variable:
   CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com
   ```

2. Redeploy backend if deployed on Render
   ```bash
   git push  # Or click Redeploy in Render dashboard
   ```

3. Test CORS:
   ```bash
   curl -X OPTIONS https://api.example.com/api/hospitals \
     -H "Origin: https://app.example.com" \
     -v
   ```

### 4.3 Scenario 2: 403 on Protected Endpoint

**Error:**
```json
{
  "success": false,
  "error": "Access denied: You don't have permission to access this resource",
  "code": "FORBIDDEN"
}
```

**Causes & Fixes:**

**a) Missing Authorization Header**
```bash
# ❌ Wrong
curl -X GET http://localhost:8080/api/appointments/patient/1

# ✅ Correct
curl -X GET http://localhost:8080/api/appointments/patient/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**b) Invalid or Expired Token**
```bash
# Get new token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Use the returned token in Authorization header
```

**c) Wrong User Role**
```bash
# Admin endpoint requires ADMIN role
# If logged in as PATIENT, will get 403
# Solution: Use admin account or endpoint that allows your role
```

### 4.4 Scenario 3: Preflight OPTIONS Request Failing

**Error in Browser Console:**
```
OPTIONS /.../api/hospitals 403 Forbidden
```

**Fix:**
Spring Security automatically allows OPTIONS requests, but verify:

1. Check SecurityConfig allows OPTIONS:
   ```java
   configuration.setAllowedMethods(Arrays.asList(
       "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
   ));
   ```

2. Ensure CORS is before request authentication
   ```java
   .cors(cors -> cors.configurationSource(corsConfigurationSource()))
   // Then other security rules
   ```

---

## 5. Frontend Configuration

### 5.1 React Axios Setup (src/lib/api.js)

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // Send credentials (cookies, auth headers)
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401/403 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 5.2 Environment Variables

**Development (.env):**
```
VITE_API_BASE_URL=http://localhost:8080
```

**Production (.env.production):**
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

### 5.3 Making Requests

```javascript
import api from './lib/api';

// Public endpoint - no auth needed
const hospitals = await api.get('/api/hospitals');

// Protected endpoint - requires token
const appointments = await api.get('/api/appointments/patient/1');

// Creating with auth
const appointment = await api.post('/api/appointments', {
  doctorId: 1,
  timeSlotId: 1,
  symptoms: 'Headache'
});
```

---

## 6. JWT Token Details

### 6.1 Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRW9lI...
TJVA95VrM7E7cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

**Parts:**
1. Header: Algorithm (HS256) and type (JWT)
2. Payload: User data (subject, name, role, issued time, expiration)
3. Signature: Cryptographic signature using JWT_SECRET

### 6.2 Token Validation

```java
// Backend validates:
1. Signature is correct (using JWT_SECRET)
2. Token is not expired
3. Claims are valid

// If fails:
- Returns 401 Unauthorized
- JwtAuthenticationFilter clears security context
```

### 6.3 Token Expiration

**Default:** 24 hours (86400000 ms)

```
Issued: 2026-03-26 10:00:00 UTC
Expires: 2026-03-27 10:00:00 UTC
```

After expiration, user must login again.

---

## 7. Role-Based Access Control (RBAC)

### 7.1 Available Roles

| Role | Permissions |
|------|-------------|
| ADMIN | Create/update/delete hospitals, departments, doctors; view dashboard |
| DOCTOR | View appointments, update appointment status; view patients |
| PATIENT | Book appointments, view own appointments, cancel appointments |
| RECEPTIONIST | Manage appointments, support admin tasks |

### 7.2 Checking Roles

```java
@GetMapping
@PreAuthorize("hasAuthority('ADMIN')")  // Only ADMIN
public ResponseEntity<...> adminEndpoint() { ... }

@GetMapping
@PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")  // DOCTOR or ADMIN
public ResponseEntity<...> doctorEndpoint() { ... }
```

### 7.3 Frontend Permission Check

```javascript
// After login, user object has role
const user = JSON.parse(localStorage.getItem('user'));

if (user.role === 'ADMIN') {
  // Show admin UI
}
```

---

## 8. Debugging Steps

### 8.1 Check Backend Logs

```bash
# Local development
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Watch for:
# - Security filter logs
# - CORS configuration
# - JWT validation logs
```

### 8.2 Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Look at OPTIONS preflight request:
   - Response Headers should include `Access-Control-*` headers
   - Status should be 200 or 204

4. Look at actual GET/POST request (after preflight):
   - Status should be 200-201 for success
   - Status 403 means authorization denied
   - Status 401 means unauthenticated

### 8.3 Test with curl

```bash
# Test public endpoint
curl -v http://localhost:8080/api/hospitals

# Test protected endpoint without token
curl -v http://localhost:8080/api/appointments/patient/1

# Test with token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -v http://localhost:8080/api/appointments/patient/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 9. Production Deployment Checklist

- [ ] JWT_SECRET is set to a secure random value
- [ ] CORS_ALLOWED_ORIGINS includes your frontend domain
- [ ] Database credentials are set correctly
- [ ] SSL/TLS enabled (Render provides free SSL)
- [ ] Rate limiting is configured
- [ ] Logging level appropriate (INFO for prod)
- [ ] Health check endpoint is accessible
- [ ] Public endpoints work without auth
- [ ] Protected endpoints require valid token
- [ ] CORS preflight requests return correct headers

---

## 10. Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| CORS blocked | Add frontend URL to `CORS_ALLOWED_ORIGINS` |
| 401 Unauthorized | Get new token via `/api/auth/login` |
| 403 Forbidden | Check user role has permission; check JWT is valid |
| OPTIONS 404 | Spring Security should handle - check config |
| Database connection failed | Verify DB credentials and network access |
| Rate limit hit | Wait for rate limit window (60 sec default) |

---

## 11. Environment Variable Reference

```bash
# Required for production
JWT_SECRET=min_32_chars_preferably_64_highly_random_alphanumeric
DB_HOST=your.database.host
DB_NAME=findcare_prod
DB_USERNAME=dbuser
DB_PASSWORD=securepassword
CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com

# Database pool (optional, has defaults)
DB_POOL_MAX_SIZE=20
DB_POOL_MIN_IDLE=5

# Rate limiting (optional)
AUTH_RATE_LIMIT_MAX_ATTEMPTS=5
AUTH_RATE_LIMIT_WINDOW_SECONDS=60

# Logging (optional)
LOG_LEVEL=INFO
```

---

For more details, see:
- API_TESTING_GUIDE.md - How to test endpoints
- DEPLOYMENT_SETUP.md - Complete deployment guide
