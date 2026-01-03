import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photoUrl: '',
    gender: 'male',
    role: 'user',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/new-user', formData);
      
      // Case 1: Account Created Successfully
      if (res.data.insertedId) {
        toast.success("Account Created! Please Login now.");
        navigate('/login');
      } 
      // Case 2: Email Already Exists (Backend se message match kiya)
      else if (res.data.message === 'User already exists') {
        toast.warning("Email already registered! Please Login.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Signup Failed! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3fcf6] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-green-50">
        <div className="bg-green-600 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Join Yoga Master</h2>
          <p className="text-green-100">Create your account</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="Aditya" 
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="aditya@example.com" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {/* Photo URL Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Photo URL (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="photoUrl" 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder="https://..." 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="animate-spin" /> : <>Sign Up <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
             Already a member? <Link to="/login" className="text-green-600 font-bold hover:underline">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;