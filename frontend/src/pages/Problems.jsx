import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // ✅ get user info

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/problems");
      setProblems(res.data);
    } catch (err) {
      console.error("Error fetching problems:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this problem?");
    if (!confirmDelete) return;

    try {
      const token = user?.token;
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/problems/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting problem:", err.response?.data || err.message);
      alert("Failed to delete the problem.");
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "Easy") return "text-green-400";
    if (difficulty === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-purple-900 p-6 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📚 All Problems</h1>
          {user?.isAdmin && (
            <Link
              to="/add"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow text-white font-semibold"
            >
              ➕ Add Problem
            </Link>
          )}
        </div>

        <div className="grid gap-6">
          {problems.length > 0 ? (
            problems.map((problem) => (
              <div
                key={problem._id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-xl hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <Link to={`/problems/${problem._id}`} className="flex-1">
                    <h2 className="text-xl font-semibold hover:underline transition">{problem.title}</h2>
                    <p className={`mt-1 ${getDifficultyColor(problem.difficulty)} font-medium`}>
                      {problem.difficulty}
                    </p>
                  </Link>

                  {user?.isAdmin && (
                    <div className="flex gap-2">
                      <Link
                        to={`/editproblem/${problem._id}`}
                        className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md font-semibold"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(problem._id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No problems found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
