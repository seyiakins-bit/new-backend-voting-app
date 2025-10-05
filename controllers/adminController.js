import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";
import crypto from "crypto";

// Helper to generate unique voterId
const generateVoterId = () => "VOTER-" + crypto.randomBytes(4).toString("hex").toUpperCase();

// Admin login
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

// Get all candidates
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: { user: true },
      orderBy: { votes: "desc" },
    });
    res.json(candidates);
  } catch (err) {
    console.error("Admin get candidates error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all voters
export const getAllVoters = async (req, res) => {
  try {
    const voters = await prisma.user.findMany({
      where: { role: "VOTER" },
      select: { id: true, name: true, email: true, voterId: true, createdAt: true },
    });
    res.json(voters);
  } catch (err) {
    console.error("Admin get voters error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Create candidate (auto voterId + hashed password)
export const createCandidate = async (req, res) => {
  try {
    const { name, email, password, party } = req.body;
    const imageUrl = req.file?.path || null;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const voterId = generateVoterId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "VOTER", voterId },
    });

    const candidate = await prisma.candidate.create({
      data: { userId: user.id, party, imageUrl },
    });

    res.status(201).json({ message: "Candidate created", candidate, voterId });
  } catch (err) {
    console.error("Admin create candidate error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
