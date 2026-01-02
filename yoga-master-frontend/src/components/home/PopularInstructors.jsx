import React from 'react';
import api from '../../api/axios';
import { useQuery } from '@tanstack/react-query'; // Import React Query

const PopularInstructors = () => {
    
    // --- USE QUERY ---
    const { data: instructors = [], isLoading } = useQuery({
        queryKey: ['popularInstructors'],
        queryFn: async () => {
            const response = await api.get('/popular-instructors');
            return response.data;
        },
        staleTime: 1000 * 60 * 10, // 10 Minute tak cache rahega
    });

    if (isLoading) {
        return <div className="text-center py-10">Loading top instructors...</div>;
    }

    return (
        <div className="my-16 px-4 md:px-12 max-w-screen-xl mx-auto bg-gray-50 py-16 rounded-3xl">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900">Meet Our Instructors</h2>
                <p className="text-gray-500 mt-2">Learn from the best yoga masters in the world.</p>
            </div>

            {/* Check if instructors data exists */}
            {instructors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {instructors.map((item, index) => (
                        <div key={item.instructor?._id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                            <img 
                                src={item.instructor?.photoUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                                alt={item.instructor?.name || "Instructor"} 
                                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-green-100" 
                            />
                            <h3 className="text-xl font-bold text-gray-800">
                                {item.instructor?.name || "Unknown Instructor"}
                            </h3>
                            <p className="text-green-600 font-medium text-sm mb-2">
                                {item.instructor?.email || "No Email Available"}
                            </p>
                            <p className="text-gray-500 text-xs">Total Students: {item.totalEnrolled}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No popular instructors found yet.</p>
            )}
        </div>
    );
};

export default PopularInstructors;