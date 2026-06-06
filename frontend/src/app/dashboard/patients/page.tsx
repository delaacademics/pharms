"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, UserPlus, Pill, CalendarPlus } from "lucide-react";

export default function Patients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [drugs, setDrugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<string | null>(null); // patientId
  const [showAptModal, setShowAptModal] = useState<string | null>(null); // patientId
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", dob: "", gender: "MALE", contact: "", address: "", bloodGroup: ""
  });

  const [prescriptionItems, setPrescriptionItems] = useState([{ drugId: "", quantity: 1, dosage: "" }]);

  const [aptData, setAptData] = useState({ date: "", time: "", reason: "", notes: "" });

  useEffect(() => {
    fetchPatients();
    fetchDrugs();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/patients");
      setPatients(res.data);
    } catch (error) { console.error("Failed to fetch patients"); }
    finally { setLoading(false); }
  };

  const fetchDrugs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacy/drugs");
      setDrugs(res.data);
    } catch (error) { console.error("Failed to fetch drugs"); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/patients", formData);
      setShowRegModal(false);
      fetchPatients();
    } catch (error: any) { alert(error.response?.data?.error || "Failed to register patient."); }
  };

  const handlePrescribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPrescriptionModal) return;
    try {
      await axios.post("http://localhost:5000/api/prescriptions", {
        patientId: showPrescriptionModal,
        notes: "General Prescription",
        items: prescriptionItems
      });
      setShowPrescriptionModal(null);
      setPrescriptionItems([{ drugId: "", quantity: 1, dosage: "" }]);
      alert("Prescription issued and sent to Cashier!");
    } catch (error) { alert("Failed to issue prescription."); }
  };

  const handleScheduleApt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAptModal) return;
    try {
      const dateTime = new Date(`${aptData.date}T${aptData.time}`);
      await axios.post("http://localhost:5000/api/appointments", {
        patientId: showAptModal,
        date: dateTime.toISOString(),
        reason: aptData.reason,
        notes: aptData.notes
      });
      setShowAptModal(null);
      setAptData({ date: "", time: "", reason: "", notes: "" });
      alert("Appointment scheduled successfully!");
    } catch (error) { alert("Failed to schedule appointment."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-500 mt-1">View patients, prescribe meds, and schedule appointments.</p>
        </div>
        <button
          onClick={() => setShowRegModal(true)}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register Patient
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading patients...</td></tr>
            ) : patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                      <div className="text-sm text-gray-500">ID: {patient.id.substring(0,8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => setShowAptModal(patient.id)} className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 p-2 rounded-lg inline-flex items-center">
                    <CalendarPlus className="h-4 w-4 mr-1" /> Schedule
                  </button>
                  <button onClick={() => setShowPrescriptionModal(patient.id)} className="text-purple-600 hover:text-purple-900 bg-purple-50 p-2 rounded-lg inline-flex items-center">
                    <Pill className="h-4 w-4 mr-1" /> Prescribe
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Modal */}
      {showAptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Schedule Appointment</h3>
              <button onClick={() => setShowAptModal(null)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleScheduleApt} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                    value={aptData.date} onChange={e => setAptData({...aptData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input type="time" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                    value={aptData.time} onChange={e => setAptData({...aptData, time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <input type="text" placeholder="e.g. Follow up checkup" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                  value={aptData.reason} onChange={e => setAptData({...aptData, reason: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea rows={3} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm border"
                  value={aptData.notes} onChange={e => setAptData({...aptData, notes: e.target.value})} />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAptModal(null)} className="px-4 py-2 text-sm text-gray-700 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Issue Prescription</h3>
              <button onClick={() => setShowPrescriptionModal(null)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handlePrescribe} className="p-6 space-y-4">
              {prescriptionItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">Drug</label>
                    <select required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
                      value={item.drugId} onChange={e => {
                        const newItems = [...prescriptionItems];
                        newItems[idx].drugId = e.target.value;
                        setPrescriptionItems(newItems);
                      }}>
                      <option value="">Select a drug...</option>
                      {drugs.map(d => (
                        <option key={d.id} value={d.id} disabled={d.stock < 1}>{d.name} ({d.stock} in stock) - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(d.price)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-700">Quantity</label>
                    <input type="number" min="1" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
                      value={item.quantity} onChange={e => {
                        const newItems = [...prescriptionItems];
                        newItems[idx].quantity = parseInt(e.target.value) || 1;
                        setPrescriptionItems(newItems);
                      }}/>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">Dosage</label>
                    <input type="text" placeholder="e.g. 2x a day" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
                      value={item.dosage} onChange={e => {
                        const newItems = [...prescriptionItems];
                        newItems[idx].dosage = e.target.value;
                        setPrescriptionItems(newItems);
                      }}/>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setPrescriptionItems([...prescriptionItems, { drugId: "", quantity: 1, dosage: "" }])}
                className="text-sm text-blue-600 font-medium">
                + Add another drug
              </button>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPrescriptionModal(null)} className="px-4 py-2 text-sm text-gray-700 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm">Issue & Send to Cashier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reg Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
             <h3 className="text-lg font-bold mb-4">Register Patient</h3>
             <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" placeholder="First Name" required className="block w-full border border-gray-300 rounded px-3 py-2" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                <input type="text" placeholder="Last Name" required className="block w-full border border-gray-300 rounded px-3 py-2" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                <input type="date" required className="block w-full border border-gray-300 rounded px-3 py-2" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                <div className="flex gap-4">
                  <select required className="block w-full border border-gray-300 rounded px-3 py-2 bg-white" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  <input type="text" placeholder="Blood Group (e.g. A+)" className="block w-full border border-gray-300 rounded px-3 py-2" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} />
                </div>
                <input type="text" placeholder="Contact" required className="block w-full border border-gray-300 rounded px-3 py-2" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                <input type="text" placeholder="Address" required className="block w-full border border-gray-300 rounded px-3 py-2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setShowRegModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
