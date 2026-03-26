# FindCare Backend - 403 Forbidden Fix & Configuration Guide

## Summary of Changes

This document outlines all the fixes and enhancements made to resolve 403 Forbidden errors and improve the Spring Boot backend for production deployment on Render.

---

## Changes Made

### 1. **Spring Security Configuration** ✅

**File:** [src/main/java/com/findcare/backend/security/SecurityConfig.java](src/main/java/com/findcare/backend/security/SecurityConfig.java)

**Changes:**
- ✅ Expanded `permitAll()` rules to include all public read endpoints
- ✅ Added `/api/users/register` endpoint to public access
- ✅ Added `/health` and `/actuator/health` health check endpoints
- ✅ Enhanced CORS configuration with better documentation
- ✅ Added PATCH method support
- ✅ Added more exposed headers for client-side access

**Before:**
```java
.requestMatchers(HttpMethod.GET,
    "/api/hospitals/**",
    "/api/doctors/**",
    "/api/departments/**",
    "/api/timeslots/doctor/**").permitAll()
```

**After:**
```java
.requestMatchers(HttpMethod.GET,
    "/api/hospitals",
    "/api/hospitals/**",
    "/api/doctors",
    "/api/doctors/**",
    "/api/departments",
    "/api/departments/**",
    "/api/timeslots",
    "/api/timeslots/**").permitAll()
```

### 2. **CORS Configuration Enhancement** ✅

**File:** [src/main/java/com/findcare/backend/security/SecurityConfig.java](src/main/java/com/findcare/backend/security/SecurityConfig.java)

**Changes:**
- ✅ Added PATCH method support
- ✅ Added more allowed headers (X-Requested-With, Accept, Origin)
- ✅ Added more exposed headers (Authorization, Content-Disposition)
- ✅ Better documentation with comments
- ✅ Improved error handling

**Supported Methods:**
- GET, POST, PUT, DELETE, PATCH, OPTIONS

**Allowed Headers:**
- Authorization, Content-Type, X-Requested-With, X-Request-ID, Accept, Origin

**Exposed Headers:**
- X-Request-ID, Authorization, Content-Disposition

### 3. **Global Exception Handler** ✅

**File:** [src/main/java/com/findcare/backend/exception/GlobalExceptionHandler.java](src/main/java/com/findcare/backend/exception/GlobalExceptionHandler.java)

**Changes:**
- ✅ Added `AuthenticationException` handler for non-BadCredentials cases
- ✅ Improved `AccessDeniedException` error message
- ✅ Added `MethodArgumentTypeMismatchException` handler
- ✅ Added exception logging to stderr
- ✅ Better error messages with context

**New Handlers:**
- `AuthenticationException` → 401 with "AUTHENTICATION_FAILED" code
- `MethodArgumentTypeMismatchException` → 400 with "INVALID_PARAMETER" code

### 4. **Application Properties** ✅

**File:** [src/main/resources/application.properties](src/main/resources/application.properties)

**Changes:**
- ✅ Added server context path configuration
- ✅ Improved logging configuration
- ✅ Added better inline documentation
- ✅ Added Hibernate dialect configuration
- ✅ Better organized properties

### 5. **Production Properties** ✅

**File:** [src/main/resources/application-prod.properties](src/main/resources/application-prod.properties)

**Changes:**
- ✅ Added server compression configuration
- ✅ Better logging configuration for production
- ✅ Better HikariCP pool settings
- ✅ Added comprehensive comments for environment variables
- ✅ Added application name for better identification

**Key Settings:**
- Server compression enabled
- Connection pool optimized: max 20, min 5
- Logging: Root at WARN, App at INFO
- SSL/TLS support for database

---

## Documentation Created

### 1. **API_TESTING_GUIDE.md** 📖
Complete REST API testing guide with:
- All endpoint examples with curl commands
- Request/response examples
- Error codes and meanings
- Test script examples
- Postman collection setup instructions
- Environment variables for Render

### 2. **DEPLOYMENT_SETUP.md** 📖
Complete deployment guide for Render:
- Step-by-step Render service setup
- All required environment variables
- Database setup options (Aiven, Render, External)
- Troubleshooting common issues
- Security best practices
- Monitoring and maintenance

### 3. **SECURITY_CORS_GUIDE.md** 📖
In-depth security configuration guide:
- How CORS works
- Authorization rules (public vs protected)
- Debugging 403 errors
- Frontend integration guide
- JWT token structure and validation
- Role-based access control (RBAC)
- Production checklist

---

## Existing Code Quality ✅

Your backend already has excellent quality:

✅ **Spring Security** - JWT-based stateless auth  
✅ **Rate Limiting** - Login attempt throttling  
✅ **DTOs** - Comprehensive with validation (@NotNull, @Email, etc.)  
✅ **Controllers** - All required endpoints  
✅ **Exception Handling** - Global exception handler  
✅ **Pagination** - Pageable support throughout  
✅ **Role-Based Access** - @PreAuthorize annotations  
✅ **Request ID Tracking** - RequestIdFilter for debugging  

---

## Available Public Endpoints (No Auth Required)

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/users/register` - Alternative registration

### Hospitals
- `GET /api/hospitals` - List all hospitals
- `GET /api/hospitals/{id}` - Get hospital by ID
- `GET /api/hospitals/search` - Search hospitals
- `GET /api/hospitals/type/{type}` - Filter by type

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `GET /api/doctors/hospital/{hospitalId}` - Doctors by hospital
- `GET /api/doctors/department/{departmentId}` - Doctors by department
- `GET /api/doctors/search` - Search doctors

### Departments
- `GET /api/departments` - List all departments
- `GET /api/departments/{id}` - Get department by ID
- `GET /api/departments/hospital/{hospitalId}` - Departments by hospital

### Time Slots
- `GET /api/timeslots/doctor/{doctorId}` - Get doctor's time slots
- `GET /api/timeslots/doctor/{doctorId}/available` - Get available slots

### Health
- `GET /health` - Health check
- `GET /actuator/health` - Detailed health check

---

## Protected Endpoints (Require JWT Token)

### Appointments (PATIENT)
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/patient/{patientId}` - View own appointments
- `PUT /api/appointments/{id}/cancel` - Cancel appointment

### Appointments (DOCTOR)
- `GET /api/appointments/doctor/{doctorId}` - View appointments
- `PUT /api/appointments/{id}/complete` - Complete appointment

### Appointments (RECEPTIONIST)
- `GET /api/appointments/today` - Today's appointments
- `PUT /api/appointments/{id}/checkin` - Check in patient
- `GET /api/appointments/search` - Search appointments

### Admin Operations
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department
- `POST /api/hospitals` - Create hospital
- `PUT /api/hospitals/{id}` - Update hospital
- `DELETE /api/hospitals/{id}` - Delete hospital
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor
- `GET /api/dashboard/stats` - Dashboard statistics

### Time Slots (ADMIN/DOCTOR)
- `POST /api/timeslots` - Create time slot
- `DELETE /api/timeslots/{id}` - Delete time slot

---

## Testing the Fixes

### 1. Local Testing (Development)

```bash
# Start backend with dev profile
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Test public endpoints (open new terminal)
curl http://localhost:8080/api/hospitals
curl http://localhost:8080/api/doctors
curl http://localhost:8080/api/departments

# Test signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234!",
    "phone": "+1-555-0000",
    "role": "PATIENT"
  }'

# Test login and get token
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }' | jq -r '.data.token')

# Test protected endpoint with token
curl -X GET http://localhost:8080/api/appointments/patient/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 2. CORS Testing

```bash
# Test preflight request
curl -X OPTIONS http://localhost:8080/api/hospitals \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Look for response headers:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### 3. Render Deployment Testing

```bash
# After deploying to Render
API_URL="https://your-backend.onrender.com"

# Test health
curl $API_URL/health

# Test public endpoints
curl $API_URL/api/hospitals | head -20

# Test CORS for your frontend domain
curl -X OPTIONS $API_URL/api/hospitals \
  -H "Origin: https://your-frontend.onrender.com" \
  -v
```

---

## Environment Variables for Render

Add these to your Render service:

```bash
# Database (required)
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=findcare_prod
DB_USERNAME=db_user
DB_PASSWORD=secure_password
DB_USE_SSL=true

# JWT (required)
JWT_SECRET=generate_a_secure_random_string_64_chars_plus

# CORS (required - UPDATE THIS!)
CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com

# Server
PORT=8080
SPRING_PROFILES_ACTIVE=prod

# Optional
LOG_LEVEL=INFO
AUTH_RATE_LIMIT_MAX_ATTEMPTS=5
AUTH_RATE_LIMIT_WINDOW_SECONDS=60
```

---

## Fixing 403 Errors - Checklist

### CORS 403 (Browser Blocks Request)

```bash
❌ Check if:
- [ ] Frontend and backend are on different domains/ports
- [ ] Browser console shows CORS error
- [ ] OPTIONS response missing Access-Control-Allow-Origin header

✅ Fix:
1. Update CORS_ALLOWED_ORIGINS in environment variables
2. Ensure frontend URL format: https://domain.com (no trailing slash)
3. Redeploy backend
4. Clear browser cache (Ctrl+Shift+Del)
5. Test again
```

### Auth 403 (User Not Authorized)

```bash
❌ Check if:
- [ ] Using protected endpoint without token
- [ ] Token is expired or invalid
- [ ] User role doesn't have permission
- [ ] Authorization header is missing or malformed

✅ Fix:
1. Include Authorization header: Bearer YOUR_TOKEN
2. Token expires after 24 hours - get new token via /api/auth/login
3. Use account with correct role for endpoint
4. Verify token format: Authorization: Bearer eyJhbGc...
```

### 404 vs 403

```bash
404 = Endpoint doesn't exist (check URL spelling)
403 = Endpoint exists but access denied (check auth/role)
401 = Not authenticated (missing token)
```

---

## Next Steps for Production

1. **Set Environment Variables on Render**
   - Update CORS_ALLOWED_ORIGINS
   - Set JWT_SECRET to secure random value
   - Configure database connection

2. **Test All Endpoints**
   - Use API_TESTING_GUIDE.md
   - Test public endpoints first
   - Test auth flow (signup → login → protected endpoint)
   - Test admin operations with admin account

3. **Update Frontend**
   - Set VITE_API_BASE_URL to Render backend URL
   - Deploy frontend to Render

4. **Monitor**
   - Check Render logs for errors
   - Verify database connections
   - Test from production URL

5. **Security**
   - Rotate JWT_SECRET periodically
   - Use strong database passwords
   - Enable SSL for database connections
   - Restrict CORS to specific frontend domain

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS blocked | Frontend domain not allowed | Add to CORS_ALLOWED_ORIGINS |
| 401 Unauthorized | No token or expired token | Get new token via /api/auth/login |
| 403 Forbidden | User role doesn't have permission | Use account with correct role |
| 404 Not Found | Endpoint URL is wrong | Check controller mappings |
| Database error | Bad credentials or connection refused | Verify DB_* environment variables |

---

## Files Modified

```
✅ src/main/java/com/findcare/backend/security/SecurityConfig.java
✅ src/main/java/com/findcare/backend/exception/GlobalExceptionHandler.java
✅ src/main/resources/application.properties
✅ src/main/resources/application-prod.properties

📄 API_TESTING_GUIDE.md (created)
📄 DEPLOYMENT_SETUP.md (created)
📄 SECURITY_CORS_GUIDE.md (created)
📄 README.md (this file)
```

---

## Resources

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [CORS Configuration Guide](https://spring.io/guides/gs/rest-service-cors/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Render Documentation](https://render.com/docs)
- [Spring Boot on Cloud](https://cloud.spring.io/)

---

## Questions?

Refer to:
1. **Local testing** → [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)
2. **Render deployment** → [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md)
3. **Security & CORS** → [SECURITY_CORS_GUIDE.md](SECURITY_CORS_GUIDE.md)

All examples include curl commands, Postman setup, and expected responses.
