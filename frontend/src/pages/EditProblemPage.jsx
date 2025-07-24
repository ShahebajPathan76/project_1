import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EditProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: [],              // NEW: tags array in state
    testCases: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/problems/${id}`)
      .then((res) => {
        const { title, description, difficulty, testCases, tags } = res.data;
        setProblem({
          title: title || "",
          description: description || "",
          difficulty: difficulty || "Easy",
          tags: tags || [], // load tags
          testCases: (testCases || []).map((tc) => ({
            input: tc.input || "",
            output: tc.output || "",
            isSample: tc.isSample || false,
          })),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading problem:", err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Get token from storage (adjust if you store token somewhere else)
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to edit problems.");
    return;
  }

  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`,
      problem,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // <-- send token here
        },
      }
    );
    navigate("/problems");
  } catch (err) {
    console.error("Error updating problem:", err.response || err.message);
    alert("Failed to update problem. Please try again.");
  }
};


  if (loading) return <div className="text-center text-xl mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 py-10 px-4 text-white">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Edit Problem</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              value={problem.title}
              onChange={(e) => setProblem({ ...problem, title: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter problem title"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Difficulty</label>
            <div className="relative">
              <select
                value={problem.difficulty}
                onChange={(e) => setProblem({ ...problem, difficulty: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/20 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option className="text-black" value="Easy">Easy</option>
                <option className="text-black" value="Medium">Medium</option>
                <option className="text-black" value="Hard">Hard</option>
              </select>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-white">
                ▼
              </div>
            </div>
          </div>

          {/* NEW: Tags input (comma separated) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Tags</label>
            <input
              type="text"
              value={problem.tags.join(", ")} // join array to string
              onChange={(e) => {
                const raw = e.target.value;
                const tagsArr = raw
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0);
                setProblem({ ...problem, tags: tagsArr });
              }}
              placeholder="Tags (comma separated, e.g. Greedy, DP, Array)"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={problem.description}
              onChange={(e) => setProblem({ ...problem, description: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={6}
              placeholder="Enter problem description"
            />
          </div>

          {/* Test Cases */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Test Cases</h3>
            {problem.testCases.map((tc, index) => (
              <div
                key={index}
                className="bg-white/10 p-4 rounded-lg mb-4 border border-white/20 space-y-2"
              >
                <input
                  type="text"
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => {
                    const newTestCases = [...problem.testCases];
                    newTestCases[index].input = e.target.value;
                    setProblem({ ...problem, testCases: newTestCases });
                  }}
                  className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-300"
                />
                <input
                  type="text"
                  placeholder="Output"
                  value={tc.output}
                  onChange={(e) => {
                    const newTestCases = [...problem.testCases];
                    newTestCases[index].output = e.target.value;
                    setProblem({ ...problem, testCases: newTestCases });
                  }}
                  className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-300"
                />
                <label className="inline-flex items-center space-x-2 text-sm text-gray-200">
                  <input
                    type="checkbox"
                    checked={tc.isSample}
                    onChange={(e) => {
                      const newTestCases = [...problem.testCases];
                      newTestCases[index].isSample = e.target.checked;
                      setProblem({ ...problem, testCases: newTestCases });
                    }}
                  />
                  <span>Is Sample?</span>
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setProblem({
                  ...problem,
                  testCases: [...problem.testCases, { input: "", output: "", isSample: false }],
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              ➕ Add Test Case
            </button>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg"
            >
              ✅ Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProblemPage;
