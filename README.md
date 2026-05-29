# 📝 TaskFlow - Premium Task Management System

TaskFlow is a state-of-the-art, production-ready, full-stack task management application. Designed for students, developers, and professionals to streamline workflows, organize projects, and keep track of deadlines with ease. It features a stunning glassmorphic UI, robust security configurations, real-time statistics, search filters, and a clean mobile-responsive layout.

---

### Tech Badges
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT Auth](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

---

## 🔗 Live Demo
🚀 Experience the live deployment here: **[Live Demo](your-render-url-here)**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://dashboard.render.com/blueprint/new?repo=https://github.com/shivamgiri068/TaskFlow)

---

## 📸 Screenshots
### 🔐 Authentication Portal (Login / Register)
*(Placeholder: Add your login screenshot here)*
```
┌──────────────────────────────────────────┐
│                ✅ TaskFlow               │
│  [ Login ] [ Register ]                  │
│  Email: _______________________          │
│  Password: ____________________          │
│  [        Sign In        ]               │
└──────────────────────────────────────────┘
```

### 📊 Premium Analytics & Workspaces (Dashboard)
*(Placeholder: Add your dashboard screenshot here)*
```
┌──────────────────────────────────────────┐
│ ✅ TaskFlow              Hello, Shivam!  │
├──────────────────────────────────────────┤
│ Total: 12 | Todo: 4 | Progress: 3 | Done:5│
├──────────────────────────────────────────┤
│ [Search...] [Status] [Priority]  [+ Add] │
├──────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ Task A   │ │ Task B   │ │ Task C   │   │
│ │ Priority │ │ Priority │ │ Priority │   │
│ └──────────┘ └──────────┘ └──────────┘   │
└──────────────────────────────────────────┘
```

---

## ✨ Features
- 🛡️ **JWT Security Middleware**: Secure endpoint access utilizing encrypted tokens transmitted via `Bearer` authorization headers.
- 🗂️ **Interactive Filtering & Search**: Filter tasks instantly on the dashboard by title, status (`todo`, `in-progress`, `done`), and priority level (`low`, `medium`, `high`).
- 📊 **Real-time Statistics**: Visual stats bar showing metrics (Total, Todo, In-Progress, Done) updating immediately upon task CRUD operations.
- 💫 **Premium Aesthetics**: Features a modern glassmorphic look, vivid background gradients (`#0f0c29` → `#302b63` → `#24243e`), rich hover feedback, and fluid enter/exit keyframe animations.
- 🌐 **Clean API Integration**: Fully decoupled architecture communicating via standard JSON routes.
- 📱 **Fully Responsive Layout**: Custom stylesheet matching layout properties on mobile, tablet, and desktop display dimensions.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JS | Pure custom styles, transitions, responsive CSS Grid layout, and Fetch API |
| **Backend** | Node.js, Express.js | Core web framework, API routing, static file host, and middleware configurations |
| **Database** | MongoDB | NoSQL Document database for persistence (Object Modeling via Mongoose) |
| **Security** | JWT (jsonwebtoken), bcryptjs | Cryptographic password hashing and authorization token claims |
| **Environment** | dotenv, nodemon | Configurations and hot-reload local setup utils |

---

## 📂 Folder Structure

```
TaskFlow/
├── Procfile
├── package.json
├── .gitignore
├── .env.example
├── README.md
└── src/
    ├── index.js
    ├── config/
    │   └── db.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── roleMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Task.js
    │   └── Project.js
    └── public/
        ├── index.html
        ├── dashboard.html
        ├── style.css
        ├── auth.js
        └── dashboard.js
```

---

## 🛣️ API Documentation

All routes are prefixed with `/api`. Protected routes require the request header: `Authorization: Bearer <token>`.

### Authentication Routes

| Endpoint | Method | Payload | Description | Auth |
|---|---|---|---|---|
| `/auth/register` | `POST` | `{ name?, email, password }` | Registers user. Password is encrypted. | `None` |
| `/auth/login` | `POST` | `{ email, password }` | Verifies user credentials. Returns JWT token and user info. | `None` |

### Task Routes

| Endpoint | Method | Payload | Description | Auth |
|---|---|---|---|---|
| `/tasks` | `GET` | `None` | Retrieves all tasks owned by the authenticated user. | `JWT` |
| `/tasks` | `POST` | `{ title, description?, status?, priority?, dueDate? }` | Creates a task and attaches to user ID. | `JWT` |
| `/tasks/:id` | `PUT` | `{ title?, description?, status?, priority?, dueDate? }` | Updates task fields. Validates ownership first. | `JWT` |
| `/tasks/:id` | `DELETE` | `None` | Deletes the task. Validates ownership first. | `JWT` |

---

## 🚀 Local Setup Instructions

Follow these commands to configure and host the application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/shivamgiri068/TaskFlow.git
cd TaskFlow
```

### 2. Install Dependencies
Install all backend packages and development utilities:
```bash
npm install
```

### 3. Setup Environment variables
Create a `.env` file from the example template:
```bash
cp .env.example .env
```
Open `.env` and fill in your details:
```env
MONGODB_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

### 4. Launch Application
Run the development environment using `nodemon` for auto-restart:
```bash
npm run dev
```
For production execution:
```bash
npm start
```
The server will boot on `http://localhost:5000`. Open your browser to explore the dashboard.

---

## 🌐 Production Deployment (Render.com)

1. Connect your Github repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Set the following details:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
4. Add the environment variables:
   - `MONGODB_URI` = `<your-atlas-connection-string>`
   - `JWT_SECRET` = `<your-jwt-signing-secret>`
5. Click deploy. Render reads the `Procfile` and launches the application automatically!

---

## 👤 Author
Developed and maintained by **[Shivam Giri](https://github.com/shivamgiri068)**.
