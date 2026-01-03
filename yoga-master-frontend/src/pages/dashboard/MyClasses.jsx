import React from 'react';
import api from '../../api/axios'; 
import { PlayCircle, Loader, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 

const MyClasses = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // --- React Query Hook ---
  const { data: classes = [], isLoading, isError, error } = useQuery({
    queryKey: ['enrolledClasses', user?.email], 
    queryFn: async () => {
        const res = await api.get(`/enrolled-classes/${user?.email}`);
        return res.data;
    },
    enabled: !!user?.email, 
  });

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-green-600">
          <Loader className="animate-spin mb-4" size={40} /> 
          <p className="font-medium animate-pulse">Loading your journey...</p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError) {
    console.error(error);
    return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
            <div className="text-center bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-md w-full">
                <p className="font-bold mb-2">Oops!</p>
                <p>Failed to load classes. Please try again later.</p>
            </div>
        </div>
    );
  }

  return (
    // 1. Dynamic Padding: p-4 for mobile, sm:p-8 for desktop
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50/50">
      
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        {/* 2. Responsive Text: text-2xl for mobile, text-3xl for desktop */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Enrolled Classes</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back! Continue your learning.</p>
      </div>

      {classes.length === 0 ? (
        // --- EMPTY STATE ---
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm text-center border border-gray-100 max-w-lg mx-auto mt-10">
            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png" alt="Empty" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 opacity-60 grayscale"/>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Classes Yet</h3>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">You haven't enrolled in any yoga classes yet. Start your journey today!</p>
            <Link to="/classes" className="inline-block w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 hover:shadow-lg transition transform active:scale-95">
                Browse Classes
            </Link>
        </div>
      ) : (
        // --- LIST OF CLASSES ---
        // 3. Responsive Grid: 1 col (mobile) -> 2 cols (tablet) -> 3 cols (desktop)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {classes.map((item, index) => (
                <div key={item._id || index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                    
                    {/* Image Section */}
                    {/* 4. aspect-video: Ensures image is always 16:9 ratio, never stretched */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img 
                            src={item.classes?.image || "https://via.placeholder.com/400x300?text=No+Image"} 
                            alt={item.classes?.name || "Class"} 
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
                        
                        {/* Play Button Overlay */}
                        <Link to={`/dashboard/class/${item.classes?._id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-[2px]">
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/50">
                                <PlayCircle size={40} className="text-white fill-green-600" />
                            </div>
                        </Link>

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                             <span className="bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-green-100">
                                Enrolled
                             </span>
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-green-600 transition">
                            {item.classes?.name || "Unknown Class"}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <User size={16} className="text-green-500" />
                            <span className="truncate">Instructor: {item.instructor?.name || "Yoga Master"}</span>
                        </div>
                        
                        {/* Spacer to push button to bottom */}
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                             <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                <Calendar size={14} />
                                <span>Lifetime Access</span>
                             </div>

                             <Link 
                                to={`/dashboard/class/${item.classes?._id}`} 
                                className="text-white bg-gray-900 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                             >
                                <PlayCircle size={16} /> Resume
                             </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyClasses;