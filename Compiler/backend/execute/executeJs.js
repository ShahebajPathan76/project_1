const { exec } = require("child_process");

const executeJs = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const command = `node "${filePath}" < "${inputFilePath}"`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) return reject({ verdict: "TLE", error: "Time Limit Exceeded" });
        return reject({ verdict: "Runtime Error", error: stderr });
      }

      resolve({
        verdict: "Success",
        output: stdout.replace(/\r/g, "").trim()
      });
    });
  });
};

module.exports = { executeJs };
