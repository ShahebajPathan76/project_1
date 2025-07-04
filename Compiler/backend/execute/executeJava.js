const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputDir = path.join(__dirname, "outputs");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const executeJava = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const className = path.basename(filePath).replace(".java", "");
    const dir = path.dirname(filePath);

    return new Promise((resolve, reject) => {
        exec(`javac "${filePath}"`, (compileError, _, compileStderr) => {
            if (compileError) {
                return reject({ verdict: "Compile Error", error: compileStderr });
            }

            exec(`java -cp "${dir}" ${className} < "${inputFilePath}"`, { timeout: 3000 }, (runError, stdout, stderr) => {
                if (runError) {
                    if (runError.killed) {
                        return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
                    }
                    return reject({ verdict: "Runtime Error", error: stderr || runError.message });
                }
                resolve({ verdict: "Success", output: stdout });
            });
        });
    });
};

module.exports = { executeJava };
