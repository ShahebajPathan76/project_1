import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CodeEditor from "../components/CodeEditor";
import { useNavigate } from "react-router-dom";
const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here...");
  const isLoggedIn = localStorage.getItem("token") !== null;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/problems/${id}`)
      .then((res) => setProblem(res.data))
      .catch((err) => console.error("Error fetching problem details:", err));
  }, [id]);

 const handleSubmit = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/submit", {
      language,
      code,
      problemId: id, // ✅ Send this to backend to fetch testCases
    });

    console.log("✅ Backend Response:", res.data);

    alert(`Verdict: ${res.data.verdict}\n\nDetails:\n${JSON.stringify(res.data.results, null, 2)}`);
  } catch (err) {
    console.error("❌ Submission error:", err.response?.data || err.message);
    alert("Submission failed");
  }
};

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
      <p className="text-sm text-gray-500 mb-4">Difficulty: {problem.difficulty}</p>
      <p className="text-gray-800 whitespace-pre-line mb-6">{problem.description}</p>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      <CodeEditor code={code} setCode={setCode} language={language} />

      {isLoggedIn ? (
  <button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit Solution</button>
) : (
  <button onClick={() => navigate("/Auth")} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Login to Submit</button>
)}

      
    </div>
  );
};

export default ProblemDetails;
