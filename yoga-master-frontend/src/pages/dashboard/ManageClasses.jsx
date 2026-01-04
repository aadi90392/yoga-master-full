import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { CheckCircle, AlertCircle, Trash2, Layers, Eye, X, Video, PlayCircle, Lock, Unlock } from 'lucide-react';

const ManageClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending'); 
    
    // --- MODAL STATE ---
    const [selectedClass, setSelectedClass] = useState(null); 
    const [activeVideo, setActiveVideo] = useState(null); // To switch between trailer/chapters inside modal

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

    // Open Modal Logic
    const handleViewDetails = (cls) => {
        setSelectedClass(cls);
        // Default video: Preview Video OR First Chapter OR Legacy videoLink
        setActiveVideo(cls.previewVideo || cls.chapters?.[0]?.video || cls.videoLink);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`/change-status/${id}`, { status: newStatus });
            
            // UI Update
            setClasses(prev => prev.map(cls => 
                cls._id === id ? { ...cls, status: newStatus } : cls
            ));

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
                                <button 
                                    onClick={() => handleViewDetails(cls)}
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

            {/* --- VERIFICATION MODAL --- */}
            {selectedClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Video size={20} className="text-green-600"/> Review: {selectedClass.name}
                            </h3>
                            <button onClick={() => setSelectedClass(null)} className="text-gray-500 hover:text-red-500 transition">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto grid lg:grid-cols-2 gap-8">
                            
                            {/* Left: Video Player */}
                            <div>
                                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 relative group shadow-lg">
                                    <video 
                                        key={activeVideo} // Reload on change
                                        src={activeVideo} 
                                        controls 
                                        className="w-full h-full object-contain"
                                        poster={selectedClass.image}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
                                    <strong>Instructor Note:</strong> {selectedClass.description}
                                </div>
                            </div>

                            {/* Right: Chapter List */}
                            <div>
                                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <Layers size={18}/> Course Curriculum
                                </h4>
                                
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Preview Video Option */}
                                    <div 
                                        onClick={() => setActiveVideo(selectedClass.previewVideo)}
                                        className={`p-3 rounded-lg border cursor-pointer transition flex items-center gap-3
                                            ${activeVideo === selectedClass.previewVideo ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <PlayCircle size={20} className="text-green-600"/>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Course Trailer</p>
                                            <p className="text-xs text-gray-500">Free Preview</p>
                                        </div>
                                    </div>

                                    {/* Chapters */}
                                    {selectedClass.chapters?.length > 0 ? (
                                        selectedClass.chapters.map((ch, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setActiveVideo(ch.video)}
                                                className={`p-3 rounded-lg border cursor-pointer transition flex items-center gap-3
                                                    ${activeVideo === ch.video ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                                                    {i+1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{ch.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        {ch.isFree ? 
                                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1"><Unlock size={10}/> Free</span> : 
                                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-1"><Lock size={10}/> Paid</span>
                                                        }
                                                    </div>
                                                </div>
                                                <PlayCircle size={18} className="text-gray-400 hover:text-green-600"/>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No chapters added (Single Video Course).</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        {selectedClass.status === 'pending' ? (
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end">
                                <button 
                                    onClick={() => handleStatusChange(selectedClass._id, 'denied')}
                                    className="px-6 py-2 rounded-lg font-bold text-red-600 hover:bg-red-100 border border-transparent hover:border-red-200 transition"
                                >
                                    Reject
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(selectedClass._id, 'approved')}
                                    className="px-6 py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-200 transition flex items-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve & Publish
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button onClick={() => setSelectedClass(null)} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition">Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageClasses;