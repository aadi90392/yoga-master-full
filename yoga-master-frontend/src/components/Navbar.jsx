import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, ShoppingCart, LayoutDashboard, Menu, X, GraduationCap } from 'lucide-react'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
        setIsMobileMenuOpen(false);
    }, [location]); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const getProfileImage = () => {
        if (user && user.photoUrl) return user.photoUrl;
        const name = user?.name || "User";
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=16a34a&color=fff&bold=true`;
    };

    return (
        <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    
                    {/* --- LEFT: LOGO --- */}
                    <Link to="/" className="flex items-center gap-2 group z-50">
                        <div className="bg-green-100 p-1.5 sm:p-2 rounded-full group-hover:bg-green-200 transition">
                            <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                        </div>
                        <span className="text-lg sm:text-xl font-extrabold text-gray-800 tracking-tight">
                            Yoga<span className="text-green-600">Master</span>
                        </span>
                    </Link>

                    {/* --- CENTER: DESKTOP LINKS --- */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="text-gray-600 font-medium hover:text-green-600 transition">Home</Link>
                        <Link to="/classes" className="text-gray-600 font-medium hover:text-green-600 transition">Classes</Link>
                        <Link to="/instructors" className="text-gray-600 font-medium hover:text-green-600 transition">Instructors</Link>
                        
                        {/* Teach Link (Only for Users) */}
                        {user && user.role === 'user' && (
                            <Link to="/teach" className="text-gray-600 font-medium hover:text-green-600 transition flex items-center gap-1">
                                Teach on YogaMaster
                            </Link>
                        )}

                        {user && (user.role === 'instructor' || user.role === 'admin') && (
                            <Link to="/dashboard/my-classes" className="text-gray-600 font-medium hover:text-green-600 transition">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* --- RIGHT: DESKTOP AUTH --- */}
                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center gap-6">
                                {/* Dashboard Icon */}
                                <Link to="/dashboard/my-classes" className="text-gray-500 hover:text-green-600" title="Go to Dashboard">
                                    <LayoutDashboard size={22} />
                                </Link>

                                {/* Cart Icon (Only for Students) */}
                                {user.role === 'user' && (
                                    <Link to="/cart" className="relative group">
                                        <ShoppingCart size={24} className="text-gray-600 group-hover:text-green-600 transition" />
                                    </Link>
                                )}

                                {/* User Profile (Clickable Avatar) */}
                                <Link to="/dashboard/user-profile" className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:opacity-80 transition" title="My Profile">
                                    <div className="w-10 h-10 rounded-full border-2 border-green-500 overflow-hidden">
                                        <img src={getProfileImage()} className="w-full h-full object-cover" alt="User" />
                                    </div>
                                </Link>

                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 font-semibold hover:text-green-600 transition">Log In</Link>
                                <Link to="/signup" className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 shadow-lg shadow-green-600/30 transition">Join Now</Link>
                            </div>
                        )}
                    </div>

                    {/* --- MOBILE: TOGGLE BUTTON --- */}
                    <div className="md:hidden flex items-center gap-4">
                        {user && user.role === 'user' && (
                             <Link to="/cart" className="relative text-gray-600">
                                <ShoppingCart size={22} />
                             </Link>
                        )}

                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="text-gray-600 hover:text-green-600 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU DROPDOWN --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl flex flex-col p-4 space-y-4 animate-in slide-in-from-top-5 duration-200">
                    
                    <Link to="/" className="text-gray-700 font-medium py-2 border-b border-gray-50 hover:text-green-600">Home</Link>
                    <Link to="/classes" className="text-gray-700 font-medium py-2 border-b border-gray-50 hover:text-green-600">Classes</Link>
                    <Link to="/instructors" className="text-gray-700 font-medium py-2 border-b border-gray-50 hover:text-green-600">Instructors</Link>
                    
                    {user ? (
                        <>
                            {user.role === 'user' && (
                                <Link to="/teach" className="text-gray-700 font-medium py-2 border-b border-gray-50 hover:text-green-600 flex items-center gap-2">
                                    <GraduationCap size={18} /> Teach on YogaMaster
                                </Link>
                            )}

                            <Link to="/dashboard/my-classes" className="text-gray-700 font-medium py-2 border-b border-gray-50 hover:text-green-600 flex items-center gap-2">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            
                            {/* Mobile Profile Link */}
                            <Link to="/dashboard/user-profile" className="flex items-center gap-3 py-2 border-b border-gray-50">
                                <img src={getProfileImage()} className="w-8 h-8 rounded-full border border-green-500" alt="User" />
                                <span className="font-semibold text-gray-800">{user.name} (Profile)</span>
                            </Link>

                            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium py-2">
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 mt-2">
                            <Link to="/login" className="w-full text-center text-gray-600 font-bold py-3 border border-gray-200 rounded-lg">
                                Log In
                            </Link>
                            <Link to="/signup" className="w-full text-center bg-green-600 text-white font-bold py-3 rounded-lg shadow-md">
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;