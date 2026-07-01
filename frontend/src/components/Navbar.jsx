import React from "react";
import { authApi } from "../api/authApi";

function Navbar() {
  const college = authApi.getCurrentCollege();
  const isAuthenticated = authApi.isAuthenticated();

  return (
    <nav
      style={{
        backgroundColor: "#111827",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", letterSpacing: "0.5px" }}>
          Cohabit-AI
        </h2>
        <span
          style={{
            fontSize: "12px",
            backgroundColor: "#3b82f6",
            padding: "2px 8px",
            borderRadius: "12px",
            fontWeight: "normal",
          }}
        >
          Hostel Room Allocator
        </span>
      </div>

      {isAuthenticated && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "14px", color: "#9ca3af" }}>
            Connected College: <strong style={{ color: "white" }}>{college?.email}</strong>
          </span>
          <button
            onClick={authApi.logout}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "6px",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;