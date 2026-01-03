import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Edit, AlertCircle, CheckCircle, Clock, Users, MessageCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const InstructorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const res = await api.get(`/classes/${user?.email}`);
        setClasses(res.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to fetch your classes.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
        fetchMyClasses();
    }
  }, [user?.email]);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-green-600">
        <Loader className="animate-spin mr-2" /> Loading your content...
    </div>
  );

  return (
    // 1. Dynamic Padding: p-4 for mobile, p-8 for desktop
    <div className="p-4 sm:p-8">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Created Classes</h2>
        <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium border border-green-100">
            Total Classes: {classes.length}
        </span>
      </div>
      
      {classes.length === 0 ? (
        // --- EMPTY STATE ---
        <div className="text-center py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-gray-100">
           <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="text-gray-400" size={24} />
           </div>
           <p className="text-gray-500 mb-6 font-medium">You haven't added any classes yet.</p>
           <Link to="/dashboard/add-class" className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20">
                Add Your First Class
           </Link>
        </div>
      ) : (
        <>
            {/* ================= MOBILE VIEW (CARDS) ================= */}
            {/* Visible on Mobile (< md), Hidden on Desktop */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {classes.map((cls) => (
                    <div key={cls._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        
                        {/* Top: Image & Basic Info */}
                        <div className="flex gap-4">
                            <img src={cls.image} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight">{cls.name}</h4>
                                    <p className="text-sm text-green-600 font-bold mt-1">${cls.price}</p>
                                </div>
                                {/* Status Badge */}
                                <span className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-fit mt-2
                                    ${cls.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                      cls.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {cls.status === 'approved' && <CheckCircle size={10} />}
                                    {cls.status === 'pending' && <Clock size={10} />}
                                    {cls.status === 'denied' && <AlertCircle size={10} />}
                                    {cls.status}
                                </span>
                            </div>
                        </div>

                        {/* Middle: Stats & Feedback */}
                        <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={12}/> Enrolled</span>
                                <span className="font-bold text-gray-800">{cls.totalEnrolled || 0} Students</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 flex items-center gap-1"><MessageCircle size={12}/> Feedback</span>
                                <span className="font-medium text-gray-800 truncate" title={cls.reason}>{cls.reason ? cls.reason : "N/A"}</span>
                            </div>
                        </div>

                        {/* Bottom: Action Button */}
                        <Link 
                            to={`/dashboard/update-class/${cls._id}`}
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition active:scale-[0.98]"
                        >
                            <Edit size={16} /> Update Class
                        </Link>
                    </div>
                ))}
            </div>

            {/* ================= DESKTOP VIEW (TABLE) ================= */}
            {/* Hidden on Mobile, Visible on Desktop (>= md) */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Class Info</th>
                        <th className="p-4 font-semibold text-gray-600">Status</th>
                        <th className="p-4 font-semibold text-gray-600">Enrolled</th>
                        <th className="p-4 font-semibold text-gray-600">Feedback</th>
                        <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {classes.map((cls) => (
                        <tr key={cls._id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                            <div className="flex items-center gap-4">
                                <img src={cls.image} alt="" className="w-16 h-12 object-cover rounded-md border border-gray-200" />
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{cls.name}</h4>
                                    <p className="text-xs text-gray-500 font-semibold">${cls.price}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-4">
                            <span className={`flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1 rounded-full w-fit border
                                ${cls.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                                cls.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                {cls.status === 'approved' && <CheckCircle size={14} />}
                                {cls.status === 'pending' && <Clock size={14} />}
                                {cls.status === 'denied' && <AlertCircle size={14} />}
                                {cls.status}
                            </span>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-gray-400"/>
                                {cls.totalEnrolled || 0}
                            </div>
                        </td>
                        <td className="p-4 text-sm text-gray-500 italic max-w-xs truncate">
                            {cls.reason || <span className="text-gray-300">No feedback</span>}
                        </td>
                        <td className="p-4 text-right">
                            <Link 
                                to={`/dashboard/update-class/${cls._id}`}
                                className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white hover:border-green-600 transition text-sm font-medium shadow-sm"
                            >
                                <Edit size={16} /> Update
                            </Link>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
      )}
    </div>
  );
};

export default InstructorClasses;