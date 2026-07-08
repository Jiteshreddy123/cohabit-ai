import React, { useState, useEffect, useRef } from "react";
import { studentApi } from "../api/studentApi";
import { Bot, Send, User, MessageSquare, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { interviewApi } from "../api/interviewApi";

function Interview() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

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
        setError("Failed to load students. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const startInterview = async (studentId) => {
    if (isSending) return;
    setIsSending(true);
    setError(null);
    // studentId is already a number from student.id
    setSelectedStudentId(studentId);
    setInterviewComplete(false);
    setChatHistory([{ sender: "bot", isTyping: true }]);

    try {
      const data = await interviewApi.startInterview(studentId);
      // history items have shape { role: "user"|"model", text: "..." }
      const formattedHistory = data.history.map((msg) => ({
        sender: msg.role === "user" ? "user" : "bot",
        text: msg.text,
      }));
      setChatHistory(formattedHistory.length > 0 ? formattedHistory : [
        { sender: "bot", text: "Hello! I'm ready to begin your interview." }
      ]);
    } catch (error) {
      console.error("Failed to start interview", error);
      const errMsg = error?.detail || "Failed to connect to AI Interviewer. Please check your API key and backend.";
      setChatHistory([{ sender: "bot", text: errMsg }]);
      setError(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    const messageToSend = userInput;
    setChatHistory((prev) => [
      ...prev,
      { sender: "user", text: messageToSend },
      { sender: "bot", isTyping: true },
    ]);
    setUserInput("");

    try {
      const data = await interviewApi.sendMessage(selectedStudentId, messageToSend);
      // Replace the typing indicator with the actual response
      const formattedHistory = data.history.map((msg) => ({
        sender: msg.role === "user" ? "user" : "bot",
        text: msg.text,
      }));
      setChatHistory(formattedHistory);

      if (data.is_complete) {
        setInterviewComplete(true);
        try {
          await interviewApi.endInterview(selectedStudentId);
        } catch (endErr) {
          console.error("Failed to end interview / extract traits:", endErr);
        }
      }
    } catch (error) {
      console.error("Failed to send message", error);
      const errMsg = error?.detail || "Sorry, I encountered an error communicating with the server.";
      setChatHistory((prev) => {
        // Remove typing indicator and add error message
        const withoutTyping = prev.filter((m) => !m.isTyping);
        return [...withoutTyping, { sender: "bot", text: errMsg }];
      });
      setError(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleRestart = async () => {
    if (!selectedStudentId || isSending) return;
    // Restart the interview with same student
    await startInterview(selectedStudentId);
  };

  if (!activeSessionId) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center max-w-2xl mx-auto mt-10 transition-colors">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Session Selected</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          You must select or create an allocation session on the Dashboard before you can conduct interviews.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-500 transition-colors shadow-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Personality Interview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Select a student to simulate the LLM roommate trait extraction interview.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
        {/* Student Selector Panel */}
        <div className="w-full lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col max-h-[600px] transition-colors">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <h2 className="font-semibold text-gray-900 dark:text-white">Select Student</h2>
          </div>
          <div className="p-3 overflow-y-auto flex-1">
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Loading students...</p>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No students enrolled yet.</p>
                <Link to="/students/new" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline">
                  Enroll Student
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => startInterview(s.id)}
                    disabled={isSending}
                    className={`w-full text-left p-3 rounded-lg border transition-colors disabled:opacity-60 ${
                      selectedStudentId === s.id
                        ? "border-brand-300 dark:border-brand-500/50 bg-brand-50 dark:bg-brand-900/30"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.branch} • {s.roll_number}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Interview Window */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[600px] transition-colors">
          {!selectedStudentId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center">
              <MessageSquare size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Student Selected</h3>
              <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
                Select a student from the panel on the left to begin the simulated personality interview.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                    <User size={20} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedStudent?.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {interviewComplete ? (
                        <>
                          <CheckCircle2 size={12} className="text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Interview Complete</span>
                        </>
                      ) : (
                        <>
                          <span className={`w-2 h-2 rounded-full ${isSending ? "bg-amber-400 animate-pulse" : "bg-green-500"}`}></span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{isSending ? "AI Thinking..." : "LLM Active"}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {interviewComplete && (
                    <Link
                      to={`/interview/${selectedStudentId}`}
                      className="text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-3 py-1.5 rounded-md hover:bg-brand-200 dark:hover:bg-brand-900/50 transition-colors"
                    >
                      View Traits
                    </Link>
                  )}
                  <button
                    onClick={handleRestart}
                    disabled={isSending}
                    title="Restart interview"
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30 dark:bg-gray-900/50 space-y-4">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex max-w-[80%] ${msg.sender === "bot" ? "self-start" : "self-end ml-auto"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                        <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 text-sm shadow-sm ${
                        msg.sender === "bot"
                          ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm"
                          : "bg-brand-600 text-white rounded-2xl rounded-tr-sm"
                      }`}
                    >
                      {msg.isTyping ? (
                        <div className="flex space-x-1.5 h-5 items-center px-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      ) : (
                        <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Footer / Input Form */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                {error && !interviewComplete && (
                  <div className="mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle size={13} />
                    {error}
                  </div>
                )}
                {interviewComplete ? (
                  <div className="text-center py-2 px-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-sm text-green-700 dark:text-green-400 font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    Personality traits processed and stored successfully.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={isSending ? "Waiting for AI..." : "Type the student's response..."}
                      disabled={isSending}
                      className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={!userInput.trim() || isSending}
                      className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
                    >
                      <Send size={18} className="ml-0.5" />
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
