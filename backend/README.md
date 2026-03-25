# FindCare Backend

Spring Boot backend for the FindCare healthcare appointment platform.

It provides secure REST APIs for:

- user authentication and JWT token issuance
- hospital, department, and doctor management
- time slot creation and availability tracking
- appointment booking and workflow transitions
- role-based dashboards and operational stats

## Tech Stack

- Java 21
- Spring Boot 4.0.4
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- MySQL (production), H2 (dev/test)
- Maven

## Project Structure

```text
backend/
├─ src/main/java/com/findcare/backend/
│  ├─ controller/
│  ├─ service/
│  ├─ repository/
│  ├─ security/
│  ├─ entity/
│  ├─ dto/
│  ├─ exception/
│  └─ DemoApplication.java
├─ src/main/resources/
│  ├─ application.properties
│  ├─ application-dev.properties
│  ├─ application-prod.properties
│  └─ application-test.properties
├─ Dockerfile
└─ pom.xml
```

## Run Locally

## Prerequisites

- Java 21+
- Maven 3.9+
- MySQL 8+ (optional if running with dev profile + H2)

## Start Backend

```bash
cd backend
mvn spring-boot:run
```

Default URL: `http://localhost:8080`

## Build and Test

```bash
cd backend
mvn -B test
mvn -B -DskipTests package
```

## Configuration and Profiles

Base configuration: [src/main/resources/application.properties](src/main/resources/application.properties)

Profiles:

- `dev` (default): H2 in-memory DB
- `prod`: MySQL + stricter runtime settings
- `test`: test-safe settings

Profile selection:

```bash
SPRING_PROFILES_ACTIVE=dev
```

## Important Environment Variables

- `SERVER_PORT`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`
- `AUTH_RATE_LIMIT_MAX_ATTEMPTS`
- `AUTH_RATE_LIMIT_WINDOW_SECONDS`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_USE_SSL`

## API Surface

Base path: `/api`

Main route groups:

- `/api/auth/*`
- `/api/hospitals/*`
- `/api/departments/*`
- `/api/doctors/*`
- `/api/timeslots/*`
- `/api/appointments/*`
- `/api/dashboard/*`

## Authentication

Protected endpoints require Bearer token:

```text
Authorization: Bearer <jwt_token>
```

Roles used by the system:

- `PATIENT`
- `DOCTOR`
- `RECEPTIONIST`
- `ADMIN`

## Response Format

The backend uses a standardized API envelope (`ApiResponse<T>`) for successful and error responses.

Typical success shape:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Typical error shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field": "reason"
  }
}
```

## Deployment

This backend is container-ready.

- Docker image build uses [Dockerfile](Dockerfile)
- Root-level compose setup is defined in [../docker-compose.yml](../docker-compose.yml)
- CI workflow is in [../.github/workflows/ci.yml](../.github/workflows/ci.yml)

## Notes

- Keep secrets in environment variables, not in committed files.
- Use prod profile for deployment workloads.
- For local development, `dev` profile is optimized for quick startup.
