import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaUserCircle, FaClock } from "react-icons/fa";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/Profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.clear());
  }, []);

  const displayName = user ? user.firstname : "Guest";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#1e3a8a] text-white font-['Inter','SegoeUI',sans-serif]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            {user && (
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-blue-400 flex items-center justify-center shadow-lg">
                <FaUserCircle className="text-blue-400 text-4xl" />
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              👋 Welcome {displayName}!
            </h1>
          </div>
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 text-white px-6 py-2 rounded-2xl shadow-lg font-semibold text-lg border border-white/10 hover:scale-105"
            >
              View Profile
            </button>
          )}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Rating Card */}
          <div
            className="relative overflow-hidden bg-white/10 backdrop-blur-lg p-7 rounded-2xl border border-blue-200/20 hover:shadow-blue-500/30 shadow-2xl hover:scale-105 transition-transform cursor-pointer group"
            onClick={() => {
              if (!user) navigate("/Auth");
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-tl from-blue-500/20 via-transparent to-yellow-300/30 blur-2xl opacity-80 scale-150 group-hover:opacity-100 transition-all" />
            <div className="relative flex items-center gap-3 mb-3">
              <FaTrophy className="text-yellow-400 text-3xl drop-shadow-glow" />
              <h2 className="text-xl font-semibold">Your Rating</h2>
            </div>
            <div className="relative">
              <p className="text-5xl font-bold text-blue-300 drop-shadow-xl tracking-wide">
                {user ? user.rating : <span>Login to view</span>}
              </p>
            </div>
          </div>

          {/* Submissions Card */}
          <div
            className="relative overflow-hidden bg-white/10 backdrop-blur-lg p-7 rounded-2xl border border-green-200/20 hover:shadow-green-400/40 shadow-2xl hover:scale-105 transition-transform cursor-pointer group"
            onClick={() => {
              if (!user) navigate("/Auth");
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-green-500/20 via-transparent to-yellow-200/20 blur-2xl opacity-80 scale-150 group-hover:opacity-100 transition-all" />
            <div className="relative flex items-center gap-3 mb-3">
              <FaUserCircle className="text-green-400 text-3xl drop-shadow-xl" />
              <h2 className="text-xl font-semibold">Recent Submissions</h2>
            </div>
            <div className="relative">
              {user ? (
                <ul className="list-disc pl-6 text-base text-gray-100 space-y-1">
                  <li>
                    Problem A -{" "}
                    <span className="text-green-300 font-semibold">
                      Accepted
                    </span>
                  </li>
                  <li>
                    Problem B -{" "}
                    <span className="text-red-300 font-semibold">
                      Wrong Answer
                    </span>
                  </li>
                  <li>
                    Problem C -{" "}
                    <span className="text-yellow-300 font-semibold">TLE</span>
                  </li>
                </ul>
              ) : (
                <p className="text-gray-300 text-lg">Login to view submissions.</p>
              )}
            </div>
          </div>

          {/* Contests Card */}
          <div className="relative col-span-1 md:col-span-2 bg-white/10 backdrop-blur-lg p-7 mt-2 rounded-2xl border border-purple-400/10 hover:shadow-purple-500/40 shadow-2xl hover:scale-105 transition-transform group">
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-400/20 blur-2xl opacity-80 scale-150 group-hover:opacity-100 transition-all" />
            <div className="relative flex items-center gap-3 mb-3">
              <FaClock className="text-purple-200 text-3xl drop-shadow" />
              <h2 className="text-xl font-semibold">Upcoming Contests</h2>
            </div>
            <p className="text-gray-300 text-lg font-medium">
              No contests scheduled yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
