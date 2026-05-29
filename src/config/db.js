const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error("FATAL: MONGODB_URI environment variable is not set.");
    process.exit(1);
  }

  const maxRetries = 5;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000
      });
      console.log("MongoDB Connected");
      return;
    } catch (err) {
      console.error(
        `MongoDB connection attempt ${attempt}/${maxRetries} failed:`,
        err.message
      );
      if (attempt === maxRetries) {
        console.error(
          "Tip: In MongoDB Atlas → Network Access → allow 0.0.0.0/0 (anywhere)."
        );
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
};

module.exports = connectDB;
