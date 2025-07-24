import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Contests = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      {/* <Navbar /> */}

      <div className="text-center py-14 px-4">
        <h1 className="text-4xl font-extrabold mb-3">Contests</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Join weekly coding contests, mock rounds, and DSA marathons to challenge yourself and improve!
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-6 pb-12">
        {/* Contest Card 1 */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Weekly Contest</h2>
          <p className="text-gray-400 mb-4">Compete every Sunday at 8 PM. 90 mins, 4-5 problems.</p>
          <Link
            to="#"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
           Coming Soon!
          </Link>
        </div>

        {/* Contest Card 2 */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Mock Interview</h2>
          <p className="text-gray-400 mb-4">Simulate real interviews with timed questions and feedback.</p>
          <Link
            to="#"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Coming Soon!
          </Link>
        </div>

        {/* Contest Card 3 */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">DSA Marathon</h2>
          <p className="text-gray-400 mb-4">Full-day challenge with 15+ problems. Build consistency!</p>
          <Link
            to="#"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
          >
            Coming Soon
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contests;
