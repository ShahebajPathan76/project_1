import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE_URL}/${isLogin ? "login" : "register"}`;
      const data = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;
      const res = await axios.post(url, data);
      localStorage.setItem("token", res.data.user.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/Dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-indigo-900 text-white px-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-indigo-300 mb-6">
          {isLogin ? "Welcome Back 👋" : "Create Your Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white/20 text-white placeholder:text-white/70 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white/20 text-white placeholder:text-white/70 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-white/20 text-white placeholder:text-white/70 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-white/20 text-white placeholder:text-white/70 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold p-3 rounded-xl transition-all duration-300 shadow-md"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-white/70">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-300 hover:underline font-medium"
          >
            {isLogin ? "Register" : "Login"} here
          </button>
        </p>
      </div>
    </div>
  );
};

export default App;
