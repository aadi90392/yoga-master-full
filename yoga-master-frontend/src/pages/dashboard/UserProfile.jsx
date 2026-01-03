import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Save, Loader, Camera } from 'lucide-react';

const UserProfile = () => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    const [submitting, setSubmitting] = useState(false);

    // 1. Backend se latest data fetch karo
    const { data: userData, refetch, isLoading } = useQuery({
        queryKey: ['userProfile', localUser?.email],
        queryFn: async () => {
            const res = await api.get(`/user/${localUser?.email}`);
            return res.data;
        },
        enabled: !!localUser?.email
    });

    // 2. Form state (Initially empty)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        photoUrl: '',
        about: ''
    });

    // 3. JAISE HI DATA AAYE, FORM BHAR DO (Crucial Fix)
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                address: userData.address || '',
                photoUrl: userData.photoUrl || '',
                about: userData.about || ''
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Safety Check: Agar ID nahi mili toh request mat bhejo
        if (!userData?._id) {
            return toast.error("User ID not found. Please refresh.");
        }

        setSubmitting(true);
        try {
            // Backend PUT request: /update-user/:id
            const res = await api.put(`/update-user/${userData._id}`, formData);
            
            if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
                toast.success("Profile Updated Successfully!");
                
                // LocalStorage update karo (Navbar aur Sidebar ke liye)
                const updatedUser = { ...userData, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Latest data fetch karo
                refetch();
            } else {
                toast.info("No changes were made.");
            }
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Failed to update profile. Check backend logs.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-green-600 font-bold">Loading Profile...</div>;

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-500 mb-8">Manage your account settings and preferences.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-green-400 to-green-600"></div>

                <div className="px-4 sm:px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-100">
                            <img 
                                src={formData.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email (Read Only)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="email" value={userData?.email} disabled 
                                    className="w-full pl-10 p-3 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Profile Photo URL</label>
                            <div className="relative">
                                <Camera className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="text" name="address" value={formData.address} onChange={handleChange}
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <button type="submit" disabled={submitting}
                                className="w-full sm:w-auto bg-gray-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg">
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