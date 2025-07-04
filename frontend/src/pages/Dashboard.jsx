import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/Profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        localStorage.clear();
        alert("Session expired. Please log in again.");
        window.location.href = "/";
      });
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Top header with profile button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {user.firstname}!
        </h1>
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Your Rating</h2>
          <p className="text-3xl text-blue-600">{user.rating || "N/A"}</p>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Recent Submissions</h2>
          <ul className="text-gray-700 list-disc pl-5">
            <li>Problem A - Accepted</li>
            <li>Problem B - Wrong Answer</li>
            <li>Problem C - Time Limit Exceeded</li>
          </ul>
        </div>

        {/* Upcoming Contests */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Upcoming Contests</h2>
          <p className="text-gray-700">No contests scheduled yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
