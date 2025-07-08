const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputDir = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const executeJava = async (filePath, inputFilePath) => {
    const className = path.basename(filePath, ".java");
    const dir = path.dirname(filePath);

    return new Promise((resolve, reject) => {
        // Step 1: Compile Java file
        exec(`javac "${filePath}"`, (compileError, _, compileStderr) => {
            if (compileError || compileStderr) {
                return reject({
                    verdict: "Compile Error",
                    error: compileStderr || compileError.message
                });
            }

            // Step 2: Execute compiled class
            const runCmd = `java -cp "${dir}" ${className} < "${inputFilePath}"`;
            exec(runCmd, { timeout: 3000 }, (runError, stdout, stderr) => {
                if (runError) {
                    if (runError.killed) {
                        return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
                    }
                    return reject({
                        verdict: "Runtime Error",
                        error: stderr || runError.message
                    });
                }

                if (stderr) {
                    return reject({ verdict: "Runtime Error", error: stderr });
                }

                resolve({ verdict: "Success", output: stdout.trim() });
            });
        });
    });
};

module.exports = { executeJava };
