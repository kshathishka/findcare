# syntax=docker/dockerfile:1.7

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src
RUN --mount=type=cache,target=/root/.m2 mvn -f backend/pom.xml -B -DskipTests package

FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

ENV JAVA_OPTS=""
COPY --from=build /app/backend/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
