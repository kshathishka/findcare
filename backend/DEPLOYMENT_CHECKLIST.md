# 📋 FindCare Backend - Deployment Checklist

## Pre-Deployment Verification (Local)

### ✅ Code Review
- [ ] Read QUICK_REFERENCE.md (5 mins)
- [ ] Review changes in SecurityConfig.java
- [ ] Review changes in GlobalExceptionHandler.java
- [ ] Review changes in application-prod.properties

### ✅ Local Testing (10 mins)
```bash
# Terminal 1: Start backend with dev profile
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Terminal 2: Run tests
bash test_api.sh http://localhost:8080
bash test_cors.sh http://localhost:8080 http://localhost:5173
```

- [ ] GET /api/hospitals returns 200 ✓
- [ ] GET /api/doctors returns 200 ✓
- [ ] POST /api/auth/signup returns 201 ✓
- [ ] POST /api/auth/login returns 200 ✓
- [ ] GET /api/appointments/patient without token returns 401 ✓
- [ ] GET /api/appointments/patient with token returns 200 ✓
- [ ] OPTIONS preflight returns CORS headers ✓
- [ ] All error responses are meaningful ✓

### ✅ Code Cleanup
- [ ] No debug statements left
- [ ] No hardcoded secrets in code
- [ ] No TODO comments
- [ ] All imports are used

### ✅ Git Setup
```bash
git add .
git commit -m "Fix CORS and Spring Security configuration for production"
git push origin main
```

- [ ] Changes committed to GitHub
- [ ] Commit message is clear
- [ ] No untracked files

---

## Render Configuration (5 mins)

### ✅ Environment Variables Setup

Go to: Render Dashboard → Your Backend Service → Environment

Add/Update these variables:

```
#
