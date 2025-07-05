import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // ✅ get user info

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/problems")
      .then((res) => setProblems(res.data))
      .catch((err) => console.error("Error fetching problems:", err));
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-2xl font-bold mb-4">All Problems</h1>

      {/* ✅ Only show this if user is admin */}
      {user?.isAdmin && (
        <Link
          to="/problems/create"
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

                {/* ✅ Show Edit button only to admin */}
                {user?.isAdmin && (
                  <Link
                    to={`/editproblem/${problem._id}`}
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Edit
                  </Link>
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
