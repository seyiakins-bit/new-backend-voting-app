import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate user using JWT
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Middleware to authorize only admins
 */
export const adminMiddleware = (req, res, next) => {
  // Check if user is authenticated and has ADMIN role
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  next();
};
