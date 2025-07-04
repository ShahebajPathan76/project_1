const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
  testCases: [
    {
      input: String,
      output: String,
      isSample: { type: Boolean, default: false } // ✅ NEW FIELD
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Problem", problemSchema);
