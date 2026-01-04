import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { User, Users, ShoppingCart, Loader, PlayCircle, X, Clock, BarChart, CheckCircle, Lock, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Classes = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    const [enrollingId, setEnrollingId] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null); // Modal video state

    // --- FETCH DATA ---
    const { data: classes = [], isLoading, isError } = useQuery({
        queryKey: ['classes'],
        queryFn: async () => {
            const res = await api.get('/classes');
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    // Modal open hone par default video set karo
    useEffect(() => {
        if (selectedClass) {
            // Priority: Preview Video -> 1st Free Chapter -> Old Video Link
            const trailer = selectedClass.previewVideo || selectedClass.chapters?.find(c => c.isFree)?.video || selectedClass.videoLink;
            setActiveVideo(trailer);
        }
    }, [selectedClass]);

    // Handle Add to Cart
    const handleSelect = async (cls, e) => {
        if(e) e.stopPropagation();

        if (!token) {
            toast.warning("Please login to select a class.");
            return navigate('/login');
        }
        if (user?.role === 'admin' || user?.role === 'instructor') {
            return toast.error("Admin and Instructors cannot buy classes.");
        }
        if (parseInt(cls.availableSeats) < 1) {
            return toast.error("Sorry, this class is full.");
        }

        setEnrollingId(cls._id);

        const cartItem = {
            classId: cls._id,
            name: cls.name,
            image: cls.image,
            price: cls.price,
            userMail: user.email, 
            instructorName: cls.instructorName
        };

        try {
            const res = await api.post('/add-to-cart', cartItem);
            if (res.data.insertedId) {
                toast.success("Added to cart!");
                setSelectedClass(null); // Close modal on add
            } else {
                toast.info("Already in cart.");
            }
        } catch (error) {
            toast.error("Error adding to cart.");
        } finally {
            setEnrollingId(null);
        }
    };

    // Handle Chapter Click inside Modal
    const handleChapterClick = (chapter) => {
        if (chapter.isFree) {
            setActiveVideo(chapter.video);
        } else {
            toast.info("🔒 Purchase full course to unlock this chapter!");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex flex-col justify-center items-center text-green-600">
            <Loader className="animate-spin mb-4" size={40} />
            <p className="font-bold text-xl">Loading Classes...</p>
        </div>
    );

    if (isError) return <div className="min-h-screen flex justify-center items-center text-red-500">Failed to load classes.</div>;

    return (
        <div className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto min-h-screen bg-gray-50">
            
            {/* HEADER */}
            <div className="text-center mb-12">
                <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Our Curriculum</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Explore Classes</h2>
                <p className="text-gray-500 mt-2">Click on any class to watch a free preview & curriculum.</p>
            </div>

            {/* CLASS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((item) => (
                    <div 
                        key={item._id} 
                        onClick={() => setSelectedClass(item)}
                        className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 flex flex-col cursor-pointer group
                        ${item.availableSeats === 0 ? 'opacity-75 grayscale' : 'hover:shadow-2xl hover:-translate-y-2'}`}
                    >
                        {/* Image Area */}
                        <div className="relative h-64 overflow-hidden">
                            <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                            
                            {/* Play Icon Overlay */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                    <PlayCircle size={40} className="text-white" fill="currentColor"/>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full font-bold shadow-sm text-sm">
                                ${item.price}
                            </div>
                            {item.availableSeats < 5 && item.availableSeats > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs animate-pulse">
                                    Only {item.availableSeats} left!
                                </div>
                            )}
                        </div>
                        
                        {/* Content Area */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">{item.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description || "Join this amazing yoga session to rejuvenate your mind and body."}</p>
                            
                            <div className="mt-auto pt-4 border-t border-gray-50 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User size={12} className="text-gray-600"/>
                                    </div>
                                    <span className="font-semibold">{item.instructorName}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-green-600"/>
                                        <span>Available: <span className="font-bold text-gray-900">{item.availableSeats}</span></span>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold">{item.totalEnrolled} Enrolled</span>
                                </div>
                            </div>

                            {/* Quick Add Button */}
                            <button 
                                onClick={(e) => handleSelect(item, e)}
                                disabled={parseInt(item.availableSeats) === 0 || user?.role === 'admin' || user?.role === 'instructor' || enrollingId === item._id}
                                className={`mt-6 block w-full py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm
                                    ${parseInt(item.availableSeats) === 0 
                                        ? 'bg-red-50 text-red-500 cursor-not-allowed' 
                                        : (user?.role === 'admin' || user?.role === 'instructor') 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-900 text-white hover:bg-green-600 shadow-lg hover:shadow-green-200'}`}
                            >
                                {enrollingId === item._id ? (
                                    <><Loader className="animate-spin" size={18} /> Adding...</>
                                ) : parseInt(item.availableSeats) === 0 ? (
                                    'Class Full' 
                                ) : (
                                    <><ShoppingCart size={18} /> Add to Cart</>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- NEW PREVIEW MODAL --- */}
            {selectedClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all animate-fade-in" onClick={() => setSelectedClass(null)}>
                    <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Close Button */}
                        <button onClick={() => setSelectedClass(null)} className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition">
                            <X size={24} />
                        </button>

                        {/* LEFT: Video Player (Native Video Tag) */}
                        <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center h-64 md:h-auto group">
                            {activeVideo ? (
                                <video 
                                    key={activeVideo} // Reload on change
                                    src={activeVideo} 
                                    controls 
                                    className="w-full h-full object-contain"
                                    controlsList="nodownload"
                                    autoPlay
                                    poster={selectedClass.image}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="text-white text-center">
                                    <Video size={48} className="mx-auto mb-2 opacity-50"/>
                                    <p>No preview video available</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Course Curriculum */}
                        <div className="w-full md:w-2/5 p-8 flex flex-col overflow-y-auto bg-white relative">
                            <div className="mb-4">
                                <span className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block">Course Overview</span>
                                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{selectedClass.name}</h2>
                                <p className="text-gray-500 text-sm mt-2">{selectedClass.description}</p>
                            </div>
                            
                            {/* Stats */}
                            <div className="flex gap-2 mb-6 text-xs font-bold uppercase tracking-wider text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{selectedClass.chapters?.length || 0} Lessons</span>
                                <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">All Levels</span>
                            </div>

                            {/* CHAPTER LIST */}
                            <div className="flex-1 space-y-3 mb-6">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm border-b pb-2">
                                    <CheckCircle size={16} className="text-green-600"/> Curriculum
                                </h4>
                                
                                <div className="space-y-2">
                                    {/* Trailer */}
                                    {selectedClass.previewVideo && (
                                        <div 
                                            onClick={() => setActiveVideo(selectedClass.previewVideo)}
                                            className={`p-3 rounded-lg border cursor-pointer transition flex items-center gap-3
                                                ${activeVideo === selectedClass.previewVideo ? 'bg-green-50 border-green-500' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                                        >
                                            <div className="bg-green-100 p-1.5 rounded-full text-green-600"><PlayCircle size={16}/></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800">Course Trailer</p>
                                                <p className="text-[10px] text-green-600 font-bold uppercase">Free Preview</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Chapters */}
                                    {selectedClass.chapters?.map((ch, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => handleChapterClick(ch)}
                                            className={`p-3 rounded-lg border cursor-pointer transition flex items-center gap-3
                                                ${activeVideo === ch.video ? 'bg-green-50 border-green-500' : 'bg-white border-gray-100 hover:bg-gray-50'}
                                                ${!ch.isFree ? 'opacity-70' : ''}`}
                                        >
                                            <div className={`p-1.5 rounded-full ${ch.isFree ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
                                                {ch.isFree ? <PlayCircle size={16}/> : <Lock size={16}/>}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800 line-clamp-1">{ch.title}</p>
                                                <p className="text-[10px] text-gray-400">Lesson {i + 1}</p>
                                            </div>
                                            {ch.isFree && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">Free</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Action */}
                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 text-xs font-bold uppercase">Total Price</span>
                                    <span className="text-3xl font-extrabold text-gray-900">${selectedClass.price}</span>
                                </div>
                                <button 
                                    onClick={(e) => handleSelect(selectedClass, e)}
                                    className="w-full bg-gray-900 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <ShoppingCart size={18} /> Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Classes;