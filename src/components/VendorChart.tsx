import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { TrendingUp, DollarSign, Cpu, Calendar, Zap, Award } from 'lucide-react';

// Register all Chart.js modules
Chart.register(...registerables);

interface ChartDataItem {
  date: string;
  revenue: number;
  usage: number;
}

export function VendorChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [chartView, setChartView] = useState<'dual' | 'revenue' | 'usage'>('dual');
  const [timeFilter, setTimeFilter] = useState<'30' | '15' | '7'>('30');

  // Generate deterministic 30-day analytics dataset
  const rawData = useMemo(() => {
    const data: ChartDataItem[] = [];
    const baseDate = new Date(2026, 5, 18); // Starting June 18, 2026
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
      
      // Weekly cycles + general upward trend + random fluctuations
      const growthFactor = i * 4.2;
      const weekendDrop = (dayOfWeek === 0 || dayOfWeek === 6) ? -15 : 45;
      const cyclicNoise = Math.sin(i * 0.9) * 20 + Math.cos(i * 1.6) * 12;
      
      const revenue = Math.round(Math.max(45, 75 + growthFactor + weekendDrop + cyclicNoise));
      
      // Usage correlates with sales but has occasional extreme spikes (e.g. viral test days)
      const usageBase = revenue * 4.5;
      const spike = i === 12 ? 350 : (i === 24 ? 420 : 0); // viral spikes
      const usageNoise = Math.sin(i * 1.1) * 60 + spike;
      const usage = Math.round(Math.max(120, usageBase + usageNoise));

      data.push({
        date: dayLabel,
        revenue,
        usage
      });
    }
    return data;
  }, []);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const limit = Number(timeFilter);
    return rawData.slice(30 - limit);
  }, [rawData, timeFilter]);

  // Calculations for KPI dashboard overlay
  const stats = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const avgRevenue = Math.round(totalRevenue / filteredData.length);
    const totalUsage = filteredData.reduce((sum, item) => sum + item.usage, 0);
    const avgUsage = Math.round(totalUsage / filteredData.length);
    const peakRevenue = Math.max(...filteredData.map(item => item.revenue));
    const peakUsage = Math.max(...filteredData.map(item => item.usage));

    return {
      totalRevenue,
      avgRevenue,
      totalUsage,
      avgUsage,
      peakRevenue,
      peakUsage
    };
  }, [filteredData]);

  // Re-initialize chart on state changes
  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart to prevent canvas reuse errors
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Create stylish gradients
    const revenueGradient = ctx.createLinearGradient(0, 0, 0, 300);
    revenueGradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');   // Indigo
    revenueGradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    const usageGradient = ctx.createLinearGradient(0, 0, 0, 300);
    usageGradient.addColorStop(0, 'rgba(245, 158, 11, 0.25)');   // Amber
    usageGradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    const labels = filteredData.map(item => item.date);
    const revenueValues = filteredData.map(item => item.revenue);
    const usageValues = filteredData.map(item => item.usage);

    // Build configuration datasets dynamically based on view tab
    const datasets = [];

    if (chartView === 'dual' || chartView === 'revenue') {
      datasets.push({
        label: 'Daily Revenue ($)',
        data: revenueValues,
        borderColor: '#6366f1',
        borderWidth: 3,
        backgroundColor: revenueGradient,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: filteredData.length > 15 ? 2.5 : 4,
        pointHoverRadius: 6,
        yAxisID: 'yRevenue',
      });
    }

    if (chartView === 'dual' || chartView === 'usage') {
      datasets.push({
        label: 'API Sandbox Usage',
        data: usageValues,
        borderColor: '#f59e0b',
        borderWidth: 2.5,
        borderDash: chartView === 'dual' ? [5, 4] : [], // Dashed in dual-mode for neat contrast
        backgroundColor: usageGradient,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: filteredData.length > 15 ? 2.5 : 4,
        pointHoverRadius: 6,
        yAxisID: 'yUsage',
      });
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false, // Custom styled legend constructed in JSX below
          },
          tooltip: {
            backgroundColor: '#0f172a', // Slate-900 background
            titleColor: '#f8fafc', // Slate-50
            bodyColor: '#cbd5e1', // Slate-300
            borderColor: '#334155', // Slate-700
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,
            titleFont: {
              family: 'Inter, sans-serif',
              size: 11,
              weight: 'bold',
            },
            bodyFont: {
              family: 'Inter, sans-serif',
              size: 11,
            },
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  if (context.dataset.yAxisID === 'yRevenue') {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                  } else {
                    label += new Intl.NumberFormat('en-US').format(context.parsed.y) + ' requests';
                  }
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#64748b', // Slate-500
              font: {
                family: 'Inter, sans-serif',
                size: 9,
                weight: 500
              },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: filteredData.length > 15 ? 8 : 15
            }
          },
          yRevenue: {
            type: 'linear',
            display: chartView === 'dual' || chartView === 'revenue',
            position: 'left',
            grid: {
              color: '#1e293b', // Slate-800 line
            },
            ticks: {
              color: '#818cf8', // Indigo-400
              font: {
                family: 'JetBrains Mono, monospace',
                size: 9,
              },
              callback: function (value) {
                return '$' + value;
              }
            }
          },
          yUsage: {
            type: 'linear',
            display: chartView === 'dual' || chartView === 'usage',
            position: 'right',
            grid: {
              drawOnChartArea: chartView === 'usage', // draw grid lines only if main usage view or disabled to avoid double grid lines
              color: '#1e293b',
            },
            ticks: {
              color: '#fbbf24', // Amber-400
              font: {
                family: 'JetBrains Mono, monospace',
                size: 9,
              },
              callback: function (value) {
                return value + ' rq';
              }
            }
          }
        }
      }
    };

    chartInstanceRef.current = new Chart(ctx, config);

    // Clean up on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [filteredData, chartView]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
      
      {/* Header controls section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-white text-base">Analytical Performance Sandbox</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time daily telemetry auditing sales revenue & concurrent sandbox client queries.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart dataset selection tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => setChartView('dual')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                chartView === 'dual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dual telemetry
            </button>
            <button
              onClick={() => setChartView('revenue')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                chartView === 'revenue' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setChartView('usage')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                chartView === 'usage' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sandbox API Usage
            </button>
          </div>

          {/* Time range select filter */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
            {['30', '15', '7'].map((days) => (
              <button
                key={days}
                onClick={() => setTimeFilter(days as any)}
                className={`w-9 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all duration-200 ${
                  timeFilter === days ? 'bg-slate-800 text-amber-500 border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout with chart canvas and insight parameters cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Interactive Canvas Chart */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div className="relative h-64 md:h-80 w-full bg-slate-950/60 rounded-2xl border border-slate-850/80 p-4">
            
            {/* Custom styled absolute legends */}
            <div className="absolute top-4 left-4 flex gap-4 z-10 text-[10px] font-bold">
              {(chartView === 'dual' || chartView === 'revenue') && (
                <div className="flex items-center gap-1.5 bg-slate-900/95 border border-slate-800 px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block"></span>
                  <span className="text-slate-300">Sales Income ($)</span>
                </div>
              )}
              {(chartView === 'dual' || chartView === 'usage') && (
                <div className="flex items-center gap-1.5 bg-slate-900/95 border border-slate-800 px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
                  <span className="text-slate-300">API Sandbox Inquiries</span>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Chart footer detail info */}
          <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-medium mt-4 px-1 gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span>Auditing range: {filteredData[0]?.date} - {filteredData[filteredData.length - 1]?.date}, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span> Active node: online</span>
              <span>•</span>
              <span>Updated a few seconds ago</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Insights Stats Breakdown */}
        <div className="bg-slate-950/40 border border-slate-850/60 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">30D Matrix Insights</span>
          
          {/* Revenue Insight card */}
          <div className="p-3.5 bg-slate-900/50 border border-slate-850/50 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase">
              <span>Selected Earnings</span>
              <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>Avg Daily:</span>
              <span className="font-mono text-emerald-400 font-bold">${stats.avgRevenue}</span>
            </div>
          </div>

          {/* Usage Insight card */}
          <div className="p-3.5 bg-slate-900/50 border border-slate-850/50 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase">
              <span>Sandbox Queries</span>
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-black text-white">{stats.totalUsage.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>Avg Daily:</span>
              <span className="font-mono text-amber-400 font-bold">{stats.avgUsage} reqs</span>
            </div>
          </div>

          {/* Peak Insight card */}
          <div className="p-3.5 bg-slate-900/50 border border-slate-850/50 rounded-xl space-y-2">
            <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Record Performance Peak</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Peak revenue:</span>
                <span className="font-extrabold text-indigo-300 font-mono">${stats.peakRevenue}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Peak sandbox usage:</span>
                <span className="font-extrabold text-amber-300 font-mono">{stats.peakUsage} reqs</span>
              </div>
            </div>
          </div>

          {/* Efficiency Factor Gauge */}
          <div className="pt-2">
            <div className="flex justify-between text-[9px] font-extrabold uppercase text-slate-500 mb-1.5">
              <span>Conversion Efficiency</span>
              <span className="text-indigo-400 font-mono">{( (stats.totalRevenue / (stats.totalUsage || 1)) * 100 ).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.round((stats.totalRevenue / (stats.totalUsage || 1)) * 300))}%` }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
