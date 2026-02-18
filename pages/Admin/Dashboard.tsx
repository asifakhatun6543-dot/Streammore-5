
import React from 'react';
import { useApp } from '../../store/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Mon', views: 4000, users: 2400 },
  { name: 'Tue', views: 3000, users: 1398 },
  { name: 'Wed', views: 2000, users: 9800 },
  { name: 'Thu', views: 2780, users: 3908 },
  { name: 'Fri', views: 1890, users: 4800 },
  { name: 'Sat', views: 2390, users: 3800 },
  { name: 'Sun', views: 3490, users: 4300 },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'fa-chart-pie' },
    { label: 'App Control', path: '/admin/app-control', icon: 'fa-toggle-on' },
    { label: 'Users', path: '/admin/users', icon: 'fa-users' },
    { label: 'Content', path: '/admin/content', icon: 'fa-film' },
    { label: 'Payments', path: '/admin/payments', icon: 'fa-credit-card' },
    { label: 'Advertisements', path: '/admin/ads', icon: 'fa-rectangle-ad' },
    { label: 'Support', path: '/admin/support', icon: 'fa-headset' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <i className="fa-solid fa-shield-halved text-white text-sm"></i>
          </div>
          <span className="font-black text-xl tracking-tighter">Admin Central</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
        <Link to="/home" className="text-slate-500 text-xs mt-auto flex items-center gap-2 hover:text-white">
          <i className="fa-solid fa-arrow-left"></i> Back to User Site
        </Link>
      </aside>
      
      {/* Main Admin Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Overview</h1>
        <div className="flex gap-3">
          <button className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm font-bold">Export Data</button>
          <button className="bg-blue-600 rounded-lg px-4 py-2 text-sm font-bold">Refresh</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '24,592', change: '+12%', icon: 'fa-users', color: 'text-blue-500' },
          { label: 'Active Streams', value: '1,208', change: '+5%', icon: 'fa-play', color: 'text-green-500' },
          { label: 'Revenue', value: '₹12,45,000', change: '+18%', icon: 'fa-indian-rupee-sign', color: 'text-amber-500' },
          { label: 'Support Tickets', value: '14', change: '-2%', icon: 'fa-life-ring', color: 'text-red-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center ${stat.color}`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6">User Growth</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6">Streaming Activity</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
