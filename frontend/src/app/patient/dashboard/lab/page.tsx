"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { TestTube, FileText, Calendar } from "lucide-react";

export default function PatientLaboratory() {
  const [labTests, setLabTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/patient/lab")
      .then(res => setLabTests(res.data))
      .catch(err => console.error("Failed to fetch patient lab data", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-xl shadow-emerald-200/50 p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Your Laboratory Results
          </h1>
          <p className="text-emerald-50 max-w-lg text-lg">
            View your recent blood work, scans, and other lab test results here.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg shadow-emerald-100/40 border border-white min-h-[500px]">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TestTube className="h-6 w-6 text-emerald-500" /> Recent Tests
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading your lab records...</div>
        ) : labTests.length === 0 ? (
          <div className="text-center py-16 bg-emerald-50/50 rounded-2xl border border-emerald-100 border-dashed">
            <FileText className="h-12 w-12 text-emerald-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No lab records found for your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labTests.map(test => (
              <div key={test.id} className="p-6 rounded-2xl bg-white border border-emerald-50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute right-0 top-0 opacity-5 transition-opacity group-hover:opacity-10 transform translate-x-4 -translate-y-4">
                  <TestTube className="h-32 w-32" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
                      <TestTube className="h-6 w-6" />
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      {new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-xl mb-1">{test.testType}</h3>
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-800 font-medium mb-1">Result Summary:</p>
                    <p className="text-emerald-700 font-bold">{test.result}</p>
                  </div>
                  
                  {test.notes && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Doctor's Notes</p>
                      <p className="text-sm text-gray-600">{test.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
