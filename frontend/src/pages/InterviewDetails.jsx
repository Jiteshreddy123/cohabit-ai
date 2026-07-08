import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { studentApi } from "../api/studentApi";
import { traitApi } from "../api/traitApi";
import { ArrowLeft, User, Activity, AlertCircle } from "lucide-react";

function InterviewDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [traits, setTraits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentData = await studentApi.getStudentById(id);
        setStudent(studentData);
        
        try {
          const traitData = await traitApi.getStudentTraits(id);
          setTraits(traitData.data);
        } catch (e) {
          console.warn("Could not load traits (expected if placeholders)");
        }
      } catch (err) {
        setError("Failed to load interview details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading interview data...</div>;

  if (error || !student) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mt-10 transition-colors">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error || "Could not find details."}</p>
        <Link to="/interview" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
          Return to Interviews
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/interview" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Extracted Traits</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View the AI-analyzed personality profile for {student.name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center text-center transition-colors">
          <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4">
            <User size={32} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{student.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{student.branch}</p>
          <div className="mt-4 w-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 py-2 rounded-lg text-sm font-medium border border-green-100 dark:border-green-800/50 flex items-center justify-center gap-2">
            <Activity size={16} />
            Interview Complete
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-900 dark:text-white">LLM Extracted Persona</h3>
          </div>
          
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800/50">
              <Activity size={24} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h4 className="text-gray-900 dark:text-white font-medium mb-2">Traits Engine Placeholder</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              The AI LLM extraction logic is scheduled for the next development phase. 
              Once implemented, this section will display vectors for:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 mt-4 space-y-2 text-left max-w-xs mx-auto">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Sleep Schedule Preference</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Noise Tolerance</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Cleanliness Strictness</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Social / Introvert scale</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewDetails;
