import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProblem = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testCases, setTestCases] = useState([
    { input: "", output: "", isSample: false },
  ]);

  const handleTestCaseChange = (index, field, value) => {
  const updated = [...testCases];
  // ✅ Force checkbox to store boolean (true/false), not string or undefined
  updated[index][field] = field === "isSample" ? !!value : value;
  setTestCases(updated);
};

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: "", output: "", isSample: false },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      console.log("📤 Sending testCases to backend:", JSON.stringify(testCases, null, 2));
      console.log("📤 Submitting problem with:", {
  title,
  description,
  difficulty,
  testCases,
});
console.log("🔑 Token:", token);

      await axios.post(
        "http://localhost:5000/api/problems",
        {
          title,
          description,
          difficulty,
          testCases,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/problems");

    } catch (err) {
      console.error("❌ Error creating problem:", err);
  if (err.response) {
    console.error("📥 Server responded with:", err.response.data);
  } else if (err.request) {
    console.error("📡 No response received:", err.request);
  } else {
    console.error("⚙️ Axios config error:", err.message);
  }
    }
  };

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create Problem</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full p-2 border rounded h-32"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <h2 className="text-lg font-semibold">Test Cases</h2>

        {testCases.map((tc, idx) => (
          <div key={idx} className="space-y-2 border-2 border-black p-4 rounded bg-orange-100">

            <input
              value={tc.input}
              onChange={(e) =>
                handleTestCaseChange(idx, "input", e.target.value)
              }
              placeholder="Input"
              required
              className="w-full p-2 border rounded"
            />

            <input
              value={tc.output}
              onChange={(e) =>
                handleTestCaseChange(idx, "output", e.target.value)
              }
              placeholder="Expected Output"
              required
              className="w-full p-2 border rounded"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                
                checked={tc.isSample}
                onChange={(e) =>
                  handleTestCaseChange(idx, "isSample", e.target.checked)
                }
              />
              <span>Mark as Sample Test Case</span>
            </label>
          </div>
        ))}

        <button
          type="button"
          onClick={addTestCase}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          ➕ Add Test Case
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Problem
        </button>
      </form>
    </div>
  );
};

export default CreateProblem;
