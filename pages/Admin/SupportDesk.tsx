
import React, { useState, useMemo } from 'react';
import { Button } from '../../components/Button';
import { SupportTicket } from '../../types';

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'T-1001',
    userId: 'u1',
    username: 'Aryan Sharma',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan',
    subject: 'Billing Issue',
    message: "I was charged twice for the monthly subscription. Please look into this immediately and refund the extra amount.",
    status: 'open',
    priority: 'urgent',
    createdAt: '2024-05-20T10:30:00Z',
    assignedTo: 'Finance Team',
    screenshot: 'https://picsum.photos/seed/billing/800/600'
  },
  {
    id: 'T-1002',
    userId: 'u2',
    username: 'Sonia Verma',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sonia',
    subject: 'Technical Problem',
    message: "The video player keeps buffering on my Samsung TV. My internet is stable at 100Mbps.",
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-05-19T14:20:00Z',
    assignedTo: 'Dev Support'
  },
  {
    id: 'T-1003',
    userId: 'u3',
    username: 'Rahul Roy',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    subject: 'Feature Request',
    message: "It would be great if you could add a multi-profile feature like Netflix. My kids use my account too.",
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-05-18T09:15:00Z',
    assignedTo: 'Product Team'
  }
];

export const SupportDesk: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTickets = useMemo(() => {
    if (filterStatus === 'all') return tickets;
    return tickets.filter(t => t.status === filterStatus);
  }, [tickets, filterStatus]);

  const updateStatus = (id: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (selectedTicket?.id === id) setSelectedTicket(prev => prev ? { ...prev, status } : null);
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'in-progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'closed': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-blue-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Support Desk</h1>
          <p className="text-slate-500 text-sm">Manage user inquiries and technical issues.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-300 outline-none"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <Button onClick={() => setTickets([...MOCK_TICKETS])} variant="secondary">
            <i className="fa-solid fa-rotate mr-2"></i> Refresh
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Ticket List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTickets.map(ticket => (
                  <tr 
                    key={ticket.id} 
                    onClick={() => setSelectedTicket(ticket)}
                    className={`cursor-pointer transition-colors group ${selectedTicket?.id === ticket.id ? 'bg-blue-600/10' : 'hover:bg-slate-800/30'}`}
                  >
                    <td className="px-6 py-5">
                      <span className="text-xs font-black text-slate-300">#{ticket.id}</span>
                      <div className="text-[9px] text-slate-500 mt-0.5">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img src={ticket.userAvatar} className="w-8 h-8 rounded-full bg-slate-950 border border-white/5" alt={ticket.username} />
                        <span className="text-sm font-bold text-white">{ticket.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-slate-300 truncate max-w-[150px]">{ticket.subject}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${getPriorityColor(ticket.priority)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'urgent' ? 'bg-red-500' : 'bg-current'}`}></div>
                        {ticket.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTickets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
                <i className="fa-solid fa-folder-open text-4xl opacity-20"></i>
                <p className="text-sm font-bold uppercase tracking-widest">No tickets found</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full">
          {selectedTicket ? (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-slate-800 bg-slate-950/50">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ticket Details</span>
                  <button onClick={() => setSelectedTicket(null)} className="text-slate-600 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <h3 className="text-xl font-black text-white leading-tight mb-2">{selectedTicket.subject}</h3>
                <div className="flex items-center gap-2">
                  <img src={selectedTicket.userAvatar} className="w-6 h-6 rounded-full" alt="" />
                  <span className="text-xs font-bold text-slate-400">{selectedTicket.username}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message</p>
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-sm text-slate-300 leading-relaxed italic">
                    "{selectedTicket.message}"
                  </div>
                </div>

                {selectedTicket.screenshot && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attachment</p>
                    <div className="rounded-2xl overflow-hidden border border-slate-800">
                      <img src={selectedTicket.screenshot} className="w-full h-auto" alt="Screenshot" />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage Ticket</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">Assigned To</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue={selectedTicket.assignedTo || ""}
                      >
                        <option value="">Unassigned</option>
                        <option>Finance Team</option>
                        <option>Dev Support</option>
                        <option>Product Team</option>
                        <option>Community Mods</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['open', 'in-progress', 'resolved', 'closed'] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(selectedTicket.id, s)}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                              selectedTicket.status === s 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                            }`}
                          >
                            {s.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-800 bg-slate-950/30">
                <Button className="w-full">
                  <i className="fa-solid fa-paper-plane mr-2"></i> Reply to User
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-30">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-3xl">
                <i className="fa-solid fa-message"></i>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest max-w-[200px]">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
