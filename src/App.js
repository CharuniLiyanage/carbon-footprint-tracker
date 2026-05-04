import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Tips from "./pages/Tips";

import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      {/* 🌍 GLOBAL NAVBAR */}
      <Navbar />

      <Routes>

        {/* 🏠 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 🔐 PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tips"
          element={
            <ProtectedRoute>
              <Tips />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        

        {/* ❌ fallback route (optional but recommended) */}
        <Route path="*" element={<Home />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;