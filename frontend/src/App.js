import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import PageLayout from "./layouts/PageLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/StudentList";
import StudentForm from "./pages/StudentForm";
import StudentDetails from "./pages/StudentDetails";
import Interview from "./pages/Interview";
import InterviewDetails from "./pages/InterviewDetails";
import SessionList from "./pages/SessionList";
import SessionForm from "./pages/SessionForm";
import SessionStructure from "./pages/SessionStructure";
import Recommendations from "./pages/Recommendations";
import RoomDetails from "./pages/RoomDetails";
import Profile from "./pages/Profile";
import Login from "./pages/login";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Helper: wraps a page in both PageLayout and ProtectedRoute
const Protected = ({ children }) => (
  <ProtectedRoute>
    <PageLayout>{children}</PageLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ── Public Routes ──────────────────────────────────── */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* ── Protected Routes ───────────────────────────────── */}
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />

          <Route path="/sessions" element={<Protected><SessionList /></Protected>} />
          <Route path="/sessions/new" element={<Protected><SessionForm /></Protected>} />
          <Route path="/sessions/:id/structure" element={<Protected><SessionStructure /></Protected>} />

          <Route path="/students" element={<Protected><StudentList /></Protected>} />
          <Route path="/students/new" element={<Protected><StudentForm /></Protected>} />
          <Route path="/students/:id" element={<Protected><StudentDetails /></Protected>} />
          <Route path="/students/:id/edit" element={<Protected><StudentForm isEditing /></Protected>} />

          <Route path="/interview" element={<Protected><Interview /></Protected>} />
          <Route path="/interview/:id" element={<Protected><InterviewDetails /></Protected>} />

          <Route path="/recommendations" element={<Protected><Recommendations /></Protected>} />
          <Route path="/recommendations/room/:id" element={<Protected><RoomDetails /></Protected>} />

          <Route path="/profile" element={<Protected><Profile /></Protected>} />

          {/* ── 404 ────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;