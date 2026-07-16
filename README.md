<div align="center">

# 💸 FinFlow — Smart Personal Finance Tracker

### A full-stack personal finance management app built with **React + Spring Boot + MySQL**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure registration & login with BCrypt password hashing and stateless JWT tokens |
| 📊 **Dashboard** | Real-time financial health overview with charts, net balance, and AI insights |
| 💸 **Expense Tracking** | Full CRUD for logging transactions with smart category detection |
| 📈 **Budget Management** | Monthly budgets per category with visual progress bars and overspend alerts |
| 🎯 **Savings Goals** | Track your financial milestones with animated progress indicators |
| 🧾 **Recurring Bills** | Monitor subscriptions and fixed monthly costs |
| 📉 **Financial Reports** | Spending trends, category breakdowns, and income vs expense charts |

---

## 🏗️ Architecture

```
FinFlow/
├── Frontend/                   # React SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable UI components (GlassCard, Modal, Charts)
│   │   ├── pages/              # Route-level pages (Dashboard, Expenses, Budgets...)
│   │   ├── services/           # Axios API service layer
│   │   ├── context/            # AuthContext (JWT token & user state)
│   │   ├── hooks/              # Custom React hooks
│   │   └── utils/              # Formatters & helpers
│   ├── .env.example            # Frontend environment variable template
│   └── vite.config.js
│
├── Backend/                    # Spring Boot REST API
│   ├── src/main/java/com/expensetracker/
│   │   ├── controller/         # REST endpoints (@RestController)
│   │   ├── service/            # Business logic layer
│   │   ├── repository/         # Spring Data JPA repositories
│   │   ├── entity/             # JPA entities (User, Expense, Budget...)
│   │   ├── dto/                # Request/Response data transfer objects
│   │   ├── security/           # JWT filter, UserDetailsService
│   │   └── config/             # Security, CORS configuration
│   ├── src/main/resources/
│   │   └── application.properties  # Reads from ENV variables
│   ├── Dockerfile              # Multi-stage Docker build for Render
│   ├── .env.example            # Backend environment variable template
│   └── pom.xml
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| TanStack React Query | Server state & data fetching |
| Axios | HTTP client with JWT interceptors |
| Framer Motion | Animations & page transitions |
| Recharts | Financial charts & graphs |
| Lucide React | Icon library |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.3 | Application framework |
| Java 17 | Programming language |
| Spring Security 6 | Authentication & authorization |
| JJWT 0.12 | JWT token generation & validation |
| Spring Data JPA | ORM & database abstraction |
| Hibernate | SQL query generation |
| MySQL Connector/J | JDBC driver |
| HikariCP | Connection pooling |
| Maven | Build & dependency management |

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** v18+ & npm
- **Java** 17+ (JDK)
- **Maven** 3.9+
- **MySQL** 8.0 running on `localhost:3306`

### 1. Clone the repository
```bash
git clone https://github.com/B-Jai12/ExpenseTracker.git
cd ExpenseTracker
```

### 2. Set up the database
```sql
CREATE DATABASE IF NOT EXISTS expense_tracker;
```

### 3. Start the Backend
```bash
cd Backend
mvn spring-boot:run
```
> The API will start on `http://localhost:8080`

### 4. Start the Frontend
```bash
cd Frontend
npm install
npm run dev
```
> The app will open on `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`Backend/.env.example`)
| Variable | Description | Default (local) |
|---|---|---|
| `PORT` | Server port | `8080` |
| `SPRING_DATASOURCE_URL` | MySQL JDBC connection string | `jdbc:mysql://localhost:3306/expense_tracker` |
| `SPRING_DATASOURCE_USERNAME` | MySQL username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | MySQL password | `root123` |
| `JWT_SECRET` | 256-bit secret for signing tokens | fallback key |
| `ALLOWED_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`Frontend/.env.example`)
| Variable | Description | Default (local) |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api` |

---

## 🐳 Production Deployment

### Backend → Render (Docker)
1. Connect your GitHub repo to [Render](https://render.com)
2. Create a **New Web Service** → Select **Docker**
3. Set **Root Directory** to `Backend`
4. Add all environment variables from the table above
5. Deploy!

### Frontend → Vercel
1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set **Root Directory** to `Frontend`
3. Add `VITE_API_URL` pointing to your Render backend URL
4. Deploy!

---

## 🔐 Security

- Passwords are hashed using **BCrypt** — never stored as plain text
- All protected API endpoints require a valid **JWT Bearer token**
- Token expiry: **24 hours** (configurable via `JWT_EXPIRATION`)
- CORS is restricted to the configured frontend origin only

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/B-Jai12">B-Jai12</a>
</div>
