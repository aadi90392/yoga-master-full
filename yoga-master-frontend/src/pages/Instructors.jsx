import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Mail, MapPin, User } from 'lucide-react';

const Instructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const res = await api.get('/instructors');
                setInstructors(res.data);
            } catch (error) {
                console.error("Error fetching instructors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInstructors();
    }, []);

    if (loading) return <div className="text-center py-20 text-green-600 font-bold">Loading Instructors...</div>;

    return (
        <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">Our Expert Instructors</h2>
                    <p className="text-gray-500 mt-2">Learn from the masters of Yoga.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {instructors.map((instructor) => (
                        <div key={instructor._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col items-center p-6 text-center group">
                            
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-100 mb-4 group-hover:scale-105 transition">
                                <img 
                                    src={instructor.photoUrl || `https://ui-avatars.com/api/?name=${instructor.name}&background=16a34a&color=fff`} 
                                    alt={instructor.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                            <p className="text-green-600 font-medium text-sm mb-4">Yoga Master</p>
                            
                            {/* Details */}
                            <div className="w-full space-y-2 text-sm text-gray-500 text-left bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-green-500"/> 
                                    <span className="truncate">{instructor.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-green-500"/> 
                                    <span className="truncate">{instructor.address || "Online"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-green-500"/> 
                                    <span className="truncate">{instructor.phone || "N/A"}</span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Instructors;