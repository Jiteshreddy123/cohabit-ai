import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sessionApi } from "../api/sessionApi";
import { studentApi } from "../api/studentApi";
import StatCard from "../components/StatCard";

// Session validation schema using Zod
const sessionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(255),
  academic_year: z.string().regex(/^\d{4}(-\d{2,4})?$/, "Must be YYYY, YYYY-YY or YYYY-YYYY (e.g. 2024-2025)"),
  room_capacity: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().positive("Capacity must be greater than 0")
  ),
});

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(
    localStorage.getItem("activeSessionId") ? parseInt(localStorage.getItem("activeSessionId"), 10) : null
  );
  const [stats, setStats] = useState({ studentsCount: 0 });

  // Initialize Create Session form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(sessionSchema),
  });

  const loadData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const sessionData = await sessionApi.getSessions();
      setSessions(sessionData);

      // Default active session to first available if none is selected
      if (sessionData.length > 0 && !activeSessionId) {
        const defaultId = sessionData[0].id;
        localStorage.setItem("activeSessionId", defaultId);
        setActiveSessionId(defaultId);
      }

      // Fetch student count if there is an active session
      const activeId = activeSessionId || (sessionData.length > 0 ? sessionData[0].id : null);
      if (activeId) {
        const studentData = await studentApi.getStudents(activeId);
        setStats({ studentsCount: studentData.length });
      }
    } catch (err) {
      setApiError(err.detail || "Failed to load allocation sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeSessionId]);

  const selectActiveSession = (id) => {
    localStorage.setItem("activeSessionId", id);
    setActiveSessionId(id);
  };

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const newSession = await sessionApi.createSession(data);
      setSessions((prev) => [...prev, newSession]);
      selectActiveSession(newSession.id);
      reset();
    } catch (err) {
      setApiError(err.detail || "Failed to create session.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#111827", fontWeight: "bold" }}>
          Dashboard
        </h1>
        <button
          onClick={loadData}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d1d5db",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#374151",
            fontWeight: "500",
          }}
        >
          Refresh Data
        </button>
      </div>

      {apiError && (
        <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "6px", fontSize: "14px", marginBottom: "24px", border: "1px solid #fee2e2" }}>
          {apiError}
        </div>
      )}

      {/* Statistics Section */}
      <h2 style={{ fontSize: "18px", color: "#374151", marginBottom: "16px", fontWeight: "600" }}>
        Overview Statistics
      </h2>
      <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
        <StatCard title="Enrolled Students (Active Session)" value={stats.studentsCount} />
        <StatCard title="Total Allocation Sessions" value={sessions.length} />
        <StatCard title="Recommendation Runs" value="0 (Draft Status)" />
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* Allocation Sessions Management */}
        <div style={{ flex: 2, minWidth: "400px", background: "white", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ marginTop: 0, fontSize: "18px", color: "#111827", marginBottom: "20px", fontWeight: "600" }}>
            Allocation Sessions
          </h2>

          {loading ? (
            <p style={{ color: "#6b7280" }}>Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No sessions found. Create one to get started.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => selectActiveSession(s.id)}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: s.id === activeSessionId ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                    backgroundColor: s.id === activeSessionId ? "#eff6ff" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#111827", fontWeight: "600" }}>
                      {s.title || `Session #${s.id}`}
                    </h3>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        backgroundColor: s.session_status === "Active" ? "#dcfce7" : "#f3f4f6",
                        color: s.session_status === "Active" ? "#16a34a" : "#4b5563",
                      }}
                    >
                      {s.session_status}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#4b5563" }}>
                    Academic Year: <strong>{s.academic_year}</strong> | Room Capacity: <strong>{s.room_capacity} students/room</strong>
                  </p>
                  {s.id === activeSessionId && (
                    <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>
                      ✓ Currently Active Session for Student Registrations
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Session Section */}
        <div style={{ flex: 1, minWidth: "300px", background: "white", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ marginTop: 0, fontSize: "18px", color: "#111827", marginBottom: "20px", fontWeight: "600" }}>
            Create New Session
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                Session Title / Description
              </label>
              <input
                type="text"
                {...register("title")}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: errors.title ? "1px solid #ef4444" : "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g. 2025 B.Tech Freshers"
              />
              {errors.title && (
                <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>
                  {errors.title.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                Academic Year
              </label>
              <input
                type="text"
                {...register("academic_year")}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: errors.academic_year ? "1px solid #ef4444" : "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g. 2024-25 or 2024-2025"
              />
              {errors.academic_year && (
                <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>
                  {errors.academic_year.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                Hostel Room Capacity
              </label>
              <input
                type="number"
                {...register("room_capacity")}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: errors.room_capacity ? "1px solid #ef4444" : "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g. 2"
              />
              {errors.room_capacity && (
                <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>
                  {errors.room_capacity.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#10b981",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => { if (!isSubmitting) e.target.style.backgroundColor = "#059669"; }}
              onMouseOut={(e) => { if (!isSubmitting) e.target.style.backgroundColor = "#10b981"; }}
            >
              {isSubmitting ? "Creating..." : "Create Session"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;