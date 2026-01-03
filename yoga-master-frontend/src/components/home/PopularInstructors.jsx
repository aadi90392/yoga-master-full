import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PopularInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                // Change: Ab hum directly instructors fetch kar rahe hain users table se
                const response = await api.get('/instructors'); 
                setInstructors(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInstructors();
    }, []);

    return (
        <div>
            {/* Show top 4 Instructors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {instructors.slice(0, 4).map((instructor, index) => (
                    <div key={instructor._id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                        <img 
                            src={instructor.photoUrl || `https://ui-avatars.com/api/?name=${instructor.name}&background=16a34a&color=fff`} 
                            alt={instructor.name} 
                            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-green-100" 
                        />
                        <h3 className="text-xl font-bold text-gray-800">
                            {instructor.name || "Unknown Instructor"}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">Yoga Expert</p>
                        
                        {/* Optional: Show stats if available */}
                        {/* <p className="text-green-600 font-medium text-xs">Verified Instructor</p> */}
                    </div>
                ))}
            </div>

            {/* View All Button - Sirf tab dikhega jab list badi ho */}
            <div className="mt-12 text-center">
                <Link to="/instructors" className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition shadow-lg">
                    View All Instructors <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default PopularInstructors;