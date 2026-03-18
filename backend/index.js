import dotenv from "dotenv";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// =============================
// LOAD ENV FILE SAFELY
// =============================
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const __dirname = path.resolve();

// =============================
// DEBUG ENV (remove later)
// =============================
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

// =============================
// DATABASE CONNECTION
// =============================
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// =============================
// MIDDLEWARE
// =============================
app.use(
  cors({
    origin: process.env.SERVER_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// =============================
// ROUTES
// =============================
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);

// =============================
// PRODUCTION STATIC FILES
// =============================
if (process.env.NODE_ENV_CUSTOM === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome to Travel and Tourism App Backend");
  });
}

// =============================
// PORT
// =============================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});