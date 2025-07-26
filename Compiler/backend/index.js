const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { generateFile } = require("./generateFile");
const generateInputFile = require("./generateInputFile");

const { executeCpp } = require("./execute/executeCpp");
const { executeJava } = require("./execute/executeJava");
const { executePython } = require("./execute/executePython");
const { executeJs } = require("./execute/executeJs");

const aiReviewRoutes = require("./routes/aiReview");
const runRoute = require("./routes/run");
const app = express();
app.use(cors());
app.use(express.json());
// app.use("/api", aiRoutes);
app.use("/api", aiReviewRoutes);
app.use("/api/run", runRoute);
app.post("/run", async (req, res) => {
    const { language, code, input } = req.body;

    if (!code || !language) {
        return res.status(400).json({ success: false, error: "Missing code or language" });
    }

    try {
        const {filePath} = await generateFile(language, code);
        const inputFilePath = await generateInputFile(input);

        // ✅ Read actual code content from file
        // const actualCode = await fs.promises.readFile(filePath, "utf-8")

        let result;

        switch (language) {
            case "cpp":
                result = await executeCpp(filePath, inputFilePath);
                break;
            case "java":
                result = await executeJava(filePath, inputFilePath);
                break;
            case "python":
                result = await executePython(filePath, inputFilePath);
                break;
            case "javascript":
            case "js":
                result = await executeJs(filePath, inputFilePath);
                break;
            default:
                return res.status(400).json({ success: false, error: "Unsupported language" });
        }

        // Optional clean-up
        await fs.promises.unlink(filePath);

        // console.log("Execution Result:", result);
        res.json({ success: true, ...result });
    } catch (err) {
        // console.error("Execution Error:", err);
        res.json({ success: false, ...err });
    }
});



app.listen(8000, () => {
    console.log("Server running on port 8000");
});
