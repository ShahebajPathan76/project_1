import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProblem = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const problemData = {
        title,
        description,
        difficulty,
        testCases,
      };
      await axios.post("http://localhost:5000/api/problems", problemData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

      navigate("/problems");
    } catch (err) {
      alert("Error creating problem");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Test Cases</label>
          {testCases.map((tc, index) => (
            <div key={index} className="mb-4 space-y-2 border p-3 rounded bg-white shadow">
              <div>
                <label>Input</label>
                <textarea
                  value={tc.input}
                  onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                  className="w-full border rounded p-2"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label>Expected Output</label>
                <textarea
                  value={tc.expectedOutput}
                  onChange={(e) => handleTestCaseChange(index, "expectedOutput", e.target.value)}
                  className="w-full border rounded p-2"
                  rows={2}
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addTestCase}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            + Add Test Case
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
