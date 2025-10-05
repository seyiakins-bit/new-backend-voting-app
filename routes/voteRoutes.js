import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getCandidates, castVote } from "../controllers/voteController.js";

const router = express.Router();

// @route   GET /vote/candidates
// @desc    Get all candidates with vote counts
// @access  Protected (must be logged in)
router.get("/candidates", authMiddleware, getCandidates);

// @route   POST /vote
// @desc    Cast a vote
// @access  Protected (must be logged in)
router.post("/", authMiddleware, castVote);

export default router;
