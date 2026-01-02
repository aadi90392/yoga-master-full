import React, { useEffect, useState } from 'react';
import api from '../api/axios'; // Secure API helper
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Navigation hook
  
  // LocalStorage se user email nikalo
  const user = JSON.parse(localStorage.getItem('user'));
  const userEmail = user?.email;

  // 1. Cart Data Fetch Karo
  const fetchCart = async () => {
    try {
      if (!userEmail) return;
      // Backend: app.get('/cart/:email')
      const res = await api.get(`/cart/${userEmail}`);
      setCart(res.data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userEmail]);

  // 2. Delete Item Logic
  const handleDelete = async (classId) => {
    try {
      // Backend: app.delete('/delete-cart-item/:id') 
      // Note: Backend 'classId' expect karta hai
      await api.delete(`/delete-cart-item/${classId}`);
      
      toast.success("Item removed!");
      fetchCart(); // List refresh karo
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  // 3. Checkout Page par jao
  const handleCheckout = () => {
      // Hum sath me Cart Data aur Total Price bhej rahe hain
      navigate('/payment', { 
          state: { 
              cart: cart, 
              price: totalPrice 
          } 
      });
  };

  // Total Price Calculate karo
  const totalPrice = cart.reduce((total, item) => total + parseInt(item.price), 0);

  if (loading) return <div className="h-screen flex justify-center items-center text-green-600 font-bold">Loading Cart...</div>;

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 min-h-screen bg-[#f3fcf6]">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <ShoppingBag className="text-green-600" /> My Cart
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
          <Link to="/classes" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">
            Browse Classes
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List (Left Side) */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">Class</th>
                    <th className="p-4 font-semibold text-gray-600">Price</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">Instr: {item.instructorName || 'Yoga Master'}</p>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-green-700">${item.price}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Checkout Summary (Right Side) */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Tax (0%)</span>
                <span>$0</span>
              </div>
              <div className="border-t border-gray-100 my-4"></div>
              <div className="flex justify-between mb-6 text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;