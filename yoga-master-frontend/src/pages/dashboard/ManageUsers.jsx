import React, { useEffect, useState } from 'react';
import api from '../../api/axios'; 
import { toast } from 'react-toastify';
import { Trash2, UserCheck, Shield, UserMinus, ShieldOff } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Users
  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Change Role Function
  const handleRoleChange = async (user, newRole) => {
    const updateData = { option: newRole }; 
    try {
      const res = await api.put(`/update-user/${user._id}`, updateData);
      if (res.data.modifiedCount > 0) {
        toast.success(`Role updated to ${newRole}!`);
        fetchUsers(); 
      }
    } catch (error) {
      toast.error("Failed to update role.");
    }
  };

  // 3. Delete User Function
  const handleDelete = async (userId) => {
    if(!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await api.delete(`/delete-user/${userId}`);
      if (res.data.deletedCount > 0) {
        toast.success("User deleted successfully.");
        setUsers(users.filter(u => u._id !== userId)); 
      }
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  if (loading) return <div className="text-center py-20 text-green-600 font-bold">Loading users...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                <th className="p-4 font-semibold text-gray-600">#</th>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-500">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                        <img 
                            src={user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                            className="w-8 h-8 rounded-full object-cover" 
                            alt="" 
                        />
                        {user.name || "Unknown User"}
                    </td>
                    <td className="p-4 text-gray-600">{user.email || "No Email"}</td>
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                            user.role === 'instructor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {user.role || 'user'}
                        </span>
                    </td>
                    <td className="p-4 text-right space-x-2 flex justify-end">
                        {/* INSTRUCTOR TOGGLE */}
                        {user.role === 'instructor' ? (
                            <button onClick={() => handleRoleChange(user, 'user')} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg" title="Remove Instructor">
                                <UserMinus size={18} />
                            </button>
                        ) : (
                            <button onClick={() => handleRoleChange(user, 'instructor')} disabled={user.role === 'admin'} className="p-2 bg-blue-50 text-blue-600 rounded-lg disabled:opacity-30" title="Make Instructor">
                                <UserCheck size={18} />
                            </button>
                        )}

                        {/* ADMIN TOGGLE */}
                        {user.role === 'admin' ? (
                           <button onClick={() => handleRoleChange(user, 'user')} className="p-2 bg-orange-50 text-orange-600 rounded-lg" title="Remove Admin">
                               <ShieldOff size={18} />
                           </button>
                        ) : (
                            <button onClick={() => handleRoleChange(user, 'admin')} disabled={user.role === 'instructor'} className="p-2 bg-purple-50 text-purple-600 rounded-lg disabled:opacity-30" title="Make Admin">
                                <Shield size={18} />
                            </button>
                        )}
                        
                        {/* DELETE */}
                        <button onClick={() => handleDelete(user._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Delete User">
                            <Trash2 size={18} />
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;