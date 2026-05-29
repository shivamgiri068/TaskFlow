const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = (process.env.MONGODB_URI || process.env.MONGO_URI || "").trim();

  if (!uri) {
    console.error("MONGODB_URI is not set. Add it in Render → Environment.");
    return;
  }

  const connectOnce = async () => {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log("MongoDB Connected");
  };

  while (true) {
    try {
      await connectOnce();
      return;
    } catch (err) {
      console.error("MongoDB connection failed, retrying in 10s:", err.message);
      await new Promise((r) => setTimeout(r, 10000));
    }
  }
};

module.exports = connectDB;
