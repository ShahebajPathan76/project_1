const { exec } = require("child_process");
const path = require("path");

const executeJava = (filePath, inputFilePath) => {
  const jobDir = path.dirname(filePath);
  return new Promise((resolve, reject) => {
    const command = `javac "${filePath}" && java -cp "${jobDir}" Main < "${inputFilePath}"`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
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

module.exports = { executeJava };
