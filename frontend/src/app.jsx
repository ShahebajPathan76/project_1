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
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import EditProblemPage from "./pages/EditProblemPage";
import CreateProblem from "./pages/CreateProblem";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <Router>
    {/* ToastContainer outside Routes */}
    <ToastContainer position="top-right" />

    <Routes>
      {/* Public routes without layout */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />

      {/* Routes with Layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/problems" element={<Layout><Problems /></Layout>} />
      <Route path="/problems/:id" element={<Layout><ProblemDetail /></Layout>} />

      {/* Protected routes inside Layout */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contests"
        element={
          <ProtectedRoute>
            <Layout><Contests /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/daily"
        element={
          <ProtectedRoute>
            <Layout><DailyProblem /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <Layout><Friends /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Add/Edit problem routes - protect & layout */}
      <Route
        path="/editproblem/:id"
        element={
          <ProtectedRoute>
            <Layout><EditProblemPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <Layout><CreateProblem /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Uncomment and add more routes as needed */}
      {/* <Route path="/ai-review" element={<Layout><AiReviewPage /></Layout>} /> */}
    </Routes>
  </Router>
);

export default App;
