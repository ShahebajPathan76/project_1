import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile"

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/Profile" element={<Profile />} />
    </Routes>
  </Router>
);

export default App;
