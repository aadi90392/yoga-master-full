import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Edit, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const InstructorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        // Backend: app.get('/classes/:email')
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

  if (loading) return <div className="text-center py-20 text-green-600 font-bold">Loading your content...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">My Created Classes</h2>
      
      {classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-500 mb-4">You haven't added any classes yet.</p>
           <Link to="/dashboard/add-class" className="text-green-600 font-bold hover:underline">Add Your First Class</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                              <p className="text-xs text-gray-500">${cls.price}</p>
                          </div>
                      </div>
                  </td>
                  <td className="p-4">
                      {/* Status Badge */}
                      <span className={`flex items-center gap-1 text-xs font-bold uppercase px-2 py-1 rounded-full w-fit
                          ${cls.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            cls.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {cls.status === 'approved' && <CheckCircle size={12} />}
                          {cls.status === 'pending' && <Clock size={12} />}
                          {cls.status === 'denied' && <AlertCircle size={12} />}
                          {cls.status}
                      </span>
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                      {cls.totalEnrolled || 0} Students
                  </td>
                  <td className="p-4 text-sm text-gray-500 italic max-w-xs truncate">
                      {cls.reason || "No feedback"}
                  </td>
                  <td className="p-4 text-right">
                      {/* Update Button (Abhi Update page banayenge next) */}
                 <Link 
    to={`/dashboard/update-class/${cls._id}`}
    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition text-sm font-medium"
>
    <Edit size={16} /> Update
</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstructorClasses;