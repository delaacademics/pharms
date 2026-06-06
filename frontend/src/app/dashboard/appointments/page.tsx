"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar as CalendarIcon, Clock, User, CalendarDays, Plus } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
    notes: ""
  });

  const fetchData = async () => {
    try {
      const [aptRes, patRes] = await Promise.all([
        axios.get("http://localhost:5000/api/appointments"),
        axios.get("http://localhost:5000/api/patients")
      ]);
      setAppointments(aptRes.data);
      setPatients(patRes.data);
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      await axios.post("http://localhost:5000/api/appointments", {
        patientId: formData.patientId,
        date: dateTime.toISOString(),
        reason: formData.reason,
        notes: formData.notes
      });
      setShowModal(false);
      setFormData({ patientId: "", date: "", time: "", reason: "", notes: "" });
      fetchData(); // Refresh list
    } catch (error) {
      alert("Failed to schedule appointment.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments & Scheduling</h1>
          <p className="text-gray-500 mt-1">Manage doctor schedules and patient queues.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors font-medium text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading appointments...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No appointments scheduled.</td></tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {apt.patient?.firstName?.charAt(0)}{apt.patient?.lastName?.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{apt.patient?.firstName} {apt.patient?.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{apt.doctor?.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <CalendarDays className="h-4 w-4 text-purple-500 mr-2" />
                      {new Date(apt.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 text-gray-400 mr-2" />
                      {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{apt.reason}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{apt.notes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Schedule Appointment</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient</label>
                <select required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                  value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                  <option value="">Select a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (ID: {p.id.substring(0,8)})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input type="time" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                    value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <input type="text" placeholder="e.g. Follow up checkup" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                  value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea rows={3} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
