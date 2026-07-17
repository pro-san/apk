import React, { useState } from 'react';
import { 
  Cpu, CreditCard, Activity, Key, Ticket, Plus, CheckCircle2, 
  Copy, ExternalLink, RefreshCw, Send, AlertCircle, Heart, Trash2, Star 
} from 'lucide-react';
import { AITool, SupportTicket, Order } from '../types';
import { aiTools } from '../data';

interface UserDashboardProps {
  purchasedTools: AITool[];
  onSelectTool: (tool: AITool) => void;
  orders: Order[];
  wishlist: string[];
  onToggleWishlist: (tool: AITool) => void;
}

export function UserDashboard({ 
  purchasedTools, 
  onSelectTool, 
  orders, 
  wishlist, 
  onToggleWishlist 
}: UserDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'tools' | 'favorites' | 'billing' | 'keys' | 'support'>('tools');
  const [apiKey, setApiKey] = useState('lumina_live_pk_8b24ef09da7812bc');
  const [isCopied, setIsCopied] = useState(false);
  const [loadingKey, setLoadingKey] = useState(false);

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
              <span className="text-[10px] uppercase tracking-wider text-amber-500 font-extrabold">Active Buyer Account</span>
              <h1 className="text-3xl font-extrabold text-white mt-1">Hello, Maisie Clarke</h1>
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
