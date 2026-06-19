const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars first
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // ✅ Changed: don't throw, just reject silently
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Routes ---
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/events",   require("./routes/events"));
app.use("/api/reserve",  require("./routes/reserve"));
app.use("/api/bookings", require("./routes/bookings"));

// --- Health check ---
app.get("/", (req, res) => {
  res.json({ status: "SortMyScene API is running 🎟️" });
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});