# FindCare Backend - Render Deployment Setup Guide

This guide provides step-by-step instructions for deploying the FindCare Spring Boot backend to Render.

## Prerequisites

- GitHub account with the repository pushed
- Render account (https://render.com)
- MySQL database (can use Render MySQL or external provider)
- Frontend URL (for CORS configuration)

---

## Step 1: Create a New Render Service

### 1.1 Go to Render Dashboard
- Log in to https://render.com
- Click "New +"
- Select "Web Service"

### 1.2 Connect GitHub Repository
- Select your GitHub repository
- Choose the branch (typically `main` or `master`)

### 1.3 Configure Build Settings
- **Name**: `findcare-backend` (or your preferred name)
- **Runtime**: Java 21
- **Region**: Choose closest to your users
- **Branch**: main

### 1.4 Build Command
```bash
./mvnw clean package -DskipTests -P prod
```

### 1.5 Start Command
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## Step 2: Configure Environment Variables

In the Render dashboard, add the following environment variables:

### Database Configuration
```
DB_HOST=your-mysql-host.c.aivencloud.com
DB_PORT=3306
DB_NAME=findcare_prod
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_db_password
DB_USE_SSL=true
DB_POOL_MAX_SIZE=20
DB_POOL_MIN_IDLE=5
DB_POOL_IDLE_TIMEOUT_MS=30000
DB_POOL_CONNECTION_TIMEOUT_MS=30000
DB_POOL_MAX_LIFETIME_MS=1800000
```

### Security & JWT
```
JWT_SECRET=your_very_long_secure_random_key_minimum_32_characters_recommended_64
JWT_EXPIRATION_MS=86400000
```

### CORS Configuration
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
```

**For multiple origins (space/comma-separated):**
```
CORS_ALLOWED_ORIGINS=https://frontend1.onrender.com,https://frontend2.example.com
```

### Server Configuration
```
PORT=8080
SPRING_PROFILES_ACTIVE=prod
SERVER_CONTEXT_PATH=/
```

### Logging
```
LOG_LEVEL=INFO
LOG_LEVEL_APP=INFO
```

### Rate Limiting
```
AUTH_RATE_LIMIT_MAX_ATTEMPTS=5
AUTH_RATE_LIMIT_WINDOW_SECONDS=60
```

---

## Step 3: Set up MySQL Database

### Option A: Using Aiven MySQL (Recommended for Production)

1. Go to https://aiven.io and create an account
2. Create a new MySQL service
3. Get connection details:
   - Host (DB_HOST)
   - Port (DB_PORT)
   - Username (DB_USERNAME)
   - Password (DB_PASSWORD)
   - Database name (DB_NAME)

4. Create the database schema:
```sql
CREATE DATABASE findcare_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Option B: Using Render MySQL

1. In Render dashboard, click "New +"
2. Select "MySQL"
3. Configure and create
4. Get connection string from Render

### Option C: Using External MySQL Provider

- AWS RDS
- DigitalOcean Managed Database
- PlanetScale
- ClearDB (Heroku add-on alternative)

---

## Step 4: Database Schema Setup

### 4.1 Connect to Your Database

```bash
# Using MySQL CLI
mysql -h your-db-host -u your-username -p your-database

# Or use MySQL Workbench / DBeaver
```

### 4.2 Initialize Database (Auto-migration)

The application will automatically create tables on first run due to:
```properties
spring.jpa.hibernate.ddl-auto=validate  # In prod
spring.jpa.hibernate.ddl-auto=update    # In dev
```

To seed initial data, create a `data.sql` in `src/main/resources/`:

```sql
-- Insert sample hospitals
INSERT INTO hospital (name, address, city, hospital_type, phone_number) VALUES
('Central Medical Hospital', '123 Main St', 'New York', 'GENERAL', '+1-555-0001'),
('Specialty Care Center', '456 Park Ave', 'Boston', 'SPECIALTY', '+1-555-0002');

-- Insert sample departments
INSERT INTO department (name, description, hospital_id) VALUES
('Cardiology', 'Heart and cardiovascular care', 1),
('Orthopedics', 'Bone and joint care', 2);

-- Insert sample doctors
INSERT INTO doctor (name, email, specialization, qualification, hospital_id, department_id, consultation_fee) VALUES
('Dr. John Smith', 'john.smith@hospital.com', 'Cardiology', 'MD, Board Certified', 1, 1, 150.00),
('Dr. Jane Doe', 'jane.doe@hospital.com', 'Orthopedics', 'MD, Board Certified', 2, 2, 120.00);
```

---

## Step 5: Automatic Deployment

### 5.1 Enable Auto-Deploy
- In Render Service settings
- Toggle "Auto-Deploy" to ON
- This deploys on every push to your configured branch

### 5.2 Manual Deployment
- Go to "Deploys" tab
- Click "Deploy latest commit"

---

## Step 6: Monitor Deployment

### 6.1 View Logs
1. Go to Service in Render dashboard
2. Click "Logs" tab
3. Watch real-time deployment and application logs

### 6.2 Common Issues

**Failed to connect to database:**
```
Check DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME environment variables
Ensure database is running and accessible
Check network security groups/firewall rules
```

**Port already in use:**
```
Render automatically assigns available port
Check that PORT environment variable is set correctly
```

**Java version mismatch:**
```
Ensure .java-version or pom.xml specifies Java 21
Check Runtime setting in Render service
```

---

## Step 7: Test Your Deployment

### 7.1 Get Your Service URL

```bash
# Render provides: https://findcare-backend.onrender.com
# Test it:
curl https://findcare-backend.onrender.com/api/hospitals
```

### 7.2 Run Full Test Suite

```bash
# Test public endpoint
curl -X GET https://findcare-backend.onrender.com/api/hospitals \
  -H "Content-Type: application/json"

# Test signup
curl -X POST https://findcare-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "+1-555-0000",
    "role": "PATIENT"
  }'

# Test login
curl -X POST https://findcare-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

---

## Step 8: CORS Configuration for Frontend

### 8.1 Update Frontend API URL

In your React frontend `.env.production`:

```
VITE_API_BASE_URL=https://findcare-backend.onrender.com
```

### 8.2 Verify CORS Headers

```bash
curl -X OPTIONS https://findcare-backend.onrender.com/api/hospitals \
  -H "Origin: https://your-frontend.onrender.com" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Look for response headers:
```
Access-Control-Allow-Origin: https://your-frontend.onrender.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, ...
```

---

## Step 9: Security Best Practices

### 9.1 Secure Environment Variables
- ✅ Use strong JWT_SECRET (min 32 chars, preferably 64)
- ✅ Use strong DB_PASSWORD
- ✅ Don't commit secrets to GitHub
- ✅ Rotate secrets periodically
- ✅ Use Render's "Secret" type for sensitive values

### 9.2 Database Access
- ✅ Set DB_USE_SSL=true for external databases
- ✅ Use network security groups/firewall
- ✅ Allow only Render service IP
- ✅ Don't expose database port publicly

### 9.3 API Security
- ✅ HTTPS only (Render provides free SSL)
- ✅ CORS restricted to your frontend domain
- ✅ Rate limiting enabled (5 attempts in 60 seconds)
- ✅ JWT tokens expire after 24 hours

---

## Step 10: Monitoring & Maintenance

### 10.1 Health Check

```bash
# Check if backend is running
curl https://findcare-backend.onrender.com/health
```

### 10.2 View Metrics
- Render dashboard shows CPU, Memory usage
- Check logs for errors
- Monitor database connection pool

### 10.3 Scale Your Service

If you need more resources:
1. Go to Service settings
2. Upgrade Instance Type
3. Render will gracefully restart

---

## Step 11: Database Backups

### 11.1 Automated Backups (if using Render MySQL)
- Render automatically backs up to S3
- Check Render documentation for recovery

### 11.2 Manual Backups

```bash
# Export MySQL database
mysqldump -h your-host -u your-user -p your-database > findcare_backup.sql

# Import backup
mysql -h your-host -u your-user -p your-database < findcare_backup.sql
```

---

## Troubleshooting Deployment Issues

### 403 Forbidden Error

**Solution:**
1. Check CORS_ALLOWED_ORIGINS environment variable
2. Verify frontend URL matches exactly
3. Ensure CORS configuration is deployed (redeploy if not)

### 401 Unauthorized Error

**Solution:**
1. Verify JWT_SECRET is set correctly (same as used in code)
2. Check token is being sent in Authorization header
3. Token may be expired - get new token via /api/auth/login

### Database Connection Failed

**Solution:**
1. Verify DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
2. Check network connectivity from Render to database
3. Ensure database is running and accepting connections
4. Check firewall rules allow Render IP

### Build Fails

**Common causes:**
1. Java version mismatch - set to Java 21
2. Tests failing - use `-DskipTests` flag in build command
3. Missing dependencies - check `pom.xml`

**Fix:**
```bash
./mvnw clean package -DskipTests -P prod
```

### Application Doesn't Start

**Check logs for:**
- Database connection errors
- Missing environment variables
- Port conflicts
- Memory issues

**Solution:**
1. View Render logs in real-time
2. Check environment variables are set
3. Verify database is running
4. Increase instance size if memory insufficient

---

## Additional Resources

- Render Documentation: https://render.com/docs
- Spring Boot Deployment: https://spring.io/guides/gs/deploying-spring-boot-app-to-cloud/
- CORS Configuration: https://spring.io/guides/gs/rest-service-cors/
- JWT Authentication: https://jwt.io

---

## Quick Deployment Checklist

- [ ] GitHub repository set up with backend code
- [ ] Java 21 runtime selected in Render
- [ ] Build command: `./mvnw clean package -DskipTests`
- [ ] Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- [ ] All environment variables configured
- [ ] MySQL database created and running
- [ ] Database connection tested
- [ ] Frontend URL added to CORS_ALLOWED_ORIGINS
- [ ] First deployment successful (check logs)
- [ ] Public endpoints responding (test /api/hospitals)
- [ ] Authentication working (test /api/auth/signup)
- [ ] Frontend can communicate with backend

---

## Production Monitoring Commands

```bash
# Get your API URL
API_URL="https://findcare-backend.onrender.com"

# Health check
curl -s $API_URL/health | jq .

# Test public endpoint
curl -s $API_URL/api/hospitals | jq . | head -20

# Monitor response times
curl -w "@curl-format.txt" -o /dev/null -s $API_URL/api/hospitals

# Load test
ab -n 100 -c 10 $API_URL/api/hospitals
```

---

For additional help, check Render logs in the dashboard or review Spring Boot deployment documentation.
