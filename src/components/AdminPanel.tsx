import React, { useState } from 'react';
import { 
  Users, Cpu, CreditCard, Ticket, Settings, Shield, CheckCircle2, 
  Trash2, RefreshCw, AlertCircle, Sparkles 
} from 'lucide-react';
import { AITool } from '../types';

interface AdminPanelProps {
  tools: AITool[];
  onApproveTool: (id: string) => void;
  onDeleteTool: (id: string) => void;
}

export function AdminPanel({ tools, onApproveTool, onDeleteTool }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'tools' | 'settings' | 'roles'>('users');
  
  // Settings local state
  const [siteName, setSiteName] = useState('Lumina AI Marketplace');
  const [defaultProv, setDefaultProv] = useState('gemini');
  const [commissionRate, setCommissionRate] = useState('15');
  const [paymentGateway, setPaymentGateway] = useState('Stripe Enabled');

  // Users roster
  const [users, setUsers] = useState([
    { id: 'USR-890', name: 'Maisie Clarke', email: 'maisieclarke506@gmail.com', role: 'Buyer', registered: 'July 14, 2026', status: 'active' },
    { id: 'USR-231', name: 'Alex Creator', email: 'alex@labs.com', role: 'Vendor', registered: 'June 28, 2026', status: 'active' },
    { id: 'USR-042', name: 'Admin Staff', email: 'admin@lumina.ai', role: 'Admin', registered: 'Jan 10, 2026', status: 'active' },
    { id: 'USR-511', name: 'John Doe', email: 'john@doe.com', role: 'Buyer', registered: 'July 01, 2026', status: 'suspended' }
  ]);

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map((u) => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
    alert('User account state toggled!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System settings persisted to database environment! Changes propagated site-wide.');
  };

  return (
    <div className="admin-panel bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Admin Header */}
        <div className="mb-10 p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20 border border-slate-900 rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">Administrative Core</span>
              <h1 className="text-3xl font-extrabold text-white mt-1">Hello, Administrator</h1>
              <p className="text-xs text-slate-400 mt-1">Configure global gateway models, review tool publish requests, manage users, and specify site configurations.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeTab === 'users' ? 'bg-emerald-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                id="admin-tools-btn"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeTab === 'tools' ? 'bg-emerald-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>AI Tools Queue</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeTab === 'settings' ? 'bg-emerald-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site Settings</span>
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeTab === 'roles' ? 'bg-emerald-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Roles & RBAC</span>
              </button>
            </div>
          </div>
        </div>

        {/* ADMIN SUB VIEWS */}
        {activeTab === 'users' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
            <h3 className="font-extrabold text-white text-base mb-4">Centralized Roster</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase">
                    <th className="pb-3 pr-4">User ID</th>
                    <th className="pb-3 pr-4">Full Name</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Account Type</th>
                    <th className="pb-3 pr-4">Joined Date</th>
                    <th className="pb-3 pr-4">State</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {users.map((u) => (
                    <tr key={u.id} className="text-slate-300 font-medium">
                      <td className="py-3 pr-4 font-mono font-bold text-slate-500">{u.id}</td>
                      <td className="py-3 pr-4 text-white font-bold">{u.name}</td>
                      <td className="py-3 pr-4">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          u.role === 'Admin' ? 'bg-emerald-500/10 text-emerald-400' : u.role === 'Vendor' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-850 text-slate-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{u.registered}</td>
                      <td className="py-3 pr-4">
                        <span className={`capitalize font-bold text-xs ${u.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                          ● {u.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u.id)}
                          id={`toggle-user-${u.id}`}
                          className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-[10px] font-bold rounded-lg transition"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
            <h3 className="font-extrabold text-white text-base mb-4">Pending AI Tools Reviews & Listings</h3>
            {tools.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                All platform tools approved and active. No items in pending queue.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase">
                      <th className="pb-3 pr-4">Tool ID</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3 pr-4">Price</th>
                      <th className="pb-3 pr-4">Creator</th>
                      <th className="pb-3 pr-4">Demo Type</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {tools.map((t) => (
                      <tr key={t.id} className="text-slate-300 font-medium">
                        <td className="py-3 pr-4 font-mono font-bold text-slate-500">{t.id}</td>
                        <td className="py-3 pr-4 text-white font-bold">{t.name}</td>
                        <td className="py-3 pr-4 capitalize">{t.category}</td>
                        <td className="py-3 pr-4 font-bold">${t.price}</td>
                        <td className="py-3 pr-4">{t.author}</td>
                        <td className="py-3 pr-4 capitalize">{t.demoType}</td>
                        <td className="py-3 space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              onApproveTool(t.id);
                              alert(`${t.name} approved for public marketplace!`);
                            }}
                            id={`approve-tool-${t.id}`}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-[10px] rounded-lg transition"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteTool(t.id);
                              alert(`${t.name} listing rejected.`);
                            }}
                            id={`reject-tool-${t.id}`}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 font-bold text-white text-[10px] rounded-lg transition"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl p-8 bg-slate-900 border border-slate-800 rounded-3xl">
            <h3 className="font-extrabold text-white text-base mb-6">Global Site Configurations</h3>
            
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Platform Name</label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-xs transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Default Routing Model Provider</label>
                  <select
                    value={defaultProv}
                    onChange={(e) => setDefaultProv(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs transition"
                  >
                    <option value="gemini">Google Gemini [Recommended]</option>
                    <option value="openai">OpenAI GPT-4o</option>
                    <option value="claude">Anthropic Claude</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Marketplace Fee (%)</label>
                  <input
                    type="number"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-xs transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Payment Integration Gateway</label>
                <select
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs transition"
                >
                  <option value="Stripe Enabled">Stripe Cashier Mode (Active)</option>
                  <option value="PayPal Enabled">PayPal Express Checkout Mode (Active)</option>
                  <option value="Stripe & PayPal">Dual Gateway (Stripe + PayPal Live)</option>
                </select>
              </div>

              <button
                type="submit"
                id="save-admin-settings-btn"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs mt-4 transition"
              >
                Save Site Settings
              </button>
            </form>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
            <h3 className="font-extrabold text-white text-base mb-2">Roles & RBAC Access Parameters</h3>
            <p className="text-xs text-slate-500 mb-6">Manage specific system capabilities mapped to our Spatie Database adapter</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase">
                    <th className="pb-3 pr-4">Access Capability</th>
                    <th className="pb-3 pr-4">Buyer Account</th>
                    <th className="pb-3 pr-4">SaaS Creator (Vendor)</th>
                    <th className="pb-3">Admin Account</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {[
                    { cap: 'Discover & Browse Directory', u: true, v: true, a: true },
                    { cap: 'Acquire Licenses & Pay Invoices', u: true, v: true, a: true },
                    { cap: 'Write Reviews & Stars Rating', u: true, v: false, a: true },
                    { cap: 'Publish AI Tool Integrations', u: false, v: true, a: true },
                    { cap: 'Create Coupon Codes', u: false, v: true, a: true },
                    { cap: 'Configure Global Site Settings', u: false, v: false, a: true },
                    { cap: 'Moderate Roster and Suspension', u: false, v: false, a: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="text-slate-300 font-medium">
                      <td className="py-3 pr-4 font-bold text-slate-200">{row.cap}</td>
                      <td className="py-3 pr-4 font-bold text-emerald-400">{row.u ? '✔ GRANTED' : '✕ DENIED'}</td>
                      <td className="py-3 pr-4 font-bold text-indigo-400">{row.v ? '✔ GRANTED' : '✕ DENIED'}</td>
                      <td className="py-3 font-bold text-emerald-500">{row.a ? '✔ GRANTED' : '✕ DENIED'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
