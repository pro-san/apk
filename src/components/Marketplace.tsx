import React, { useState, useMemo } from 'react';
import { 
  Search, Sliders, MessageSquare, Image, FileText, Mic, Music, Cpu, 
  Star, Filter, RefreshCw, Layers, Trash2, AlertCircle, Heart
} from 'lucide-react';
import { categories, aiTools } from '../data';
import { AITool } from '../types';

interface MarketplaceProps {
  onSelectTool: (tool: AITool) => void;
  wishlist: string[];
  onToggleWishlist: (tool: AITool) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Marketplace({ onSelectTool, wishlist, onToggleWishlist, searchQuery, setSearchQuery }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'one-time' | 'subscription'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [compareList, setCompareList] = useState<AITool[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareWarning, setCompareWarning] = useState<string | null>(null);

  // Map category icons safely
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
      case 'Image': return <Image className="w-4 h-4" />;
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'Mic': return <Mic className="w-4 h-4" />;
      case 'Music': return <Music className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  // Filter tools
  const filteredTools = useMemo(() => {
    return aiTools.filter((tool) => {
      const matchCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      
      const categoryObj = categories.find(c => c.id === tool.category);
      const categoryName = categoryObj ? categoryObj.name.toLowerCase() : '';
      const query = searchQuery.toLowerCase().trim();
      
      const matchSearch = !query || 
                          tool.name.toLowerCase().includes(query) || 
                          tool.category.toLowerCase().includes(query) ||
                          categoryName.includes(query) ||
                          tool.tagline.toLowerCase().includes(query) ||
                          tool.description.toLowerCase().includes(query);
                          
      const matchPricing = pricingFilter === 'all' || tool.pricingType === pricingFilter;
      const matchRating = tool.rating >= minRating;

      return matchCategory && matchSearch && matchPricing && matchRating;
    });
  }, [selectedCategory, searchQuery, pricingFilter, minRating]);

  const handleToggleCompare = (tool: AITool, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent detail navigation
    if (compareList.some(item => item.id === tool.id)) {
      setCompareList(compareList.filter(item => item.id !== tool.id));
    } else {
      if (compareList.length >= 3) {
        setCompareWarning('You can compare a maximum of 3 tools side-by-side.');
        setTimeout(() => setCompareWarning(null), 4000);
        return;
      }
      setCompareList([...compareList, tool]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPricingFilter('all');
    setMinRating(0);
  };

  return (
    <div className="marketplace-catalog bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800/60 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Tools Directory</h1>
            <p className="text-sm text-slate-400 mt-1">Browse, filter, compare and test premium model integrations in sandbox</p>
          </div>
          
          {/* Header Real-Time Search Bar */}
          <div className="w-full md:w-96 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="text"
              id="header-search-bar"
              placeholder="Search tools by name or category tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500/50 text-xs text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none transition-all duration-200 shadow-md"
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
        </div>

        {/* Search, Categories Bar & Filters Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 p-6 bg-slate-900 border border-slate-800 rounded-3xl h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-amber-500" />
                <span>Search Filters</span>
              </span>
              <button 
                onClick={handleResetFilters}
                id="reset-filters-btn"
                className="text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Keyword Search</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 text-slate-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500/50 text-slate-200 placeholder-slate-600 rounded-xl focus:outline-none text-xs transition"
                />
              </div>
            </div>

            {/* Pricing Filter */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">License Type</label>
              <div className="space-y-2 text-xs">
                {['all', 'free', 'one-time', 'subscription'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input 
                      type="radio" 
                      name="pricing" 
                      checked={pricingFilter === type}
                      onChange={() => setPricingFilter(type as any)}
                      className="accent-amber-500 h-4 w-4 bg-slate-950 border-slate-800"
                    />
                    <span className="capitalize">{type === 'all' ? 'All Plans' : type.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Minimum Rating</label>
              <div className="space-y-2 text-xs">
                {[0, 4.5, 4.8].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="accent-amber-500 h-4 w-4 bg-slate-950 border-slate-800"
                    />
                    <span>{rating === 0 ? 'Any Rating' : `★ ${rating}+ Rating`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Compare Bar Button */}
            {compareList.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowCompareModal(true)}
                  id="open-compare-btn"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition font-bold text-white rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare ({compareList.length}) Selected</span>
                </button>
              </div>
            )}
          </div>

          {/* Directory Listings */}
          <div className="lg:col-span-3">
            
            {/* Horizontal Categories Tab Slider */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                id="cat-tab-all"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition flex-shrink-0 ${
                  selectedCategory === 'all' 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span>All Capabilities</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  id={`cat-tab-${cat.id}`}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition flex-shrink-0 ${
                    selectedCategory === cat.id 
                      ? 'bg-amber-500 text-slate-950 shadow-md' 
                      : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {getCategoryIcon(cat.icon)}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            {filteredTools.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-slate-800 rounded-3xl">
                <Cpu className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">No AI Tools Match Your Search</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">Try clearing your filters or testing other tags to discover platform capabilities.</p>
                <button 
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl mt-6 transition"
                >
                  Reset Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTools.map((tool) => {
                  const isCompared = compareList.some(item => item.id === tool.id);
                  return (
                    <div 
                      key={tool.id}
                      onClick={() => onSelectTool(tool)}
                      className="p-6 bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-3xl hover:bg-slate-900 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        {/* Title bar */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-950/80 border border-slate-800 text-amber-500 rounded-xl">
                              {getCategoryIcon(tool.iconName)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base font-bold text-white group-hover:text-amber-500 transition-colors">
                                  {tool.name}
                                </h3>
                                <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700/60 text-[9px] text-amber-500 font-bold uppercase rounded tracking-wider">
                                  {categories.find(c => c.id === tool.category)?.name || tool.category}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                {tool.provider}
                              </span>
                            </div>
                          </div>

                          {/* Compare toggle checkbox and wishlist button */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleWishlist(tool);
                              }}
                              id={`wishlist-toggle-${tool.id}`}
                              className={`p-1.5 rounded-lg border transition ${
                                wishlist.includes(tool.id)
                                  ? 'bg-rose-500/10 border-rose-500 text-rose-500' 
                                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-500 hover:text-rose-400'
                              }`}
                              title={wishlist.includes(tool.id) ? "Remove from Favorites" : "Add to Favorites"}
                            >
                              <Heart className={`w-3.5 h-3.5 ${wishlist.includes(tool.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-500 hover:text-slate-300'}`} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleToggleCompare(tool, e)}
                              id={`compare-toggle-${tool.id}`}
                              className={`p-1.5 rounded-lg border text-[10px] font-bold tracking-tight uppercase transition flex items-center gap-1 ${
                                isCompared 
                                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed mb-5">
                          {tool.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {tool.features.slice(0, 2).map((feat, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-950 text-slate-500 text-[10px] rounded border border-slate-850">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom stats */}
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-auto">
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{tool.rating}</span>
                        </div>
                        <div className="text-xs font-bold text-white">
                          ${tool.price}{tool.pricingType === 'subscription' ? '/mo' : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>      {/* Compare Modal Drawer */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8 relative">
            <button 
              onClick={() => setShowCompareModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition duration-200"
            >
              ✕
            </button>
            
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500 animate-pulse" />
                <span>AI Tool Comparison Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Side-by-side technical capabilities, pricing options, model specs, and playground demos.</p>
            </div>

            {/* Side-by-side Technical Specs & Pricing Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[200px]">Specification</th>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <th key={index} className="p-4 text-sm font-bold text-white border-l border-slate-800 w-[250px]">
                          {tool ? (
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-slate-900 border border-slate-800 text-amber-500 rounded-xl">
                                  {getCategoryIcon(tool.iconName)}
                                </div>
                                <div>
                                  <div className="font-bold text-white line-clamp-1 text-sm">{tool.name}</div>
                                  <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">{tool.provider}</div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => handleToggleCompare(tool, e)}
                                className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition"
                                title="Remove from comparison"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-2.5 border-2 border-dashed border-slate-800/80 rounded-xl text-slate-600 bg-slate-950/20">
                              <span className="text-xs font-semibold text-slate-500">+ Empty Comparison Slot</span>
                              <span className="text-[9px] text-slate-600 mt-0.5">Select a tool in the directory</span>
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {/* Row 1: Pricing */}
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Pricing & License</td>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <td key={index} className="p-4 border-l border-slate-800/60 text-slate-200">
                          {tool ? (
                            <div>
                              <span className="text-base font-extrabold text-white">${tool.price}</span>
                              <span className="text-slate-500 text-[10px] ml-1.5 capitalize">
                                {tool.pricingType === 'subscription' ? `/ ${tool.billingPeriod || 'monthly'}` : 'one-time license'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-700 font-mono">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  
                  {/* Row 2: Model Engine */}
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Model Architecture</td>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <td key={index} className="p-4 border-l border-slate-800/60 text-slate-300">
                          {tool ? (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold">
                              {tool.provider}
                            </span>
                          ) : (
                            <span className="text-slate-700 font-mono">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 3: Category */}
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Primary Category</td>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <td key={index} className="p-4 border-l border-slate-800/60 text-slate-300 capitalize font-medium">
                          {tool ? tool.category : <span className="text-slate-700 font-mono">-</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 4: Quality Score */}
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Satisfaction Score</td>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <td key={index} className="p-4 border-l border-slate-800/60 text-slate-300">
                          {tool ? (
                            <div className="flex items-center gap-1">
                              <span className="text-amber-500 font-bold">★ {tool.rating}</span>
                              <span className="text-slate-500">({tool.ratingCount || 0} reviews)</span>
                            </div>
                          ) : (
                            <span className="text-slate-700 font-mono">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 5: Sandbox Playground */}
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Sandbox Environment</td>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <td key={index} className="p-4 border-l border-slate-800/60 text-slate-300 capitalize">
                          {tool ? `${tool.demoType} Playground` : <span className="text-slate-700 font-mono">-</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 6: Primary Developer */}
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Verified Developer</td>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <td key={index} className="p-4 border-l border-slate-800/60 text-slate-300">
                          {tool ? tool.author || 'Independent Creator' : <span className="text-slate-700 font-mono">-</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 7: Technical Specifications */}
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px] align-top pt-5">Technical Specifications</td>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <td key={index} className="p-4 border-l border-slate-800/60 text-slate-300 align-top">
                          {tool ? (
                            <ul className="space-y-1.5 list-disc pl-4 text-slate-400 text-[10px] leading-relaxed">
                              {tool.features.map((feat, fIdx) => (
                                <li key={fIdx}>{feat}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-slate-700 font-mono">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 8: Action button */}
                  <tr>
                    <td className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Sandbox Navigation</td>
                    {[0, 1, 2].map((index) => {
                      const tool = compareList[index];
                      return (
                        <td key={index} className="p-4 border-l border-slate-800/60">
                          {tool ? (
                            <button
                              onClick={() => {
                                onSelectTool(tool);
                                setShowCompareModal(false);
                              }}
                              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-amber-500/20"
                            >
                              Launch Sandbox
                            </button>
                          ) : (
                            <span className="text-slate-700 font-mono">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Warning Toast */}
      {compareWarning && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-950/90 border border-rose-800/80 text-rose-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 max-w-sm animate-pulse">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{compareWarning}</span>
        </div>
      )}
    </div>
  );
}
