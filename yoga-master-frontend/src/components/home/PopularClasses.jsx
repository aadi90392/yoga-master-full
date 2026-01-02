import React from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Import React Query

const PopularClasses = () => {
    
    // --- USE QUERY (Caching + Background Fetch) ---
    const { data: classes = [], isLoading } = useQuery({
        queryKey: ['popularClasses'], // Unique Key
        queryFn: async () => {
            const response = await api.get('/popular_classes');
            return response.data;
        },
        staleTime: 1000 * 60 * 10, // 10 Minute tak data fresh rahega (Dobara fetch nahi karega)
    });

    if (isLoading) {
        return <div className="text-center py-10">Loading popular classes...</div>;
    }

    return (
        <div className="my-16 px-4 md:px-12 max-w-screen-xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900">Our Popular Classes</h2>
                <p className="text-gray-500 mt-2">Explore our top-rated yoga sessions loved by students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((item) => (
                    <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                        <div className="relative h-56">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg font-bold">
                                ${item.price}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                            
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
                                <span>👨‍🏫 {item.instructorName}</span>
                                <span>👥 {item.totalEnrolled} Students</span>
                            </div>

                            <Link 
                                to={`/classes`} 
                                className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularClasses;