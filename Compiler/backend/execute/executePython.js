const path = require("path");
const { exec } = require("child_process");

const executePython = async (filePath, inputFilePath) => {
    return new Promise((resolve, reject) => {
        const command = `python3 "${filePath}" < "${inputFilePath}"`;
        exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
                }
                return reject({ verdict: "Runtime Error", error: stderr });
            }
            if (stderr) {
                return reject({ verdict: "Runtime Error", error: stderr });
            }
            resolve({ verdict: "Success", output: stdout });
        });
    });
};

module.exports = { executePython };
