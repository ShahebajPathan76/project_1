import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserFriends, FaCode, FaTrophy, FaSignInAlt,FaUserCircle,FaClock } from "react-icons/fa";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/Profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.clear());
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#5b21b6] to-[#1e3a8a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
            👋 Welcome {user?.firstname || "Guest"}!
          </h1>
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-xl shadow-md"
            >
              View Profile
            </button>
          )}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating Card */}
          <div
  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:shadow-xl transition-shadow cursor-pointer"
  onClick={() => {
    if (!user) navigate("/Auth");
  }}
>

            <div className="flex items-center gap-3 mb-2">
              <FaTrophy className="text-yellow-400 text-2xl" />
              <h2 className="text-xl font-semibold">Your Rating</h2>
            </div>
            <p className="text-4xl font-bold text-blue-400">
              {user ? user.rating : <span className="" >Login to view</span>}
            </p>

          </div>

          {/* Submissions Card */}
          <div
          className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => {
            if (!user) navigate("/Auth");
          }}
          >

            <div className="flex items-center gap-3 mb-2">
              <FaUserCircle className="text-green-400 text-2xl" />
              <h2 className="text-xl font-semibold">Recent Submissions</h2>
            </div>
            {user ? (
              <ul className="list-disc pl-6 text-sm text-gray-200 space-y-1">
                <li>
                  Problem A - <span className="text-green-400">Accepted</span>
                </li>
                <li>
                  Problem B - <span className="text-red-400">Wrong Answer</span>
                </li>
                <li>
                  Problem C - <span className="text-yellow-400">TLE</span>
                </li>
              </ul>
            ) : (
              <p className="text-gray-400">Login to view submissions.</p>
            )}
          </div>

          {/* Contests Card (full width) */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:shadow-xl transition-shadow col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <FaClock className="text-purple-400 text-2xl" />
              <h2 className="text-xl font-semibold">Upcoming Contests</h2>
            </div>
            <p className="text-gray-300 text-sm">No contests scheduled yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
