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
    testCases: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/problems/${id}`)
      .then((res) => {
        console.log("Fetched problem:", res.data);
        setProblem({
          title: res.data.title || "",
          description: res.data.description || "",
          difficulty: res.data.difficulty || "Easy",
          testCases: (res.data.testCases || []).map((tc) => ({
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
    await axios.put(`http://localhost:5000/api/problems/${id}`, problem);
    navigate("/problems");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
      <label className="block mb-2">
        Title:
        <input
          type="text"
          value={problem.title}
          onChange={(e) => setProblem({ ...problem, title: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="block mb-2">
        Difficulty:
        <select
          value={problem.difficulty}
          onChange={(e) =>
            setProblem({ ...problem, difficulty: e.target.value })
          }
          className="w-full border p-2 rounded"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </label>

      <label className="block mb-2">
        Description:
        <textarea
          value={problem.description}
          onChange={(e) =>
            setProblem({ ...problem, description: e.target.value })
          }
          className="w-full border p-2 rounded"
          rows={6}
        />
      </label>

      <label className="block mb-2">
        Test Cases:
        {problem.testCases.map((tc, index) => (
          <div key={index} className="mb-4 border p-2 rounded bg-orange-50">
            <input
              type="text"
              placeholder="Input"
              className="w-full mb-1 border p-2 rounded"
              value={tc.input}
              onChange={(e) => {
                const newTestCases = [...problem.testCases];
                newTestCases[index].input = e.target.value;
                setProblem({ ...problem, testCases: newTestCases });
              }}
            />
            <input
              type="text"
              placeholder="Output"
              className="w-full mb-1 border p-2 rounded"
              value={tc.output}
              onChange={(e) => {
                const newTestCases = [...problem.testCases];
                newTestCases[index].output = e.target.value;
                setProblem({ ...problem, testCases: newTestCases });
              }}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={tc.isSample}
                onChange={(e) => {
                  const newTestCases = [...problem.testCases];
                  newTestCases[index].isSample = e.target.checked;
                  setProblem({ ...problem, testCases: newTestCases });
                }}
              />
              Is Sample?
            </label>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setProblem({
              ...problem,
              testCases: [
                ...problem.testCases,
                { input: "", output: "", isSample: false },
              ],
            })
          }
          className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
        >
          ➕ Add Test Case
        </button>
      </label>

      <button
        type="submit"
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditProblemPage;
