import React, { useState } from 'react';
import { 
  ArrowLeft, Star, FileText, CheckCircle2, MessageSquare, 
  Image as ImageIcon, Sparkles, Volume2, Play, AlertCircle 
} from 'lucide-react';
import { AITool, Review } from '../types';
import { reviews as initialReviews, aiTools } from '../data';

interface ToolDetailProps {
  tool: AITool;
  onBack: () => void;
  onSelectTool: (tool: AITool) => void;
  onOpenAuth: () => void;
  onPurchaseSuccess: (tool: AITool) => void;
  currentUser: { name: string; email: string; role: 'user' | 'vendor' | 'admin' } | null;
  purchasedTools: AITool[];
  reviewsList: Review[];
  onAddReview: (newReview: Review) => void;
}

export function ToolDetail({ 
  tool, 
  onBack, 
  onSelectTool, 
  onOpenAuth, 
  onPurchaseSuccess,
  currentUser,
  purchasedTools,
  reviewsList,
  onAddReview
}: ToolDetailProps) {
  const [activeTab, setActiveTab] = useState<'playground' | 'docs' | 'reviews'>('playground');
  const [activeImage, setActiveImage] = useState(tool.gallery[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
  
  // Playground state
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [voice, setVoice] = useState('Kore');
  const [response, setResponse] = useState('');
  const [generatedImg, setGeneratedImg] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sandboxMode, setSandboxMode] = useState(false);

  // Review states
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userComment, setUserComment] = useState('');

  // Filter reviews for this tool from the global reviews list
  const filteredReviews = reviewsList.filter(r => r.toolId === tool.id);

  // Related Tools
  const relatedTools = aiTools.filter(t => t.category === tool.category && t.id !== tool.id);

  const handlePurchase = () => {
    onPurchaseSuccess(tool);
  };

  const handleRunPlayground = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResponse('');
    setGeneratedImg('');
    setGeneratedAudio('');
    setSandboxMode(false);

    try {
      const res = await fetch('/api/tools/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          demoType: tool.demoType,
          options: {
            aspectRatio,
            voice,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server returned an error.');
      }

      if (data.success) {
        if (tool.demoType === 'image') {
          setGeneratedImg(data.imageUrl);
        } else if (tool.demoType === 'audio') {
          setGeneratedAudio(data.audioUrl);
        } else {
          setResponse(data.text);
        }

        if (data.sandboxNotice) {
          setSandboxMode(true);
        }
      } else {
        throw new Error(data.error || 'Execution failed.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to leave a review.');
      onOpenAuth();
      return;
    }

    const hasPurchased = purchasedTools.some(p => p.id === tool.id);
    if (!hasPurchased) {
      alert('You must purchase this tool to submit a review.');
      return;
    }

    if (!userComment.trim()) return;

    const newRev: Review = {
      id: String(Date.now()),
      toolId: tool.id,
      userName: currentUser.name || currentUser.email || 'Verified Buyer',
      rating: userRating,
      comment: userComment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onAddReview(newRev);
    setUserComment('');
    setUserRating(5);
  };

  return (
    <div className="tool-detail-view bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          id="back-to-catalog"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Product Shell header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          
          {/* Main overview gallery */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl w-fit flex-shrink-0">
                <Sparkles className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white leading-tight">{tool.name}</h1>
                <p className="text-sm text-slate-400 mt-1">{tool.tagline}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                  <span className="text-amber-500 font-bold">★ {tool.rating} ({tool.ratingCount} reviews)</span>
                  <span>Category: <span className="text-slate-300 capitalize">{tool.category}</span></span>
                  <span>Creator: <span className="text-slate-300">{tool.author}</span></span>
                  <span>Model: <span className="text-slate-300 font-mono text-[10px]">{tool.provider}</span></span>
                </div>
              </div>
            </div>

            {/* Showcase Image with Gallery switcher */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 flex items-center justify-center relative">
                <img src={activeImage} alt={tool.name} className="w-full h-80 sm:h-96 object-cover" />
                <div className="absolute top-4 left-4 px-2.5 py-1 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full text-[10px] font-mono text-slate-400">
                  Tool Snapshot Gallery
                </div>
              </div>
              <div className="flex gap-3">
                {tool.gallery.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border transition ${
                      activeImage === img ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-900 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout pricing card */}
          <div className="p-6 bg-slate-900/60 border border-slate-900 rounded-3xl h-fit flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">License Purchase Option</span>
              
              <div className="my-4">
                <span className="text-4xl font-extrabold text-white">${tool.price}</span>
                {tool.pricingType === 'subscription' && <span className="text-sm text-slate-500 font-normal">/mo</span>}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {tool.description}
              </p>

              <div className="space-y-3.5 mb-8">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">License Includes</span>
                {tool.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handlePurchase}
              id="purchase-licence-btn"
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 transition text-slate-950 font-extrabold rounded-2xl text-sm"
            >
              Get License & API Keys
            </button>
          </div>
        </div>

        {/* Tab switcher tabs */}
        <div className="border-t border-slate-900 pt-10">
          <div className="flex border-b border-slate-900 gap-6 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('playground')}
              id="tab-playground"
              className={`pb-4 text-xs font-bold uppercase tracking-wider relative transition flex-shrink-0 ${
                activeTab === 'playground' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>Interactive Playground</span>
              {activeTab === 'playground' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              id="tab-docs"
              className={`pb-4 text-xs font-bold uppercase tracking-wider relative transition flex-shrink-0 ${
                activeTab === 'docs' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>Developer API & Docs</span>
              {activeTab === 'docs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              id="tab-reviews"
              className={`pb-4 text-xs font-bold uppercase tracking-wider relative transition flex-shrink-0 ${
                activeTab === 'reviews' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>Customer Reviews ({filteredReviews.length})</span>
              {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
            </button>
          </div>

          {/* ACTIVE TAB RENDER */}
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Controls input */}
              <div className="lg:col-span-2 p-6 bg-slate-900/40 border border-slate-900 rounded-3xl h-fit">
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-white text-base">Live Sandbox Playgound</h3>
                </div>

                <form onSubmit={handleRunPlayground} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Input Prompt</label>
                    <textarea
                      required
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={
                        tool.demoType === 'image' 
                          ? "A realistic visual of a futuristic neon city center..." 
                          : tool.demoType === 'audio' 
                          ? "Have a beautiful morning! Today is going to be excellent." 
                          : "Draft a high-converting email campaign for our new newsletter SaaS..."
                      }
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl p-4 focus:outline-none focus:border-amber-500/40 text-xs transition leading-relaxed placeholder-slate-700"
                    />
                  </div>

                  {/* Optional Dynamic Parameters */}
                  {tool.demoType === 'image' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Image Aspect Ratio</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['1:1', '16:9', '9:16'].map((ar) => (
                          <button
                            key={ar}
                            type="button"
                            onClick={() => setAspectRatio(ar)}
                            className={`py-2 text-xs font-bold rounded-xl border transition ${
                              aspectRatio === ar 
                                ? 'bg-amber-500 border-amber-500 text-slate-950' 
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                            }`}
                          >
                            {ar === '1:1' ? 'Square (1:1)' : ar === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {tool.demoType === 'audio' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Synthesizer Voice</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Kore', 'Zephyr', 'Puck'].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setVoice(v)}
                            className={`py-2 text-xs font-bold rounded-xl border transition ${
                              voice === v 
                                ? 'bg-amber-500 border-amber-500 text-slate-950' 
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                            }`}
                          >
                            Voice {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    id="run-playground-btn"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2"
                  >
                    <span>{loading ? 'Synthesizing...' : 'Execute Playground'}</span>
                  </button>
                </form>
              </div>

              {/* Outputs box */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between min-h-[300px]">
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4">Output Result</h4>

                  {errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2.5 leading-relaxed">
                      <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Execution Failed</p>
                        <p className="mt-0.5">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div className="py-12 text-center text-xs text-slate-500 animate-pulse">
                      <div className="w-6 h-6 border-2 border-t-amber-500 border-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <span>Connecting with server AI model...</span>
                    </div>
                  )}

                  {!loading && !errorMsg && !response && !generatedImg && !generatedAudio && (
                    <div className="py-16 text-center text-xs text-slate-600">
                      <span>Enter prompt on the left to invoke live models on our server.</span>
                    </div>
                  )}

                  {/* Sandbox Notice Banner */}
                  {sandboxMode && (
                    <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] rounded-xl flex items-start gap-2">
                      <Volume2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>
                        <strong>Secrets Sandbox Mode:</strong> Real API Key is missing. Presenting simulated high-fidelity model performance. Configure <code>GEMINI_API_KEY</code> in Settings to run live!
                      </p>
                    </div>
                  )}

                  {/* Text outputs */}
                  {response && (
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 max-h-80 overflow-y-auto leading-relaxed text-slate-300 text-xs whitespace-pre-line font-medium">
                      {response}
                    </div>
                  )}

                  {/* Image Outputs */}
                  {generatedImg && (
                    <div className="overflow-hidden rounded-2xl border border-slate-850">
                      <img src={generatedImg} alt="Generated asset" className="w-full object-cover max-h-72" />
                      <div className="p-2.5 bg-slate-950 text-center">
                        <a 
                          href={generatedImg} 
                          download="generated_ai_asset.png"
                          className="text-[10px] text-amber-500 font-bold hover:underline"
                        >
                          Download Generated Asset
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Audio output */}
                  {generatedAudio && (
                    <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl text-center">
                      <Volume2 className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                      <p className="text-xs text-slate-300 font-bold mb-4">Synthetic Speech Completed</p>
                      {generatedAudio === 'simulated' ? (
                        <p className="text-[10px] text-slate-500">Audio playback simulated in keyless sandbox mode.</p>
                      ) : (
                        <audio controls className="w-full mx-auto max-w-xs">
                          <source src={generatedAudio} type="audio/wav" />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-3xl">
              <h3 className="font-extrabold text-white text-base mb-2">Centralized REST Integration API</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                All purchased tools are routed through our high-performance unified proxy gateway. Integrate with your applications using your generated bearer tokens.
              </p>

              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300 mb-6 leading-relaxed">
                <span className="text-slate-500">// POST /api/tools/{tool.id}/demo</span> <br />
                <span className="text-amber-500">const</span> response = <span className="text-amber-500">await</span> fetch(<span className="text-emerald-400">`https://lumina.ai/api/v1/tools/{tool.id}/query`</span>, &#123; <br />
                &nbsp;&nbsp;method: <span className="text-emerald-400">'POST'</span>, <br />
                &nbsp;&nbsp;headers: &#123; <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">'Authorization'</span>: <span className="text-emerald-400">'Bearer YOUR_SECRET_BEARER_TOKEN'</span>, <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">'Content-Type'</span>: <span className="text-emerald-400">'application/json'</span> <br />
                &nbsp;&nbsp;&#125;, <br />
                &nbsp;&nbsp;body: JSON.stringify(&#123; prompt: <span className="text-emerald-400">'your prompt here'</span> &#125;) <br />
                &#125;); <br />
                <span className="text-amber-500">const</span> data = <span className="text-amber-500">await</span> response.json();
              </div>

              <h4 className="text-xs uppercase font-black text-slate-500 mb-2">Usage Documentation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tool.documentation}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Leave a review component */}
              <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-3xl h-fit">
                <h3 className="font-extrabold text-white text-base mb-4">Leave Your Review</h3>
                
                {!currentUser ? (
                  <div className="text-center py-6 px-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
                    <AlertCircle className="w-8 h-8 text-amber-500/80 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-white mb-2">Sign In Required</h4>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      You must be signed in to submit star ratings and feedback.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 transition text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Sign In / Register
                    </button>
                  </div>
                ) : !purchasedTools.some(p => p.id === tool.id) ? (
                  <div className="text-center py-6 px-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
                    <AlertCircle className="w-8 h-8 text-amber-500/80 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-white mb-2">Purchase Required</h4>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Only verified license buyers of this tool can submit feedback.
                    </p>
                    <button
                      type="button"
                      onClick={handlePurchase}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 transition text-slate-200 font-bold rounded-xl text-xs"
                    >
                      Purchase Tool License
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeaveReview} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Rating Stars</label>
                      <div className="flex items-center gap-1.5 my-2">
                        {[1, 2, 3, 4, 5].map((starValue) => {
                          const isFilled = hoverRating !== null ? starValue <= hoverRating : starValue <= userRating;
                          return (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() => setUserRating(starValue)}
                              onMouseEnter={() => setHoverRating(starValue)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 focus:outline-none transition-transform hover:scale-110"
                              title={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                            >
                              <Star
                                className={`w-5 h-5 transition-colors ${
                                  isFilled
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-slate-600 hover:text-amber-500/60'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Review Comment</label>
                      <textarea
                        required
                        rows={3}
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Share your experience using this model..."
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500 text-xs transition placeholder-slate-700"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition w-full"
                    >
                      Post Review
                    </button>
                  </form>
                )}
              </div>

              {/* Reviews Feed */}
              <div className="lg:col-span-2 space-y-4">
                {filteredReviews.length === 0 ? (
                  <div className="p-8 text-center border border-slate-900 rounded-3xl text-xs text-slate-500">
                    No customer reviews yet. Be the first to post a review!
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div key={rev.id} className="p-5 bg-slate-900 border border-slate-850 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-extrabold text-white">{rev.userName}</h4>
                        <span className="text-[10px] text-slate-500">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500 text-[10px] mb-2 font-bold">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Tools section */}
        {relatedTools.length > 0 && (
          <div className="border-t border-slate-900 mt-16 pt-12">
            <h3 className="text-xl font-extrabold text-white mb-6">Related AI Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.slice(0, 3).map((rt) => (
                <div 
                  key={rt.id}
                  onClick={() => onSelectTool(rt)}
                  className="p-5 bg-slate-900/30 border border-slate-900 hover:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs uppercase font-extrabold text-amber-500 tracking-wider mb-1 capitalize">{rt.category}</h4>
                    <h5 className="text-base font-bold text-white mb-2">{rt.name}</h5>
                    <p className="text-xs text-slate-400 line-clamp-2">{rt.tagline}</p>
                  </div>
                  <span className="text-[10px] font-bold text-white block mt-4 border-t border-slate-800 pt-3">
                    ${rt.price}{rt.pricingType === 'subscription' ? '/mo' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
