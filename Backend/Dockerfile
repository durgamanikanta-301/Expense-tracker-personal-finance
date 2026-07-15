# ==========================================
# Build Stage
# ==========================================
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies (speeds up subsequent builds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Run Stage
# ==========================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render injects the PORT environment variable. We expose 8080 as a default.
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
