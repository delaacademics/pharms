"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Activity } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-blue-50 flex items-center justify-center rounded-full">
               <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Hospital Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Sign in to access your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="admin@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:shadow-md"
            >
              Sign in
            </button>
          </div>
          <div className="text-sm text-center text-gray-500 pt-2 border-t border-gray-100">
            Are you a patient? <a href="/patient/register" className="text-blue-600 hover:underline">Register here to book an appointment</a>
          </div>
        </form>
      </div>
    </div>
  );
}
