import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { History, CreditCard, Calendar, Package } from 'lucide-react';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get(`/payment-history/${user?.email}`);
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
        fetchPayments();
    }
  }, [user?.email]);

  if (loading) return <div className="text-center py-20 text-green-600 font-bold animate-pulse">Loading history...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <History className="text-green-600" /> Payment History
      </h2>
      
      {payments.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-100">
           <p className="text-gray-500">No payment records found.</p>
        </div>
      ) : (
        <>
          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="grid gap-4 md:hidden">
            {payments.map((pay) => (
              <div key={pay._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                {/* Header: Amount & Date */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Amount</span>
                    <span className="text-xl font-bold text-green-700">${pay.price}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">
                      {new Date(pay.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gray-100 w-full my-1"></div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                   <div className="flex items-start gap-3">
                      <CreditCard size={16} className="text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-xs text-gray-400">Transaction ID</span>
                        <span className="font-mono text-gray-700 text-xs break-all">{pay.transactionId}</span>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <Package size={16} className="text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-xs text-gray-400">Purchased</span>
                        <span className="text-gray-700 font-medium">{pay.quantity} Classes</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                      <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">#</th>
                      <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Transaction ID</th>
                      <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Amount</th>
                      <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Items</th>
                      <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Date</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                  {payments.map((pay, index) => (
                      <tr key={pay._id} className="hover:bg-gray-50 transition duration-150">
                          <td className="p-4 text-gray-400 text-sm">{index + 1}</td>
                          <td className="p-4">
                              <div className="flex items-center gap-2 font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                                  <CreditCard size={14} className="text-green-600" /> 
                                  {pay.transactionId}
                              </div>
                          </td>
                          <td className="p-4 font-bold text-green-700">${pay.price}</td>
                          <td className="p-4 text-gray-600 font-medium">{pay.quantity} Classes</td>
                          <td className="p-4 text-sm text-gray-500">
                              <span className="flex items-center gap-2">
                                  <Calendar size={14} className="text-gray-400"/> 
                                  {new Date(pay.date).toLocaleDateString()}
                              </span>
                          </td>
                      </tr>
                  ))}
                  </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;