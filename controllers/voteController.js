import prisma from "../utils/prismaClient.js";

// Get all candidates
export const getCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({ orderBy: { votes: "desc" } });
    res.json(candidates);
  } catch (err) {
    console.error("Get candidates error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Cast vote
export const castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const voterId = req.user.id;

    const voter = await prisma.user.findUnique({ where: { id: voterId } });
    if (!voter || voter.has_voted) return res.status(400).json({ error: "You have already voted" });

    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    await prisma.vote.create({ data: { voterId, candidateId } });
    await prisma.candidate.update({ where: { id: candidateId }, data: { votes: { increment: 1 } } });
    await prisma.user.update({ where: { id: voterId }, data: { has_voted: true } });

    res.json({ message: "Vote cast successfully" });
  } catch (err) {
    console.error("Vote error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
