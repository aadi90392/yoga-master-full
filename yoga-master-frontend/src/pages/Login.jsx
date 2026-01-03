import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import api from '../api/axios'; 
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/login', { email, password });
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Login Failed! Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. calc(100vh - 80px): Adjusts height so it doesn't fight with your Navbar (assuming navbar is ~80px)
    // 2. p-4: Reduced outer padding for small screens
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center bg-[#f3fcf6] p-4 sm:p-6">
      
      {/* 3. w-full: Ensures it uses available width. mx-auto: Centers it perfectly */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-green-50 flex flex-col mx-auto">
        
        {/* Header Section */}
        {/* 4. py-6 px-5: Reduced padding inside the card for mobile so text doesn't wrap weirdly */}
        <div className="bg-green-600 py-6 px-5 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Welcome Back</h2>
          <p className="text-green-100 text-sm sm:text-base">Login to your account</p>
        </div>

        {/* Form Section */}
        <div className="p-5 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            
            <div>
              <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" /> {/* Slightly smaller icon for mobile */}
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1.5 text-sm sm:text-base">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-green-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base">
              {loading ? <Loader className="animate-spin" size={20} /> : <>Log In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account? <Link to="/signup" className="text-green-600 font-bold hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;