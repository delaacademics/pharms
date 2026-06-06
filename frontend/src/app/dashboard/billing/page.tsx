"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CreditCard, CheckCircle, Clock } from "lucide-react";

export default function Billing() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/billing/invoices");
      setInvoices(res.data);
    } catch (error) {
      console.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePay = async (id: string) => {
    try {
      await axios.post(`http://localhost:5000/api/billing/invoices/${id}/pay`);
      fetchInvoices();
    } catch (error) {
      alert("Failed to process payment");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cashier & Billing</h1>
        <p className="text-gray-500 mt-1">Manage patient invoices and process payments.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading invoices...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No invoices found.</td></tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.patient?.firstName} {invoice.patient?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">ID: {invoice.patientId.substring(0,8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.status === "PAID" ? (
                      <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Paid
                      </span>
                    ) : (
                      <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                        <Clock className="h-3 w-3 mr-1" /> Unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {invoice.status === "UNPAID" ? (
                      <button 
                        onClick={() => handlePay(invoice.id)}
                        className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg inline-flex items-center shadow-sm transition-colors"
                      >
                        <CreditCard className="h-4 w-4 mr-1.5" /> Process Payment
                      </button>
                    ) : (
                      <span className="text-gray-400">Paid</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
