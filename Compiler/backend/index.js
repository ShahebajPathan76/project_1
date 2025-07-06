const express = require("express");
const cors = require("cors");
const { generateFile } = require("./generateFile");
const generateInputFile = require("./generateInputFile");

const { executeCpp } = require("./execute/executeCpp");
const { executeJava } = require("./execute/executeJava");
const { executePython } = require("./execute/executePython");
const { executeJs } = require("./execute/executeJs");


const app = express();
app.use(cors());
app.use(express.json());

app.post("/run", async (req, res) => {
    const { language, code, input } = req.body;

    if (!code || !language) {
        return res.status(400).json({ success: false, error: "Missing code or language" });
    }

    try {
        const filePath = await generateFile(language, code);
        const inputFilePath = await generateInputFile(input);

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
            case "js":
                result = await executeJs(filePath, inputFilePath);
                break;
            default:
                return res.status(400).json({ success: false, error: "Unsupported language" });
        }
        console.log("Execution Result:", result);
        res.json({ success: true, ...result });
    } catch (err) {
        res.json({ success: false, ...err });
    }
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});
