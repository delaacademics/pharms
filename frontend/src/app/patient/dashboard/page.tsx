"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/patient/appointments")
      .then(res => setAppointments(res.data))
      .catch(err => console.error("Failed to fetch appointments"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-xl shadow-emerald-200/50 p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-emerald-50 max-w-lg text-lg">
            This is your patient portal. From here, you can book appointments and manage your health records.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute right-20 -bottom-20 w-48 h-48 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg shadow-emerald-100/40 border border-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                {appointments.length} Total
              </span>
            </div>
            
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-16 bg-emerald-50/50 rounded-2xl border border-emerald-100 border-dashed">
                <Calendar className="h-12 w-12 text-emerald-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">You don't have any appointments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => {
                  const dateObj = new Date(apt.date);
                  const isPast = dateObj < new Date();
                  return (
                    <div key={apt.id} className={`p-5 rounded-2xl border transition-all hover:shadow-md ${isPast ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white border-emerald-100 shadow-sm'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${isPast ? 'bg-gray-200 text-gray-500' : 'bg-emerald-100 text-emerald-600'}`}>
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{apt.doctor.name}</h3>
                            <p className="text-sm text-gray-500">{apt.reason || "General Checkup"}</p>
                          </div>
                        </div>
                        <div className={`text-right ${isPast ? 'text-gray-500' : 'text-emerald-700'}`}>
                          <div className="flex items-center gap-1 font-medium justify-end">
                            <Calendar className="h-4 w-4" />
                            {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1 text-sm justify-end mt-1">
                            <Clock className="h-4 w-4" />
                            {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg shadow-emerald-100/40 border border-white sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <a href="/patient/dashboard/book" className="group flex items-center justify-between w-full bg-emerald-600 text-white p-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg shadow-emerald-200">
                <span className="font-semibold text-lg">Book Appointment</span>
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <div className="mt-8 pt-6 border-t border-emerald-50">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Need Help?</h3>
              <p className="text-sm text-gray-500">Contact the hospital administration for emergency cases or if you need to reschedule.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
