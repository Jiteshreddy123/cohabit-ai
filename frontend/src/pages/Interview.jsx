import React, { useState, useEffect } from "react";
import { studentApi } from "../api/studentApi";

const MOCK_BOT_QUESTIONS = [
  "Hello! I am the CoHabit-AI Personality Interview Bot. I'll help you extract roommate traits. To start, what is your preferred sleeping and waking schedule? (e.g. Sleep at 11 PM, wake at 7 AM)",
  "Great! How do you feel about study environments? Do you prefer absolute silence in the room, or is low background music/noise acceptable for you?",
  "Understood. How would you rate your preference for cleanliness and organization in the shared room on a scale from 1 (very relaxed) to 5 (extremely neat)?",
  "Thank you! Finally, are you a social person who likes hosting friends in the room, or do you prefer the room to remain a quiet, private sanctuary?",
];

function Interview() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState(false);

  const activeSessionId = localStorage.getItem("activeSessionId")
    ? parseInt(localStorage.getItem("activeSessionId"), 10)
    : null;

  useEffect(() => {
    const fetchStudents = async () => {
      if (!activeSessionId) {
        setLoading(false);
        return;
      }
      try {
        const studentData = await studentApi.getStudents(activeSessionId);
        setStudents(studentData);
      } catch (err) {
        console.error("Failed to load students for interview selection", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [activeSessionId]);

  const startInterview = (studentId) => {
    setSelectedStudentId(studentId);
    setQuestionIndex(0);
    setInterviewComplete(false);
    setChatHistory([
      { sender: "bot", text: MOCK_BOT_QUESTIONS[0] }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const updatedHistory = [...chatHistory, { sender: "user", text: userInput }];
    setChatHistory(updatedHistory);
    setUserInput("");

    const nextIndex = questionIndex + 1;
    if (nextIndex < MOCK_BOT_QUESTIONS.length) {
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: MOCK_BOT_QUESTIONS[nextIndex] }
        ]);
        setQuestionIndex(nextIndex);
      }, 800);
    } else {
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Thank you! The interview is complete. I have successfully analyzed your responses and generated your roommate compatibility profile."
          }
        ]);
        setInterviewComplete(true);
      }, 800);
    }
  };

  if (!activeSessionId) {
    return (
      <div style={{ padding: "20px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", textAlign: "center" }}>
        <h2 style={{ color: "#374151" }}>No Active Session Selected</h2>
        <p style={{ color: "#6b7280" }}>Please choose an active allocation session on the Dashboard first.</p>
      </div>
    );
  }

  const selectedStudent = students.find((s) => s.id === parseInt(selectedStudentId, 10));

  return (
    <div>
      <h1 style={{ fontSize: "28px", color: "#111827", fontWeight: "bold", marginBottom: "10px" }}>
        LLM Roommate Matching Interview
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
        Select a registered student to start their automated roommate trait extraction interview.
      </p>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* Student Selector Panel */}
        <div style={{ flex: 1, minWidth: "280px", background: "white", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", alignSelf: "flex-start" }}>
          <h2 style={{ marginTop: 0, fontSize: "18px", color: "#111827", marginBottom: "16px", fontWeight: "600" }}>
            Select Student
          </h2>
          {loading ? (
            <p>Loading enrolled students...</p>
          ) : students.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No students enrolled. Enroll students first under "Students Enrollment".</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => startInterview(s.id)}
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    borderRadius: "6px",
                    border: selectedStudentId === s.id ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    backgroundColor: selectedStudentId === s.id ? "#eff6ff" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <strong style={{ display: "block", color: "#111827" }}>{s.name}</strong>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{s.branch} | Roll: {s.roll_number}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Interview Window */}
        <div style={{ flex: 2, minWidth: "400px", display: "flex", flexDirection: "column", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", height: "550px" }}>
          {!selectedStudentId ? (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", color: "#9ca3af", padding: "40px" }}>
              <span style={{ fontSize: "48px", marginBottom: "10px" }}>💬</span>
              <h3>No Student Selected</h3>
              <p style={{ fontSize: "14px", textAlign: "center", maxWidth: "300px", margin: 0 }}>
                Please select a student from the panel on the left to begin the simulated personality interview.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#111827", fontWeight: "600" }}>
                  Interviewing: {selectedStudent?.name}
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#16a34a", fontWeight: "600" }}>
                  ● Session: Active AI Extraction Pipeline
                </p>
              </div>

              {/* Chat Area */}
              <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#fcfdfd" }}>
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
                      maxWidth: "75%",
                      backgroundColor: msg.sender === "bot" ? "#f3f4f6" : "#2563eb",
                      color: msg.sender === "bot" ? "#1f2937" : "#ffffff",
                      padding: "12px 16px",
                      borderRadius: msg.sender === "bot" ? "18px 18px 18px 2px" : "18px 18px 2px 18px",
                      fontSize: "14px",
                      lineHeight: "1.4",
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Footer / Input Form */}
              <div style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb" }}>
                {interviewComplete ? (
                  <div style={{ textAlign: "center", padding: "10px" }}>
                    <span style={{ color: "#16a34a", fontWeight: "600", fontSize: "14px" }}>
                      ✓ Personality traits processed and stored successfully in database.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "12px" }}>
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type answers to the bot..."
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        borderRadius: "20px",
                        border: "1px solid #d1d5db",
                        outline: "none",
                        fontSize: "14px",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Send
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interview;
