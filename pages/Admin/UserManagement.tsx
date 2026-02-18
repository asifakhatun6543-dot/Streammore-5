
import React, { useState, useMemo } from 'react';
import { Button } from '../../components/Button';
import { User } from '../../types';

interface ManagedUser extends User {
  status: 'active' | 'banned';
  joinedAt: string;
}

const MOCK_USERS: ManagedUser[] = [
  {
    id: 'u-501',
    username: 'Aryan Sharma',
    email: 'aryan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan',
    isPremium: true,
    isAdmin: false,
    status: 'active',
    joinedAt: '2024-01-12'
  },
  {
    id: 'u-502',
    username: 'Sonia Verma',
    email: 'sonia@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sonia',
    isPremium: false,
    isAdmin: false,
    status: 'active',
    joinedAt: '2024-02-20'
  },
  {
    id: 'u-503',
    username: 'Rahul Roy',
    email: 'admin@streammore.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    isPremium: true,
    isAdmin: true,
    status: 'active',
    joinedAt: '2023-11-05'
  },
  {
    id: 'u-504',
    username: 'Vikram Singh',
    email: 'vikram@blocked.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    isPremium: false,
    isAdmin: false,
    status: 'banned',
    joinedAt: '2024-03-15'
  }
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.username.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u
    ));
  };

  const updateRole = (id: string, role: 'admin' | 'premium' | 'user') => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      return {
        ...u,
        isAdmin: role === 'admin',
        isPremium: role === 'premium' || role === 'admin'
      };
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white">User Management</h1>
          <p className="text-slate-500 text-sm">Manage user roles, permissions, and account statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none w-64 md:w-80"
            />
          </div>
          <Button variant="outline" size="md">
            <i className="fa-solid fa-file-export mr-2"></i> Export
          </Button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-6 py-5">User Profile</th>
              <th className="px-6 py-5">Role / Permission</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Join Date</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/5 bg-slate-950 overflow-hidden shrink-0">
                      <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{user.username}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <select 
                    value={user.isAdmin ? 'admin' : (user.isPremium ? 'premium' : 'user')}
                    onChange={(e) => updateRole(user.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="user">Standard User</option>
                    <option value="premium">Premium Member</option>
                    <option value="admin">System Admin</option>
                  </select>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                    user.status === 'active' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs font-bold text-slate-500">
                  {new Date(user.joinedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        user.status === 'active' 
                          ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                          : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'
                      }`}
                      title={user.status === 'active' ? 'Ban User' : 'Unban User'}
                    >
                      <i className={`fa-solid ${user.status === 'active' ? 'fa-user-slash' : 'fa-user-check'} text-xs`}></i>
                    </button>
                    <button className="w-9 h-9 rounded-xl bg-slate-950 text-slate-500 hover:text-white border border-slate-800 flex items-center justify-center transition-all">
                      <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center text-slate-800 mx-auto border border-slate-800">
               <i className="fa-solid fa-users-slash text-2xl"></i>
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No users found matching your search</p>
          </div>
        )}
      </div>

      {/* Permissions Guide */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { role: 'Admin', desc: 'Full system access including content management, finance, and user control.', color: 'text-blue-500' },
          { role: 'Premium', desc: '4K streaming, offline downloads, and early access to new releases.', color: 'text-amber-500' },
          { role: 'User', desc: 'Standard access to the library with ads and restricted quality.', color: 'text-slate-500' }
        ].map((guide, i) => (
          <div key={i} className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/60 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 ${guide.color}`}>
               <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">{guide.role} Privileges</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{guide.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
