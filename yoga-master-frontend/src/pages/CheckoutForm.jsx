import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import api from '../api/axios'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Loader } from 'lucide-react';

const CheckoutForm = ({ price, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Initialize Payment Intent
  useEffect(() => {
    if (price > 0) {
      api.post('/create-payment-intent', { price })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error("Payment Intent Error", err));
    }
  }, [price]);

  // 2. Handle Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
        toast.error("Payment system not ready. Please refresh.");
        return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setProcessing(true);
    
    // Stripe Payment Process
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: user?.name || 'Unknown User',
          email: user?.email || 'anonymous',
        },
      },
    });

    if (error) {
      toast.error(`Payment Failed: ${error.message}`);
      setProcessing(false);
    } else {
      if (paymentIntent.status === 'succeeded') {
        // --- SAVE TO BACKEND ---
        const paymentInfo = {
            userEmail: user?.email,
            transactionId: paymentIntent.id,
            price,
            date: new Date(),
            quantity: cart.length,
            classesId: cart.map(item => item._id),
            classNames: cart.map(item => item.name),
            status: 'service pending'
        }

        try {
            const res = await api.post('/payment-info', paymentInfo);
            if(res.data.paymentResult.insertedId) {
                toast.success("Payment Successful! Welcome to the class.");
                
                // --- REDIRECT TO DASHBOARD ---
                navigate('/dashboard/my-classes'); 
            }
        } catch (error) {
             console.error(error);
             toast.error("Payment successful but database update failed.");
        }
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
      
      {/* Top Green Border */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-teal-400"></div>

      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
         <CreditCard className="text-green-600" /> Payment Details
      </h3>
      
      {/* Card Input Field */}
      <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-sm">Card Information</label>
          <div className="border border-gray-300 p-4 rounded-xl bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500 transition-all">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    fontFamily: '"Inter", sans-serif',
                    '::placeholder': { color: '#9ca3af' },
                    iconColor: '#16a34a',
                  },
                  invalid: { color: '#dc2626', iconColor: '#dc2626' },
                },
              }}
            />
          </div>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
          ${processing 
            ? 'bg-gray-400 cursor-not-allowed opacity-70' 
            : 'bg-gradient-to-r from-green-600 via-green-500 to-teal-500 hover:shadow-green-500/30 hover:from-green-700 hover:to-teal-600'
          }`}
      >
        {processing ? (
            <><Loader className="animate-spin" /> Processing...</>
        ) : (
            <><Lock size={20} /> Pay Securely ${price}</>
        )}
      </button>

      {/* Test Card Hint */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
        <p className="text-xs text-blue-600 font-medium">
          <span className="font-bold">TEST MODE:</span> Card: <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code>
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;