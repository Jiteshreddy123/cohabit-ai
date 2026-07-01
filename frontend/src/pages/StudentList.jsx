import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { studentApi } from "../api/studentApi";
import { sessionApi } from "../api/sessionApi";
import { Link } from "react-router-dom";

// Zod validation schema for student details
const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  roll_number: z.string().min(1, "Roll number is required").max(50),
  email: z.string().email("Invalid email address"),
  branch: z.string().min(1, "Branch/Department is required").max(100),
  year_of_study: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().min(1, "Year must be at least 1").max(5, "Year cannot exceed 5")
  ),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Select a valid gender" }),
  }),
});

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const activeSessionId = localStorage.getItem("activeSessionId")
    ? parseInt(localStorage.getItem("activeSessionId"), 10)
    : null;

  // Initialize Register Student form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: "Male",
    }
  });

  const loadData = async () => {
    if (!activeSessionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setApiError(null);
    try {
      // Find active session details
      const sessions = await sessionApi.getSessions();
      const current = sessions.find((s) => s.id === activeSessionId);
      setActiveSession(current);

      if (current) {
        const studentData = await studentApi.getStudents(activeSessionId);
        setStudents(studentData);
      }
    } catch (err) {
      setApiError(err.detail || "Failed to load student profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeSessionId]);

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      const studentPayload = {
        ...data,
        allocation_session_id: activeSessionId,
        college_id: activeSession?.college_id || 0, // Will be overridden or validated by backend JWT
      };

      const newStudent = await studentApi.createStudent(studentPayload);
      setStudents((prev) => [...prev, newStudent]);
      setSuccessMsg(`Student ${newStudent.name} enrolled successfully!`);
      reset();
    } catch (err) {
      setApiError(err.detail || "Failed to enroll student.");
    }
  };

  if (!activeSessionId) {
    return (
      <div style={{ padding: "20px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", textAlign: "center" }}>
        <h2 style={{ color: "#374151" }}>No Active Session Selected</h2>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          You must select or create an allocation session on the Dashboard before you can enroll students.
        </p>
        <Link
          to="/"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            display: "inline-block",
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#111827", fontWeight: "bold" }}>
            Student Enrollment
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
            Active Session: <strong>{activeSession?.title || `Session #${activeSessionId}`}</strong> ({activeSession?.academic_year})
          </p>
        </div>
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
          Refresh List
        </button>
      </div>

      {apiError && (
        <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "6px", fontSize: "14px", marginBottom: "24px", border: "1px solid #fee2e2" }}>
          {apiError}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: "12px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "6px", fontSize: "14px", marginBottom: "24px", border: "1px solid #dcfce7" }}>
          {successMsg}
        </div>
      )}

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* Enrolled Students Table */}
        <div style={{ flex: 2, minWidth: "400px", background: "white", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ marginTop: 0, fontSize: "18px", color: "#111827", marginBottom: "20px", fontWeight: "600" }}>
            Enrolled Students ({students.length})
          </h2>

          {loading ? (
            <p style={{ color: "#6b7280" }}>Loading students...</p>
          ) : students.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No students enrolled in this session yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f3f4f6", color: "#4b5563" }}>
                    <th style={{ padding: "12px 8px", fontWeight: "600" }}>Name</th>
                    <th style={{ padding: "12px 8px", fontWeight: "600" }}>Roll Number</th>
                    <th style={{ padding: "12px 8px", fontWeight: "600" }}>Email</th>
                    <th style={{ padding: "12px 8px", fontWeight: "600" }}>Branch</th>
                    <th style={{ padding: "12px 8px", fontWeight: "600" }}>Year</th>
                    <th style={{ padding: "12px 8px", fontWeight: "600" }}>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6", color: "#111827" }}>
                      <td style={{ padding: "12px 8px", fontWeight: "500" }}>{s.name}</td>
                      <td style={{ padding: "12px 8px", fontFamily: "monospace" }}>{s.roll_number}</td>
                      <td style={{ padding: "12px 8px" }}>{s.email}</td>
                      <td style={{ padding: "12px 8px" }}>{s.branch}</td>
                      <td style={{ padding: "12px 8px" }}>{s.year_of_study}</td>
                      <td style={{ padding: "12px 8px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: s.gender === "Male" ? "#eff6ff" : s.gender === "Female" ? "#fdf2f8" : "#f3f4f6",
                            color: s.gender === "Male" ? "#2563eb" : s.gender === "Female" ? "#db2777" : "#4b5563",
                          }}
                        >
                          {s.gender}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Enroll Student Form */}
        <div style={{ flex: 1, minWidth: "300px", background: "white", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ marginTop: 0, fontSize: "18px", color: "#111827", marginBottom: "20px", fontWeight: "600" }}>
            Enroll New Student
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                Full Name
              </label>
              <input
                type="text"
                {...register("name")}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: errors.name ? "1px solid #ef4444" : "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                placeholder="e.g. Rahul Kumar"
              />
              {errors.name && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px", display: "block" }}>{errors.name.message}</span>}
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                Roll Number (Unique)
              </label>
              <input
                type="text"
                {...register("roll_number")}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: errors.roll_number ? "1px solid #ef4444" : "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                placeholder="e.g. CS25F102"
              />
              {errors.roll_number && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px", display: "block" }}>{errors.roll_number.message}</span>}
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                Email Address (Unique)
              </label>
              <input
                type="email"
                {...register("email")}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: errors.email ? "1px solid #ef4444" : "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                placeholder="e.g. student@college.edu"
              />
              {errors.email && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px", display: "block" }}>{errors.email.message}</span>}
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                Branch / Major
              </label>
              <input
                type="text"
                {...register("branch")}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: errors.branch ? "1px solid #ef4444" : "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                placeholder="e.g. Computer Science"
              />
              {errors.branch && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px", display: "block" }}>{errors.branch.message}</span>}
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Year of Study
                </label>
                <input
                  type="number"
                  {...register("year_of_study")}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: errors.year_of_study ? "1px solid #ef4444" : "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                  placeholder="e.g. 1"
                />
                {errors.year_of_study && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px", display: "block" }}>{errors.year_of_study.message}</span>}
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Gender
                </label>
                <select
                  {...register("gender")}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: errors.gender ? "1px solid #ef4444" : "1px solid #d1d5db", outline: "none", fontSize: "14px", boxSizing: "border-box", background: "white" }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px", display: "block" }}>{errors.gender.message}</span>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => { if (!isSubmitting) e.target.style.backgroundColor = "#1d4ed8"; }}
              onMouseOut={(e) => { if (!isSubmitting) e.target.style.backgroundColor = "#2563eb"; }}
            >
              {isSubmitting ? "Enrolling..." : "Enroll Student"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentList;
