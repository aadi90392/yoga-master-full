import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Trash2, Layers, Eye, X, Video } from 'lucide-react';

const ManageClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending'); 
    
    // --- MODAL STATE ---
    const [selectedClass, setSelectedClass] = useState(null); // Agar ye null nahi hai, to Modal dikhega

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

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/change-status/${id}`, { status: newStatus });
            
            // UI Update
            setClasses(prev => prev.map(cls => 
                cls._id === id ? { ...cls, status: newStatus } : cls
            ));

            // Agar Modal khula hai to band kar do
            setSelectedClass(null); 

            const msg = newStatus === 'approved' ? "Class Approved & Live!" : "Class Rejected.";
            toast.success(msg);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure? This will delete the class permanently.")) return;
        try {
            await api.delete(`/delete-class/${id}`);
            setClasses(prev => prev.filter(cls => cls._id !== id));
            toast.success("Class Deleted Permanently.");
        } catch (error) {
            toast.error("Failed to delete class.");
        }
    };

    const filteredClasses = classes.filter(cls => cls.status === activeTab);

    if (loading) return <div className="text-center py-20 font-bold text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="p-4 sm:p-8 relative">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Classes</h2>

            {/* --- TABS --- */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 
                    ${activeTab === 'pending' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Pending Requests ({classes.filter(c => c.status === 'pending').length})
                </button>

                <button 
                    onClick={() => setActiveTab('approved')}
                    className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 
                    ${activeTab === 'approved' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Approved Classes ({classes.filter(c => c.status === 'approved').length})
                </button>
            </div>

            {/* --- LIST --- */}
            <div className="grid grid-cols-1 gap-4">
                {filteredClasses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Layers className="mx-auto text-gray-300 mb-2" size={48} />
                        <p className="text-gray-500">No {activeTab} classes found.</p>
                    </div>
                ) : (
                    filteredClasses.map((cls) => (
                        <div key={cls._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition">
                            
                            <div className="flex gap-4 items-center">
                                <img src={cls.image} alt="" className="w-20 h-16 object-cover rounded-lg bg-gray-100" />
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{cls.name}</h3>
                                    <p className="text-sm text-gray-500">By {cls.instructorName} • {cls.instructorEmail}</p>
                                    <p className="text-xs text-gray-400 mt-1">Price: ${cls.price} | Seats: {cls.availableSeats}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                {/* IMPORTANT: View Details Button */}
                                <button 
                                    onClick={() => setSelectedClass(cls)}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition flex items-center justify-center gap-2"
                                >
                                    <Eye size={18} /> View & Verify
                                </button>

                                {activeTab === 'approved' && (
                                    <button 
                                        onClick={() => handleDelete(cls._id)}
                                        className="bg-white border border-gray-200 text-red-500 p-2 rounded-lg hover:bg-red-50 transition"
                                        title="Delete Class"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- VERIFICATION MODAL (The Main Feature) --- */}
            {selectedClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Video size={20} className="text-green-600"/> Review Class Content
                            </h3>
                            <button onClick={() => setSelectedClass(null)} className="text-gray-500 hover:text-red-500 transition">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto">
                            {/* 1. Video Player for Verification */}
                            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 relative group">
                                <video 
                                    src={selectedClass.videoLink} 
                                    controls 
                                    className="w-full h-full object-contain"
                                    poster={selectedClass.image}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {/* 2. Details */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Class Name</p>
                                    <p className="font-bold text-gray-800 text-lg">{selectedClass.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Instructor</p>
                                    <p className="font-bold text-gray-800">{selectedClass.instructorName}</p>
                                    <p className="text-sm text-gray-500">{selectedClass.instructorEmail}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Pricing</p>
                                    <p className="font-bold text-green-600 text-lg">${selectedClass.price}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Seats Available</p>
                                    <p className="font-bold text-gray-800">{selectedClass.availableSeats}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Description</p>
                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {selectedClass.description}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer (Actions) */}
                        {selectedClass.status === 'pending' && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end">
                                <button 
                                    onClick={() => handleStatusChange(selectedClass._id, 'denied')}
                                    className="px-6 py-2 rounded-lg font-bold text-red-600 hover:bg-red-100 border border-transparent hover:border-red-200 transition"
                                >
                                    Reject Request
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(selectedClass._id, 'approved')}
                                    className="px-6 py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-200 transition flex items-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve & Publish
                                </button>
                            </div>
                        )}
                        
                        {/* Agar already approved hai, to sirf Close button dikhao */}
                        {selectedClass.status === 'approved' && (
                             <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                                 <button 
                                    onClick={() => setSelectedClass(null)}
                                    className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                                >
                                    Close
                                </button>
                             </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageClasses;