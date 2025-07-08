import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaSearch, FaUserPlus } from "react-icons/fa"; // 🔥 Add icons

const Profile = () => {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(1450);
  const [friendsCount, setFriendsCount] = useState(5);
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");             // 🔥
  const [results, setResults] = useState([]);           // 🔥
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    axios
      .get("http://localhost:5000/Profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setRating(1620);
        setFriendsCount(12);
        setSubmissions([
          { problem: "Two Sum", status: "Accepted", date: "2025-07-07" },
          { problem: "Palindrome", status: "Wrong Answer", date: "2025-07-06" },
          { problem: "Binary Search", status: "Accepted", date: "2025-07-05" },
        ]);
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        alert(msg === "Token expired" ? "Session expired. Please log in again." : msg || "Authentication failed.");
        localStorage.clear();
        navigate("/");
      });
  }, []);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!search.trim()) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/friends/search?q=${search}`, {

        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      alert("Error while searching users");
    }
  };

  const handleAddFriend = async (friendId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`http://localhost:5000/api/friends/add-friend/${friendId}`, {}, {

        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Friend added successfully!");
      setFriendsCount((prev) => prev + 1);
      setResults((prev) => prev.filter((user) => user._id !== friendId)); // Optional: remove from list
    } catch (err) {
      alert("Something went wrong while adding friend!");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-purple-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
        {/* Left: User Info Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-300 mb-2">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-white/80 mb-2">📧 {user.email}</p>
          <p className="text-white/70 mb-2">🏆 Rating: <span className="text-green-400 font-semibold">{rating}</span></p>
          <p
            className="text-white/70 hover:text-blue-400 cursor-pointer transition"
            onClick={() => navigate("/friends")}
          >
            👥 Friends: <span className="text-blue-300 underline">{friendsCount}</span>
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Right Side: Submissions + Search User Box */}
        <div className="space-y-6">
          {/* Submissions Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-indigo-200 mb-4">📝 Recent Submissions</h3>
            {submissions.length === 0 ? (
              <p className="text-white/70">No submissions yet.</p>
            ) : (
              <ul className="space-y-3">
                {submissions.map((sub, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center px-4 py-2 rounded-lg ${
                      sub.status === "Accepted"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    <span>{sub.problem}</span>
                    <span>{sub.status}</span>
                    <span className="text-sm text-white/50">{sub.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🔥 Search User Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-indigo-200 mb-2">🔍 Search Users</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 p-2 rounded-lg text-black border border-gray-300"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg flex items-center gap-1 transition"
              >
                <FaSearch />
              </button>
            </div>

            {/* 🔥 Show Results */}
            {results.map((u) => (
              <div
                key={u._id}
                className="flex justify-between items-center text-white p-2 bg-white/10 rounded-lg mb-2"
              >
                <span>{u.firstname}</span>
                <button
                  className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                  onClick={() => handleAddFriend(u._id)}
                >
                  <FaUserPlus />
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
