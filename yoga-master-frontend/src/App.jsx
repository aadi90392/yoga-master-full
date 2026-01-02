import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

// Components
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/Home';
import Classes from './pages/Classes';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Payment from './pages/Payment';

// Dashboard Pages
import DashboardLayout from './pages/dashboard/DashboardLayout';
import MyClasses from './pages/dashboard/MyClasses';
import ClassDetails from './pages/dashboard/ClassDetails';
import PaymentHistory from './pages/dashboard/PaymentHistory'; // <--- NEW IMPORT

// Instructor Pages
import AddClass from './pages/dashboard/AddClass';
import InstructorClasses from './pages/dashboard/InstructorClasses';
import UpdateClass from './pages/dashboard/UpdateClass';

// Admin Pages
import ManageClasses from './pages/dashboard/ManageClasses';
import ManageUsers from './pages/dashboard/ManageUsers';

// --- 1. PRIVATE ROUTE (General Login Check) ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// --- 2. INSTRUCTOR ROUTE (Role Check) ---
const InstructorRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  if (!token || user?.role !== 'instructor') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// --- 3. ADMIN ROUTE (Role Check) ---
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        
        {/* Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
        
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/classes" element={<><Navbar /><Classes /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/signup" element={<><Navbar /><Signup /></>} />
          
          {/* --- PROTECTED USER ROUTES --- */}
          <Route path="/cart" element={
            <PrivateRoute>
              <Navbar />
              <Cart />
            </PrivateRoute>
          } />
          
          <Route path="/payment" element={
            <PrivateRoute>
              <Navbar />
              <Payment />
            </PrivateRoute>
          } />

          {/* --- DASHBOARD SECTION --- */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
             {/* 1. Student Routes (Common) */}
             <Route path="my-classes" element={<MyClasses />} />
             <Route path="class/:id" element={<ClassDetails />} /> 
             
             {/* Payment History Route (NEW) */}
             <Route path="payment-history" element={<PaymentHistory />} />

             {/* 2. Instructor Routes */}
             <Route path="add-class" element={
               <InstructorRoute>
                 <AddClass />
               </InstructorRoute>
             } />
             
             {/* Instructor: My Uploaded Classes */}
             <Route path="instructor-classes" element={
               <InstructorRoute>
                 <InstructorClasses />
               </InstructorRoute>
             } />

             {/* Instructor: Update Class Route */}
             <Route path="update-class/:id" element={
               <InstructorRoute>
                 <UpdateClass />
               </InstructorRoute>
             } />

             {/* 3. Admin Routes */}
             <Route path="manage-classes" element={
               <AdminRoute>
                 <ManageClasses />
               </AdminRoute>
             } />
             
             {/* Admin: Manage Users */}
             <Route path="manage-users" element={
               <AdminRoute>
                 <ManageUsers />
               </AdminRoute>
             } />

          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;