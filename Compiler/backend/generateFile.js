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
        py: "py",
        js: "js",
    }[language];

    const fileName = language === "java" ? "Main.java" : `${jobId}.${fileExtension}`;
    const filePath = path.join(dirCodes, fileName);
    await fs.promises.writeFile(filePath, code);
    return filePath;
};

module.exports = { generateFile };
