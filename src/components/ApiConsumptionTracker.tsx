import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Zap, 
  HelpCircle, 
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { AITool } from '../types';

interface ApiConsumptionTrackerProps {
  purchasedTools: AITool[];
  onSelectTool: (tool: AITool) => void;
}

interface QuotaState {
  toolId: string;
  toolName: string;
  totalQuota: number;
  usedQuota: number;
  lastUsed: string;
  avgLatency: number;
}

export function ApiConsumptionTracker({ purchasedTools, onSelectTool }: ApiConsumptionTrackerProps) {
  const [loading, setLoading] = useState(false);
  const [quotas, setQuotas] = useState<QuotaState[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Initialize quotas based on purchased tools
  useEffect(() => {
    // Attempt to load from localStorage to preserve simulated usages
    const cached = localStorage.getItem('lumina_api_quotas');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as QuotaState[];
        // Filter out quotas for tools that might have been deleted/refunded,
        // and add quotas for newly purchased tools
        const updatedQuotas = purchasedTools.map(tool => {
          const existing = parsed.find(q => q.toolId === tool.id);
          if (existing) return existing;
          
          // Generate default quota if not existing
          return generateDefaultQuota(tool);
        });
        setQuotas(updatedQuotas);
        localStorage.setItem('lumina_api_quotas', JSON.stringify(updatedQuotas));
        setLastUpdated(new Date().toLocaleTimeString());
        return;
      } catch (e) {
        console.error('Error parsing cached quotas, generating fresh ones', e);
      }
    }

    const initial = purchasedTools.map(generateDefaultQuota);
    setQuotas(initial);
    localStorage.setItem('lumina_api_quotas', JSON.stringify(initial));
    setLastUpdated(new Date().toLocaleTimeString());
  }, [purchasedTools]);

  function generateDefaultQuota(tool: AITool): QuotaState {
    // Quota scale based on pricing type
    let totalQuota = 1000; // default/free
    if (tool.pricingType === 'subscription') {
      totalQuota = tool.price >= 49 ? 100000 : 50000;
    } else if (tool.pricingType === 'one-time') {
      totalQuota = 15000;
    }

    // Generate a deterministic but natural used count
    const seed = tool.id.charCodeAt(0) || 42;
    const usedQuota = Math.floor((seed % 7) * 0.12 * totalQuota) + 120;

    return {
      toolId: tool.id,
      toolName: tool.name,
      totalQuota,
      usedQuota,
      lastUsed: '2 hours ago',
      avgLatency: 120 + (seed % 15) * 8
    };
  }

  // Live fetch function simulating backend RPC telemetry sync
  const handleFetchQuota = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate slight progress or dynamic sync changes
      const updated = quotas.map(q => {
        // Occasionally simulate small natural background API usage
        const backgroundUsage = Math.floor(Math.random() * 8) + 1;
        const newUsed = Math.min(q.totalQuota, q.usedQuota + backgroundUsage);
        return {
          ...q,
          usedQuota: newUsed,
          lastUsed: 'Just now'
        };
      });
      setQuotas(updated);
      localStorage.setItem('lumina_api_quotas', JSON.stringify(updated));
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    }, 750);
  };

  // Simulates executing an API inquiry sandbox request
  const handleTriggerMockQuery = (toolId: string) => {
    const updated = quotas.map(q => {
      if (q.toolId === toolId) {
        const increment = Math.floor(Math.random() * 45) + 5; // consume 5-50 requests
        const nextUsed = Math.min(q.totalQuota, q.usedQuota + increment);
        return {
          ...q,
          usedQuota: nextUsed,
          lastUsed: 'Just now'
        };
      }
      return q;
    });
    setQuotas(updated);
    localStorage.setItem('lumina_api_quotas', JSON.stringify(updated));
  };

  // Upgrades mock quota
  const handleUpgradeQuota = (toolId: string) => {
    const updated = quotas.map(q => {
      if (q.toolId === toolId) {
        return {
          ...q,
          totalQuota: q.totalQuota + 25000,
          lastUsed: 'Just now'
        };
      }
      return q;
    });
    setQuotas(updated);
    localStorage.setItem('lumina_api_quotas', JSON.stringify(updated));
    alert('Mock Quota successfully expanded by +25,000 monthly requests!');
  };

  if (purchasedTools.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-900 rounded-3xl bg-slate-950/40">
        <Zap className="w-10 h-10 text-slate-800 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-300">No active consumption channels</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Acquire subscription licences or sandbox API tokens from the marketplace to initialize telemetry consumption logs.
        </p>
      </div>
    );
  }

  return (
    <div className="api-consumption-tracker bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-white text-base">API Quota & Telemetry Consumption</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time usage metrics and remaining request balances for developer keys.</p>
        </div>

        <button
          onClick={handleFetchQuota}
          disabled={loading}
          className="px-4 py-2 bg-slate-950 hover:bg-slate-850 disabled:opacity-50 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Fetching...' : 'Sync Quotas'}</span>
        </button>
      </div>

      {/* Grid containing details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Progress bars list */}
        <div className="lg:col-span-2 space-y-5">
          {quotas.map((q) => {
            const remaining = q.totalQuota - q.usedQuota;
            const remainingPercent = Math.max(0, Math.round((remaining / q.totalQuota) * 100));
            const isLow = remainingPercent <= 15;
            
            // Find corresponding tool to match styling
            const matchedTool = purchasedTools.find(tool => tool.id === q.toolId);

            return (
              <div 
                key={q.toolId}
                className="p-5 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition"
              >
                {/* Tool title and badging */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 border border-slate-800 text-amber-500 rounded-lg">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white block leading-snug">{q.toolName}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                        <span>Latency: <span className="font-mono text-slate-400 font-bold">{q.avgLatency}ms</span></span>
                        <span>•</span>
                        <span>Last usage: <span className="font-medium text-slate-400">{q.lastUsed}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLow ? (
                      <span className="flex items-center gap-1 text-[9px] font-black tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Low Balance</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* The main progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end text-[10px] font-bold">
                    <div className="text-slate-400">
                      Remaining Monthly Requests:
                      <span className="font-mono text-xs text-white ml-1.5 font-extrabold">{remaining.toLocaleString()}</span>
                      <span className="text-slate-600 font-medium font-mono"> / {q.totalQuota.toLocaleString()}</span>
                    </div>
                    <span className={`font-mono text-xs ${isLow ? 'text-rose-400' : 'text-amber-500'}`}>
                      {remainingPercent}%
                    </span>
                  </div>

                  {/* HTML/CSS elegant Progress Bar Bar container */}
                  <div className="w-full h-2.5 bg-slate-900 border border-slate-850/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isLow 
                          ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                      }`}
                      style={{ width: `${remainingPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action buttons embedded for full sandbox interactivity */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-900/60">
                  <button
                    onClick={() => handleTriggerMockQuery(q.toolId)}
                    disabled={remaining === 0}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                    title="Simulate querying this AI model with your API key to consume quota requests"
                  >
                    <Play className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>Query Sandbox API</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpgradeQuota(q.toolId)}
                      className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                    >
                      <span>Buy Quota</span>
                    </button>
                    {matchedTool && (
                      <button
                        onClick={() => onSelectTool(matchedTool)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold transition inline-flex items-center gap-0.5"
                      >
                        <span>Playground</span>
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right col: Dynamic unified insights panels */}
        <div className="p-5 bg-slate-950/40 border border-slate-850/60 rounded-2xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-3">Unified Telemetry</span>
            
            {/* Aggregate calculations */}
            {(() => {
              const totalAllocated = quotas.reduce((acc, curr) => acc + curr.totalQuota, 0);
              const totalUsed = quotas.reduce((acc, curr) => acc + curr.usedQuota, 0);
              const totalRemaining = totalAllocated - totalUsed;
              const aggregatePercent = totalAllocated > 0 ? Math.round((totalRemaining / totalAllocated) * 100) : 0;

              return (
                <div className="space-y-4">
                  {/* Overall balance card */}
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Aggregated Remaining Balance</span>
                    <div className="text-2xl font-black text-white mt-1.5 font-mono">
                      {totalRemaining.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-normal">reqs</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Across <span className="text-amber-500 font-bold">{quotas.length}</span> active subscription models.
                    </p>
                  </div>

                  {/* Overal efficiency progress dial */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[9px] font-extrabold uppercase text-slate-500">
                      <span>Total Account Health</span>
                      <span className="text-emerald-400 font-mono">{aggregatePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${aggregatePercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Quick FAQ / Info block */}
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wider text-[9px]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How are quotas computed?</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Quotas are bound to monthly subscription tiers. At the 1st of every month at UTC midnight, all balances reset.
            </p>
          </div>

          {/* Timestamp tracking */}
          <div className="text-[9px] text-slate-600 font-bold flex items-center justify-between">
            <span>Last Telemetry Sync:</span>
            <span className="font-mono">{lastUpdated || 'Never'}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
