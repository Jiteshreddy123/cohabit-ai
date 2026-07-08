import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 * If no JWT token is found in localStorage, redirects to /login
 * and preserves the attempted URL so the user lands there after login.
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Pass the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
