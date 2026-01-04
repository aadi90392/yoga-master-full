import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

// Components
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/Home';
import Classes from './pages/Classes';
import Instructors from './pages/Instructors';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Teach from './pages/Teach';

// User Pages
import Cart from './pages/Cart';
import Payment from './pages/Payment';

// Dashboard Pages
import DashboardLayout from './pages/dashboard/DashboardLayout';
import MyClasses from './pages/dashboard/MyClasses';
import ClassDetails from './pages/dashboard/ClassDetails';
import PaymentHistory from './pages/dashboard/PaymentHistory';
import UserProfile from './pages/dashboard/UserProfile';

// Instructor Pages
import InstructorHome from './pages/dashboard/InstructorHome';
import AddClass from './pages/dashboard/AddClass';
import InstructorClasses from './pages/dashboard/InstructorClasses';
import UpdateClass from './pages/dashboard/UpdateClass';

// Admin Pages
import ManageClasses from './pages/dashboard/ManageClasses';
import ManageUsers from './pages/dashboard/ManageUsers';
import InstructorRequests from './pages/dashboard/InstructorRequests';

// --- ROUTE GUARDS ---
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

const InstructorRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!token || user?.role !== 'instructor') {
        return <Navigate to="/" replace />;
    }
    return children;
};

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!token || user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
};

// --- NEW: Dashboard Redirect Helper ---
// Ye component role check karke sahi jagah bhejega
const DashboardRedirect = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role;

    if (role === 'admin') return <Navigate to="/dashboard/manage-users" replace />;
    if (role === 'instructor') return <Navigate to="/dashboard/instructor-home" replace />;
    return <Navigate to="/dashboard/my-classes" replace />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-white font-sans text-gray-900">
                <ToastContainer position="top-right" autoClose={3000} />
                
                <Routes>
                    {/* --- PUBLIC ROUTES --- */}
                    <Route path="/" element={<><Navbar /><Home /></>} />
                    <Route path="/classes" element={<><Navbar /><Classes /></>} />
                    <Route path="/instructors" element={<><Navbar /><Instructors /></>} />
                    <Route path="/login" element={<><Navbar /><Login /></>} />
                    <Route path="/signup" element={<><Navbar /><Signup /></>} />
                    
                    {/* Apply for Instructor */}
                    <Route path="/teach" element={
                        <PrivateRoute><Navbar /><Teach /></PrivateRoute>
                    } />
                    
                    {/* --- USER ROUTES --- */}
                    <Route path="/cart" element={
                        <PrivateRoute><Navbar /><Cart /></PrivateRoute>
                    } />
                    <Route path="/payment" element={
                        <PrivateRoute><Navbar /><Payment /></PrivateRoute>
                    } />

                    {/* --- DASHBOARD SECTION --- */}
                    <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                        
                        {/* DEFAULT INDEX ROUTE (Role Based Redirect) */}
                        <Route index element={<DashboardRedirect />} />

                        {/* Common for All Logged In Users */}
                        <Route path="user-profile" element={<UserProfile />} />

                        {/* Student Routes */}
                        <Route path="my-classes" element={<MyClasses />} />
                        <Route path="class/:id" element={<ClassDetails />} /> 
                        <Route path="payment-history" element={<PaymentHistory />} />

                        {/* Instructor Routes */}
                        <Route path="instructor-home" element={
                            <InstructorRoute><InstructorHome /></InstructorRoute>
                        } />
                        <Route path="add-class" element={
                            <InstructorRoute><AddClass /></InstructorRoute>
                        } />
                        <Route path="instructor-classes" element={
                            <InstructorRoute><InstructorClasses /></InstructorRoute>
                        } />
                        <Route path="update-class/:id" element={
                            <InstructorRoute><UpdateClass /></InstructorRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="manage-classes" element={
                            <AdminRoute><ManageClasses /></AdminRoute>
                        } />
                        <Route path="manage-users" element={
                            <AdminRoute><ManageUsers /></AdminRoute>
                        } />
                        <Route path="manage-applications" element={
                            <AdminRoute><InstructorRequests /></AdminRoute>
                        } />

                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;