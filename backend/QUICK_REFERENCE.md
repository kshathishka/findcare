# FindCare Backend - Quick Reference & Action Items

## 🚀 Quick Start (5 Minutes)

### Step 1: Update Render Environment Variables

Go to your Render dashboard → Your Service → Environment

Add/Update these variables:

```
CORS_ALLOWED_ORIGINS=https://your-findcare-frontend.onrender.com
JWT_SECRET=YourVerySecureRandomString32CharactersOrMore
DB_HOST=your-mysql-host.c.aivencloud.com
DB_PORT=3306
DB_NAME=findcare_prod
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_USE_SSL=true
SPRING_PROFILES_ACTIVE=prod
```

**⚠️ CRITICAL:** Update `CORS_ALLOWED_ORIGINS` with your actual Render frontend URL!

### Step 2: Redeploy

1. Push changes to GitHub:
```bash
git add .
git commit -m "Fix CORS and security configuration"
git push
```

2. Or manually redeploy in Render:
   - Go to Render dashboard
   - Click "Redeploy" button
   - Wait for deployment to complete

### Step 3: Test

```bash
# Get your API URL from Render (e.g., https://findcare-backend.onrender.com)
API_URL="https://your-api-url.onrender.com"

# Test public endpoint
curl $API_URL/api/hospitals

# Should return hospitals list (200 OK)
```

---

## 📋 Environment Variables Checklist

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `CORS_ALLOWED_ORIGINS` | ✅ YES | `https://findcare-frontend.onrender.com` | Must match your frontend URL exactly |
| `JWT_SECRET` | ✅ YES | `abc123xyz...` (64 chars) | Generate random, keep secret |
| `DB_HOST` | ✅ YES | `your-db.c.aivencloud.com` | Database host/domain |
| `DB_PORT` | ✅ YES | `3306` | Usually 3306 for MySQL |
| `DB_NAME` | ✅ YES | `findcare_prod` | Database name |
| `DB_USERNAME` | ✅ YES | `admin` | Database user |
| `DB_PASSWORD` | ✅ YES | `secure_password_here` | Database password |
| `DB_USE_SSL` | ✅ YES | `true` | Enable for security |
| `SPRING_PROFILES_ACTIVE` | ✅ YES | `prod` | Use prod for production |
| `PORT` | ⚠️ Optional | `8080` | Render auto-assigns if not set |
| `LOG_LEVEL` | ⚠️ Optional | `INFO` | INFO for production |

---

## 🔍 What Changed in Your Code

### 1. SecurityConfig.java
- ✅ Expanded public endpoint access rules
- ✅ Better CORS configuration
- ✅ Added health check endpoints

### 2. GlobalExceptionHandler.java
- ✅ Better error messages
- ✅ New exception handlers
- ✅ Improved debugging

### 3. application.properties
- ✅ Better configuration options
- ✅ Improved documentation

### 4. application-prod.properties
- ✅ Production-optimized settings
- ✅ Full database configuration support
- ✅ Connection pool tuning

---

## 🧪 Testing Your Deployment

### Test 1: Public Endpoint (Should Work Without Auth)

```bash
curl https://your-backend.onrender.com/api/hospitals
```

**Expected:** Returns list of hospitals (HTTP 200)

### Test 2: User Registration

```bash
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234!",
    "phone": "+1-555-0000",
    "role": "PATIENT"
  }'
```

**Expected:** Returns JWT token (HTTP 201)

### Test 3: Login

```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

**Expected:** Returns JWT token (HTTP 200)

### Test 4: Protected Endpoint

```bash
TOKEN="your-jwt-token-from-login"

curl https://your-backend.onrender.com/api/appointments/patient/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Returns appointments (HTTP 200)

### Test 5: CORS Preflight

```bash
curl -X OPTIONS https://your-backend.onrender.com/api/hospitals \
  -H "Origin: https://your-frontend.onrender.com" \
  -v
```

**Expected:** Response includes:
```
Access-Control-Allow-Origin: https://your-frontend.onrender.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

---

## ❌ Common Issues & Fixes

### Issue: 403 Forbidden from Frontend

**Cause:** CORS not configured for frontend domain

**Fix:**
1. Copy your frontend Render URL (e.g., `https://findcare-frontend.onrender.com`)
2. Set `CORS_ALLOWED_ORIGINS` environment variable to this URL
3. Redeploy backend
4. Clear browser cache (Ctrl+Shift+Delete)
5. Try again

### Issue: 401 Unauthorized

**Cause:** Missing or invalid JWT token

**Fix:**
1. Get token from `/api/auth/login` endpoint
2. Include in every protected endpoint request:
   ```bash
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
3. Tokens expire after 24 hours - get new one if needed

### Issue: 404 Not Found

**Cause:** Wrong endpoint URL

**Fix:**
- Check URL spelling
- Verify endpoint exists
- See [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) for all endpoints

### Issue: Database Connection Error

**Cause:** Wrong database credentials

**Fix:**
1. Verify `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
2. Test database connection manually:
   ```bash
   mysql -h $DB_HOST -u $DB_USERNAME -p$DB_PASSWORD $DB_NAME
   ```
3. Check firewall allows connection from Render

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README_403_FIX.md](README_403_FIX.md) | Complete summary of all changes |
| [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) | REST API endpoints with curl examples |
| [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md) | Step-by-step Render deployment guide |
| [SECURITY_CORS_GUIDE.md](SECURITY_CORS_GUIDE.md) | Detailed security & CORS configuration |

---

## 🔐 Security Tips

✅ **DO:**
- Use strong, random JWT_SECRET (64+ characters)
- Keep DB_PASSWORD secure
- Use HTTPS for all connections
- Restrict CORS to your specific frontend domain
- Rotate secrets periodically
- Use environment variables, never hardcode secrets

❌ **DON'T:**
- Commit secrets to GitHub
- Use same JWT_SECRET for dev and prod
- Allow CORS from any origin (`*`)
- Use weak passwords
- Store tokens in localStorage for sensitive operations
- Share API URLs publicly

---

## 🎯 Success Criteria

After deployment, verify:

- [ ] `GET /api/hospitals` returns hospitals (no auth needed)
- [ ] `POST /api/auth/signup` creates user and returns token
- [ ] `POST /api/auth/login` authenticates user and returns token
- [ ] Protected endpoints require Authorization header
- [ ] Frontend can access API without CORS errors
- [ ] Health check accessible: `GET /health`
- [ ] Error responses are meaningful (401, 403, 404, etc.)
- [ ] Rate limiting works (5 failed logins blocks for 60 sec)
- [ ] Database connection stable
- [ ] Render logs show no errors

---

## 📞 Support Resources

### If You Get CORS Error:
→ Read [SECURITY_CORS_GUIDE.md](SECURITY_CORS_GUIDE.md) Section 4.2

### If You Want to Test Endpoints:
→ Read [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

### If You Need Deployment Help:
→ Read [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md)

### If You Want to Understand Security:
→ Read [SECURITY_CORS_GUIDE.md](SECURITY_CORS_GUIDE.md)

---

## 🚀 One-Liner Commands

```bash
# View backend logs on Render
# (Render dashboard → Logs tab)

# Test health endpoint
curl https://your-api.onrender.com/health | jq

# Get all hospitals
curl https://your-api.onrender.com/api/hospitals | jq '.data.content[0:3]'

# Quick signup script
bash scripts/test_signup.sh

# Full test suite
bash scripts/test_api.sh
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│     React Frontend (Render)             │
│  https://findcare-frontend.onrender.com │
└────────────┬────────────────────────────┘
             │ HTTP/HTTPS Requests
             │ (CORS Enabled)
┌────────────▼────────────────────────────┐
│    Spring Boot Backend (Render)         │
│  https://findcare-backend.onrender.com  │
│                                         │
│  ✓ JWT Authentication                  │
│  ✓ Role-Based Authorization            │
│  ✓ CORS Configured                     │
│  ✓ Global Exception Handling           │
│  ✓ Rate Limiting                       │
└────────────┬────────────────────────────┘
             │ JDBC Connection
             │ (SSL/TLS)
┌────────────▼────────────────────────────┐
│      MySQL Database (Aiven/External)    │
│   your-db.c.aivencloud.com:3306         │
└─────────────────────────────────────────┘
```

---

## ⏱️ Deployment Timeline

| Step | Duration | What Happens |
|------|----------|--------------|
| 1. Push to GitHub | Instant | Changes saved |
| 2. Render detects push | ~5 sec | Auto-deploy triggered |
| 3. Build JAR | ~60 sec | Maven builds project |
| 4. Deploy JAR | ~30 sec | Application starts |
| 5. Health check passes | ~10 sec | Service is ready |
| **Total** | **~2 minutes** | **Backend is live** |

---

## 🎓 Learning Resources

- [JWT Authentication](https://jwt.io)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Spring Security](https://spring.io/projects/spring-security)
- [HTTP Status Codes](https://httpwg.org/specs/rfc9110.html#status.codes)
- [RESTful API Design](https://restfulapi.net)

---

**Last Updated:** March 26, 2026  
**Backend Version:** Spring Boot 4.0.4 with Java 21
