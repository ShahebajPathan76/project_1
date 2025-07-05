import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center animate-fade-in">
        Welcome to <span className="text-orange-400">🔥 Online Judge</span>
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center max-w-xl">
        Practice, Compete & Improve Your Coding Skills with Real-Time Code Execution,
        Custom Problems, and Live Contests.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-lg text-lg font-semibold shadow-lg"
      >
        🚀 Start Coding
      </button>
    </div>
  );
};

export default Landing;
