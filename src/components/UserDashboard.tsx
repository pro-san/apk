import React, { useState } from 'react';
import { 
  Cpu, CreditCard, Activity, Key, Ticket, Plus, CheckCircle2, 
  Copy, ExternalLink, RefreshCw, Send, AlertCircle, Heart, Trash2, Star,
  Shield, Lock, Smartphone, Check
} from 'lucide-react';
import { AITool, SupportTicket, Order } from '../types';
import { aiTools } from '../data';

interface UserDashboardProps {
  purchasedTools: AITool[];
  onSelectTool: (tool: AITool) => void;
  orders: Order[];
  wishlist: string[];
  onToggleWishlist: (tool: AITool) => void;
  currentUser?: { name: string; email: string; role: 'user' | 'vendor' | 'admin' } | null;
}

export function UserDashboard({ 
  purchasedTools, 
  onSelectTool, 
  orders, 
  wishlist, 
  onToggleWishlist,
  currentUser
}: UserDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'tools' | 'favorites' | 'billing' | 'keys' | 'support' | 'security'>('tools');
  const [apiKey, setApiKey] = useState('lumina_live_pk_8b24ef09da7812bc');
  const [isCopied, setIsCopied] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);

  // Two-Factor Authentication states
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(() => {
    return localStorage.getItem('lumina_2fa_enabled') === 'true';
  });
  const [twoFactorStep, setTwoFactorStep] = useState<'idle' | 'setup' | 'backup'>('idle');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_2fa_backup_codes');
    return saved ? JSON.parse(saved) : [];
  });
  const [tempSecret, setTempSecret] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');

  const handleStartSetup = () => {
    const secret = 'LUMINA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-2FA';
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setTempSecret(secret);
    setSimulatedCode(code);
    setVerificationCodeInput('');
    setVerificationError('');
    setTwoFactorStep('setup');
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCodeInput.trim() === simulatedCode) {
      const codes = Array.from({ length: 4 }, () => 
        'LUMINA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      );
      setBackupCodes(codes);
      localStorage.setItem('lumina_2fa_backup_codes', JSON.stringify(codes));
      setIsTwoFactorEnabled(true);
      localStorage.setItem('lumina_2fa_enabled', 'true');
      setTwoFactorStep('backup');
      setVerificationError('');
    } else {
      setVerificationError('Invalid 6-digit verification code. Please enter the correct code shown below.');
    }
  };

  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable Two-Factor Authentication? This will reduce your account security.')) {
      setIsTwoFactorEnabled(false);
      localStorage.setItem('lumina_2fa_enabled', 'false');
      setTwoFactorStep('idle');
    }
  };

  const handleCopyBackup = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  // Tickets local state
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TICK-908',
      title: 'Stripe Payment Invoicing Query',
      category: 'Billing',
      status: 'in-progress',
      lastUpdated: 'Today',
      messages: [
        { sender: 'user', text: 'Hi support team, I noticed our monthly subscription charge was processed but I did not receive the Stripe PDF invoice. Could you please send it over?', timestamp: '2 hours ago' },
        { sender: 'support', text: 'Hello, we are processing your invoice generation hook. It will be dispatched to your account email address shortly.', timestamp: '1 hour ago' }
      ]
    },
    {
      id: 'TICK-412',
      title: 'Velo API Gateway Connection Issues',
      category: 'Technical',
      status: 'closed',
      lastUpdated: 'Yesterday',
      messages: [
        { sender: 'user', text: 'Getting a 401 unauthorized code when attempting to run OmniChat via API key.', timestamp: 'Yesterday' },
        { sender: 'support', text: 'Hi there, make sure you include the "Bearer " prefix before your key in the authorization headers. Thanks!', timestamp: 'Yesterday' }
      ]
    }
  ]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [ticketMsg, setTicketMsg] = useState('');
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCat, setNewTicketCat] = useState('Technical');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const handleGenerateKey = () => {
    setLoadingKey(true);
    setTimeout(() => {
      const chars = 'abcdef0123456789';
      let randomHex = '';
      for (let i = 0; i < 16; i++) randomHex += chars[Math.floor(Math.random() * chars.length)];
      setApiKey(`lumina_live_pk_${randomHex}`);
      setLoadingKey(false);
    }, 800);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendTicketMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMsg.trim() || !activeTicket) return;

    const updated = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          lastUpdated: 'Today',
          messages: [
            ...t.messages,
            { sender: 'user' as const, text: ticketMsg, timestamp: 'Just now' }
          ]
        };
      }
      return t;
    });

    setTickets(updated);
    const updatedTicket = updated.find(t => t.id === activeTicket.id);
    if (updatedTicket) setActiveTicket(updatedTicket);
    setTicketMsg('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;

    const newTick: SupportTicket = {
      id: `TICK-${Math.floor(Math.random() * 900) + 100}`,
      title: newTicketTitle,
      category: newTicketCat,
      status: 'open',
      lastUpdated: 'Today',
      messages: [
        { sender: 'user', text: 'Ticket opened. Support engineers will respond shortly.', timestamp: 'Just now' }
      ]
    };

    setTickets([newTick, ...tickets]);
    setNewTicketTitle('');
    setShowNewTicketModal(false);
    alert('Support Ticket successfully submitted!');
  };

  return (
    <div className="user-dashboard bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Dashboard Header Panel */}
        <div className="mb-10 p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-900 rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-amber-500 font-extrabold">Active Buyer Account</span>
                {isTwoFactorEnabled && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Shield className="w-2.5 h-2.5" />
                    <span>2FA ACTIVE</span>
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-white mt-1">
                Hello, {currentUser ? currentUser.name : 'Maisie Clarke'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">Manage active subscriptions, view purchases, test APIs, or open support files.</p>
            </div>
            
            {/* Tab switch buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'tools', label: 'My Products', icon: <Cpu className="w-4 h-4" /> },
                { id: 'favorites', label: 'My Favorites', icon: <Heart className="w-4 h-4" /> },
                { id: 'billing', label: 'Billing & History', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'keys', label: 'Central API Keys', icon: <Key className="w-4 h-4" /> },
                { id: 'support', label: 'Support Tickets', icon: <Ticket className="w-4 h-4" /> },
                { id: 'security', label: 'Security & 2FA', icon: <Shield className="w-4 h-4" /> },
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    activeSubTab === subTab.id 
                      ? 'bg-amber-500 text-slate-950' 
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {subTab.icon}
                  <span>{subTab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVE SUBTAB VIEW */}
        {activeSubTab === 'tools' && (
          <div>
            <h2 className="text-xl font-extrabold text-white mb-6">Purchased & Subscribed Tools</h2>
            {purchasedTools.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-900 rounded-3xl bg-slate-950/40">
                <Cpu className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-300">You haven't acquired any tools yet</h3>
                <p className="text-xs text-slate-500 mt-1">Explore our marketplace to acquire licenses and run playgrounds.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedTools.map((tool) => (
                  <div 
                    key={tool.id}
                    onClick={() => onSelectTool(tool)}
                    className="p-6 bg-slate-900 border border-slate-800/80 rounded-2xl hover:border-amber-500/20 cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="p-2.5 bg-slate-950 text-amber-500 w-fit rounded-xl border border-slate-850 mb-4">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-white text-base leading-tight">{tool.name}</h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{tool.tagline}</p>
                    </div>

                    <div className="flex items-center justify-between mt-6 border-t border-slate-800/60 pt-4">
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase rounded">
                        Active License
                      </span>
                      <span className="text-xs text-amber-500 font-extrabold hover:underline">
                        Launch Playground →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'favorites' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>My Favorited AI Tools</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Your saved sandbox environments and model playgrounds for quick access.</p>
              </div>
            </div>

            {wishlist.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-900 rounded-3xl bg-slate-950/40">
                <Heart className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-300">Your favorites list is empty</h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Click the heart icon on any AI tool card in the marketplace to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiTools
                  .filter((tool) => wishlist.includes(tool.id))
                  .map((tool) => (
                    <div 
                      key={tool.id}
                      id={`favorite-card-${tool.id}`}
                      className="p-6 bg-slate-900 border border-slate-800/80 rounded-2xl flex flex-col justify-between group relative hover:border-rose-500/20 transition-all duration-300"
                    >
                      {/* Heart toggle on card */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(tool);
                        }}
                        id={`favorite-remove-${tool.id}`}
                        className="absolute top-4 right-4 p-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition duration-200"
                        title="Remove from Favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div onClick={() => onSelectTool(tool)} className="cursor-pointer">
                        <div className="p-2.5 bg-slate-950 text-amber-500 w-fit rounded-xl border border-slate-850 mb-4">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-white text-base leading-tight group-hover:text-amber-500 transition-colors">{tool.name}</h3>
                        <p className="text-[10px] text-slate-500 font-semibold tracking-wider mt-1 uppercase">{tool.provider}</p>
                        <p className="text-xs text-slate-400 mt-3 line-clamp-2">{tool.tagline}</p>
                      </div>

                      <div className="flex items-center justify-between mt-6 border-t border-slate-800/60 pt-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="text-xs text-slate-300 font-semibold">{tool.rating}</span>
                        </div>
                        <button
                          onClick={() => onSelectTool(tool)}
                          className="text-xs text-amber-500 font-bold hover:underline"
                        >
                          Launch Sandbox →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Quick stats and sub summary */}
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Monthly API Spend</span>
                <span className="block text-3xl font-extrabold text-white mt-2">$29.00</span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-3 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Stripe Auto-renewal Active</span>
                </div>
              </div>

              {/* Central key statistics charts */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-4 block">Unified Usage Statistics</span>
                
                {/* Custom SVG usage bar charts */}
                <div className="h-28 flex items-end justify-between gap-3 mt-4">
                  {[
                    { day: 'Mon', count: 40 },
                    { day: 'Tue', count: 65 },
                    { day: 'Wed', count: 90 },
                    { day: 'Thu', count: 110 },
                    { day: 'Fri', count: 85 },
                    { day: 'Sat', count: 30 },
                    { day: 'Sun', count: 55 },
                  ].map((stat, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-slate-950 rounded-lg relative h-20 overflow-hidden flex items-end">
                        <div 
                          className="bg-amber-500 hover:bg-amber-400 transition w-full rounded-t-lg" 
                          style={{ height: `${(stat.count / 120) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] text-slate-500 font-semibold uppercase mt-1.5">{stat.day}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 text-center block mt-3">Daily API Invocations (Central Proxy)</span>
              </div>
            </div>

            {/* Invoices and orders tables */}
            <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
              <h3 className="font-extrabold text-white text-base mb-4">Past Purchases & Invoices</h3>
              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No orders processed yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase">
                        <th className="pb-3 pr-4">Order ID</th>
                        <th className="pb-3 pr-4">AI Product</th>
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Gateway</th>
                        <th className="pb-3 pr-4">Amount</th>
                        <th className="pb-3">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="text-slate-300 font-medium">
                          <td className="py-3 pr-4 text-slate-500 font-mono text-[10px]">{ord.id}</td>
                          <td className="py-3 pr-4">{ord.toolName}</td>
                          <td className="py-3 pr-4">{ord.date}</td>
                          <td className="py-3 pr-4 capitalize">{ord.paymentMethod}</td>
                          <td className="py-3 pr-4 font-bold text-white">${ord.amount}</td>
                          <td className="py-3">
                            <span className="text-amber-500 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5">
                              <span>PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'keys' && (
          <div className="max-w-3xl p-8 bg-slate-900 border border-slate-800 rounded-3xl">
            <h3 className="font-extrabold text-white text-base mb-2">Centralized Bearer Token</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Generate and copy credentials to route dynamic models through our centralized marketplace gateway (Google Gemini, Anthropic Claude, OpenAI, etc.). Never leak secrets directly to your clients.
            </p>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">ACTIVE API TOKEN</label>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={apiKey}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-700 font-mono text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/30"
                />
                
                <button
                  onClick={handleCopyKey}
                  id="copy-key-btn"
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-xs font-bold">{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-900">
                <button
                  onClick={handleGenerateKey}
                  disabled={loadingKey}
                  id="regenerate-key-btn"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingKey ? 'animate-spin' : ''}`} />
                  <span>{loadingKey ? 'Rolling...' : 'Roll Credentials'}</span>
                </button>
                <span className="text-[10px] text-slate-600 font-medium">
                  Last regenerated: Today
                </span>
              </div>
            </div>

            {/* API guidelines warning */}
            <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/10 text-amber-500 text-xs rounded-2xl flex gap-2.5 leading-relaxed">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Security Alert:</strong> Treat your Bearer token with absolute caution. Sharing this API token allows third parties to consume your active platform credits and billing balances.
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Tickets selector */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-white text-base">Your Tickets</h3>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  id="open-new-ticket-btn"
                  className="p-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Open Ticket</span>
                </button>
              </div>

              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`p-4 rounded-xl border transition cursor-pointer text-left ${
                      activeTicket?.id === t.id 
                        ? 'bg-amber-500/5 border-amber-500/40' 
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">{t.id}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 uppercase font-black rounded ${
                        t.status === 'open' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : t.status === 'in-progress' 
                          ? 'bg-amber-500/10 text-amber-400' 
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{t.title}</h4>
                    <span className="text-[9px] text-slate-500 mt-2 block font-semibold">
                      Updated: {t.lastUpdated}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Ticket Conversation */}
            <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl min-h-[400px] flex flex-col justify-between">
              {activeTicket ? (
                <>
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div>
                        <h3 className="font-extrabold text-white text-base leading-tight">{activeTicket.title}</h3>
                        <span className="text-[10px] text-slate-500 mt-1 block">Category: {activeTicket.category}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{activeTicket.id}</span>
                    </div>

                    {/* Messages Body */}
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-4">
                      {activeTicket.messages.map((msg, i) => (
                        <div 
                          key={i}
                          className={`flex flex-col max-w-[85%] ${
                            msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                          }`}
                        >
                          <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none' 
                              : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-bl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-600 mt-1">{msg.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Input Form */}
                  {activeTicket.status !== 'closed' ? (
                    <form onSubmit={handleSendTicketMessage} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Type reply message..."
                        value={ticketMsg}
                        onChange={(e) => setTicketMsg(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-700 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/30"
                      />
                      <button
                        type="submit"
                        id="submit-ticket-reply-btn"
                        className="px-4 py-3 bg-amber-500 hover:bg-amber-600 transition text-slate-950 rounded-xl flex items-center justify-center"
                      >
                        <Send className="w-4.5 h-4.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-center text-xs text-slate-500">
                      This ticket is closed. Submit a new ticket to open a different inquiry.
                    </div>
                  )}
                </>
              ) : (
                <div className="m-auto text-center text-xs text-slate-500">
                  Select a support ticket from the sidebar to view dialogue logs and replies.
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Main 2FA controls card */}
            <div className="lg:col-span-2 p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Secure your seller and developer credentials with multi-factor OTP validation.</p>
                </div>
              </div>

              {twoFactorStep === 'idle' && (
                <div className="space-y-6">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Two-Factor Authentication (2FA) adds an extra, robust layer of security to your client gateway account. Once configured, logging in or rolling your API tokens will require scanning a time-based single-use passcode (OTP) on your mobile authenticator.
                  </p>

                  {isTwoFactorEnabled ? (
                    <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                          <Check className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 flex-grow">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Multi-Factor Status: SECURED</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Two-Factor Authentication is currently active on your account. Your credentials, products, and API billing gateways are safe.
                          </p>
                          
                          <div className="flex flex-wrap gap-3 pt-4">
                            <button
                              onClick={() => setTwoFactorStep('backup')}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
                            >
                              Show Backup Codes
                            </button>
                            <button
                              onClick={handleDisable2FA}
                              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl text-xs border border-red-500/20 transition"
                            >
                              Disable Two-Factor Auth
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0 mt-0.5">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 flex-grow">
                          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">Multi-Factor Status: UNPROTECTED</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Two-Factor Authentication is disabled. We highly recommend activating 2FA to shield your private keys from potential credential stuffing or phishing attempts.
                          </p>
                          <div className="pt-4">
                            <button
                              onClick={handleStartSetup}
                              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Setup Two-Factor Authentication</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {twoFactorStep === 'setup' && (
                <div className="space-y-6">
                  {/* Step Banner */}
                  <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-500 uppercase">Configuration Wizard</span>
                    <span className="text-[10px] text-slate-500">Step 1 of 2: Verification</span>
                  </div>

                  {/* Wizard instructions and assets */}
                  <div className="space-y-5 text-xs text-slate-300">
                    <div className="space-y-2">
                      <span className="font-extrabold text-white">1. Scan QR Code on Mobile App</span>
                      <p className="text-slate-400">
                        Open your authenticator app (such as Google Authenticator, Authy, or Microsoft Authenticator) and scan the QR barcode below:
                      </p>
                    </div>

                    {/* Interactive QR and Secret section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-950 rounded-2xl border border-slate-850">
                      {/* Detailed Realistic Vector QR Code */}
                      <svg width="130" height="130" viewBox="0 0 29 29" fill="none" className="bg-white p-2 rounded-xl shrink-0">
                        <path d="M0,0 h7 v7 h-7 z M1,1 h5 v5 h-5 z M2,2 h3 v3 h-3 z" fill="#0f172a" />
                        <path d="M22,0 h7 v7 h-7 z M23,1 h5 v5 h-5 z M24,2 h3 v3 h-3 z" fill="#0f172a" />
                        <path d="M0,22 h7 v7 h-7 z M1,23 h5 v5 h-5 z M2,24 h3 v3 h-3 z" fill="#0f172a" />
                        <path d="M20,20 h5 v5 h-5 z M21,21 h3 v3 h-3 z" fill="#0f172a" />
                        <rect x="9" y="1" width="2" height="2" fill="#0f172a" />
                        <rect x="14" y="0" width="1" height="3" fill="#0f172a" />
                        <rect x="18" y="2" width="2" height="1" fill="#0f172a" />
                        <rect x="10" y="5" width="3" height="1" fill="#0f172a" />
                        <rect x="15" y="4" width="2" height="2" fill="#0f172a" />
                        <rect x="1" y="9" width="2" height="2" fill="#0f172a" />
                        <rect x="5" y="10" width="2" height="1" fill="#0f172a" />
                        <rect x="0" y="14" width="3" height="1" fill="#0f172a" />
                        <rect x="4" y="16" width="1" height="3" fill="#0f172a" />
                        <rect x="9" y="9" width="4" height="4" fill="#0f172a" />
                        <rect x="10" y="10" width="2" height="2" fill="white" />
                        <rect x="16" y="9" width="3" height="2" fill="#0f172a" />
                        <rect x="22" y="9" width="2" height="1" fill="#0f172a" />
                        <rect x="26" y="11" width="3" height="2" fill="#0f172a" />
                        <rect x="9" y="16" width="2" height="3" fill="#0f172a" />
                        <rect x="13" y="15" width="3" height="1" fill="#0f172a" />
                        <rect x="15" y="18" width="2" height="2" fill="#0f172a" />
                        <rect x="20" y="14" width="4" height="1" fill="#0f172a" />
                        <rect x="26" y="15" width="2" height="3" fill="#0f172a" />
                        <rect x="22" y="18" width="2" height="1" fill="#0f172a" />
                      </svg>

                      {/* Secret text fallback */}
                      <div className="space-y-2 flex-grow w-full">
                        <span className="block text-[10px] font-bold text-slate-500 uppercase">Secret Entry Key</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={tempSecret}
                            className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 font-mono text-[10px] text-slate-200 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(tempSecret);
                              alert('Secret Key copied to clipboard!');
                            }}
                            className="px-3 bg-slate-900 border border-slate-850 hover:bg-slate-800 transition rounded-xl text-slate-400 hover:text-white"
                            title="Copy Key"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          If your scanner camera fails to respond, type this key manually into your authenticator app.
                        </p>
                      </div>
                    </div>

                    {/* Simulated assistant helper banner for sandbox testing */}
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
                      <div className="flex items-start gap-2">
                        <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="block text-[10px] uppercase font-bold text-indigo-300">Developer Sandbox Assist</strong>
                          <p className="text-[11px] mt-0.5 leading-relaxed">
                            To simulate scanning, enter the following 6-digit OTP code currently running in your device's virtual pipeline: <span className="font-mono font-black text-amber-500 text-sm tracking-wider underline">{simulatedCode}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Verification input section */}
                    <div className="space-y-3 pt-2">
                      <span className="font-extrabold text-white block">2. Enter Verification Code</span>
                      <form onSubmit={handleVerify2FA} className="space-y-4">
                        <div>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            placeholder="e.g. 000000"
                            value={verificationCodeInput}
                            onChange={(e) => setVerificationCodeInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full sm:w-64 bg-slate-950 border border-slate-800/80 text-center text-slate-200 font-mono text-xl tracking-widest rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition placeholder-slate-800"
                          />
                          {verificationError && (
                            <p className="text-xs text-red-400 mt-2.5 flex items-center gap-1.5 font-semibold">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{verificationError}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                          >
                            Verify & Continue
                          </button>
                          <button
                            type="button"
                            onClick={() => setTwoFactorStep('idle')}
                            className="px-5 py-2.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs transition"
                          >
                            Cancel Setup
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {twoFactorStep === 'backup' && (
                <div className="space-y-6">
                  {/* Step Banner */}
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Verification Successful</span>
                    <span className="text-[10px] text-slate-500">Step 2 of 2: Save Backups</span>
                  </div>

                  <div className="space-y-4 text-xs text-slate-300">
                    <h4 className="font-extrabold text-white">Save Your Secure Backup Codes</h4>
                    <p className="text-slate-400 leading-relaxed">
                      If you lose access to your authenticator application or your mobile phone, you can bypass the 2FA screen by keying in one of these single-use recovery tokens. Store them offline or in a trusted password manager.
                    </p>

                    {/* Codes display grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-850">
                      {backupCodes.map((code, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-center font-mono text-xs text-amber-500 select-all font-bold tracking-wider">
                          {code}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4">
                      <button
                        onClick={handleCopyBackup}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedBackup ? 'Copied Backup List!' : 'Copy Recovery Codes'}</span>
                      </button>
                      <button
                        onClick={() => setTwoFactorStep('idle')}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                      >
                        Complete Setup
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Security Health Checklist panel */}
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Security Health Audit</span>
                
                <div className="space-y-4">
                  {/* Health checks */}
                  {[
                    { label: 'Authorized Session Key', status: true, desc: 'Lumina central proxy token is valid.' },
                    { label: 'Secure Email Verification', status: true, desc: `Verified via email login (${currentUser ? currentUser.email : 'maisieclarke@gmail.com'})` },
                    { label: 'Device Multi-Factor Status', status: isTwoFactorEnabled, desc: isTwoFactorEnabled ? '2FA is active and secure.' : '2FA is disabled. Configure OTP setup.' },
                    { label: 'Sandbox Sandbox Encryption', status: true, desc: 'Standard HTTPS transport protocol active.' },
                  ].map((check, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex gap-3">
                      <div className={`p-1 rounded-lg shrink-0 h-fit mt-0.5 ${
                        check.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {check.status ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-white block leading-tight">{check.label}</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{check.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security advice Card */}
              <div className="p-5 bg-gradient-to-br from-amber-500/5 to-slate-900 border border-slate-850 rounded-2xl text-xs leading-relaxed text-slate-400 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wider text-[10px]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Developer Best Practices</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Never commit plain-text credentials to code repositories. We recommend using server environment configurations alongside Lumina\'s dynamic proxy key mapping system.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* New Ticket Modal popup */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowNewTicketModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-extrabold text-white mb-2">Open Support Ticket</h3>
            <p className="text-xs text-slate-400 mb-6">Describe technical issues or billing inquiries</p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Ticket Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe checkout fails"
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500 text-xs transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Category</label>
                <select
                  value={newTicketCat}
                  onChange={(e) => setNewTicketCat(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-xs transition"
                >
                  <option value="Technical">Technical Integration</option>
                  <option value="Billing">Billing & Stripe Transactions</option>
                  <option value="Creator Account">Creator Profile</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs mt-4 transition"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
