import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, FileText, CheckCircle, Home, Clock } from "lucide-react";
import apiClient from "../api/apiClient";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  
  // Get student info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Need to fetch current student data
        // For simplicity, we can fetch their room status which will tell us room info
        // and interview status which we need to fetch from a generic endpoint, but we don't have one right now.
        // Let's rely on room recommendations API first.
        const roomRes = await apiClient.get("/recommendations/my-room");
        setRoomData(roomRes.data);
      } catch (err) {
        // Ignore or handle
        console.error("Could not fetch room data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-brand-500 rounded-full border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Student Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome{user.name ? `, ${user.name}` : ''} to your Cohabit-AI portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-brand-50 dark:bg-brand-500/10 p-3 rounded-lg">
              <FileText className="text-brand-600 dark:text-brand-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Personality Interview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Complete this to get matched</p>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link to="/interview" className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700">
              Go to Interview
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              <Home className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Room Allocation</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {roomData?.published && roomData?.allocated 
                  ? "You have been allocated a room!" 
                  : "Check your room status"}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
            {roomData?.published ? (
               roomData?.allocated ? (
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <p className="text-sm font-medium text-green-800 dark:text-green-400 flex items-center">
                      <CheckCircle size={16} className="mr-2" />
                      Allocated Room: {roomData.room_number}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="font-semibold mb-1">Roommates:</p>
                    <ul className="list-disc pl-5">
                      {roomData.roommates.map(rm => (
                        <li key={rm.id}>{rm.name} ({rm.roll_number})</li>
                      ))}
                    </ul>
                  </div>
                </div>
               ) : (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {roomData.message}
                  </p>
                </div>
               )
            ) : (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center">
                  <Clock size={16} className="mr-2" />
                  Allocations not yet published by admin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
