import React, { useState } from 'react';
import { useLocations } from '../hooks/useLocations';
import { Check, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const { locations } = useLocations();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password for demo
      setIsAuthenticated(true);
      toast.success('লগইন সফল হয়েছে');
    } else {
      toast.error('ভুল পাসওয়ার্ড');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-emerald-900">অ্যাডমিন লগইন</h2>
          <input
            type="password"
            placeholder="পাসওয়ার্ড দিন"
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            লগইন
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">পেন্ডিং রিকোয়েস্ট</h2>
        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
          {locations.length} টি পোস্ট
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">নাম</th>
              <th className="px-6 py-3">জেলা</th>
              <th className="px-6 py-3">স্ট্যাটাস</th>
              <th className="px-6 py-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {locations.map((loc) => (
              <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{loc.name}</td>
                <td className="px-6 py-4 text-gray-600 capitalize">{loc.district}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    loc.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                    loc.verificationStatus === 'suspicious' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {loc.verificationStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Approve">
                    <Check size={18} />
                  </button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
                    <X size={18} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
