import React, { useLayoutEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Contests from "./pages/Contests";
import DailyProblem from "./pages/DailyProblem";
import Friends from "./pages/Friends";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout"; // includes Navbar

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/problems/:id" element={<ProblemDetail />} />
      <Route path="/contests" element={<Contests />} />
      <Route path="/daily" element={<DailyProblem />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>}/>
    </Routes>
  </Router>
);

export default App;
