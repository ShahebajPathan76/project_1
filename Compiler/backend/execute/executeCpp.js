const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, jobId);

    return new Promise((resolve, reject) => {
        const command = `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputFilePath}"`;
        exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
                }
                return reject({ verdict: "Compile Error", error: stderr });
            }
            if (stderr) {
                return reject({ verdict: "Runtime Error", error: stderr });
            }
            resolve({ verdict: "Success", output: stdout });
        });
    });
};

module.exports = { executeCpp };
