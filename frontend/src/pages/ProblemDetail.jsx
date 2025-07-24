import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";
import CodeEditor from "../components/CodeEditor";

const boilerplateMap = {
cpp: `#include <iostream>
using namespace std;

int main() {
// Write your code here
return 0;
}
`,
python: `# Write your code here
def main():
pass

if __name__ == "__main__":
main()
`,
java: `public class Main {
public static void main(String[] args) {
// Write your code here
}
}
`,
javascript: `// Write your code here
function main() {
}

main();
`,
};

// --- Add this function above your component ---
async function storeSubmission(problemTitle, verdict) {
try {
const token = localStorage.getItem("token");
await axios.post(
`${import.meta.env.VITE_BACKEND_URL}/api/submission/submit`,
{
problem: problemTitle,
status: verdict,
},
{
headers: { Authorization: `Bearer ${token}` },
}
);
// Optionally show a toast or similar UI
} catch (err) {
console.error("Error storing submission:", err);
}
}

const ProblemDetails = () => {
const { id } = useParams();
const navigate = useNavigate();
const location = useLocation();
const prefilledCode = location.state?.code || null; // ✅
  const prefilledLanguage = location.state?.language || "cpp"; // ✅
const [showCustomInput, setShowCustomInput] = useState(false);
const [customInput, setCustomInput] = useState("");
const [output, setOutput] = useState("");
const [problem, setProblem] = useState(null);
const [code, setCode] = useState(prefilledCode || boilerplateMap[prefilledLanguage]); 
const [language, setLanguage] = useState("cpp");
// const [code, setCode] = useState(boilerplateMap["cpp"]);
const [verdict, setVerdict] = useState("");
const isLoggedIn = localStorage.getItem("token") !== null;
const [review, setReview] = useState("");
const [reviewLoading, setReviewLoading] = useState(false);





const handleLanguageChange = (e) => {
const selectedLang = e.target.value;
setLanguage(selectedLang);
setCode(boilerplateMap[selectedLang]);
};

useEffect(() => {
axios
.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`)
.then((res) => setProblem(res.data))
.catch((err) => console.error("Error fetching problem details:", err));
}, [id]);

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    // 1. Run the code first via your /submit route to get verdict
    const runRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submit`, {
      language,
      code,
      problemId: id,
    });

    const finalVerdict = runRes.data.verdict || "Unknown";

    // 2. Save the submission with actual verdict
    const saveRes = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/submission/submit`,
      {
        problemId: id,
        code,
        language,
        status: finalVerdict, // ✅ Now this is correct
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setVerdict(finalVerdict);

  } catch (err) {
    console.error("❌ Submission error:", err.response?.data || err.message);
    setVerdict("Submission failed");
  }
};


const handleRunCode = async () => {
  try {
    const inputToUse = showCustomInput
      ? customInput
      : problem.testCases[0]?.input || "";

    const res = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/api/run`, {
      language,
      code,
      input: inputToUse,
    });

    setOutput(res.data.output || "No output");
  } catch (err) {
    const verdict = err.response?.data?.verdict;
    const error = err.response?.data?.error;

    if (verdict && error) {
      setOutput(`${verdict}: ${error}`);
    } else {
      setOutput("Execution failed");
    }
  }
};



const handleCodeReview = async () => {
setReviewLoading(true);
try {
const res = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/api/ai-review`, { code });
setReview(res.data.review);
} catch (error) {
setReview("error reviewing code");
console.log(error);
} finally {
setReviewLoading(false);
}
};

useEffect(() => {
if (verdict) {
const timer = setTimeout(() => setVerdict(""), 4000);
return () => clearTimeout(timer);
}
}, [verdict]);

const getDifficultyColor = (difficulty) => {
if (difficulty === "Easy") return "text-green-400";
if (difficulty === "Medium") return "text-yellow-400";
return "text-red-400";
};

if (!problem) return <div className="p-6 text-white">Loading...</div>;

return (
<div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-purple-900 text-white p-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
{/* LEFT SIDE - PROBLEM DETAILS */}
<div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-xl overflow-y-auto max-h-[calc(100vh-50px)]">
<h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
<p className={`text-sm font-semibold mb-4 ${getDifficultyColor(problem.difficulty)}`}>
Difficulty: {problem.difficulty}
</p>

<pre className="whitespace-pre-wrap text-slate-200 mb-6">
{problem.description}
</pre>

{problem.testCases?.some((tc) => tc.isSample) && (
<div>
<h3 className="text-lg font-semibold mb-2">Sample Test Cases:</h3>
{problem.testCases
.filter((tc) => tc.isSample)
.map((tc, index) => (
<div key={index} className="mb-4 bg-slate-800 p-3 rounded-lg border border-white/10">
<p className="text-sm text-gray-200 font-medium">Input:</p>
<pre className="bg-slate-900 text-green-300 p-2 rounded mb-2 overflow-x-auto">
{tc.input}
</pre>
<p className="text-sm text-gray-200 font-medium">Expected Output:</p>
<pre className="bg-slate-900 text-yellow-300 p-2 rounded overflow-x-auto">
{tc.output}
</pre>
</div>
))}
</div>
)}
</div>

{/* RIGHT SIDE - EDITOR + SUBMIT */}
<div className="flex flex-col justify-between h-full">
<div>
<div className="mb-4">
<label className="block mb-1 font-medium">Select Language:</label>
<select
value={language}
onChange={handleLanguageChange}
className="p-2 border border-slate-600 bg-slate-800 text-white rounded w-full"
>
<option value="cpp">C++</option>
<option value="python">Python</option>
<option value="java">Java</option>
<option value="javascript">JavaScript</option>
</select>
</div>

<CodeEditor code={code} setCode={setCode} language={language} />

<button
onClick={() => setShowCustomInput(!showCustomInput)}
className="w-full mt-4 bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg font-semibold text-white transition"
>
{showCustomInput ? "Hide Custom Input" : "🔎 Test with Custom Input"}
</button>

{showCustomInput && (
<textarea
className="w-full mt-2 p-2 border border-slate-700 rounded bg-slate-900 text-white"
rows={5}
placeholder="Enter your custom input here..."
value={customInput}
onChange={(e) => setCustomInput(e.target.value)}
/>
)}

<button
  onClick={handleRunCode}
  className="w-full mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white transition"
>
  ▶️ Run Code
</button>


<button
onClick={handleCodeReview}
className="w-full mt-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold text-white transition">
🤖 Review with AI
</button>
{reviewLoading && (
<p className="text-yellow-300 mt-2">AI is thinking... 🤔</p>
)}
{review && (
<div className="mt-4 p-4 bg-slate-800 border border-slate-600 rounded text-white">
<h4 className="font-bold mb-2">AI Review:</h4>
<pre className="whitespace-pre-wrap">{review}</pre>
</div>
)}



{output && (
<div className="mt-4 p-4 bg-slate-800 border border-slate-600 rounded text-white">
<h4 className="font-bold mb-2">Output:</h4>
<pre className="whitespace-pre-wrap">{output}</pre>
</div>
)}
</div>

<div className="mt-4">
{isLoggedIn ? (
<>
<button
onClick={handleSubmit}
className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
>
🚀 Submit Solution
</button>
{verdict && (
<div
className={`mt-4 p-3 rounded-lg text-center font-semibold ${
verdict === "Accepted"
? "bg-green-700 text-white"
: verdict === "Wrong Answer"
? "bg-red-700 text-white"
: "bg-yellow-700 text-white"
}`}
>
{verdict}
</div>
)}
</>
) : (
<button
onClick={() => navigate("/Auth")}
className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
>
🔐 Login to Submit
</button>
)}
</div>
</div>
</div>
</div>
);
};

export default ProblemDetails;