import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", register);

// @route   POST /auth/login
// @desc    Login and get token
// @access  Public
router.post("/login", login);

export default router;
