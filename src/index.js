require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// CORS must allow ALL origins with credentials
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"] }));
app.use(express.json());

// Database connection check middleware for API routes
app.use("/api", (req, res, next) => {
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      msg: "Database is not connected. If this is running on Render, ensure you set MONGODB_URI in the environment variables and whitelisted all IP addresses (0.0.0.0/0) in your MongoDB Atlas Network Access settings."
    });
  }
  next();
});

// Auth & Task Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Root route sends index.html
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

// Health check route
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting"
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not set. Add it in environment variables.");
}

if (!process.env.MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI is not set. Add it in environment variables.");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
