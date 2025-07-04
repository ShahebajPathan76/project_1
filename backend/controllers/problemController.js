const Problem = require("../models/Problem");

// Create a problem
exports.createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    console.log("📦 Request body:", req.body); // For debugging

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: "Test cases are required" });
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      testCases,
    });

    res.status(201).json(problem);
  } catch (err) {
    console.error("❌ Error creating problem:", err.message);
    res.status(500).json({ message: "Error creating problem", error: err.message });
  }
};


// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching problems", error: err.message });
  }
};

// Get a single problem
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: "Error fetching problem", error: err.message });
  }
};

// Update a problem
exports.updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating problem", error: err.message });
  }
};

// Delete a problem
exports.deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: "Problem deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting problem", error: err.message });
  }
};
