import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle } from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Classes (Users nahi!)
  const fetchClasses = async () => {
    try {
      // NOTE: Yahan '/class-manage' hona chahiye, '/users' nahi
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

  // 2. Handle Status Change (Approve/Deny)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/change-status/${id}`, { status: newStatus });
      toast.success(`Class ${newStatus} successfully!`);
      fetchClasses(); 
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading classes...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Classes</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                    <img src={cls.image} alt="" className="w-16 h-12 object-cover rounded-md" />
                </td>
                <td className="p-4 font-medium text-gray-800">{cls.name}</td>
                <td className="p-4 text-sm text-gray-600">
                    {cls.instructorName}<br/>
                    <span className="text-xs text-gray-400">{cls.instructorEmail}</span>
                </td>
                <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                        ${cls.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          cls.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {cls.status}
                    </span>
                </td>
                <td className="p-4 text-right space-x-2">
                    {/* Approve Button */}
                    <button 
                        onClick={() => handleStatusChange(cls._id, 'approved')}
                        disabled={cls.status === 'approved'}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Approve"
                    >
                        <CheckCircle size={18} />
                    </button>
                    
                    {/* Deny Button */}
                    <button 
                        onClick={() => handleStatusChange(cls._id, 'denied')}
                        disabled={cls.status === 'denied'}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Deny"
                    >
                        <XCircle size={18} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageClasses;