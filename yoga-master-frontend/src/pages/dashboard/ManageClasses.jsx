import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, User, Mail } from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Classes
  const fetchClasses = async () => {
    try {
      const res = await api.get('/class-manage');
      setClasses(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // 2. Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/change-status/${id}`, { status: newStatus });
      toast.success(`Class ${newStatus} successfully!`);
      fetchClasses(); 
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-gray-500">
        <span className="loading-spinner">Loading classes...</span>
    </div>
  );

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Classes</h2>
        <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
            Total: {classes.length}
        </span>
      </div>
      
      {/* ================= MOBILE VIEW (CARDS) ================= */}
      {/* Visible on Mobile, Hidden on Medium screens and up */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {classes.map((cls) => (
            <div key={cls._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                {/* Header: Image & Name */}
                <div className="flex items-center gap-4">
                    <img src={cls.image} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                    <div>
                        <h3 className="font-bold text-gray-900">{cls.name}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase mt-1
                            ${cls.status === 'approved' ? 'bg-green-100 text-green-700' : 
                              cls.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {cls.status}
                        </span>
                    </div>
                </div>

                {/* Instructor Info */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                        <User size={14} /> <span className="font-medium">{cls.instructorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Mail size={14} /> <span className="truncate">{cls.instructorEmail}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-1">
                    <button 
                        onClick={() => handleStatusChange(cls._id, 'approved')}
                        disabled={cls.status === 'approved'}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                    <button 
                        onClick={() => handleStatusChange(cls._id, 'denied')}
                        disabled={cls.status === 'denied'}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <XCircle size={16} /> Deny
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW (TABLE) ================= */}
      {/* Hidden on Mobile, Visible on Medium screens and up */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Class Image</th>
              <th className="p-4 font-semibold text-gray-600">Class Name</th>
              <th className="p-4 font-semibold text-gray-600">Instructor</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.map((cls) => (
              <tr key={cls._id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                    <img src={cls.image} alt="" className="w-16 h-12 object-cover rounded-md border border-gray-200" />
                </td>
                <td className="p-4 font-medium text-gray-800">{cls.name}</td>
                <td className="p-4 text-sm text-gray-600">
                    <div className="font-medium text-gray-900">{cls.instructorName}</div>
                    <div className="text-xs text-gray-400">{cls.instructorEmail}</div>
                </td>
                <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                        ${cls.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          cls.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {cls.status}
                    </span>
                </td>
                <td className="p-4 text-right space-x-2">
                    <button 
                        onClick={() => handleStatusChange(cls._id, 'approved')}
                        disabled={cls.status === 'approved'}
                        className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-100 disabled:hover:text-green-700"
                        title="Approve"
                    >
                        <CheckCircle size={18} />
                    </button>
                    
                    <button 
                        onClick={() => handleStatusChange(cls._id, 'denied')}
                        disabled={cls.status === 'denied'}
                        className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-100 disabled:hover:text-red-700"
                        title="Deny"
                    >
                        <XCircle size={18} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {classes.length === 0 && (
            <div className="p-10 text-center text-gray-500">
                No classes found to manage.
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;