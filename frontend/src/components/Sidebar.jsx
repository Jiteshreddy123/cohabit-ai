import React from "react";
import { NavLink } from "react-router-dom";
import { authApi } from "../api/authApi";

function Sidebar() {
  const isAuthenticated = authApi.isAuthenticated();

  if (!isAuthenticated) return null;

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "12px 16px",
    color: isActive ? "#3b82f6" : "#4b5563",
    backgroundColor: isActive ? "#eff6ff" : "transparent",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: isActive ? "600" : "500",
    marginBottom: "8px",
    transition: "all 0.2s ease-in-out",
  });

  return (
    <div
      style={{
        width: "240px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "24px 16px",
        minHeight: "calc(100vh - 60px)",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "#9ca3af", letterSpacing: "1px", margin: "0 0 16px 0", paddingLeft: "8px" }}>
        Menu Panel
      </h3>

      <nav>
        <NavLink to="/" style={linkStyle}>
          Dashboard & Sessions
        </NavLink>
        <NavLink to="/students" style={linkStyle}>
          Students Enrollment
        </NavLink>
        <NavLink to="/interview" style={linkStyle}>
          Simulate Interview
        </NavLink>
        <NavLink to="/recommendations" style={linkStyle}>
          Room Recommendations
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;