import React, { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { User, Users, ShoppingCart, Loader, PlayCircle, X, Clock, BarChart, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Classes = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  const [enrollingId, setEnrollingId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // --- DYNAMIC VIDEO LOGIC ---
  // Agar database me video nahi hai, to inme se ek randomly pick hoga (Based on Class ID)
  const sampleVideos = [
    "https://www.youtube.com/embed/v7AYKMP6rOE", // Yoga for Beginners
    "https://www.youtube.com/embed/sTANio_2E0Q", // Yoga for Anxiety
    "https://www.youtube.com/embed/hJbRpHZr_d0", // 15 Min Morning Yoga
    "https://www.youtube.com/embed/0XBcrKbdV9Q", // Full Body Stretch
    "https://www.youtube.com/embed/inpok4MKVLM", // Meditation Guide
    "https://www.youtube.com/embed/Co9c578G5vI"  // Power Yoga
  ];

  // Ye function Class ID ke basis par hamesha same video dega us class ke liye
  const getClassVideo = (id) => {
    if (!id) return sampleVideos[0];
    // ID ke characters ka sum nikal ke modulus nikalenge taaki video fix rahe
    let charCodeSum = 0;
    for (let i = 0; i < id.length; i++) {
        charCodeSum += id.charCodeAt(i);
    }
    const index = charCodeSum % sampleVideos.length;
    return `${sampleVideos[index]}?autoplay=1&mute=0&controls=1&rel=0`;
  };

  // --- FETCH DATA ---
  const { data: classes = [], isLoading, isError } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

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
            setSelectedClass(null);
        } else {
            toast.info("Already in cart.");
        }
    } catch (error) {
        toast.error("Error adding to cart.");
    } finally {
        setEnrollingId(null);
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
            <p className="text-gray-500 mt-2">Click on any class to watch a preview & learn more.</p>
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

        {/* --- CLASS DETAILS MODAL (DYNAMIC VIDEO) --- */}
        {selectedClass && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all animate-fade-in" onClick={() => setSelectedClass(null)}>
                <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Close Button */}
                    <button onClick={() => setSelectedClass(null)} className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition">
                        <X size={24} />
                    </button>

                    {/* Left: Video Player */}
                    <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center h-64 md:h-auto group">
                        <iframe 
                            className="w-full h-full object-cover"
                            // YAHAN LOGIC CHANGE KIYA HAI: Dynamic Video based on ID
                            src={getClassVideo(selectedClass._id)}
                            title="Class Preview" 
                            allow="autoplay; encrypted-media" 
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Right: Details Section */}
                    <div className="w-full md:w-2/5 p-8 flex flex-col overflow-y-auto bg-white relative">
                        <div className="mb-6">
                            <span className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2 block">Class Overview</span>
                            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">{selectedClass.name}</h2>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-6">
                            <div className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-gray-100">
                                <User size={14}/> {selectedClass.instructorName}
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-gray-100">
                                <Clock size={14}/> 60 Mins
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-gray-100">
                                <BarChart size={14}/> All Levels
                            </div>
                        </div>

                        <div className="space-y-6 mb-8 flex-1">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Description</h4>
                                <p className="text-gray-500 leading-relaxed text-sm">{selectedClass.description || "Experience a transformative session designed to align your body and mind. Suitable for all practitioners."}</p>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <h4 className="font-bold text-green-800 mb-2 text-sm">Instructor's Note</h4>
                                <p className="text-green-700 text-xs italic">"Bring your mat, a bottle of water, and an open heart. See you on the mat!"</p>
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Total Price</p>
                                <div className="text-3xl font-extrabold text-gray-900">${selectedClass.price}</div>
                            </div>
                            <button 
                                onClick={(e) => handleSelect(selectedClass, e)}
                                disabled={parseInt(selectedClass.availableSeats) === 0 || enrollingId === selectedClass._id}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                            >
                                {enrollingId === selectedClass._id ? <Loader className="animate-spin"/> : <ShoppingCart size={20} />}
                                {parseInt(selectedClass.availableSeats) === 0 ? 'Sold Out' : 'Enroll Now'}
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