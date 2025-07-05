import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Contests from "./pages/Contests";
import DailyProblem from "./pages/DailyProblem";
import Friends from "./pages/Friends";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AddProblem from "./pages/AddProblem";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import EditProblemPage from "./pages/EditProblemPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/problems" element={<Layout><Problems /></Layout>} />
      <Route path="/problems/:id" element={<Layout><ProblemDetail /></Layout>} />
      <Route path="/contests" element={<ProtectedRoute><Contests /></ProtectedRoute>} />
      <Route path="/daily" element={<ProtectedRoute><DailyProblem /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      <Route path="/problems/create" element={<ProtectedRoute><AddProblem /></ProtectedRoute>} />
      <Route path="/editproblem/:id" element={<EditProblemPage />} />
    </Routes>
  </Router>
);

export default App;
