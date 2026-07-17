import React, { useState } from 'react';
import { 
  ArrowRight, Search, Sparkles, MessageSquare, Image, FileText, 
  Mic, Music, Cpu, Star, Check, HelpCircle, ArrowUpRight 
} from 'lucide-react';
import { categories, aiTools, blogPosts, faqs } from '../data';
import { AITool } from '../types';

interface LandingPageProps {
  onExploreMarketplace: () => void;
  onSelectTool: (tool: AITool) => void;
  onOpenAuth: () => void;
}

export function LandingPage({ onExploreMarketplace, onSelectTool, onOpenAuth }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreMarketplace();
  };

  // Map icon names to lucide components safely
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className="w-6 h-6" />;
      case 'Image': return <Image className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'Mic': return <Mic className="w-6 h-6" />;
      case 'Music': return <Music className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <div className="landing-page bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-20 border-b border-slate-900/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.07),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-500 font-bold mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Next Generation Multi-Model AI Marketplace</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Discover & Access the Best <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                AI Engines in One Place
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
              Explore, purchase, subscribe, and directly invoke premium models like Gemini, Claude, and OpenAI via a single unified dashboard and developer API.
            </p>

            {/* Prompt Search Mockup */}
            <form onSubmit={handleSearchSubmit} className="mt-10 max-w-xl mx-auto flex gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl focus-within:border-amber-500/50 transition">
              <div className="flex items-center pl-3 text-slate-500 flex-1">
                <Search className="w-5 h-5 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="What tool or model are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                />
              </div>
              <button 
                type="submit"
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 transition font-bold text-slate-950 rounded-xl text-sm flex items-center gap-1.5"
              >
                <span>Browse</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-12 text-center border-t border-slate-900 pt-8">
              <div>
                <span className="block text-2xl font-extrabold text-white">50+</span>
                <span className="text-xs text-slate-500 mt-0.5 block">Premium Tools</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-white">10k+</span>
                <span className="text-xs text-slate-500 mt-0.5 block">Active Builders</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-white">99.9%</span>
                <span className="text-xs text-slate-500 mt-0.5 block">Uptime SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Browse by Capability</h2>
          <p className="text-sm text-slate-400 mt-2">Filter and inspect tools designed specifically for your stack workflow</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={onExploreMarketplace}
              className="p-6 bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-3xl cursor-pointer hover:bg-slate-900 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-950/80 border border-slate-800 text-amber-500 w-fit rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="text-lg font-bold text-white mt-5 flex items-center gap-1.5">
                <span>{cat.name}</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {cat.description}
              </p>
              <span className="text-[10px] text-slate-500 mt-4 block font-semibold">
                {cat.count} AVAILABLE TOOLS
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED TOOLS */}
      <section className="py-20 bg-slate-900/20 border-y border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-500">Curated Staff Picks</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Featured AI Engines</h2>
            </div>
            <button 
              onClick={onExploreMarketplace}
              className="text-amber-500 hover:text-amber-400 font-bold text-sm mt-3 sm:mt-0 flex items-center gap-1.5 transition"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiTools.filter(t => t.isFeatured).map((tool) => (
              <div 
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-amber-500/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl">
                      {getCategoryIcon(tool.iconName)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                      <p className="text-xs text-slate-500">By {tool.author}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.features.slice(0, 3).map((feat, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-950 text-slate-400 border border-slate-800 text-[10px] rounded-lg">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-auto">
                  <div className="flex items-center gap-1 text-sm text-amber-500 font-semibold">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{tool.rating}</span>
                    <span className="text-slate-500">({tool.ratingCount})</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    ${tool.price}{tool.pricingType === 'subscription' ? '/mo' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI MODEL MULTI-PROVIDER ABSTRACTS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold text-amber-500 tracking-wider">Multi-Provider Adapter Layers</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Integrated Premium Foundations
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Our platform features an abstraction routing engine, allowing you to run, swap, and scale models across the leading AI providers seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Google Gemini 3.5', tag: 'Fast, Multi-Modal', color: 'border-blue-500/20 text-blue-400 bg-blue-500/5' },
            { name: 'Anthropic Claude', tag: 'Elite Logic, Coding', color: 'border-amber-500/20 text-amber-400 bg-amber-500/5' },
            { name: 'OpenAI GPT-4o', tag: 'Creative, High-Speed', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' },
            { name: 'ElevenLabs', tag: 'Emotional Voices', color: 'border-purple-500/20 text-purple-400 bg-purple-500/5' },
          ].map((prov, i) => (
            <div 
              key={i}
              className={`p-5 rounded-2xl border text-center ${prov.color}`}
            >
              <h3 className="font-bold text-white text-base">{prov.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{prov.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING PLANS */}
      <section className="py-20 bg-slate-900/20 border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-500">Flexible SaaS Licenses</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Simple Pricing, Cancel Anytime</h2>
            <p className="text-sm text-slate-400 mt-2">Discover tools for individual builders or configure commercial enterprise scale APIs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter Pass',
                price: 'Free',
                desc: 'Perfect for sandbox testing and discovering tools',
                features: ['Access to Free AI tools', 'Interactive sandbox playgounds', 'Up to 5 API calls per day', 'Community forum support'],
                buttonText: 'Start Exploring',
                popular: false,
              },
              {
                name: 'Builder Pro',
                price: '$29',
                period: '/month',
                desc: 'Ideal for professionals, creators, and active developers',
                features: ['Access all featured & trending tools', 'Unlimited playground interactions', 'Generate custom developer API keys', 'Stripe invoice billing', 'Priority email support'],
                buttonText: 'Subscribe Now',
                popular: true,
              },
              {
                name: 'Enterprise Adapter',
                price: 'Custom',
                desc: 'Tailored for heavy volumes, dedicated hardware, or companies',
                features: ['SLA uptime guarantees', 'Whitelabel dashboard deployment', 'Relational DB replication', 'Custom multi-provider abstractions', '24/7 dedicated support representative'],
                buttonText: 'Contact Sales',
                popular: false,
              },
            ].map((plan, i) => (
              <div 
                key={i}
                className={`p-8 bg-slate-900 rounded-3xl border flex flex-col justify-between ${
                  plan.popular ? 'border-amber-500 shadow-xl relative' : 'border-slate-800'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] uppercase font-black rounded-full tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-2">{plan.desc}</p>
                  
                  <div className="my-6 text-3xl font-extrabold text-white flex items-baseline">
                    <span>{plan.price}</span>
                    {plan.period && <span className="text-sm font-normal text-slate-500">{plan.period}</span>}
                  </div>

                  <ul className="space-y-3 border-t border-slate-800/80 pt-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={onOpenAuth}
                  className={`w-full py-3 rounded-xl mt-8 font-bold text-sm transition ${
                    plan.popular 
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-500">Client Reviews</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Trusted by 10,000+ Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Alex Henderson', role: 'SaaS Founder', text: 'Integrating Gemini & Claude in one place saved our engineering team weeks of writing API wrappers. Brilliant marketplace design!' },
            { name: 'Pharith Lim', role: 'Content Lead', text: 'ScribeSaaS copywriting templates are extremely polished. Best prompt engineering results I have encountered.' },
            { name: 'Kylie Roberts', role: 'Digital Illustrator', text: 'NovaArt Canvas produces incredibly detailed assets for our social feeds. The 16:9 cinematic outputs are masterfully rendered.' }
          ].map((rev, i) => (
            <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <p className="text-sm text-slate-300 italic leading-relaxed">"{rev.text}"</p>
              <div className="flex items-center gap-3 mt-6 border-t border-slate-800/60 pt-4">
                <div className="w-9 h-9 bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center rounded-full text-xs">
                  {rev.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                  <span className="text-[10px] text-slate-500">{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ COMPONENT */}
      <section className="py-20 bg-slate-900/20 border-t border-slate-900/60 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400 mt-2">Answers regarding subscriptions, licenses, and creator tools</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div 
                key={i} 
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-white font-bold hover:bg-slate-800/40 transition"
                >
                  <span className="text-sm">{faq.q}</span>
                  <HelpCircle className={`w-5 h-5 text-amber-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-slate-400 text-xs leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. LATEST BLOG */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-t border-slate-900/60">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-500">Tech Insights</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">From Our Blog</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <div 
              key={post.id}
              className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/20 transition duration-300"
            >
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="px-2.5 py-0.5 bg-slate-950 text-amber-500 rounded-full font-bold">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug hover:text-amber-400 transition cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="text-xs font-bold text-amber-500 hover:text-amber-400 cursor-pointer mt-4 inline-flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900/80 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-black text-white tracking-tight">Lumina AI</span>
            </div>
            <p className="leading-relaxed">
              Discover and build with high-performing multi-model AI adapters. Single dashboard, centralized invoices.
            </p>
          </div>
          <div>
            <h4 className="text-slate-300 font-bold mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li><button onClick={onExploreMarketplace} className="hover:text-amber-500 transition">AI Chat Assistants</button></li>
              <li><button onClick={onExploreMarketplace} className="hover:text-amber-500 transition">Image Generator</button></li>
              <li><button onClick={onExploreMarketplace} className="hover:text-amber-500 transition">Copywriter Templates</button></li>
              <li><button onClick={onExploreMarketplace} className="hover:text-amber-500 transition">Audio & Vocals</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-300 font-bold mb-4">Developer Tools</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-600">Centralized REST API</span></li>
              <li><span className="text-slate-600">Laravel 12 Service</span></li>
              <li><span className="text-slate-600">Vue 3 Frontend Views</span></li>
              <li><span className="text-slate-600">Docker Installer</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-300 font-bold mb-4">Platform Info</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-600">SLA & Terms of Use</span></li>
              <li><span className="text-slate-600">Privacy Guidelines</span></li>
              <li><span className="text-slate-600">Help Desk Support</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 mt-12 pt-6 text-center">
          <p>© 2026 Lumina AI Marketplace. Inspired by AICambo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
