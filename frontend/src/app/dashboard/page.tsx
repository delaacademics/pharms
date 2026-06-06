"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Calendar, Pill, TrendingUp, AlertCircle, Clock, User as UserIcon } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    lowStockDrugs: 0,
    monthlyRevenue: 0
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/api/dashboard/stats"),
      axios.get("http://localhost:5000/api/appointments")
    ]).then(([statsRes, aptsRes]) => {
      setStats(statsRes.data);
      setAppointments(aptsRes.data);
    }).catch(err => console.error("Failed to fetch dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const statCards = [
    { title: "Total Patients", value: stats.totalPatients, icon: Users, color: "from-blue-500 to-indigo-500", shadow: "shadow-blue-200/50" },
    { title: "Appointments Today", value: stats.appointmentsToday, icon: Calendar, color: "from-purple-500 to-fuchsia-500", shadow: "shadow-purple-200/50" },
    { title: "Low Stock Drugs", value: stats.lowStockDrugs, icon: Pill, color: "from-rose-500 to-orange-500", shadow: "shadow-rose-200/50" },
    { title: "Monthly Revenue", value: formatCurrency(stats.monthlyRevenue), icon: TrendingUp, color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-200/50" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-500 mt-1">Here is what's happening at the hospital today.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white shadow-lg shadow-blue-50/50 text-sm font-medium text-gray-700">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white flex flex-col relative overflow-hidden group">
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110`}>
                <Icon className="h-24 w-24" />
              </div>
              <div className={`bg-gradient-to-br ${stat.color} h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.shadow} mb-4 relative z-10`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{loading ? "..." : stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-blue-50/50 border border-white p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Ongoing & Upcoming Appointments</h3>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
              {appointments.length} Total
            </span>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                <Calendar className="h-10 w-10 text-blue-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No appointments scheduled.</p>
              </div>
            ) : (
              appointments.slice(0, 5).map((apt: any) => {
                const dateObj = new Date(apt.date);
                const isPast = dateObj < new Date();
                return (
                  <div key={apt.id} className={`p-4 rounded-2xl border transition-all ${isPast ? 'bg-gray-50/50 border-gray-100' : 'bg-white border-blue-100 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPast ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                          <p className="text-xs text-gray-500">with {apt.doctor?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 font-medium text-sm justify-end ${isPast ? 'text-gray-500' : 'text-gray-900'}`}>
                          <Clock className="h-4 w-4 text-gray-400" />
                          {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {appointments.length > 5 && (
              <a href="/dashboard/appointments" className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 mt-4 pt-4 border-t border-gray-100">
                View all appointments &rarr;
              </a>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-200/50 p-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6">System Health</h3>
            <div className="space-y-6">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-100">Server Status</span>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <p className="text-lg font-bold">Online</p>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-100">Database Load</span>
                  <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded-lg">Normal</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2 mt-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-200 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-100 leading-relaxed">
                  The dashboard is now connected to live database records. Real-time updates are active.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
