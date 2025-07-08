const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = async (filePath, inputFilePath) => {
    const command = `python "${filePath}" < "${inputFilePath}"`; // Use 'python' for cross-platform compatibility

    return new Promise((resolve, reject) => {
        exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
                }
                return reject({ verdict: "Runtime Error", error: stderr || error.message });
            }

            if (stderr) {
                return reject({ verdict: "Runtime Error", error: stderr });
            }

            resolve({ verdict: "Success", output: stdout.trim() });
        });
    });
};

module.exports = { executePython };
