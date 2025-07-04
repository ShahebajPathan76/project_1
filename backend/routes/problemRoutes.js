const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const isAdmin = require("../middleware/isAdmin");
const verifyToken = require("../middleware/verifyToken");
// Create
router.post("/", verifyToken,isAdmin ,async (req, res) => {
  try {
    console.log(req.headers); 
    
    const { title, description, difficulty,testCases, tags } = req.body;
    // console.log("🧪 testCases received:", testCases);
    const problem = await Problem.create({ title, description, difficulty,testCases, tags });
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ message: "Error creating problem", error: err.message });
  }
});

// Read all
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    console.error("❌ Problem creation error:", err); // Log full error
    res.status(500).json({ message: "Error fetching problems", error: err.message });
  }
});

// Read single
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: "Error fetching problem", error: err.message });
  }
});

// Update
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Problem not found" });
    res.json({ message: "Problem updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating problem", error: err.message });
  }
});

// Delete
router.delete('/:id',isAdmin, async (req, res) => {
    console.log("Trying to delete ID:", req.params.id);

  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
    if (!deletedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting problem', error });
  }
});


module.exports = router;
