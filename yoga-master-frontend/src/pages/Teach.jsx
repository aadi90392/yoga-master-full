import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Briefcase, Video, User, CheckCircle, Loader, Info } from 'lucide-react';

const Teach = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [existingApp, setExistingApp] = useState(null); // Status store karne ke liye

    // Check if already applied
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await api.get(`/applied-instructors/${user?.email}`);
                if (res.data) {
                    setExistingApp(res.data); // Agar data mila, to status set karo
                }
            } catch (error) {
                console.error("Error checking status", error);
            }
        };
        if(user?.email) checkStatus();
    }, [user?.email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData(e.target);
        const data = {
            name: user?.name,
            email: user?.email,
            photoUrl: user?.photoUrl,
            experience: formData.get('experience'),
            skills: formData.get('skills'),
            about: formData.get('about'),
            demoVideo: formData.get('demoVideo'), 
            status: 'pending'
        };

        try {
            const res = await api.post('/as-instructor', data);
            
            if (res.data.message === "Already applied") {
                toast.warning("Application already under review.");
                setExistingApp(data); // Screen update kar do
            } else {
                toast.success("Application Submitted! Admin will review it.");
                setExistingApp(data); // Form hata ke status dikhao
            }
        } catch (error) {
            toast.error("Server error.");
        } finally {
            setLoading(false);
        }
    };

    // --- CONDITION: AGAR APPLY KIYA HAI TO YE DIKHAO ---
    if (existingApp) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f3fcf6] px-4">
                <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center border border-green-100">
                    <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Info size={40} className="text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Pending</h2>
                    <p className="text-gray-500 mb-6">
                        Hey {user?.name}, your request to become an instructor is currently under review by our Admin team.
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-left text-sm space-y-2 mb-6">
                        <p><span className="font-bold text-gray-700">Email:</span> {existingApp.email}</p>
                        <p><span className="font-bold text-gray-700">Status:</span> <span className="text-yellow-600 font-bold uppercase">{existingApp.status || "Pending"}</span></p>
                        <p className="text-xs text-gray-400 mt-2">*Review usually takes 24-48 hours.</p>
                    </div>

                    <button onClick={() => navigate('/')} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // --- NORMAL FORM VIEW ---
    return (
        <div className="pt-24 pb-12 bg-gray-50 min-h-screen px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                
                {/* Left Side: Pitch */}
                <div className="bg-stone-900 text-white p-10 flex flex-col justify-center">
                    <h2 className="text-4xl font-serif mb-6">Become an Instructor</h2>
                    <p className="text-stone-400 mb-8">Join the world's fastest-growing yoga platform. Teach what you love and earn passive income.</p>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3"><CheckCircle className="text-green-500" /> Earn 80% per sale</li>
                        <li className="flex items-center gap-3"><CheckCircle className="text-green-500" /> Reach Global Audience</li>
                        <li className="flex items-center gap-3"><CheckCircle className="text-green-500" /> 24/7 Support</li>
                    </ul>
                </div>

                {/* Right Side: Form */}
                <div className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Inputs... (Same as before) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Experience (Years)</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="text" name="experience" required className="w-full pl-10 p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 5 Years" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Skills / Certification</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="text" name="skills" required className="w-full pl-10 p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. RYT 200" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Demo Video Link</label>
                            <div className="relative">
                                <Video className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="url" name="demoVideo" required className="w-full pl-10 p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Why should we hire you?</label>
                            <textarea name="about" required rows="3" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                        </div>

                        <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2">
                            {loading ? <Loader className="animate-spin" /> : "Submit Application"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Teach;