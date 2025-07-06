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


  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-2xl font-bold mb-4">All Problems</h1>

      {user?.isAdmin && (
        <Link
          to="/add"
          className="bg-blue-500 text-white px-3 py-1 rounded mb-4 inline-block"
        >
          + Add Problem
        </Link>
      )}

      <div className="grid gap-4 mt-4">
        {problems.length > 0 ? (
          problems.map((problem) => (
            <div
              key={problem._id}
              className="bg-white p-4 rounded shadow hover:shadow-md border hover:bg-gray-100"
            >
              <div className="flex items-center justify-between">
                <Link to={`/problems/${problem._id}`}>
                  <h2 className="text-lg font-semibold">{problem.title}</h2>
                  <p className="text-gray-600">{problem.difficulty}</p>
                </Link>

                {user?.isAdmin && (
                  <div className="flex gap-2 ml-2">
                    <Link
                      to={`/editproblem/${problem._id}`}
                      className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No problems found.</p>
        )}
      </div>
    </div>
  );
};

export default Problems;
