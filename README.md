<div align="center">

<!-- Animated banner using capsule-render -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,25,30&height=200&section=header&text=FinFlow&fontSize=90&fontAlignY=38&desc=💸%20Your%20money.%20Your%20rules.%20Your%20clarity.&descAlignY=58&descAlign=50&animation=twinkling&fontColor=ffffff" width="100%"/>

<br/>

<!-- Typing animation -->
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=A78BFA&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=Full-Stack+Personal+Finance+Tracker;Built+with+React+%2B+Spring+Boot+%2B+PostgreSQL;Track+%7C+Budget+%7C+Save+%7C+Grow+💜" alt="Typing SVG" />

<br/><br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Aiven-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

<br/>

> **FinFlow** is a full-stack personal finance tracker with a stunning glassmorphic dark UI,
> real-time analytics, intelligent merchant detection, and rotating financial wisdom quotes —
> all deployed on the cloud and ready to use from any device.

<br/>

[![🚀 Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Click%20Here-A78BFA?style=for-the-badge)](https://expense-tracker-flax-ten-84.vercel.app)
&nbsp;
[![📖 API Docs](https://img.shields.io/badge/📡%20API%20Docs-Endpoints-6DB33F?style=for-the-badge)](#-api-endpoints)
&nbsp;
[![🛠️ Setup](https://img.shields.io/badge/🛠️%20Local%20Setup-Guide-61DAFB?style=for-the-badge)](#-local-development-setup)
&nbsp;
[![🐛 Bug Report](https://img.shields.io/badge/🐛%20Report%20Bug-Issues-EF4444?style=for-the-badge)](https://github.com/B-Jai12/ExpenseTracker/issues)

</div>

---

## ✨ Features at a Glance

| Feature | Description |
|---|---|
| 🏠 **Live Dashboard** | Real-time balance, income/expense stats, health score gauge, 6-month cash flow chart |
| 💳 **Smart Transactions** | Add income & expenses with intelligent auto-categorization |
| 🧠 **Merchant Detection** | Auto-identifies 100+ merchants (Swiggy, Amazon, Netflix, etc.) and assigns the right category |
| 📊 **Reports & Analytics** | Pie charts, bar charts, category breakdowns, monthly trends |
| 🎯 **Budget Tracking** | Set monthly budgets per category with visual progress bars and overspend alerts |
| 💰 **Savings Goals** | Create savings targets and track your progress toward each goal |
| 🔔 **Recurring Bills** | Track upcoming bills and subscriptions so you never miss a payment |
| 💡 **Daily Mindset** | 60+ rotating financial wisdom quotes that change every 3 minutes with fade animation |
| 🔒 **JWT Auth** | Secure stateless authentication — your data stays yours |
| 📱 **Fully Responsive** | Works beautifully on mobile, tablet, and desktop |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        USER                             │
└──────────────────────────┬──────────────────────────────┘
                           │ opens browser
                           ▼
┌─────────────────────────────────────────────────────────┐
│           🌐  VERCEL  (Frontend)                        │
│         React 18 + Vite + TanStack Query                │
│           Glassmorphic Dark UI | Framer Motion          │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API calls
                           ▼
┌─────────────────────────────────────────────────────────┐
│           ⚙️  RENDER  (Backend)                         │
│         Spring Boot 3 + Java 17 + JWT Auth              │
│           Docker containerized | REST API               │
└──────────────────────────┬──────────────────────────────┘
                           │ JPA / Hibernate
                           ▼
┌─────────────────────────────────────────────────────────┐
│           🗄️  AIVEN  (Database)                         │
│                PostgreSQL (Cloud)                       │
│           Managed | Encrypted | Always-on               │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite 5** | Lightning-fast build tool |
| **TanStack Query** | Server state, caching & sync |
| **Framer Motion** | Smooth animations & transitions |
| **Recharts** | Beautiful charts & graphs |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |

### Backend
| Tech | Purpose |
|---|---|
| **Spring Boot 3** | REST API framework |
| **Java 17** | Core language |
| **Spring Security + JWT** | Authentication & authorization |
| **Spring Data JPA** | Database ORM |
| **Hibernate** | Object-relational mapping |
| **Maven** | Dependency management |
| **Docker** | Containerization |

### Database & Infrastructure
| Tech | Purpose |
|---|---|
| **PostgreSQL** | Primary database (via Aiven) |
| **Aiven** | Managed cloud database |
| **Render** | Backend hosting |
| **Vercel** | Frontend hosting + CDN |

---

## 🚀 Live Deployment

| Service | URL |
|---|---|
| 🌐 **Frontend** | [expense-tracker-flax-ten-84.vercel.app](https://expense-tracker-flax-ten-84.vercel.app) |
| ⚙️ **Backend API** | [expensetracker-vxzj.onrender.com/api](https://expensetracker-vxzj.onrender.com/api) |
| 📡 **Health Check** | [expensetracker-vxzj.onrender.com/api/health](https://expensetracker-vxzj.onrender.com/api/health) |

> ⚠️ **Note:** The backend is on Render's free tier. The first request after 15 minutes of inactivity may take ~30 seconds to wake up. Subsequent requests are instant.

---

## 💻 Local Development Setup

### Prerequisites

```bash
java --version    # Java 17+
mvn --version     # Apache Maven 3.8+
node --version    # Node.js 18+
psql --version    # PostgreSQL 14+
```

### 1️⃣ Clone the repository

```bash
git clone https://github.com/B-Jai12/ExpenseTracker.git
cd ExpenseTracker
```

### 2️⃣ Set up the database

```bash
psql -U postgres -c "CREATE DATABASE expensetracker;"
```

### 3️⃣ Run the backend

```bash
cd Backend
# No .env needed for local dev — defaults are built in!
mvn spring-boot:run
```
Backend starts on **http://localhost:8080** — Spring Boot auto-creates all tables ✅

### 4️⃣ Run the frontend

```bash
cd Frontend
npm install
npm run dev
```
Frontend starts on **http://localhost:5173** ✅

### 5️⃣ Open the app

Go to **http://localhost:5173** → Click **Register** → You're in! 🎉

---

## 📡 API Endpoints

Base URL: `https://expensetracker-vxzj.onrender.com/api`

### 🔐 Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and get JWT token |

### 💳 Expenses (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/expenses` | Get all transactions |
| `POST` | `/expenses` | Create a transaction |
| `PUT` | `/expenses/{id}` | Update a transaction |
| `DELETE` | `/expenses/{id}` | Delete a transaction |
| `GET` | `/expenses/filter/period?month=7&year=2026` | Filter by month/year |

### 🎯 Budgets (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/budgets` | Get all budgets |
| `POST` | `/budgets` | Create a budget |
| `GET` | `/budgets/filter/period?month=7&year=2026` | Filter by period |
| `PUT` | `/budgets/{id}` | Update a budget |
| `DELETE` | `/budgets/{id}` | Delete a budget |

### 🏠 Dashboard (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard` | Get full financial dashboard summary |

### 💰 Savings Goals (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/savings-goals` | Get all savings goals |
| `POST` | `/savings-goals` | Create a savings goal |
| `PUT` | `/savings-goals/{id}` | Update a savings goal |

> 💡 All protected endpoints require: `Authorization: Bearer <your_jwt_token>`

---

## 📁 Project Structure

```
ExpenseTracker/
│
├── 📂 Frontend/                    # React + Vite app
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   └── ui/               # GlassCard, Button, Modal, etc.
│   │   ├── pages/                 # Page components
│   │   │   ├── Dashboard/        # Main dashboard
│   │   │   ├── Expenses/         # Transactions
│   │   │   ├── Budgets/          # Budget tracking
│   │   │   ├── Savings/          # Savings goals
│   │   │   ├── Bills/            # Recurring bills
│   │   │   └── Reports/          # Analytics
│   │   ├── services/             # API service layer
│   │   │   ├── api.js            # Axios instance + interceptors
│   │   │   └── merchantService.js # Intelligent category detection
│   │   ├── constants/            # App-wide constants & 60 quotes
│   │   └── utils/                # Helper utilities
│   └── Dockerfile
│
├── 📂 Backend/                     # Spring Boot app
│   └── src/main/java/com/expensetracker/
│       ├── controller/           # REST controllers
│       ├── service/              # Business logic
│       ├── repository/           # JPA repositories
│       ├── entity/               # JPA entities
│       ├── dto/                  # Request/Response DTOs
│       ├── mapper/               # Entity ↔ DTO mappers
│       ├── security/             # JWT auth configuration
│       └── exception/            # Global error handling
│
└── 📄 README.md
```

---

## 🔐 Environment Variables

### Backend (Render dashboard)
| Variable | Example |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://host:port/db?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | `avnadmin` |
| `SPRING_DATASOURCE_PASSWORD` | `your_password` |
| `JWT_SECRET` | `your_256bit_secret` |

### Frontend (Vercel dashboard)
| Variable | Example |
|---|---|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` |

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feat/amazing-feature`
3. 💾 Commit your changes: `git commit -m 'feat: add amazing feature'`
4. 📤 Push to branch: `git push origin feat/amazing-feature`
5. 🔃 Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Jaideep**

[![GitHub](https://img.shields.io/badge/GitHub-B--Jai12-181717?style=for-the-badge&logo=github)](https://github.com/B-Jai12)

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,25,30&height=100&section=footer&animation=twinkling" width="100%"/>

**Built with ❤️, ☕, and a lot of debugging**

*If this helped you, please give it a ⭐ on GitHub!*

</div>
