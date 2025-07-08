const express = require("express");
const router = express.Router();
const { executeCpp } = require("../../Compiler/backend/execute/executeCpp");
const { executePython } = require("../../Compiler/backend/execute/executePython");
const { executeJava } = require("../../Compiler/backend/execute/executeJava");
const { executeJs } = require("../../Compiler/backend/execute/executeJs");

router.post("/", async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required" });
  }

  try {
    let result;
    switch (language) {
      case "cpp":
        result = await executeCpp(code, input);
        break;
      case "python":
        result = await executePython(code, input);
        break;
      case "java":
        result = await executeJava(code, input);
        break;
      case "javascript":
        result = await executeJs(code, input);
        break;
      default:
        return res.status(400).json({ error: "Unsupported language" });
    }

    res.json(result); // ✅ No extra "output" wrapper
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Execution failed" });
  }
});

module.exports = router;
