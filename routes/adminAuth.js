// routes/adminAuth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.user.findUnique({ where: { email } });
  if (!admin || admin.role !== "ADMIN")
    return res.status(401).json({ error: "Invalid credentials" });

  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "2h" });

  res.json({ token, user: { id: admin.id, name: admin.name, role: admin.role } });
});

export default router;
