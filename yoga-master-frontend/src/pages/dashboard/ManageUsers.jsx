import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Trash2, UserCheck, Shield, UserMinus, ShieldOff, Mail, Search, Users, UserCog, Crown } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        if(!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
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

    // --- FILTER LOGIC (SEARCH) ---
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- STATS CALCULATION ---
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalInstructors = users.filter(u => u.role === 'instructor').length;
    const totalStudents = users.filter(u => u.role === 'user' || !u.role).length;

    if (loading) return <div className="text-center py-20 text-green-600 font-bold">Loading users...</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            
            {/* --- HEADER & STATS --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h2>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">Overview of all registered members.</p>
                </div>
                
                {/* Stats Row (Responsive Flex Wrap) */}
                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                    <div className="flex-1 min-w-[120px] bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-bold border border-purple-100 flex items-center justify-center gap-2 shadow-sm">
                        <Crown size={18}/> {totalAdmins} Admins
                    </div>
                    <div className="flex-1 min-w-[120px] bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-bold border border-blue-100 flex items-center justify-center gap-2 shadow-sm">
                        <UserCog size={18}/> {totalInstructors} Instructors
                    </div>
                    <div className="flex-1 min-w-[120px] bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-bold border border-green-100 flex items-center justify-center gap-2 shadow-sm">
                        <Users size={18}/> {totalStudents} Students
                    </div>
                </div>
            </div>

            {/* --- SEARCH BAR --- */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by Name or Email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition-all bg-white"
                />
            </div>

            {/* --- TABLE VIEW (Desktop - Large Screens) --- */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600 text-sm">#</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm">User Details</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm">Current Role</th>
                            <th className="p-4 font-semibold text-gray-600 text-sm text-right">Manage Access</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">No users found matching "{searchTerm}"</td></tr>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 text-gray-400 text-sm">{index + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="" />
                                            <div>
                                                <div className="font-bold text-gray-800">{user.name || "Unknown"}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                            ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                              user.role === 'instructor' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* INSTRUCTOR TOGGLE */}
                                            {user.role === 'instructor' ? (
                                                <button onClick={() => handleRoleChange(user, 'user')} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 border border-yellow-200 transition" title="Demote to Student">
                                                    <UserMinus size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleRoleChange(user, 'instructor')} disabled={user.role === 'admin'} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 transition disabled:opacity-30" title="Promote to Instructor">
                                                    <UserCheck size={18} />
                                                </button>
                                            )}

                                            {/* ADMIN TOGGLE */}
                                            {user.role === 'admin' ? (
                                                <button onClick={() => handleRoleChange(user, 'user')} className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 border border-orange-200 transition" title="Remove Admin">
                                                    <ShieldOff size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleRoleChange(user, 'admin')} disabled={user.role === 'instructor'} className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 border border-purple-200 transition disabled:opacity-30" title="Make Admin">
                                                    <Shield size={18} />
                                                </button>
                                            )}

                                            {/* DELETE */}
                                            <button onClick={() => handleDelete(user._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 transition" title="Delete User">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE & TABLET CARD VIEW --- */}
            {/* Hidden on Large Desktop, Visible on Mobile/Tablet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                            <img src={user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-12 h-12 rounded-full border border-gray-100 object-cover" alt="" />
                            <div className="flex-1 min-w-0"> {/* min-w-0 ensures text truncation works */}
                                <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                                <p className="text-xs text-gray-500 break-all">{user.email}</p>
                                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase border 
                                    ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : user.role === 'instructor' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                    {user.role || 'user'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 border-t border-gray-50 pt-3">
                            <button onClick={() => handleDelete(user._id)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 active:scale-95 transition">Delete</button>
                            <button onClick={() => handleRoleChange(user, 'instructor')} disabled={user.role === 'instructor'} className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-blue-100 active:scale-95 transition">Instructor</button>
                            <button onClick={() => handleRoleChange(user, 'admin')} disabled={user.role === 'admin'} className="flex-1 py-2.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-purple-100 active:scale-95 transition">Admin</button>
                        </div>
                    </div>
                ))}
                {filteredUsers.length === 0 && <p className="text-center text-gray-500 col-span-full py-8">No users found.</p>}
            </div>

        </div>
    );
};

export default ManageUsers;