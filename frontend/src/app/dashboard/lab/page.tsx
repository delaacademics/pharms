"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { TestTube, Plus, FileText, User, Calendar } from "lucide-react";

export default function Laboratory() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [patientId, setPatientId] = useState("");
  const [testType, setTestType] = useState("");
  const [result, setResult] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, labRes] = await Promise.all([
        axios.get("http://localhost:5000/api/patients"),
        axios.get("http://localhost:5000/api/lab")
      ]);
      setPatients(patientsRes.data);
      setLabTests(labRes.data);
    } catch (err) {
      console.error("Failed to fetch lab data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !testType || !result) return;
    
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/lab", {
        patientId,
        testType,
        result,
        notes
      });
      // Reset form
      setPatientId("");
      setTestType("");
      setResult("");
      setNotes("");
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Failed to submit lab test", err);
    } finally {
      setSubmitting(false);
    }
  };

  const testTypes = ["Blood Work", "MRI Scan", "X-Ray", "Urinalysis", "CT Scan", "Ultrasound"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Laboratory Module</h1>
        <p className="text-gray-500 mt-1">Manage patient lab tests and scan results.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg shadow-blue-50/50 border border-white sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <Plus className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">New Lab Record</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient *</label>
                <select 
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type *</label>
                <select 
                  required
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">-- Select Test Type --</option>
                  {testTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Result Summary *</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Normal, High Cholesterol..."
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Notes</label>
                <textarea 
                  rows={3}
                  placeholder="Any additional observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-md shadow-blue-200"
              >
                {submitting ? "Saving..." : "Save Lab Result"}
              </button>
            </form>
          </div>
        </div>

        {/* Results List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg shadow-blue-50/50 border border-white min-h-[500px]">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TestTube className="h-5 w-5 text-blue-500" /> Recent Lab Results
            </h2>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading lab records...</div>
            ) : labTests.length === 0 ? (
              <div className="text-center py-16 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                <FileText className="h-12 w-12 text-blue-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No lab records found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {labTests.map(test => (
                  <div key={test.id} className="p-5 rounded-2xl bg-white border border-blue-50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                          <TestTube className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{test.testType}</h3>
                            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                              {test.patient?.firstName} {test.patient?.lastName}
                            </span>
                          </div>
                          <p className="text-gray-700 font-medium">Result: {test.result}</p>
                          {test.notes && <p className="text-gray-500 text-sm mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">{test.notes}</p>}
                        </div>
                      </div>
                      <div className="text-right text-xs font-medium text-gray-400">
                        <div className="flex items-center justify-end gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(test.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
