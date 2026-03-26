#!/bin/bash

# FindCare Backend - Complete API Test Script
# This script tests all major endpoints
# Usage: bash test_api.sh [BASE_URL]
# Example: bash test_api.sh http://localhost:8080

BASE_URL="${1:-http://localhost:8080}"
TEMP_FILE="/tmp/findcare_test_$RANDOM.json"

echo "=================================="
echo "FindCare API Test Suite"
echo "=================================="
echo "Testing: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    echo -n "Testing $method $endpoint ... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ $status_code${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ Expected $expected_status, got $status_code${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    fi
    echo ""
}

# Test public endpoints (no auth required)
echo "====== PUBLIC ENDPOINTS (No Auth Required) ======"
echo ""

echo "1. Testing Health Check"
test_endpoint "GET" "/health" "" "200"

echo "2. Testing Get All Hospitals"
test_endpoint "GET" "/api/hospitals?page=0&size=5" "" "200"

echo "3. Testing Get All Doctors"
test_endpoint "GET" "/api/doctors?page=0&size=5" "" "200"

echo "4. Testing Get All Departments"
test_endpoint "GET" "/api/departments" "" "200"

# Authentication Tests
echo ""
echo "====== AUTHENTICATION TESTS ======"
echo ""

echo "5. Testing User Signup"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "patient'$RANDOM'@test.com",
    "password": "TestPass123!",
    "phone": "+1-555-0100",
    "role": "PATIENT"
  }')

TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.data.token // empty')
STATUS=$(echo "$SIGNUP_RESPONSE" | jq -r '.success')

if [ "$STATUS" = "true" ] && [ ! -z "$TOKEN" ]; then
    echo -e "${GREEN}✓ Signup successful${NC}"
    echo "Token: $TOKEN"
else
    echo -e "${RED}✗ Signup failed${NC}"
    echo "$SIGNUP_RESPONSE" | jq .
fi
echo ""

echo "6. Testing User Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient'$RANDOM'@test.com",
    "password": "TestPass123!"
  }')

echo "$LOGIN_RESPONSE" | jq .

# Extract token if available
LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')
if [ ! -z "$LOGIN_TOKEN" ]; then
    TOKEN=$LOGIN_TOKEN
fi

echo ""

# Protected endpoints
if [ ! -z "$TOKEN" ]; then
    echo "====== PROTECTED ENDPOINTS (Requires Auth) ======"
    echo ""
    
    # Get patient ID
    PATIENT_ID=1  # Usually 1 for first patient in test
    
    echo "7. Testing Get Patient Appointments"
    test_endpoint "GET" "/api/appointments/patient/$PATIENT_ID" "" "200"
    
    echo "8. Testing CORS Preflight"
    CORS_RESPONSE=$(curl -s -I -X OPTIONS "$BASE_URL/api/hospitals" \
        -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: GET")
    
    if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
        echo -e "${GREEN}✓ CORS configured${NC}"
    else
        echo -e "${RED}✗ CORS not configured${NC}"
    fi
    echo ""
    
    echo "9. Testing Get Hospital by ID"
    test_endpoint "GET" "/api/hospitals/1" "" "200"
    
    echo "10. Testing Get Doctor by ID"
    test_endpoint "GET" "/api/doctors/1" "" "200"
    
else
    echo -e "${RED}Failed to get auth token - skipping protected tests${NC}"
fi

# Error scenarios
echo ""
echo "====== ERROR SCENARIOS ======"
echo ""

echo "11. Testing 404 Not Found"
test_endpoint "GET" "/api/doctors/99999999" "" "404"

echo "12. Testing Invalid Request"
test_endpoint "POST" "/api/appointments" \
  '{"invalid": "data"}' "400"

# Generate summary
echo ""
echo "====== TEST COMPLETE ======"
echo ""
echo -e "${YELLOW}Note: Some tests may fail if database is empty${NC}"
echo "For more details, see API_TESTING_GUIDE.md"
