import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import voteRoutes from "./routes/voteroutes.js";
import adminAuthRoutes from "./routes/adminAuth.js";   // ✅ admin login
import adminRoutes from "./routes/adminRoutes.js";     // ✅ protected admin routes

dotenv.config();

const app = express();

// Middleware
// Allow only your frontend origin to access the backend
const allowedOrigins = [
  "https://voting-app-frontend-git-main-akinsulure-seyis-projects.vercel.app",
  "http://localhost:5173" // optional: for local frontend testing
];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    credentials: true, // if you are sending cookies or auth headers
  })
);

app.use(express.json());

// Test route to verify server is running
app.get("/", (req, res) => res.send("Server is running"));

// Routes
app.use("/auth", authRoutes);
app.use("/vote", voteRoutes);
app.use("/admin", adminAuthRoutes);   // ✅ login, no token required
app.use("/admin", adminRoutes);       // ✅ protected routes (need token)

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
