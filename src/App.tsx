import React, { useState } from 'react';
import { 
  Cpu, LogIn, LogOut, Menu, X, Sparkles, BookOpen, Layers, User, Settings, ShieldAlert, Search
} from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { Marketplace } from './components/Marketplace';
import { ToolDetail } from './components/ToolDetail';
import { UserDashboard } from './components/UserDashboard';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminPanel } from './components/AdminPanel';
import { CodebaseHub } from './components/CodebaseHub';
import { AuthModal } from './components/AuthModal';
import { aiTools as initialTools, reviews as initialReviews } from './data';
import { AITool, Order, Review } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'marketplace' | 'detail' | 'user-dash' | 'vendor-dash' | 'admin-dash' | 'code-hub'>('landing');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: 'user' | 'vendor' | 'admin' } | null>(null);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global AI Tools state
  const [tools, setTools] = useState<AITool[]>(initialTools);
  
  // Buyer purchased tools
  const [purchasedTools, setPurchasedTools] = useState<AITool[]>([
    initialTools[0], // Pre-purchase OmniChat Pro for initial dashboard visual appeal
    initialTools[1], // Pre-purchase NovaArt Canvas
  ]);

  // Wishlisted tools local state
  const [wishlist, setWishlist] = useState<string[]>([
    initialTools[2]?.id || '3' // Seed ScribeSaaS Copywriter as a favorite tool initially
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Global Reviews State
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);

  const handleAddReview = (newReview: Review) => {
    setReviewsList((prev) => [newReview, ...prev]);
  };

  const handleToggleWishlist = (tool: AITool) => {
    if (wishlist.includes(tool.id)) {
      setWishlist(wishlist.filter(id => id !== tool.id));
    } else {
      setWishlist([...wishlist, tool.id]);
    }
  };

  // Orders Log
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-7012',
      toolId: '1',
      toolName: 'OmniChat Pro',
      toolIcon: 'MessageSquare',
      date: 'July 14, 2026',
      amount: 15.00,
      status: 'paid',
      paymentMethod: 'stripe',
      billingPeriod: 'monthly',
      type: 'subscription'
    },
    {
      id: 'ORD-4029',
      toolId: '2',
      toolName: 'NovaArt Canvas',
      toolIcon: 'Image',
      date: 'July 10, 2026',
      amount: 29.00,
      status: 'paid',
      paymentMethod: 'paypal',
      type: 'one-time'
    }
  ]);

  const handleLoginSuccess = (user: { name: string; email: string; role: 'user' | 'vendor' | 'admin' }) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveView('admin-dash');
    } else if (user.role === 'vendor') {
      setActiveView('vendor-dash');
    } else {
      setActiveView('user-dash');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const handleSelectTool = (tool: AITool) => {
    setSelectedTool(tool);
    setActiveView('detail');
  };

  const handlePublishTool = (newTool: AITool) => {
    setTools([newTool, ...tools]);
  };

  const handleApproveTool = (id: string) => {
    // Approve tool mockup: currently all tools are in list, but we can toggle status
    alert('Tool approved and launched to marketplace catalogue successfully!');
  };

  const handleDeleteTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const handlePurchaseSuccess = (tool: AITool) => {
    if (purchasedTools.some(p => p.id === tool.id)) {
      alert(`You already own a license for ${tool.name}. Launching playground!`);
      setActiveView('detail');
      return;
    }

    // Process new mock order
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      toolId: tool.id,
      toolName: tool.name,
      toolIcon: tool.iconName,
      date: 'Today',
      amount: tool.price,
      status: 'paid',
      paymentMethod: 'stripe',
      billingPeriod: tool.pricingType === 'subscription' ? 'monthly' : undefined,
      type: tool.pricingType,
    };

    setOrders([newOrder, ...orders]);
    setPurchasedTools([tool, ...purchasedTools]);
    
    alert(`Payment successful! Stripe license active. ${tool.name} added to your active dashboard.`);
    setActiveView('user-dash');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 flex flex-col justify-between">
      
      {/* GLOBAL HEADER BAR */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2 cursor-pointer group"
            id="brand-logo"
          >
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">Lumina AI</span>
          </div>

          {/* Persistent Header Search Input (filters marketplace in real-time) */}
          {activeView === 'marketplace' && (
            <div className="hidden sm:block flex-grow max-w-xs md:max-w-md mx-4 md:mx-8 relative" id="header-search-container">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <input
                type="text"
                id="header-nav-search-bar"
                placeholder="Search tools by name or category tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800/80 focus:border-amber-500/50 text-xs text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs"
                  title="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveView('landing')}
              className={`text-xs font-bold transition uppercase tracking-wider ${activeView === 'landing' ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('marketplace')}
              id="nav-marketplace"
              className={`text-xs font-bold transition uppercase tracking-wider ${activeView === 'marketplace' || activeView === 'detail' ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveView('code-hub')}
              id="nav-code-hub"
              className={`text-xs font-bold transition uppercase tracking-wider flex items-center gap-1.5 ${activeView === 'code-hub' ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>SaaS Codebase</span>
            </button>
            
            {/* Conditional dashboards */}
            {currentUser && (
              <>
                <button
                  onClick={() => setActiveView('user-dash')}
                  id="nav-buyer-dash"
                  className={`text-xs font-bold transition uppercase tracking-wider ${activeView === 'user-dash' ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}
                >
                  My Tools
                </button>
                {currentUser.role === 'vendor' && (
                  <button
                    onClick={() => setActiveView('vendor-dash')}
                    id="nav-vendor-dash"
                    className={`text-xs font-bold transition uppercase tracking-wider ${activeView === 'vendor-dash' ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}
                  >
                    Creator Portal
                  </button>
                )}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setActiveView('admin-dash')}
                    id="nav-admin-dash"
                    className={`text-xs font-bold transition uppercase tracking-wider ${activeView === 'admin-dash' ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}
                  >
                    Admin Core
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Actions button */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <User className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-300 truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  id="logout-btn"
                  className="p-2 text-slate-500 hover:text-red-400 rounded-xl transition hover:bg-slate-900"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                id="open-auth-modal"
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-amber-500" />
                <span>Sign In / Sandbox</span>
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-900 px-6 py-4 space-y-3.5 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <button 
              onClick={() => { setActiveView('landing'); setMobileMenuOpen(false); }} 
              className="w-full text-left py-2 hover:text-amber-500"
            >
              Overview
            </button>
            <button 
              onClick={() => { setActiveView('marketplace'); setMobileMenuOpen(false); }} 
              className="w-full text-left py-2 hover:text-amber-500"
            >
              Marketplace
            </button>
            <button 
              onClick={() => { setActiveView('code-hub'); setMobileMenuOpen(false); }} 
              className="w-full text-left py-2 hover:text-amber-500"
            >
              SaaS Codebase
            </button>

            {currentUser && (
              <>
                <button 
                  onClick={() => { setActiveView('user-dash'); setMobileMenuOpen(false); }} 
                  className="w-full text-left py-2 hover:text-amber-500"
                >
                  My Tools
                </button>
                {currentUser.role === 'vendor' && (
                  <button 
                    onClick={() => { setActiveView('vendor-dash'); setMobileMenuOpen(false); }} 
                    className="w-full text-left py-2 hover:text-amber-500"
                  >
                    Creator Portal
                  </button>
                )}
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => { setActiveView('admin-dash'); setMobileMenuOpen(false); }} 
                    className="w-full text-left py-2 hover:text-amber-500"
                  >
                    Admin Core
                  </button>
                )}
              </>
            )}

            <div className="border-t border-slate-900 pt-4 mt-2">
              {currentUser ? (
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 text-red-400 flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button 
                  onClick={() => { setIsAuthOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 text-amber-500 flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Sandbox</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* CORE VIEWPORT */}
      <main className="flex-grow">
        {activeView === 'landing' && (
          <LandingPage 
            onExploreMarketplace={() => setActiveView('marketplace')}
            onSelectTool={handleSelectTool}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
        
        {activeView === 'marketplace' && (
          <Marketplace 
            onSelectTool={handleSelectTool}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeView === 'detail' && selectedTool && (
          <ToolDetail 
            tool={selectedTool}
            onBack={() => setActiveView('marketplace')}
            onSelectTool={handleSelectTool}
            onOpenAuth={() => setIsAuthOpen(true)}
            onPurchaseSuccess={handlePurchaseSuccess}
            currentUser={currentUser}
            purchasedTools={purchasedTools}
            reviewsList={reviewsList}
            onAddReview={handleAddReview}
          />
        )}

        {activeView === 'user-dash' && (
          <UserDashboard 
            purchasedTools={purchasedTools}
            onSelectTool={handleSelectTool}
            orders={orders}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeView === 'vendor-dash' && (
          <VendorDashboard 
            onPublishTool={handlePublishTool}
            myTools={tools.filter(t => t.author === 'Alex Creator')}
          />
        )}

        {activeView === 'admin-dash' && (
          <AdminPanel 
            tools={tools}
            onApproveTool={handleApproveTool}
            onDeleteTool={handleDeleteTool}
          />
        )}

        {activeView === 'code-hub' && (
          <CodebaseHub />
        )}
      </main>

      {/* LOGIN/REGISTER DIALOG BOX */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
