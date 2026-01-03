import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Check, X, Video, User, Clock, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';

const InstructorRequests = () => {
    const [apps, setApps] = useState([]);

    // 1. Fetch Pending Applications
    const fetchApps = async () => {
        try {
            const res = await api.get('/applied-instructors');
            setApps(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchApps(); }, []);

    // 2. Approve Logic
    const handleApprove = async (application) => {
        try {
            const res = await api.patch('/make-instructor', { email: application.email });
            
            if (res.data.modifiedCount > 0) {
                await api.delete(`/delete-application/${application._id}`);
                toast.success(`${application.name} is now an Instructor!`);
                fetchApps();
            } else {
                toast.warn("User role not updated. Maybe email didn't match?");
            }
        } catch (error) {
            console.error(error);
            if(error.response && error.response.status === 403) {
                toast.error("Permission Denied! Are you logged in as Admin?");
            } else {
                toast.error("Error approving request");
            }
        }
    };

    // 3. Reject Logic
    const handleReject = async (id) => {
        try {
            await api.delete(`/delete-application/${id}`);
            toast.info("Application rejected.");
            fetchApps();
        } catch (error) {
            toast.error("Error rejecting application.");
        }
    };

    return (
        <div className="h-full w-full bg-gray-50">
            {/* CSS to hide scrollbar but allow scrolling */}
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}
            </style>

            <div className="max-w-7xl mx-auto p-4 md:p-6 h-full flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                    Instructor Applications
                </h2>
                
                {/* Main List Container - Scrollable without visual scrollbar */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
                    {apps.map(app => (
                        <div 
                            key={app._id} 
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-5 transition-all hover:shadow-md"
                        >
                            
                            {/* Section 1: User Profile */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 pr-0 lg:pr-4">
                                <img 
                                    src={app.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                    alt="applicant" 
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm mx-auto sm:mx-0" 
                                />
                                <div className="text-center sm:text-left flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 truncate">{app.name}</h3>
                                    <p className="text-gray-500 text-sm truncate">{app.email}</p>
                                    
                                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <Clock size={14} className="text-blue-500" />
                                            <span><strong>Exp:</strong> {app.experience}</span>
                                        </div>
                                        <div className="flex items-start justify-center sm:justify-start gap-2">
                                            <BookOpen size={14} className="text-purple-500 mt-0.5" />
                                            <span className="break-words line-clamp-2 text-left"><strong>Skills:</strong> {app.skills}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Why Hire & Demo (Takes remaining space) */}
                            <div className="flex-1 flex flex-col justify-between gap-3">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">About Applicant</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic leading-relaxed border border-gray-100">
                                        "{app.about}"
                                    </div>
                                </div>
                                
                                {app.demoVideo && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <a 
                                            href={app.demoVideo} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                                        >
                                            <Video size={14} /> Watch Demo Class
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Actions (Responsive Buttons) */}
                            <div className="flex lg:flex-col gap-3 justify-center pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-4 min-w-[140px]">
                                <button 
                                    onClick={() => handleApprove(app)} 
                                    className="flex-1 lg:flex-none bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 active:scale-95 flex items-center justify-center gap-2 shadow-sm transition font-medium text-sm"
                                >
                                    <Check size={16} /> <span className="hidden sm:inline lg:inline">Approve</span><span className="sm:hidden">Accept</span>
                                </button>
                                <button 
                                    onClick={() => handleReject(app._id)} 
                                    className="flex-1 lg:flex-none bg-white text-red-500 border border-red-200 px-4 py-2.5 rounded-lg hover:bg-red-50 active:scale-95 flex items-center justify-center gap-2 transition font-medium text-sm"
                                >
                                    <X size={16} /> Reject
                                </button>
                            </div>

                        </div>
                    ))}
                    
                    {apps.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <User size={40} className="opacity-30"/>
                            </div>
                            <p className="font-medium">No pending instructor requests</p>
                            <p className="text-sm">New applications will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorRequests;