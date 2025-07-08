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
      const res = await axios.get("http://localhost:5000/api/friends/list", {
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
    try {
      const res = await axios.get(
        `http://localhost:5000/api/friends/search?q=${search}`,
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
      `http://localhost:5000/api/friends/add-friend/${friendId}`,
      {}, // Empty body, since you're passing ID in params
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Friend added successfully!");
  } catch (err) {
    console.error("Add Friend Error:", err.response?.data || err.message);
    alert("Something went wrong while adding friend!");
  }
};



  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/friends/remove",
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#3b0764] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          🤝 Your Friends
        </h1>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto flex-1 p-3 rounded-xl text-black border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl flex items-center gap-2 transition"
          >
            <FaSearch />
            Search
          </button>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">🔍 Search Results</h2>
            <div className="space-y-4">
              {results.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center bg-white/10 border border-white/10 p-4 rounded-2xl backdrop-blur-sm"
                >
                  <p className="font-medium">{user.firstname}</p>
                  <button
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    onClick={() => handleAddFriend(user._id)}
                  >
                    <FaUserPlus />
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friend List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">👥 Your Friends</h2>
          {friends.length > 0 ? (
            <div className="space-y-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex justify-between items-center bg-white/10 border border-white/10 p-4 rounded-2xl backdrop-blur-sm"
                >
                  <p className="font-medium">{friend.firstname}</p>
                  <button
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    onClick={() => handleRemoveFriend(friend._id)}
                  >
                    <FaUserMinus />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">You don’t have any friends yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
