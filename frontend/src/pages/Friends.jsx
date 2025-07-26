import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserPlus, FaUserMinus, FaSearch } from "react-icons/fa";

const Friends = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/friends/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(res.data);
      } catch (err) {
        console.error("Fetch Friends Error:", err);
      }
    };

    fetchFriends();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/friends/search?q=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/friends/add-friend/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addedFriend = results.find((u) => u._id === friendId);
      if (addedFriend) {
        setFriends((prev) => [...prev, addedFriend]);
      }
      alert("Friend added successfully!");
    } catch (err) {
      console.error("Add Friend Error:", err.response?.data || err.message);
      alert("Something went wrong while adding friend!");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/friends/remove-friend/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch (err) {
      console.error("Remove Friend Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wide drop-shadow-lg">
          🤝 Your Friends
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full sm:flex-1 p-4 rounded-xl text-gray-900 font-semibold border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl flex items-center gap-3 text-lg font-semibold shadow-lg transform transition hover:scale-105"
            aria-label="Search users"
          >
            <FaSearch className="text-white" size={20} />
            Search
          </button>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 drop-shadow-md">🔍 Search Results</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {results.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-lg hover:shadow-indigo-500/50 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar Circle with Initial */}
                    <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold text-white select-none">
                      {user.firstname.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-semibold text-xl">{user.firstname}</p>
                  </div>
                  <button
                    className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-2xl flex items-center gap-2 text-white font-semibold shadow-md transform transition hover:scale-110"
                    onClick={() => handleAddFriend(user._id)}
                  >
                    <FaUserPlus size={18} />
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div>
          <h2 className="text-3xl font-semibold mb-8 drop-shadow-md">👥 Your Friends</h2>
          {friends.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-lg hover:shadow-red-500/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-lg font-bold text-white select-none">
                      {friend.firstname.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-semibold text-xl">{friend.firstname}</p>
                  </div>
                  <button
                    className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-2xl flex items-center gap-2 text-white font-semibold shadow-md transform transition hover:scale-110"
                    onClick={() => handleRemoveFriend(friend._id)}
                  >
                    <FaUserMinus size={18} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300 italic text-center text-lg">
              You don’t have any friends yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
