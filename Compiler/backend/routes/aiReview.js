const express = require("express");
const router = express.Router();
const generateAiResponse = require("../generateAiResponse"); // adjust path as needed


router.post("/ai-review", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Code is empty. Please provide code for review.",
    });
  }

  try {
    const aiFeedback = await generateAiResponse(code);
    res.json({ success: true, review: aiFeedback });
  } catch (err) {
    // console.error("AI Review Error:", err);
    res.status(500).json({ success: false, error: "AI review failed." });
  }
});

module.exports = router;
