import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { ShieldCheck, Lock } from 'lucide-react';

// Stripe Key Load
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const Payment = () => {
  const location = useLocation();
  // Cart data nikalo. Agar direct URL se aaya to wapas bhej do.
  const { cart, price } = location.state || {};

  if (!cart || !price) {
    return <Navigate to="/cart" replace />;
  }

  const totalPrice = parseFloat(price).toFixed(2);

  return (
    <div className="pt-24 min-h-screen bg-[#f3fcf6] pb-12 px-4">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Lock className="text-green-600" size={28} /> Secure Checkout
        </h2>
        <p className="text-gray-600 mt-2 flex items-center justify-center gap-1">
          <ShieldCheck size={16} className="text-green-600" /> 256-bit SSL Encrypted Payment
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
        
        {/* --- LEFT SIDE: ORDER SUMMARY --- */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
            
            {/* Cart Items List */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.instructorName || 'Yoga Master'}</p>
                  </div>
                  <div className="font-bold text-green-700">${item.price}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.length} items)</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax / Fees</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between text-2xl font-extrabold text-gray-900">
                <span>Total Pay</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: PAYMENT FORM WRAPPER --- */}
        <div className="lg:col-span-3 order-1 lg:order-2">
             {/* Card Icons */}
             <div className="flex gap-2 mb-4 justify-center lg:justify-start opacity-70 grayscale hover:grayscale-0 transition">
                 <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8" />
                 <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Mastercard" className="h-8" />
                 <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="Amex" className="h-8" />
             </div>
            
            {/* Stripe Elements Wrapper */}
            <Elements stripe={stripePromise}>
                <CheckoutForm price={totalPrice} cart={cart} />
            </Elements>
             
             <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-1">
                 Powered by <span className="font-bold text-indigo-600">Stripe</span>. Your data is secure.
             </p>
        </div>

      </div>
    </div>
  );
};

export default Payment;