import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col justify-center items-center">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center text-center px-6 py-12">
        <p className="text-yellow-400 font-semibold mb-3 text-sm tracking-wider">New Era of Coding 🚀</p>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Master Your <span className="text-orange-400">Coding Journey</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
          Practice, Compete & Improve Your Coding Skills with Real-Time Code Execution,
          Custom Problems, and Live Contests.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-full text-lg font-semibold shadow-lg"
        >
          🚀 Start Coding Now
        </button>
      </div>

      {/* Stats Section */}
      <div className="w-full py-12 px-6 bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { value: "28", label: "Total Problems", color: "text-blue-400" },
            { value: "100+", label: "Active Users", color: "text-pink-500" },
            { value: "200+", label: "Solutions", color: "text-green-400" },
            { value: "85%", label: "Success Rate", color: "text-orange-400" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-center shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-300 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
