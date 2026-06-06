"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function BookAppointment() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Failed to load doctors"));
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/appointments/available-slots?doctorId=${selectedDoctor}&date=${selectedDate}`)
        .then(res => {
          setAvailableSlots(res.data);
          setSelectedSlot("");
        })
        .catch(err => console.error("Failed to fetch slots"))
        .finally(() => setLoading(false));
    }
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await axios.post("http://localhost:5000/api/patient/appointments", {
        doctorId: selectedDoctor,
        date: selectedSlot,
        reason
      });
      setSuccess(true);
      setTimeout(() => router.push("/patient/dashboard"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
        <p className="text-gray-500 mb-6">Select a doctor, choose a date, and find an available time slot.</p>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-green-900">Appointment Confirmed!</h3>
            <p className="text-green-700 mt-1">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1 text-gray-400" /> Select Doctor
                </label>
                <select 
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1 text-gray-400" /> Select Date
                </label>
                <input 
                  type="date"
                  required
                  min={getTodayString()}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {selectedDoctor && selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1 text-gray-400" /> Available Time Slots
                </label>
                {loading ? (
                  <div className="text-sm text-gray-500 py-4">Checking availability...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
                    No available slots for this date. Please choose another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableSlots.map(slot => {
                      const dateObj = new Date(slot);
                      const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                            selectedSlot === slot
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {timeString}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
              <textarea 
                required
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3"
                placeholder="Briefly describe your symptoms or reason for appointment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading || !selectedSlot}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
