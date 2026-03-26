#!/bin/bash

# FindCare CORS Configuration Test Script
# Tests CORS headers for your API
# Usage: bash test_cors.sh [BASE_URL] [FRONTEND_URL]
# Example: bash test_cors.sh http://localhost:8080 http://localhost:5173

BASE_URL="${1:-http://localhost:8080}"
FRONTEND_URL="${2:-http://localhost:5173}"

echo "=================================="
echo "FindCare CORS Configuration Test"
echo "=================================="
echo "API URL: $BASE_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

test_cors_header() {
    local header=$1
    local endpoint=$2
    
    response=$(curl -s -i -X OPTIONS "$BASE_URL$endpoint" \
        -H "Origin: $FRONTEND_URL" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Authorization, Content-Type")
    
    value=$(echo "$response" | grep -i "^$header:" | cut -d' ' -f2-)
    
    if [ -z "$value" ]; then
        echo -e "${RED}✗ $header: NOT SET${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $header: $value${NC}"
        return 0
    fi
}

echo "Testing CORS Headers for: $FRONTEND_URL"
echo ""

echo "Preflight Request (OPTIONS):"
echo "---"

test_cors_header "Access-Control-Allow-Origin" "/api/hospitals"
test_cors_header "Access-Control-Allow-Methods" "/api/hospitals"
test_cors_header "Access-Control-Allow-Headers" "/api/hospitals"
test_cors_header "Access-Control-Allow-Credentials" "/api/hospitals"
test_cors_header "Access-Control-Max-Age" "/api/hospitals"

echo ""
echo "Testing Multiple Endpoints:"
echo "---"

endpoints=(
    "/api/hospitals"
    "/api/doctors"
    "/api/departments"
    "/api/auth/signup"
    "/api/appointments"
)

for endpoint in "${endpoints[@]}"; do
    response=$(curl -s -X OPTIONS "$BASE_URL$endpoint" \
        -H "Origin: $FRONTEND_URL" \
        -H "Access-Control-Request-Method: GET" 2>/dev/null)
    
    status=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$BASE_URL$endpoint" \
        -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: GET")
    
    if [ "$status" = "200" ] || [ "$status" = "204" ]; then
        echo -e "${GREEN}✓ $endpoint: $status OK${NC}"
    else
        echo -e "${RED}✗ $endpoint: $status${NC}"
    fi
done

echo ""
echo "Testing Actual Requests:"
echo "---"

# Test GET request
echo -e "\n${BLUE}GET /api/hospitals${NC}"
curl -s -X GET "$BASE_URL/api/hospitals?page=0&size=3" \
    -H "Content-Type: application/json" | jq '.data.content | length' 2>/dev/null && \
    echo -e "${GREEN}✓ GET works${NC}" || echo -e "${RED}✗ GET failed${NC}"

# Test POST request (signup)
echo -e "\n${BLUE}POST /api/auth/signup${NC}"
curl -s -X POST "$BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "CORS Test User",
        "email": "cors_test_'$RANDOM'@test.com",
        "password": "TestPass123!",
        "phone": "+1-555-0000",
        "role": "PATIENT"
    }' | jq '.success' 2>/dev/null && \
    echo -e "${GREEN}✓ POST works${NC}" || echo -e "${RED}✗ POST failed${NC}"

echo ""
echo "====== CORS Test Complete ======"
echo ""

# Recommendations
echo -e "${YELLOW}Recommendations:${NC}"
echo ""
echo "1. If headers are missing:"
echo "   - Check CORS_ALLOWED_ORIGINS environment variable"
echo "   - Ensure frontend URL matches exactly"
echo "   - Redeploy backend (if on Render)"
echo ""
echo "2. If 404 or 500 error:"
echo "   - Backend might be down"
echo "   - Check backend logs: Render Dashboard → Logs"
echo ""
echo "3. Allowed Origins Configuration:"
echo "   Format: comma-separated list without trailing slash"
echo "   Example: http://localhost:5173,https://frontend.onrender.com"
echo ""
echo "For more details, see SECURITY_CORS_GUIDE.md"
