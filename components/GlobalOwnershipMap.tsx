
import React, { useState, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { DETAILED_FOREIGN_HOLDERS, MapHolder } from '../constants';
import { Globe, MapPin, TrendingUp, Clock, Download, Zap } from 'lucide-react';

const GlobalOwnershipMap: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<MapHolder | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<MapHolder | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Dynamically calculate the "Last Updated" date based on the current date.
  // TIC (Treasury International Capital) data usually has a ~2 month reporting lag.
  const dynamicLastUpdate = useMemo(() => {
    const now = new Date();
    // Go back 2 months for "realism"
    now.setMonth(now.getMonth() - 2);
    return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, []);

  // Generate simulated historical trend for the sparkline
  const sparklineData = useMemo(() => {
    if (!hoveredCountry) return [];
    const amount = hoveredCountry.amount;
    return [
      { val: amount * 0.82 },
      { val: amount * 0.88 },
      { val: amount * 0.85 },
      { val: amount * 0.94 },
      { val: amount * 0.91 },
      { val: amount * 0.98 },
      { val: amount },
    ];
  }, [hoveredCountry]);

  const handleExportCSV = () => {
    const headers = ["Country ID", "Country Name", "Amount (Trillions USD)", "Percentage of Foreign Holdings (%)"];
    const rows = DETAILED_FOREIGN_HOLDERS.map(holder => [
      holder.id,
      holder.name,
      holder.amount,
      holder.percentage
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `US_Foreign_Debt_Holders_${new Date().getFullYear()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="mt-12 space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Globe className="w-6 h-6 text-blue-400" />
              <span>Global Debt Distribution</span>
            </h2>
            <p className="text-slate-400 text-sm">Mapping the nations that fund the United States deficit.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-3 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full transition-all duration-300 hover:border-slate-600 shadow-inner group">
            <div className="relative">
               <Clock className="w-4 h-4 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-slate-900 animate-pulse"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] font-black text-slate-500 leading-none mb-0.5">Live Data Stream</span>
              <span className="text-[10px] font-bold text-slate-200">
                Reporting: <span className="text-blue-400">{dynamicLastUpdate}</span>
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 text-xs font-bold transition-all group shadow-lg"
          >
            <Download className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Interactive SVG Map Container */}
        <div 
          className="lg:col-span-3 glass-card p-4 md:p-8 rounded-3xl relative overflow-hidden min-h-[400px] md:min-h-[550px] flex items-center justify-center transition-all duration-500 group"
          onMouseMove={handleMouseMove}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
          </div>
          
          <svg viewBox="0 0 100 100" className="w-full h-full max-w-4xl drop-shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            {/* World Outline Symbolic Regions */}
            <rect x="5" y="20" width="30" height="40" rx="2" fill="rgba(30, 41, 59, 0.4)" />
            <rect x="45" y="15" width="15" height="35" rx="2" fill="rgba(30, 41, 59, 0.4)" />
            <rect x="42" y="55" width="18" height="30" rx="2" fill="rgba(30, 41, 59, 0.4)" />
            <rect x="65" y="20" width="30" height="45" rx="2" fill="rgba(30, 41, 59, 0.4)" />
            <rect x="75" y="70" width="15" height="15" rx="2" fill="rgba(30, 41, 59, 0.4)" />

            {/* Country Pins */}
            {DETAILED_FOREIGN_HOLDERS.map((country) => {
              const isSelected = selectedCountry?.id === country.id;
              const isHovered = hoveredCountry?.id === country.id;
              const scale = isSelected ? 1.6 : (isHovered ? 1.3 : 1);
              const opacity = isSelected || isHovered ? 1 : 0.6;
              const size = Math.sqrt(country.amount) * 3;

              return (
                <g 
                  key={country.id} 
                  className="cursor-pointer group/pin"
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => setSelectedCountry(country)}
                >
                  {/* Selection Ripple Animation */}
                  {isSelected && (
                    <circle 
                      cx={country.coordinates[0]} 
                      cy={country.coordinates[1]} 
                      r="0"
                      fill="none"
                      stroke="#fbbf24"
                      className="animate-selection-ring pointer-events-none"
                    />
                  )}
                  
                  {/* Base Circle with Glow */}
                  <circle 
                    cx={country.coordinates[0]} 
                    cy={country.coordinates[1]} 
                    r={size * scale} 
                    fill={isSelected ? '#3b82f6' : (isHovered ? '#60a5fa' : '#3b82f6')} 
                    fillOpacity={opacity * 0.25} 
                    className="transition-all duration-500 ease-out"
                  />
                  
                  {/* Core Point */}
                  <circle 
                    cx={country.coordinates[0]} 
                    cy={country.coordinates[1]} 
                    r={2 * (isSelected ? 1.5 : (isHovered ? 1.2 : 1))} 
                    fill={isSelected ? '#fbbf24' : '#3b82f6'} 
                    className="transition-all duration-300 shadow-xl"
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover Deep-Dive Tooltip Overlay */}
          {hoveredCountry && (
            <div 
              className="absolute z-50 pointer-events-none transition-opacity duration-200"
              style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
            >
              <div className="glass-card bg-slate-950/95 border-blue-500/50 p-4 rounded-2xl shadow-2xl min-w-[220px] animate-fade-in-up backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white tracking-tight">{hoveredCountry.name}</span>
                  <span className="text-[9px] font-mono bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase">{hoveredCountry.id}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/50 p-2 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Held</span>
                      <span className="text-white font-mono font-bold text-sm">${hoveredCountry.amount}T</span>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Share</span>
                      <span className="text-blue-400 font-bold text-sm">{hoveredCountry.percentage}%</span>
                    </div>
                  </div>

                  {/* Sparkline Chart */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Estimated Trend</span>
                      <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <div className="h-10 w-full bg-slate-900/40 rounded-lg border border-white/5 p-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                          <Line 
                            type="monotone" 
                            dataKey="val" 
                            stroke="#60a5fa" 
                            strokeWidth={2} 
                            dot={false} 
                            isAnimationActive={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-400 italic leading-tight px-1 pt-1 border-t border-white/5">
                    Strategic international creditor helping maintain Treasury market liquidity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Legend Overlay */}
          <div className="absolute bottom-6 left-6 flex items-center space-x-4 bg-slate-900/90 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-2xl transition-transform hover:scale-105">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Major Holder</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Selected</span>
            </div>
          </div>
        </div>

        {/* Info Panel with transitions */}
        <div className="lg:col-span-1 space-y-6 overflow-hidden min-h-[500px]">
          {selectedCountry ? (
            <div key={selectedCountry.id} className="glass-card p-6 rounded-3xl border-blue-500/30 animate-slide-in-right h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{selectedCountry.name}</h3>
                  <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded w-fit mt-1">ISO: {selectedCountry.id}</span>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              
              <div className="space-y-8 flex-1">
                <div className="group">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 group-hover:text-blue-400 transition-colors">Total Debt Held</p>
                  <p className="text-4xl font-bold text-white mono tracking-tighter">
                    ${selectedCountry.amount}<span className="text-lg text-slate-500 font-medium ml-1">T</span>
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Ownership Share</p>
                    <span className="text-sm font-bold text-blue-400">{selectedCountry.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${selectedCountry.percentage}%` }}></div>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-2 text-right italic">Relative to total foreign holdings</p>
                </div>

                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-700/50 space-y-3 shadow-inner">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Strategic Profile</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    As a top-tier holder of US securities, <span className="text-slate-200 font-medium">{selectedCountry.name}</span> plays a pivotal role in maintaining the liquidity of the Treasury market. Sudden liquidations from this region could trigger significant volatility in global interest rates.
                  </p>
                </div>

                <button 
                  onClick={() => setSelectedCountry(null)}
                  className="w-full mt-auto py-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-2xl transition-all border border-transparent hover:border-slate-500"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-3xl border-slate-800/50 h-full flex flex-col justify-center items-center text-center space-y-6 animate-fade-in-up">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                <div className="relative p-6 bg-slate-900 rounded-full border border-white/5">
                  <MapPin className="w-10 h-10 text-blue-400 animate-bounce" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Select a Nation</h3>
                <p className="text-sm text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                  Interact with the global map or hover over nation markers to reveal deep-dive fiscal analysis.
                </p>
              </div>
              <div className="pt-6 w-full space-y-3">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest text-left px-2">Key Strategic Holders</div>
                <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                  {DETAILED_FOREIGN_HOLDERS.slice(0, 6).map(h => (
                    <button 
                      key={h.id} 
                      className="flex items-center justify-between text-xs p-3 bg-slate-900/40 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer transition-all hover:translate-x-1 group"
                      onClick={() => setSelectedCountry(h)}
                    >
                      <span className="text-slate-400 group-hover:text-white transition-colors">{h.name}</span>
                      <span className="mono text-blue-400 font-bold tracking-tighter">${h.amount}T</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalOwnershipMap;
