"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pill, AlertTriangle } from "lucide-react";

export default function Pharmacy() {
  const [drugs, setDrugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: 0,
    price: 0,
    expiryDate: ""
  });

  const fetchDrugs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacy/drugs");
      setDrugs(res.data);
    } catch (error) {
      console.error("Failed to fetch drugs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/pharmacy/drugs", formData);
      setShowModal(false);
      setFormData({ name: "", description: "", stock: 0, price: 0, expiryDate: "" });
      fetchDrugs();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to add drug. Check your permissions.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmacy Inventory</h1>
          <p className="text-gray-500 mt-1">Manage drug stock, pricing, and expiration.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Drug
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Rp)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : drugs.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Inventory is empty.</td></tr>
            ) : (
              drugs.map((drug) => (
                <tr key={drug.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Pill className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{drug.name}</div>
                        <div className="text-sm text-gray-500">{drug.description || 'No description'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${drug.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {drug.stock} units
                    </span>
                    {drug.stock < 10 && <AlertTriangle className="inline h-4 w-4 text-red-500 ml-2" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(drug.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {drug.expiryDate ? new Date(drug.expiryDate).toLocaleDateString() : 'N/A'}
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
              <h3 className="text-lg font-bold text-gray-900">Add New Drug</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input type="number" required min="0" className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (Rp)</label>
                  <input type="number" required min="0" className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2" 
                    value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2" 
                  value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md">Add Drug</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
