const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const outputPath = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (code, input = "") => {
  const jobId = uuid();
  const codePath = path.join(outputPath, `${jobId}.cpp`);
  const inputPath = path.join(outputPath, `${jobId}.txt`);
  const outPath = path.join(outputPath, `${jobId}.out`);

  fs.writeFileSync(codePath, code);
  fs.writeFileSync(inputPath, input);

  return new Promise((resolve, reject) => {
    const command = `g++ "${codePath}" -o "${outPath}" && "${outPath}" < "${inputPath}"`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      // Clean up files after execution
      fs.unlinkSync(codePath);
      fs.unlinkSync(inputPath);
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

      if (error) {
        if (error.killed) return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
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
