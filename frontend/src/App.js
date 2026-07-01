import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/StudentList";
import Interview from "./pages/Interview";
import Login from "./pages/login";
import { authApi } from "./api/authApi";

const ProtectedLayout = ({ children }) => {
  if (!authApi.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        <Sidebar />
        <div style={{ flex: 1, backgroundColor: "#f9fafb", padding: "30px", boxSizing: "border-box" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/students"
          element={
            <ProtectedLayout>
              <StudentList />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/interview"
          element={
            <ProtectedLayout>
              <Interview />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/recommendations"
          element={
            <ProtectedLayout>
              <div style={{ padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h2>Room Recommendations</h2>
                <p style={{ color: "#6b7280" }}>Similarity extraction & Room matching calculations are in progress.</p>
              </div>
            </ProtectedLayout>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;