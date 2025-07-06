const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split(".")[0];

    return new Promise((resolve, reject) => {
        const command = `py "${filePath}" < "${inputFilePath}"`;

        console.log("🔧 Trying to run:", command); // Add this

        exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
            console.log("✅ STDOUT:", stdout);
            console.log("⚠️ STDERR:", stderr);
            console.log("❌ ERROR:", error);

            if (error) {
                if (error.killed) {
                    return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
                }
                return reject({ verdict: "Runtime Error", error: stderr || error.message });
            }

            if (stderr) {
                return reject({ verdict: "Runtime Error", error: stderr });
            }

            resolve({ verdict: "Success", output: stdout });
        });
    });
};

module.exports = { executePython };
