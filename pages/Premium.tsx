
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useApp } from '../store/AppContext';

export const Premium: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const plans = [
    { id: 'plan-a', name: 'Mobile', price: '₹149', period: 'month', features: ['720p Resolution', '1 Mobile Device', 'Limited Downloads'] },
    { id: 'plan-b', name: 'Standard', price: '₹499', period: 'month', features: ['1080p Resolution', '2 Devices at once', 'Offline Viewing', 'No Ads'], popular: true },
    { id: 'plan-c', name: 'Premium', price: '₹799', period: 'month', features: ['4K + HDR', '4 Devices at once', 'Dolby Atmos', 'No Ads', 'Exclusive Early Access'] }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4 pt-10">
        <span className="bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full">Membership</span>
        <h1 className="text-4xl md:text-6xl font-black text-white">Choose Your Plan</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Unlock the full potential of StreamMore with premium features and ad-free experience.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 px-4">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 rounded-3xl flex flex-col border ${
              plan.popular ? 'bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/10' : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-white">{plan.price}</span>
              <span className="text-slate-500 text-sm">/{plan.period}</span>
            </div>
            
            <ul className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <i className="fa-solid fa-circle-check text-blue-500"></i>
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.popular ? 'primary' : 'outline'}
              className="w-full py-4 rounded-xl"
              onClick={() => navigate('/payment', { state: { plan } })}
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 rounded-3xl p-10 border border-slate-800 text-center">
        <h4 className="text-xl font-bold mb-4">Why Go Premium?</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: 'fa-ban', label: 'No Advertisements' },
            { icon: 'fa-cloud-arrow-down', label: 'Offline Downloads' },
            { icon: 'fa-tv', label: '4K Ultra HD Quality' },
            { icon: 'fa-headset', label: '24/7 Priority Support' }
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl mx-auto flex items-center justify-center">
                <i className={`fa-solid ${item.icon} text-blue-500 text-xl`}></i>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
