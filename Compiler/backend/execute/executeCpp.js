const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const outputPath = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, inputFilePath) => {
  const jobId = uuid();
  const inputPath = path.join(outputPath, `${jobId}.txt`);
  const outPath = path.join(outputPath, `${jobId}.out`);

  fs.copyFileSync(inputFilePath, inputPath);

  return new Promise((resolve, reject) => {
    const command = `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputPath}"`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      // ✅ Safe Cleanup
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      } catch (unlinkErr) {
        console.error("Cleanup failed:", unlinkErr.message);
      }

      if (error) {
        if (error.killed) return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
        return reject({ verdict: "Compile Error", error: stderr });
      }

      resolve({
        verdict: "Success",
        output: stdout.replace(/\r/g, "").trim()
      });
    });
  });
};

module.exports = { executeCpp };
