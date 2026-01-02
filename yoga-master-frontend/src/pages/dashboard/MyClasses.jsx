import React from 'react';
import api from '../../api/axios'; 
import { PlayCircle, Loader } from 'lucide-react';
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
    enabled: !!user?.email, // Sirf tab chalega jab email hoga
  });

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-green-600">
          <Loader className="animate-spin mr-2" /> Loading your journey...
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError) {
    console.error(error);
    return <div className="text-center py-20 text-red-500">Failed to load classes. Please try again.</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Enrolled Classes</h1>
        <p className="text-gray-500 mt-1">Welcome back! Continue your learning.</p>
      </div>

      {classes.length === 0 ? (
        // --- EMPTY STATE ---
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png" alt="Empty" className="w-32 h-32 mx-auto mb-4 opacity-50"/>
            <h3 className="text-xl font-bold text-gray-800">No Classes Yet</h3>
            <p className="text-gray-500 mb-6">You haven't enrolled in any yoga classes yet.</p>
            <Link to="/classes" className="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700">
                Browse Classes
            </Link>
        </div>
      ) : (
        // --- LIST OF CLASSES ---
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {classes.map((item, index) => (
                <div key={item._id || index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                    
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                        <img 
                            src={item.classes?.image || "https://via.placeholder.com/400x300?text=No+Image"} 
                            alt={item.classes?.name || "Class"} 
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                        
                        {/* Play Button Overlay */}
                        <Link to={`/dashboard/class/${item.classes?._id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                            <PlayCircle size={48} className="text-white drop-shadow-lg" fill="rgba(0,0,0,0.5)" />
                        </Link>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                            {item.classes?.name || "Unknown Class"}
                        </h3>
                        
                        <p className="text-sm text-gray-500 mb-4">
                            Instructor: {item.instructor?.name || "Yoga Master"}
                        </p>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                             <Link 
                                to={`/dashboard/class/${item.classes?._id}`} 
                                className="text-green-600 font-bold text-sm hover:underline flex items-center gap-1"
                             >
                                <PlayCircle size={16} /> Continue
                             </Link>
                             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                Active
                             </span>
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