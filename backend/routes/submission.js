const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const auth = require('../middleware/verifyToken');


// POST: Store submission with code and language
router.post('/submit', auth, async (req, res) => {
  try {
    const { problemId, code, language, status } = req.body;
    if (!problemId || !code || !language || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Use req.user.id (not req.user._id)
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token: user id missing" });
    }

    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code,
      language,
      status,
    });

    // Populate problem title for convenience
    await submission.populate('problem', 'title');

    res.status(201).json({
      _id: submission._id,
      problem: { _id: submission.problem._id, title: submission.problem.title },
      code: submission.code,
      language: submission.language,
      status: submission.status,
      createdAt: submission.createdAt,
    });
  } catch (e) {
    console.error("Submission Creation Error:", e);
    res.status(500).json({ message: 'Failed to submit' });
  }
});

// GET: User's own submissions with problem titles
router.get('/my', auth, async (req, res) => {
  try {
    // Use req.user.id here as well
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token: user id missing" });
    }

    const submissions = await Submission.find({ user: userId })
        .select('problem status code language createdAt') // Add this line
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (e) {
    console.error("Fetch submissions error:", e);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});

module.exports = router;
