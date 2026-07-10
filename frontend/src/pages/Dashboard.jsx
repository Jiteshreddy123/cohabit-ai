import React, { useState, useEffect } from "react";
import { sessionApi } from "../api/sessionApi";
import { studentApi } from "../api/studentApi";
import { Users, Layers, Lightbulb, TrendingUp, AlertCircle, RefreshCw, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import StudentDashboard from "./StudentDashboard";

function StatCard({ title, value, icon, colorClass }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-lg ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [stats, setStats] = useState({ studentsCount: 0 });
  const role = authApi.getUserRole();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const activeSessionId = localStorage.getItem("activeSessionId")
    ? parseInt(localStorage.getItem("activeSessionId"), 10)
    : null;

  // Calculate real total bed capacity from room_inventory
  const calcTotalBeds = (session) => {
    if (!session?.room_inventory || Object.keys(session.room_inventory).length === 0) return null;
    return Object.entries(session.room_inventory).reduce(
      (sum, [cap, count]) => sum + parseInt(cap) * parseInt(count),
      0
    );
  };

  const loadData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const sessionData = await sessionApi.getSessions();
      setSessions(sessionData);

      if (sessionData.length > 0 && !activeSessionId) {
        const defaultId = sessionData[0].id;
        localStorage.setItem("activeSessionId", defaultId);
      }

      const activeId = activeSessionId || (sessionData.length > 0 ? sessionData[0].id : null);
      if (activeId) {
        const studentData = await studentApi.getStudents(activeId);
        setStats({ studentsCount: studentData.length });
      }
    } catch (err) {
      setApiError(err.detail || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      loadData();
    } else {
      setLoading(false);
    }
  }, [activeSessionId, role]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const totalBeds = calcTotalBeds(activeSession);
  const vacancySeats = totalBeds !== null ? totalBeds - stats.studentsCount : null;

  if (role === "student") {
    return <StudentDashboard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your allocation sessions and student metrics.</p>
          {user.collegeCode && (
            <div className="mt-2 inline-flex flex-col sm:flex-row items-start sm:items-center p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mr-2">Your College Code (Share with Students):</span>
              <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded font-mono font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 shadow-sm text-sm">{user.collegeCode}</code>
            </div>
          )}
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-red-500 mt-0.5 mr-3 shrink-0" size={18} />
          <div className="text-sm text-red-700">{apiError}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sessions"
          value={sessions.length}
          icon={<Layers size={24} className="text-brand-600 dark:text-brand-400" />}
          colorClass="bg-brand-50 dark:bg-brand-500/10"
        />
        <StatCard
          title="Total Hostel Capacity"
          value={totalBeds !== null ? `${totalBeds} beds` : "Not configured"}
          icon={<Building2 size={24} className="text-blue-600 dark:text-blue-400" />}
          colorClass="bg-blue-50 dark:bg-blue-500/10"
        />
        <StatCard
          title="Enrolled Students"
          value={stats.studentsCount}
          icon={<Users size={24} className="text-purple-600 dark:text-purple-400" />}
          colorClass="bg-purple-50 dark:bg-purple-500/10"
        />
        <StatCard
          title="Vacancy Seats"
          value={vacancySeats !== null ? vacancySeats : "—"}
          icon={<TrendingUp size={24} className="text-amber-600 dark:text-amber-400" />}
          colorClass="bg-amber-50 dark:bg-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>
            <Link to="/sessions" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">View All →</Link>
          </div>

          <div className="p-6 flex-1">
            {loading ? (
              <div className="flex justify-center py-8 text-gray-500 dark:text-gray-400"><RefreshCw className="animate-spin" /></div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-10">
                <Layers className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No sessions created yet.</p>
                <Link to="/sessions/new" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-500">
                  Create First Session
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.slice(0, 3).map((s) => (
                  <div key={s.id} className={`p-4 rounded-lg border flex items-center justify-between ${s.id === activeSessionId ? 'border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                        {s.id === activeSessionId && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300">Active</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Year: {s.academic_year}
                        {s.room_inventory && Object.keys(s.room_inventory).length > 0
                          ? ` • ${Object.entries(s.room_inventory).map(([k, v]) => `${v}×${k}-bed`).join(", ")}`
                          : " • No rooms configured"}
                      </p>
                    </div>
                    <Link to={`/sessions`} className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      <span className="sr-only">View</span>
                      →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl border border-brand-700 shadow-sm text-white overflow-hidden relative flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>

          <div className="p-8 relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm mb-6">
              <Lightbulb className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ready to allocate?</h2>
            <p className="text-brand-100 mb-8 leading-relaxed">
              Once you have enrolled all students and completed AI personality interviews, run the optimization engine.
            </p>
          </div>

          <div className="p-6 bg-black/10 border-t border-white/10 relative z-10">
            <Link to="/recommendations" className="block w-full text-center bg-white text-brand-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-bold text-sm shadow-sm transition-colors">
              Go to Recommendations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;