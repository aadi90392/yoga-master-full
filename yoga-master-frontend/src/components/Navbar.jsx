import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, ShoppingCart, LayoutDashboard } from 'lucide-react'; // LayoutDashboard import karo

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
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
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition">
                <Leaf className="h-6 w-6 text-green-700" />
            </div>
            <span className="text-xl font-extrabold text-gray-800 tracking-tight">
              Yoga<span className="text-green-600">Master</span>
            </span>
          </Link>

          {/* LINKS */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 font-medium hover:text-green-600 transition">Home</Link>
            <Link to="/classes" className="text-gray-600 font-medium hover:text-green-600 transition">Classes</Link>
            
            {/* AGAR USER LOGIN HAI, TO DASHBOARD LINK DIKHAO */}
            {user && (
              <Link to="/dashboard/my-classes" className="text-gray-600 font-medium hover:text-green-600 transition">
                Dashboard
              </Link>
            )}
          </div>

          {/* AUTH SECTION */}
          <div>
            {user ? (
              <div className="flex items-center gap-6">
                
                {/* Dashboard Icon (Mobile/Desktop Quick Access) */}
                <Link to="/dashboard/my-classes" className="text-gray-500 hover:text-green-600" title="Go to Dashboard">
                    <LayoutDashboard size={22} />
                </Link>

                <Link to="/cart" className="relative group">
                  <ShoppingCart size={24} className="text-gray-600 group-hover:text-green-600 transition" />
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white">!</span>
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="w-10 h-10 rounded-full border-2 border-green-500 overflow-hidden">
                        <img 
                          src={getProfileImage()} 
                          className="w-full h-full object-cover"
                          alt="User"
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16a34a&color=fff&bold=true`;}} 
                        />
                    </div>
                </div>

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;