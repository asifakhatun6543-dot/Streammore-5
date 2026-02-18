
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useApp } from '../store/AppContext';

export const Payment: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const [method, setMethod] = useState<'upi' | 'qr'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = state?.plan || { name: 'Standard', price: '₹499' };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (user) {
        setUser({ ...user, isPremium: true });
      }
      navigate('/payment-successful');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-8">Payment Method</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <button 
                onClick={() => setMethod('upi')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                  method === 'upi' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <i className="fa-solid fa-mobile-screen-button text-2xl"></i>
                <span className="font-bold">UPI / PhonePe / GPay</span>
              </button>
              <button 
                onClick={() => setMethod('qr')}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                  method === 'qr' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <i className="fa-solid fa-qrcode text-2xl"></i>
                <span className="font-bold">Scan QR Code</span>
              </button>
            </div>

            {method === 'upi' ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Enter VPA / UPI ID</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="example@upi"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handlePay} isLoading={isProcessing}>Verify & Pay</Button>
                </div>
                <div className="flex justify-center gap-8 pt-6 opacity-40">
                  <img src="https://img.icons8.com/color/48/000000/google-pay.png" alt="gpay" className="h-8" />
                  <img src="https://img.icons8.com/color/48/000000/phonepe.png" alt="phonepe" className="h-8" />
                  <img src="https://img.icons8.com/color/48/000000/paytm.png" alt="paytm" className="h-8" />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-48 h-48 bg-white p-4 mx-auto rounded-xl">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=StreamMorePayment" alt="qr" className="w-full h-full" />
                </div>
                <p className="text-slate-400 text-sm">Scan this QR code with any UPI app to pay</p>
                <Button variant="outline" onClick={handlePay} isLoading={isProcessing}>I have completed payment</Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Plan: {plan.name}</span>
                <span className="text-white font-bold">{plan.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax (GST)</span>
                <span className="text-white font-bold">₹0</span>
              </div>
              <div className="border-t border-slate-800 pt-4 flex justify-between font-black">
                <span>Total</span>
                <span className="text-blue-500">{plan.price}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tighter">
                By clicking pay, you agree to our Terms of Service and Privacy Policy. Subscriptions renew automatically.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
            <i className="fa-solid fa-lock"></i>
            Secure 256-bit encrypted payment
          </div>
        </div>
      </div>
    </div>
  );
};
