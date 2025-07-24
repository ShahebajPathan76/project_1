const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (language, code) => {
    const jobId = uuid();
    const fileExtension = {
        cpp: "cpp",
        java: "java",
        python: "py",
        javascript: "js",
    }[language];

    const jobDir = path.join(dirCodes, jobId);
    await fs.promises.mkdir(jobDir, { recursive: true });

    const fileName = language === "java" ? "Main.java" : `code.${fileExtension}`;
    const filePath = path.join(jobDir, fileName);
    await fs.promises.writeFile(filePath, code);
    // console.log(`Code to write (${fileName}):\n`, code);

    return { filePath, jobId, jobDir };
};

module.exports = { generateFile };
