require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    console.error("FATAL: Set MONGODB_URI in Render → Environment.");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("FATAL: Set JWT_SECRET in Render → Environment.");
    process.exit(1);
  }

  await connectDB();

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
