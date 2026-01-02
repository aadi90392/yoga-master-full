import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Home, LogOut, Menu, X, PlusCircle, Users, BookOpen, Layers, History } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'user'; // Default to user if no role

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- ROLE BASED LINKS ---
  const dashboardLinks = {
    // 1. Instructor Links
    instructor: [
      { name: 'Add Class', path: '/dashboard/add-class', icon: <PlusCircle size={20} /> },
      { name: 'My Classes', path: '/dashboard/instructor-classes', icon: <Layers size={20} /> },
    ],
    // 2. Admin Links
    admin: [
        { name: 'Manage Classes', path: '/dashboard/manage-classes', icon: <BookOpen size={20} /> },
        { name: 'Manage Users', path: '/dashboard/manage-users', icon: <Users size={20} /> },
    ],
    // 3. Student (User) Links
    user: [
      { name: 'My Enrolled Classes', path: '/dashboard/my-classes', icon: <BookOpen size={20} /> },
      { name: 'Payment History', path: '/dashboard/payment-history', icon: <History size={20} /> }, // <--- NEW LINK
    ]
  };

  // Current Role ke hisaab se links select karo
  const links = dashboardLinks[role] || dashboardLinks['user'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="text-green-600" size={24} />
            <span className="text-xl font-bold text-gray-800">YogaMaster</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 text-center border-b border-gray-100 bg-green-50/50">
            <img 
                src={user?.photoUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=16a34a&color=fff`} 
                alt="Profile" 
                className="w-16 h-16 rounded-full mx-auto border-2 border-green-500 mb-2"
            />
            <h3 className="font-bold text-gray-800">{user?.name}</h3>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                {role}
            </span>
        </div>

        <nav className="p-4 space-y-2">
            {links.map((link) => (
                <Link 
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
                        ${location.pathname === link.path 
                            ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                            : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                        }`}
                >
                    {link.icon} {link.name}
                </Link>
            ))}
            
            <div className="border-t border-gray-100 my-4 pt-4">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">
                    <Home size={20} /> Home Page
                </Link>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 font-medium mt-1"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                <Menu size={24} />
            </button>
            <span className="font-bold text-gray-800 capitalize">{role} Dashboard</span>
            <div className="w-6"></div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;