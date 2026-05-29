# TaskFlow

Full-stack task management application with user authentication, project management, and task CRUD operations. Built with Node.js, Express, MongoDB, and JWT.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcryptjs
- **Deployment:** Render.com, MongoDB Atlas

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/shivamgiri068/TaskFlow.git
cd TaskFlow
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

5. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register a user | No |
| POST | `/api/auth/login` | Login and get JWT | No |
| GET | `/api/tasks` | List all tasks | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |
| GET | `/api/projects` | List projects | Yes |
| POST | `/api/projects` | Create project (admin) | Yes |
| POST | `/api/projects/add-member` | Add member (admin) | Yes |

Send the JWT in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

---

## Deploy to Render.com (Free)

### Prerequisites

- GitHub account with this repo pushed
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster
- [Render](https://render.com) account

### Step 1: MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a **free M0 cluster** (choose a cloud provider and region close to you).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string.
6. Replace `<password>` with your database user password and set the database name (e.g. `taskflow`):

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
```

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Prepare TaskFlow for Render deployment"
git push origin main
```

### Step 3: Create a Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select the **TaskFlow** repository.
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `taskflow` (or any name) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node src/index.js` |

5. Select the **Free** instance type.

### Step 4: Environment Variables on Render

In your Render service, go to **Environment** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | A long random secret (e.g. generate with `openssl rand -hex 32`) |
| `PORT` | `10000` (Render sets `PORT` automatically; this is optional) |

> **Note:** Render injects `PORT` automatically. Your app uses `process.env.PORT || 5000`, so no manual PORT is required.

6. Click **Create Web Service** and wait for the deploy to finish.

### Step 5: Verify Deployment

1. Open your Render URL (e.g. `https://taskflow.onrender.com`).
2. You should see: `TaskFlow API is running`.
3. Test signup/login with Postman or your frontend, pointing API calls to your Render URL.

### Free Tier Notes

- Render free services **spin down after 15 minutes** of inactivity; the first request may take 30–60 seconds.
- MongoDB Atlas M0 cluster is free forever with 512 MB storage.
- Keep `JWT_SECRET` and `MONGODB_URI` private; never commit them to GitHub.

---

## Project Structure

```
TaskFlow/
├── Procfile
├── package.json
├── .env.example
├── README.md
└── src/
    ├── index.js
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Task.js
    │   └── Project.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── taskRoutes.js
    │   └── projectRoutes.js
    └── middleware/
        ├── authMiddleware.js
        └── roleMiddleware.js
```

## Author

[Shivam Giri](https://github.com/shivamgiri068)
