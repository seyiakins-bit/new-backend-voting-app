import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import voteRoutes from "./routes/voteroutes.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Allow any Vercel deployment
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);

      // Allow local dev
      if (origin === "http://localhost:5173") return callback(null, true);

      console.warn(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error("CORS policy: This origin is not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Root test route
app.get("/", (req, res) => res.send("✅ Server is running successfully!"));

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/vote", voteRoutes);
app.use("/admin", adminAuthRoutes);
app.use("/admin", adminRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: err.message || "Internal server error occurred" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



