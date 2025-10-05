import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import {
  getAllCandidates,
  getAllVoters,
  createCandidate,
} from "../controllers/adminController.js";
import { uploadCloud } from "../utils/multerCloudinary.js";

const router = express.Router();

// Protect all admin routes with JWT + admin role
router.use(authMiddleware, adminMiddleware);

// @route   GET /admin/candidates
// @desc    List all candidates with votes
// @access  Admin only
router.get("/candidates", getAllCandidates);

// @route   GET /admin/voters
// @desc    List all voters
// @access  Admin only
router.get("/voters", getAllVoters);

// @route   POST /admin/candidates
// @desc    Create a candidate with optional Cloudinary image
// @access  Admin only
router.post("/candidates", uploadCloud.single("image"), createCandidate);

export default router;
