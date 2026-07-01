import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

// Zod schemas for form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "College name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  // Initialize form with Zod schema resolver depending on mode
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      if (isRegister) {
        await authApi.register(data.name, data.email, data.password);
        setSuccessMsg("Registration successful! You can now log in.");
        setIsRegister(false);
        reset();
      } else {
        await authApi.login(data.email, data.password);
        navigate("/");
        window.location.reload(); // Force navbar to reload with authenticated state
      }
    } catch (err) {
      setApiError(err.detail || "An error occurred. Please try again.");
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setApiError(null);
    setSuccessMsg(null);
    reset();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
            Cohabit-AI
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            {isRegister ? "Register your College Admin account" : "Log in to Admin Dashboard"}
          </p>
        </div>

        {apiError && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fef2f2",
              color: "#ef4444",
              borderRadius: "6px",
              fontSize: "14px",
              marginBottom: "20px",
              border: "1px solid #fee2e2",
            }}
          >
            {apiError}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              borderRadius: "6px",
              fontSize: "14px",
              marginBottom: "20px",
              border: "1px solid #dcfce7",
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {isRegister && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                College Name
              </label>
              <input
                type="text"
                {...register("name")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: errors.name ? "1px solid #ef4444" : "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g. IIT Bombay"
              />
              {errors.name && (
                <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>
                  {errors.name.message}
                </span>
              )}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: errors.email ? "1px solid #ef4444" : "1px solid #d1d5db",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
              placeholder="admin@college.edu"
            />
            {errors.email && (
              <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: errors.password ? "1px solid #ef4444" : "1px solid #d1d5db",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
              placeholder="••••••••"
            />
            {errors.password && (
              <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => { if (!isSubmitting) e.target.style.backgroundColor = "#1d4ed8"; }}
            onMouseOut={(e) => { if (!isSubmitting) e.target.style.backgroundColor = "#2563eb"; }}
          >
            {isSubmitting ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#4b5563" }}>
          <span>{isRegister ? "Already have an account?" : "New to Cohabit-AI?"} </span>
          <button
            onClick={toggleMode}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {isRegister ? "Sign In" : "Register College"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
