import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios'; // Humara naya api file use karenge
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Backend me save ho raha hai
    photoUrl: '', 
    gender: 'male',
    role: 'user', // Default role
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend: app.post('/new-user')
      const res = await api.post('/new-user', formData);
      
      if (res.data.insertedId) {
        toast.success("Account Created! Please Login now.");
        navigate('/login'); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Signup Failed! Email might be used.");
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
            
            {/* Inputs */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input type="text" name="name" required onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Aditya" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input type="email" name="email" required onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="aditya@example.com" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input type="password" name="password" required onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="••••••••" />
            </div>

             <div>
              <label className="block text-gray-700 font-medium mb-1">Photo URL</label>
              <input type="text" name="photoUrl" onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://..." />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex justify-center items-center gap-2">
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