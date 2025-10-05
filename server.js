import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import voteRoutes from "./routes/voteroutes.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  "https://new-voting-app-frontend.vercel.app", // main frontend
  "http://localhost:5173",                       // local testing
];

// CORS middleware
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow Postman or known origins
      if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes("vercel.app"))) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("Server is running"));

// Routes
app.use("/auth", authRoutes);
app.use("/vote", voteRoutes);
app.use("/admin", adminAuthRoutes);
app.use("/admin", adminRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
