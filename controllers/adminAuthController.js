import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";

/**
 * Admin login
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.user.findUnique({ where: { email } });
    if (!admin || admin.role !== "ADMIN")
      return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, user: { id: admin.id, name: admin.name, role: admin.role } });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
