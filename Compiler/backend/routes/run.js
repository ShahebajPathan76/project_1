const express = require("express");
const router = express.Router();
const { executeCpp } = require("../execute/executeCpp");
const { executePython } = require("../execute/executePython");
const { executeJava } = require("../execute/executeJava");
const { executeJs } = require("../execute/executeJs");
const { generateFile } = require("../generateFile");
const generateInputFile = require("../generateInputFile");

router.post("/", async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required" });
  }

  try {
    const { filePath } = await generateFile(language, code);
    const inputFilePath = generateInputFile(input || "");

    let result;

    switch (language) {
      case "cpp":
        result = await executeCpp(filePath, inputFilePath);
        break;
      case "python":
        result = await executePython(filePath, inputFilePath);
        break;
      case "javascript":
        result = await executeJs(filePath, inputFilePath);
        break;
      case "java":
        result = await executeJava(filePath, inputFilePath);
        break;
      default:
        return res.status(400).json({ error: "Unsupported language" });
    }

    res.json(result);
  } catch (err) {
  console.error("Execution error:", err);
  const verdict = err.verdict || "Execution Failed";
  const errorMessage = err.error || err.message || "Something went wrong";
  res.status(500).json({ verdict, error: errorMessage });
}
});


module.exports = router;
