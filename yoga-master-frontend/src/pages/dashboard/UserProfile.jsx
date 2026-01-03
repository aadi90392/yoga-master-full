import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Save, Loader, Camera } from 'lucide-react';

const UserProfile = () => {
    // LocalStorage se initial user info lo
    const localUser = JSON.parse(localStorage.getItem('user'));
    const [submitting, setSubmitting] = useState(false);

    // 1. Fetch Latest User Data from DB (Taaki purana data na dikhe)
    const { data: userData, refetch } = useQuery({
        queryKey: ['userProfile', localUser?.email],
        queryFn: async () => {
            const res = await api.get(`/user/${localUser?.email}`);
            return res.data;
        },
        initialData: localUser // Jab tak load ho raha hai, local data dikhao
    });

    const [formData, setFormData] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        address: userData?.address || '',
        photoUrl: userData?.photoUrl || '',
    });

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Submit Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await api.put(`/update-user/${userData._id}`, formData);
            
            if (res.data.modifiedCount > 0) {
                toast.success("Profile Updated Successfully!");
                
                // Important: LocalStorage update karo taaki Navbar me photo change ho jaye
                const updatedUser = { ...userData, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Data refetch karo
                refetch();
                
                // Optional: Page reload taaki Navbar update ho jaye (Simple hack)
                window.location.reload(); 
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-500 mb-8">Manage your account settings and preferences.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-green-400 to-green-600"></div>

                <div className="px-8 pb-8">
                    {/* Profile Image Avatar */}
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-100">
                            <img 
                                src={formData.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                                />
                            </div>
                        </div>

                        {/* Email (Read Only) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="email" 
                                    value={userData?.email} 
                                    disabled 
                                    className="w-full pl-10 p-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                        </div>

                        {/* Photo URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Profile Photo URL</label>
                            <div className="relative">
                                <Camera className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    name="photoUrl" 
                                    value={formData.photoUrl} 
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange}
                                    placeholder="Indore, MP"
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 mt-4">
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center gap-2 shadow-lg"
                            >
                                {submitting ? <Loader className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;