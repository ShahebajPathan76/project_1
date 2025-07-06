const express = require("express");
const axios = require("axios");
const router = express.Router();
const Problem = require("../models/Problem"); // ⬅️ Needed to fetch testCases from DB

router.post("/", async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ error: "Code, language, and problemId are required." });
    }

    // Step 1: Fetch the problem from DB
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const testCases = problem.testCases; // Array of { input, output }
    let allPassed = true;
    let results = [];

    // Step 2: Loop through each test case
    for (let i = 0; i < testCases.length; i++) {
  const tc = testCases[i];

  try {
    const { data } = await axios.post("http://localhost:8000/run", {
      code,
      language,
      input: tc.input,
    });

    // Check if there was a compilation or execution error
    const actual = data.output?.trim() || "";
    const expected = tc.output?.trim() || "";
    let verdict;

    if (data.verdict === "TLE") {
      verdict = "TLE";
      allPassed = false;
    } else if (data.verdict === "Compile Error") {
      verdict = "Compile Error";
      allPassed = false;
    } else if (data.verdict === "Runtime Error") {
      verdict = "Runtime Error";
      allPassed = false;
    } else {
      verdict = actual === expected ? "Passed" : "Failed";
      if (verdict === "Failed") allPassed = false;
    }

    results.push({
      testCase: i + 1,
      input: tc.input,
      expected,
      actual,
      verdict,
    });
    
    // If it's not a normal failed case, break early
    if (["TLE", "Compile Error", "Runtime Error"].includes(verdict)) {
      break;
    }

  } catch (err) {
    console.error("Error running test case:", err);
    results.push({
      testCase: i + 1,
      input: tc.input,
      expected: tc.output?.trim() || "",
      actual: "",
      verdict: "Internal Error",
    });
    allPassed = false;
    break;
  }
}


    const finalVerdict = allPassed ? "Accepted" : "Wrong Answer";
    
    return res.json({
      verdict: finalVerdict,
      results,
    });

  } catch (err) {
    console.error("Submit error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Submission failed",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
