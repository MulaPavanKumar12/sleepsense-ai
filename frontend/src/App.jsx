import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LogSleep from "./pages/LogSleep";
import Recommendations from "./pages/Recommendations";
import Coach from "./pages/Coach";

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main className="min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/log"
            element={
              <ProtectedRoute>
                <LogSleep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach"
            element={
              <ProtectedRoute>
                <Coach />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </AuthProvider>
  );
}
