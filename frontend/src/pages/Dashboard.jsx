import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // guest view allowed

    axios
      .get("http://localhost:5000/Profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.clear();
      });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* Background animation bubbles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-600 opacity-20 rounded-full blur-3xl animate-ping"></div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-wide">
            👋 Welcome {user?.firstname || "Guest"}!
          </h1>
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 shadow-lg"
            >
              View Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating Card */}
          <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl shadow-md border border-white/10">
            <h2 className="text-xl font-semibold mb-2">Your Rating</h2>
            <p className="text-4xl font-bold text-blue-400">
              {user?.rating || "Login to view"}
            </p>
          </div>

          {/* Recent Submissions */}
          <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl shadow-md border border-white/10">
            <h2 className="text-xl font-semibold mb-2">Recent Submissions</h2>
            {user ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-200">
                <li>Problem A - <span className="text-green-400">Accepted</span></li>
                <li>Problem B - <span className="text-red-400">Wrong Answer</span></li>
                <li>Problem C - <span className="text-yellow-400">Time Limit Exceeded</span></li>
              </ul>
            ) : (
              <p className="text-gray-400">Login to view submissions.</p>
            )}
          </div>

          {/* Upcoming Contests */}
          <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl shadow-md border border-white/10 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Upcoming Contests</h2>
            <p className="text-gray-300">No contests scheduled yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
