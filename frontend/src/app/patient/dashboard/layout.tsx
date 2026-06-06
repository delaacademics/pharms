"use client";

import { useAuth } from "@/context/AuthContext";
import { Calendar, LayoutDashboard, LogOut, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: "My Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
    { name: "Book Appointment", href: "/patient/dashboard/book", icon: Calendar },
    { name: "Laboratory", href: "/patient/dashboard/lab", icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-emerald-50/50 font-sans medical-pattern">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur-md border-r border-emerald-100 flex flex-col shadow-lg shadow-emerald-100/50 z-10">
        <div className="h-16 flex items-center px-6 border-b border-emerald-50">
          <Activity className="h-6 w-6 text-green-600 mr-2" />
          <span className="text-lg font-bold text-gray-900">Patient Portal</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1.5 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive 
                      ? "bg-green-600 text-white shadow-md shadow-green-200" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-emerald-50 bg-emerald-50/30">
          <div className="flex items-center mb-3 px-3 py-2 rounded-xl bg-white/60 border border-emerald-100 shadow-sm backdrop-blur-sm">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm mr-3">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Loading...'}</p>
              <p className="text-xs text-gray-500 truncate">Patient</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 lg:px-12">
          {children}
        </main>
      </div>
    </div>
  );
}
