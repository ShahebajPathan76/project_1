const express = require("express");
const router = express.Router();
const { createProblem, getAllProblems, getProblemById, updateProblem, deleteProblem } = require("../controllers/problemController");
const isAdmin = require("../middleware/isAdmin");
const verifyToken = require("../middleware/verifyToken");

// ✅ FIXED: Use controller here
router.post("/", verifyToken, isAdmin, createProblem);

// Others (unchanged)
router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.put("/:id", isAdmin, updateProblem);
router.delete("/:id", isAdmin, deleteProblem);

module.exports = router;
