# ExpenseTracker

A modern full-stack personal finance management application that helps users track transactions, manage budgets, set savings goals, and monitor recurring bills.

## Tech Stack

**Frontend**
- React (JavaScript, Vite)
- React Router
- Context API for state management

**Backend**
- Spring Boot 3 (Java)
- Maven
- Spring Security + JWT
- Spring Data JPA

## Project Structure

```
ExpenseTracker/
├── Frontend/   # React SPA client
├── Backend/    # Spring Boot REST API
├── README.md
├── .gitignore
└── LICENSE
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.9+
- A relational database (e.g. PostgreSQL/MySQL) — configure in `Backend/src/main/resources/application.properties`

### Backend Setup
```bash
cd Backend
cp .env.example .env
./mvnw spring-boot:run
```
The API will start on `http://localhost:8080` by default.

### Frontend Setup
```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```
The app will start on `http://localhost:5173` by default.

## Features (Planned)
- User authentication (JWT-based)
- Transaction tracking (income/expense)
- Budget creation and monitoring
- Savings goals
- Recurring bill reminders
- Financial reports and analytics

## Status
This repository currently contains the project scaffolding only. Business logic has not yet been implemented.

## License
See [LICENSE](./LICENSE).
