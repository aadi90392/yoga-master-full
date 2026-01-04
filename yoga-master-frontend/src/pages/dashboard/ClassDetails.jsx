import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, PlayCircle, Lock, CheckCircle, Video, ShoppingCart } from 'lucide-react';

const ClassDetails = () => {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const [classData, setClassData] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null); // Jo video player me chalega
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Class Data Fetch karo
                const resClass = await api.get(`/class/${id}`);
                const cls = resClass.data[0];
                setClassData(cls);
                
                // --- LOGIC FIX HERE ---
                // Priority 1: Instructor ka uploaded Trailer (Preview Video)
                // Priority 2: Pehla Chapter ka video
                // Priority 3: Purana videoLink field (Backward compatibility)
                const defaultVideo = cls.previewVideo || cls.chapters?.[0]?.video || cls.videoLink;
                setActiveVideo(defaultVideo); 

                // 2. Check Purchase Status (Agar user logged in hai)
                if (user?.email) {
                    const resEnrolled = await api.get(`/enrolled-classes/${user.email}`);
                    // Check karo agar ye class ID enrolled list me hai
                    const enrolledIds = resEnrolled.data.map(item => item.classes._id);
                    if (enrolledIds.includes(id)) {
                        setIsPurchased(true);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user?.email]);

    // Handle Chapter Click
    const handleChapterClick = (chapter, index) => {
        // Unlock Logic: 
        // 1. Agar course khareeda hua hai -> Sab unlocked
        // 2. Agar chapter "Free" mark hai -> Unlocked
        // 3. Agar user Admin ya Instructor hai -> Unlocked
        const isUnlocked = isPurchased || chapter.isFree || user?.role === 'admin' || user?.email === classData.instructorEmail;

        if (isUnlocked) {
            setActiveVideo(chapter.video);
        } else {
            alert("🔒 This chapter is locked! Please purchase the full course to access.");
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-green-600">Loading Course Details...</div>;
    if (!classData) return <div className="text-center py-20 font-bold text-red-500">Class not found!</div>;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
            
            {/* Back Button */}
            <Link to={isPurchased ? "/dashboard/my-classes" : "/classes"} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-green-600 transition font-medium">
                <ArrowLeft size={20}/> {isPurchased ? "Back to Dashboard" : "Back to All Classes"}
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* --- LEFT SIDE: VIDEO PLAYER & DESCRIPTION --- */}
                <div className="lg:col-span-2">
                    {/* Video Player */}
                    <div className="bg-black aspect-video rounded-2xl overflow-hidden shadow-2xl relative border-4 border-white">
                        {activeVideo ? (
                            <video 
                                key={activeVideo} // Important: URL change hone par player reload karega
                                src={activeVideo} 
                                controls 
                                controlsList="nodownload" // Download button disable
                                className="w-full h-full object-contain"
                                autoPlay // Auto play when switched
                                poster={classData.image} // Thumbnail
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="flex items-center justify-center h-full text-white">
                                <p>No video available for preview.</p>
                            </div>
                        )}
                    </div>

                    {/* Class Info */}
                    <div className="mt-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{classData.name}</h1>
                        
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                                {isPurchased ? "Enrolled" : `$${classData.price}`}
                            </span>
                            <span>Instructor: <b>{classData.instructorName}</b></span>
                            <span>• {classData.totalEnrolled || 0} Students</span>
                        </div>

                        <div className="mt-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-3 text-lg">About this Class</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {classData.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: COURSE CONTENT (CHAPTERS) --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
                        
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800">Course Content</h3>
                                <p className="text-xs text-gray-500 mt-1">{classData.chapters?.length || 0} Lessons</p>
                            </div>
                        </div>

                        {/* List of Chapters */}
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            {/* Option 1: Main Trailer (Always Free) */}
                            {classData.previewVideo && (
                                <div 
                                    onClick={() => setActiveVideo(classData.previewVideo)}
                                    className={`p-4 border-b border-gray-50 flex items-center gap-4 transition cursor-pointer
                                        ${activeVideo === classData.previewVideo ? 'bg-green-50 border-l-4 border-l-green-600' : 'hover:bg-gray-50'}
                                    `}
                                >
                                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                                        <PlayCircle size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800">Course Trailer</h4>
                                        <p className="text-xs text-green-600 font-semibold">Free Preview</p>
                                    </div>
                                </div>
                            )}

                            {/* Chapters Loop */}
                            {classData.chapters?.map((chapter, index) => {
                                // Lock Logic
                                const isUnlocked = isPurchased || chapter.isFree || user?.role === 'admin' || user?.email === classData.instructorEmail;

                                return (
                                    <div 
                                        key={index} 
                                        onClick={() => handleChapterClick(chapter, index)}
                                        className={`p-4 border-b border-gray-50 flex items-center gap-4 transition cursor-pointer group
                                            ${activeVideo === chapter.video ? 'bg-green-50 border-l-4 border-l-green-600' : 'hover:bg-gray-50'}
                                            ${!isUnlocked ? 'opacity-70' : ''}
                                        `}
                                    >
                                        <div className="flex-shrink-0">
                                            {isUnlocked ? (
                                                <div className="bg-gray-100 p-2 rounded-full text-gray-600 group-hover:bg-green-100 group-hover:text-green-600 transition">
                                                    <PlayCircle size={20} />
                                                </div>
                                            ) : (
                                                <div className="bg-red-50 p-2 rounded-full text-red-400">
                                                    <Lock size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{index + 1}. {chapter.title}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{chapter.description || "No description"}</p>
                                        </div>
                                        
                                        {/* Status Badge */}
                                        <div className="text-xs">
                                            {isUnlocked && !isPurchased && chapter.isFree && (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Free</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                            {(!classData.chapters || classData.chapters.length === 0) && (
                                <div className="p-6 text-center text-gray-400 text-sm italic">
                                    No chapters added yet.
                                </div>
                            )}
                        </div>

                        {/* Buy Button (Footer) */}
                        {!isPurchased && user?.role === 'user' && (
                            <div className="p-5 border-t border-gray-100 bg-white">
                                <div className="text-center mb-3">
                                    <p className="text-xs text-gray-500">Unlock full access to all chapters</p>
                                </div>
                                <Link 
                                    to="/cart" 
                                    state={{ cart: [classData], price: classData.price }} // Direct buy logic support if needed
                                    className="block w-full bg-gray-900 text-white text-center py-3.5 rounded-xl font-bold hover:bg-green-600 transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={18} /> Buy Course for ${classData.price}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClassDetails;