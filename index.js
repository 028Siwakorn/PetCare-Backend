const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const serviceRouter = require("./routers/service.router");
const bookingRouter = require("./routers/booking.router");
const petRouter = require("./routers/pet.router");

const app = express();
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const DB_URL = process.env.DB_URL;

// CORS: รองรับ origin ที่มี/ไม่มี slash ท้าย (เบราว์เซอร์ส่ง http://localhost:5173 ไม่มี slash)
const allowedOrigin = BASE_URL ? BASE_URL.replace(/\/$/, "") : null;
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || !allowedOrigin) return cb(null, true);
      const normalized = origin.replace(/\/$/, "");
      if (normalized === allowedOrigin) return cb(null, true);
      cb(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Pet Care Booking API</h1>");
});

if (!DB_URL) {
  console.error("DB_URL is missing! please set it in your .env file...");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

//use Router
app.use("/api/v1/user", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/pets", petRouter);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});