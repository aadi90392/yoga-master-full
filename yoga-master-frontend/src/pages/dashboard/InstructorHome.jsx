import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { DollarSign, Users, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InstructorHome = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch Stats
    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['instructorStats', user?.email],
        queryFn: async () => {
            const res = await api.get(`/instructor-stats/${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="text-center py-20">Loading Dashboard...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}! 👋</h1>
            <p className="text-gray-500 mb-8">Here is what's happening with your classes.</p>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Revenue Card */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <DollarSign size={32} />
                        </div>
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                            <h3 className="text-3xl font-bold">${stats.totalRevenue?.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Students Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Students</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalEnrolled}</h3>
                    </div>
                </div>

                {/* Classes Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-purple-50 p-3 rounded-full text-purple-600">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Classes</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalClasses}</h3>
                    </div>
                </div>
            </div>

            {/* --- GRAPH SECTION --- */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue per Class</h3>
                <div className="h-80 w-full">
                    {/* Recharts Component */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.classesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" hide /> {/* Name hide kiya agar lambe naam ho */}
                            <YAxis />
                            <Tooltip 
                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="totalEnrolled" name="Students" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">Showing student enrollment per class</p>
            </div>
        </div>
    );
};

export default InstructorHome;