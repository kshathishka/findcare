# FindCare

FindCare is a full-stack healthcare appointment platform for discovering hospitals, browsing doctors, managing time slots, and booking appointments with role-based access for patients, doctors, receptionists, and administrators.

## Overview

FindCare includes:

- A Spring Boot backend with JWT authentication, role-based authorization, and REST APIs.
- A React + Vite frontend with responsive UI and dashboard flows.
- Deployment artifacts for containerized environments (Dockerfiles, Compose, CI workflow).

## Tech Stack

### Backend

- Java 21
- Spring Boot 4.0.4
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL (prod), H2 (dev/test)
- Maven

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios

## Repository Structure

```text
findcare/
├─ backend/                  # Spring Boot API
│  ├─ src/main/java/...      # Controllers, services, security, entities
│  ├─ src/main/resources/    # application properties per profile
│  ├─ Dockerfile
│  └─ pom.xml
├─ frontend/                 # React app
│  ├─ src/                   # Pages, layout, context, services
│  ├─ Dockerfile
│  └─ package.json
├─ docker-compose.yml        # Local multi-service deployment
├─ .env.example              # Required runtime variables
└─ .github/workflows/ci.yml  # CI build/test and image publish pipeline
```

## Core Features

- JWT login/signup flows with secure password handling.
- Role-based endpoint protection (`PATIENT`, `DOCTOR`, `RECEPTIONIST`, `ADMIN`).
- Hospital and doctor search/filtering.
- Appointment lifecycle: create, cancel, check-in, complete.
- Admin and operational dashboards.
- Standardized API response envelope and global exception handling.

## Local Development

## 1. Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 22+
- npm 10+
- MySQL 8+ (if running backend with MySQL profile)

## 2. Backend

```bash
cd backend
mvn spring-boot:run
```

By default, backend runs on `http://localhost:8080`.

## 3. Frontend

```bash
cd frontend
npm ci
npm run dev
```

Frontend runs on Vite default host/port unless overridden.

## 4. Build Validation

Backend:

```bash
cd backend
mvn -B test
mvn -B -DskipTests package
```

Frontend:

```bash
cd frontend
npm run build
```

## Configuration

Main properties live in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).

Environment-specific properties:

- [backend/src/main/resources/application-dev.properties](backend/src/main/resources/application-dev.properties)
- [backend/src/main/resources/application-prod.properties](backend/src/main/resources/application-prod.properties)
- [backend/src/main/resources/application-test.properties](backend/src/main/resources/application-test.properties)

Important environment variables (see [.env.example](.env.example)):

- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`
- `AUTH_RATE_LIMIT_MAX_ATTEMPTS`, `AUTH_RATE_LIMIT_WINDOW_SECONDS`

## API and Security

- Base API path: `/api/*`
- Public endpoints include auth/login, auth/signup, and public discovery APIs.
- Protected endpoints require:

```text
Authorization: Bearer <token>
```

Detailed backend API documentation: [backend/README.md](backend/README.md)

## Deployment

### Docker (recommended)

1. Copy `.env.example` to `.env` and fill secure values.
2. Start stack:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3306`

### CI/CD

The GitHub Actions workflow at [.github/workflows/ci.yml](.github/workflows/ci.yml):

- Runs backend tests.
- Builds frontend.
- Builds/pushes Docker images on push to `main`.

Required GitHub secrets/vars:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- optional repo vars for image names (`DOCKERHUB_BACKEND_REPO`, `DOCKERHUB_FRONTEND_REPO`)

## Notes

- Do not commit production secrets to the repository.
- Use profile-based config and env variables for prod deployments.
- Keep generated build outputs out of git (`backend/target`, `frontend/dist`, `node_modules`).

## License

This project is currently provided without an explicit license. Add a LICENSE file before public/open-source distribution.