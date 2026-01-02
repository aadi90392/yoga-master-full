import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, User, Calendar, Clock, PlayCircle } from 'lucide-react';

const ClassDetails = () => {
  const { id } = useParams(); 
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        // Backend se class ka data laao
        const res = await api.get(`/class/${id}`);
        // Backend array return karta hai, isliye pehla item lo
        setClassData(res.data[0]); 
      } catch (error) {
        console.error("Error fetching class details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassDetails();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-green-600 font-bold text-xl">Loading Class...</div>;
  if (!classData) return <div className="h-screen flex items-center justify-center text-red-500 font-bold text-xl">Class not found!</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-screen pb-10">
      
      {/* --- TOP BAR: BACK BUTTON --- */}
      <div className="pt-6 px-6 mb-4">
        <Link to="/dashboard/my-classes" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition font-medium bg-gray-50 px-4 py-2 rounded-full border border-gray-200 hover:bg-green-50">
             <ArrowLeft size={18} /> Back to My Classes
        </Link>
      </div>

      {/* --- VIDEO PLAYER SECTION --- */}
      <div className="mx-6">
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video border-4 border-gray-100 relative group">
            
            {/* DIRECT VIDEO PLAYER */}
            <video 
                src={classData.videoLink} 
                controls 
                controlsList="nodownload" // Video download button hata dega
                className="w-full h-full object-contain"
                poster={classData.image} // Video load hone se pehle image dikhegi
            >
                Your browser does not support the video tag.
            </video>

        </div>
      </div>

      {/* --- CLASS INFO SECTION --- */}
      <div className="px-8 mt-8 grid lg:grid-cols-3 gap-10">
        
        {/* Left Side: Title & Description */}
        <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{classData.name}</h1>
            
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold border border-green-100">
                    <User size={16} /> {classData.instructorName}
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-100">
                    <Clock size={16} /> Duration: Flexible
                </div>
                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold border border-purple-100">
                    <PlayCircle size={16} /> Online Session
                </div>
            </div>

            {/* Description Box */}
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="text-green-600" size={20}/> About this Class
                </h3>
                <div className="prose text-gray-600 leading-relaxed whitespace-pre-line">
                    {classData.description || "No description provided for this class."}
                </div>
            </div>
        </div>

        {/* Right Side: Instructor Card (Optional Extra Info) */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Instructor</h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                        {classData.instructorName?.charAt(0) || "I"}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{classData.instructorName}</p>
                        <p className="text-xs text-gray-500">{classData.instructorEmail}</p>
                    </div>
                </div>
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition shadow-lg">
                    Contact Instructor
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ClassDetails;