"use client";

import { useState } from "react";
import axios from "axios";
import { Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PatientRegister() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "Male",
    contact: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        role: "PATIENT"
      };
      // Register
      await axios.post("http://localhost:5000/api/auth/register", data);
      
      // Auto-login
      const res = await axios.post("http://localhost:5000/api/auth/login", { 
        email: formData.email, 
        password: formData.password 
      });
      
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-50 flex items-center justify-center rounded-full">
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Patient Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already registered? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Log in</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm text-center">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  onChange={e => setFormData({...formData, firstName: e.target.value, name: `${e.target.value} ${formData.lastName}`})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  onChange={e => setFormData({...formData, lastName: e.target.value, name: `${formData.firstName} ${e.target.value}`})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input required type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input required type="password" minLength={6} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input required type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input required type="tel" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  onChange={e => setFormData({...formData, contact: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea required rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div>
              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
