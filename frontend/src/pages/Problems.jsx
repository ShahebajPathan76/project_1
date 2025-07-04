import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/problems")
      .then((res) => setProblems(res.data))
      .catch((err) => console.error("Error fetching problems:", err));
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-2xl font-bold mb-4">All Problems</h1>
      <Link
      to="/problems/create"
      className="inline-block bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
    >
      + Add New Problem
    </Link>
      <div className="grid gap-4">
        {problems.length > 0 ? (
          problems.map((problem) => (
            <Link
              to={`/problems/${problem._id}`}
              key={problem._id}
              className="block"
            >
              <div className="bg-white p-4 rounded shadow hover:shadow-md border hover:bg-gray-100">
                <h2 className="text-lg font-semibold">{problem.title}</h2>
                <p className="text-gray-600">{problem.difficulty}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No problems found.</p>
        )}
      </div>
    </div>
  );
};

export default Problems;
