import React from "react";
import { NavLink } from "react-router-dom";
import { authApi } from "../api/authApi";
import { LayoutDashboard, Users, UserPlus, BookOpen, Layers, Lightbulb, Settings, FileText } from "lucide-react";

function Sidebar() {
  const isAuthenticated = authApi.isAuthenticated();

  if (!isAuthenticated) return null;

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/sessions", label: "Allocation Sessions", icon: <Layers size={18} /> },
    { to: "/students", label: "Students", icon: <Users size={18} /> },
    { to: "/interview", label: "AI Interviews", icon: <FileText size={18} /> },
    { to: "/recommendations", label: "Recommendations", icon: <Lightbulb size={18} /> },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-4 py-6 min-h-[calc(100vh-64px)] flex flex-col transition-colors">
      <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider mb-4 px-3">
        Menu
      </h3>
      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-8">
        <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider mb-4 px-3">
          Account
        </h3>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`
          }
        >
          <Settings size={18} />
          Profile Settings
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;