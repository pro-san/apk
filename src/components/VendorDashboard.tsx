import React, { useState } from 'react';
import { 
  BarChart3, Plus, Wallet, Percent, CheckCircle2, ArrowUpRight, 
  Settings, Trash2, Cpu 
} from 'lucide-react';
import { AITool } from '../types';
import { VendorChart } from './VendorChart';

interface VendorDashboardProps {
  onPublishTool: (newTool: AITool) => void;
  myTools: AITool[];
}

export function VendorDashboard({ onPublishTool, myTools }: VendorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'publish' | 'coupons'>('analytics');
  
  // Coupons list
  const [coupons, setCoupons] = useState([
    { code: 'SUMMER50', discount: '50%', type: 'Percentage', status: 'active', usage: '42' },
    { code: 'LAUNCH20', discount: '20%', type: 'Percentage', status: 'active', usage: '128' },
    { code: 'WELCOME10', discount: '$10', type: 'Fixed', status: 'expired', usage: '15' }
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');

  // Form parameters
  const [toolName, setToolName] = useState('');
  const [toolTagline, setToolTagline] = useState('');
  const [toolDesc, setToolDesc] = useState('');
  const [toolCategory, setToolCategory] = useState('chat');
  const [toolPrice, setToolPrice] = useState('19');
  const [toolDemoType, setToolDemoType] = useState<'chat' | 'image' | 'copywriter' | 'audio'>('chat');
  const [toolDoc, setToolDoc] = useState('');
  const [toolFeatures, setToolFeatures] = useState('Dual-model completion, Markdown structure');

  // Withdrawal logic
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('240.00');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newDiscount.trim()) return;

    setCoupons([
      { code: newCode.toUpperCase(), discount: newDiscount, type: 'Percentage', status: 'active', usage: '0' },
      ...coupons
    ]);
    setNewCode('');
    setNewDiscount('');
    alert('Coupon code published successfully!');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !toolTagline.trim()) return;

    const featsArray = toolFeatures.split(',').map(f => f.trim()).filter(Boolean);

    const newTool: AITool = {
      id: String(Date.now()),
      name: toolName,
      slug: toolName.toLowerCase().replace(/\s+/g, '-'),
      tagline: toolTagline,
      description: toolDesc,
      features: featsArray.length > 0 ? featsArray : ['Dynamic proxy queries', 'Bearer authentication support'],
      category: toolCategory,
      rating: 5.0,
      ratingCount: 1,
      price: Number(toolPrice) || 19,
      pricingType: 'subscription',
      iconName: 'Cpu',
      gallery: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
      ],
      demoType: toolDemoType,
      documentation: toolDoc || 'Integration requires authenticating via Lumina token and calling the POST routes directly.',
      reviewsCount: 0,
      author: 'Alex Creator',
      provider: 'Google Gemini',
      isFeatured: false,
      isTrending: false
    };

    onPublishTool(newTool);
    
    // Clear form
    setToolName('');
    setToolTagline('');
    setToolDesc('');
    setToolDoc('');
    setActiveTab('analytics');
    alert('Congratulations! Your AI tool has been registered and is now live in the directory.');
  };

  return (
    <div className="vendor-dashboard bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Creator Header */}
        <div className="mb-10 p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/20 border border-slate-900 rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-extrabold">Creator Dashboard</span>
              <h1 className="text-3xl font-extrabold text-white mt-1">Hello, Alex Creator</h1>
              <p className="text-xs text-slate-400 mt-1">Publish tools, create subscriptions, manage discount coupon systems, or request withdrawals.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Sales & Stats</span>
              </button>
              <button
                onClick={() => setActiveTab('publish')}
                id="tab-publish-tool"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeTab === 'publish' ? 'bg-indigo-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Publish AI Tool</span>
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeTab === 'coupons' ? 'bg-indigo-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                <Percent className="w-4 h-4" />
                <span>Coupons System</span>
              </button>
            </div>
          </div>
        </div>

        {/* SUB VIEWS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Gross Sales Earnings</span>
                <span className="block text-3xl font-extrabold text-white mt-2">$3,420.00</span>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="mt-4 text-xs font-bold text-indigo-400 flex items-center gap-1 hover:underline"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Withdraw Balance</span>
                </button>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Active Subscriptions</span>
                <span className="block text-3xl font-extrabold text-white mt-2">128 Users</span>
                <span className="text-[10px] text-emerald-400 block mt-2 font-medium">↑ 12% relative to yesterday</span>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Platform Viewers</span>
                <span className="block text-3xl font-extrabold text-white mt-2">14,208 Views</span>
                <span className="text-[10px] text-indigo-400 block mt-2 font-medium">Conversion: 2.8% avg</span>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase">My Published Tools</span>
                <span className="block text-3xl font-extrabold text-white mt-2">{myTools.length} live</span>
                <span className="text-[10px] text-slate-500 block mt-2 font-medium">Category distribution active</span>
              </div>
            </div>

            {/* Sales Chart & Registered tools list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2">
                <VendorChart />
              </div>

              {/* My list tools */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
                <h3 className="font-extrabold text-white text-base mb-4">My AI Products ({myTools.length})</h3>
                <div className="space-y-3.5">
                  {myTools.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <Cpu className="w-5 h-5 text-indigo-400" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{t.name}</h4>
                          <span className="text-[9px] text-slate-500 capitalize">{t.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-300">${t.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="max-w-4xl p-8 bg-slate-900 border border-slate-800 rounded-3xl">
            <div className="mb-6">
              <h3 className="font-extrabold text-white text-base">Register Your AI Tool</h3>
              <p className="text-xs text-slate-400 mt-1">Complete your registration to deploy your model proxy and start earning sales commissions.</p>
            </div>

            <form onSubmit={handlePublish} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">AI Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SynthVocal AI"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Short Tagline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Realistic voiceover generator"
                    value={toolTagline}
                    onChange={(e) => setToolTagline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Long Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide an overview describing technical capabilities, training data parameters, or output styles..."
                  value={toolDesc}
                  onChange={(e) => setToolDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs transition leading-relaxed placeholder-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Category Capability</label>
                  <select
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs transition"
                  >
                    <option value="chat">AI Chat</option>
                    <option value="image">AI Image</option>
                    <option value="writing">AI Writing</option>
                    <option value="audio">AI Audio</option>
                    <option value="music">AI Music</option>
                    <option value="productivity">AI Productivity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Interactive Sandbox Interface</label>
                  <select
                    value={toolDemoType}
                    onChange={(e) => setToolDemoType(e.target.value as any)}
                    className="w-full px-3 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs transition"
                  >
                    <option value="chat">Conversational Chat Interface</option>
                    <option value="image">Aspect Ratio Image Sandbox</option>
                    <option value="copywriter">Copywriting template generator</option>
                    <option value="audio">Text to speech synthesizer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Monthly Price License (USD)</label>
                  <input
                    type="number"
                    required
                    placeholder="19"
                    value={toolPrice}
                    onChange={(e) => setToolPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Feature Highlights (Comma separated list)</label>
                <input
                  type="text"
                  placeholder="e.g. Real-time translation, High-fidelity voice synthesis, 24kHz download"
                  value={toolFeatures}
                  onChange={(e) => setToolFeatures(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">API Integration & Documentation Guide</label>
                <textarea
                  rows={3}
                  placeholder="Draft guides for endpoint integrations, required request headers, parameters, etc."
                  value={toolDoc}
                  onChange={(e) => setToolDoc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs transition leading-relaxed placeholder-slate-700"
                />
              </div>

              <button
                type="submit"
                id="submit-new-tool-btn"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 transition font-bold text-white rounded-xl text-xs mt-4 shadow-lg"
              >
                Publish AI Tool
              </button>
            </form>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create Coupon form */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
              <h3 className="font-extrabold text-white text-base mb-4">Create Coupon Code</h3>
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">CODE VALUE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH30"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">DISCOUNT PERCENT/AMOUNT</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30% or $15"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs transition"
                  />
                </div>
                <button
                  type="submit"
                  id="submit-coupon-btn"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition font-bold text-white rounded-xl text-xs mt-2"
                >
                  Publish Coupon
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit">
              <h3 className="font-extrabold text-white text-base mb-4">Active Coupons Systems</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase">
                      <th className="pb-3 pr-4">Code</th>
                      <th className="pb-3 pr-4">Reduction</th>
                      <th className="pb-3 pr-4">Uses</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {coupons.map((c, i) => (
                      <tr key={i} className="text-slate-300 font-medium">
                        <td className="py-3 pr-4 font-mono font-bold text-white">{c.code}</td>
                        <td className="py-3 pr-4 text-emerald-400 font-bold">{c.discount}</td>
                        <td className="py-3 pr-4">{c.usage} times</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-850 text-slate-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Withdraw balance modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-extrabold text-white mb-2">Request Withdrawal</h3>
            <p className="text-xs text-slate-400 mb-6">Dispatch earnings to your verified bank or PayPal account</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Withdrawal request of $${withdrawAmount} submitted! Processing timeframe: 24-48 business hours.`);
              setShowWithdrawModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Amount to Withdraw (USD)</label>
                <input
                  type="number"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 text-xs font-bold transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Disbursement Gateway</label>
                <select className="w-full px-3 py-3 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs transition">
                  <option value="stripe">Direct Bank Wire (Stripe Connect)</option>
                  <option value="paypal">PayPal Direct Account Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs mt-4 transition"
              >
                Confirm Dispatch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
