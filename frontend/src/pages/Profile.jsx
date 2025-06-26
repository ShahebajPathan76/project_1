import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // 🚫 No token? Redirect to login
      return;
    }

    // ✅ Token exists, now fetch user from backend
    axios
      .get("http://localhost:5000/Profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data); // ✅ save the user to state
      })
      .catch((err) => {
         const msg = err.response?.data?.message;
      if (msg === "Token expired") {
        alert("Session expired. Please log in again.");
      } else {
        alert(msg || "Authentication failed.");
      }
      localStorage.clear();
      navigate("/"); // 🔁 redirect to login
      });
  }, []);

  if (!user) return null; // show nothing until user is fetched

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h1 className="text-xl font-bold mb-4">
          Welcome, {user.firstname} {user.lastname}
        </h1>
        <p className="text-gray-700">Email: {user.email}</p>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
