
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, ReferenceArea, XAxis as RechartsXAxis, YAxis as RechartsYAxis
} from 'recharts';
import { HISTORICAL_DATA, OWNERSHIP_BREAKDOWN, DEBT_EVENTS, OTHER_PRIVATE_BREAKDOWN, BANKS_FINANCIAL_BREAKDOWN, SPENDING_DATA } from '../constants';
import { Download, Milestone, Info, TrendingUp, AlertTriangle, ChevronRight, PieChart as PieIcon, CreditCard, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const event = DEBT_EVENTS.find(e => e.year === label);
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl max-w-[280px]">
        <p className="text-slate-300 font-bold mb-2 flex items-center justify-between">
          <span>{`Year ${label}`}</span>
          {event && <Milestone className="w-3 h-3 text-amber-500" />}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="mono font-bold">${entry.value}T</span>
            </div>
          ))}
        </div>
        
        {event && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-[10px] text-amber-500 font-bold uppercase mb-1 tracking-wider">Key Event</p>
            <p className="text-xs text-white font-semibold leading-tight">{event.title}</p>
            <p className="text-[10px] text-slate-400 mt-1 italic">{event.description}</p>
          </div>
        )}

        {payload[0].payload.gdpRatio && (
          <p className="text-[10px] text-emerald-400 mt-2 font-mono text-center border-t border-slate-700/30 pt-2">
            Debt-to-GDP Ratio: {payload[0].payload.gdpRatio}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

const SpendingTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl">
        <p className="text-white font-bold text-sm mb-1">{data.name}</p>
        <p className="text-xl font-bold mono" style={{ color: data.color }}>${data.amount}T</p>
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-2 inline-block ${data.isMandatory ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
          {data.isMandatory ? 'Mandatory' : 'Discretionary'}
        </span>
      </div>
    );
  }
  return null;
};

const AnalyticsBoard: React.FC = () => {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [activeDeepDive, setActiveDeepDive] = useState<'none' | 'private' | 'banks'>('none');

  const handleExportCSV = () => {
    const headers = ["Year", "Total Debt (Trillions)", "Public Debt (Trillions)", "Intragovernmental Debt (Trillions)", "Debt-to-GDP Ratio (%)"];
    const rows = HISTORICAL_DATA.map(point => [
      point.date,
      point.totalDebt,
      point.publicDebt,
      point.intragovDebt,
      point.gdpRatio
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `US_National_Debt_Historical_Data_${new Date().getFullYear()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-12 space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <span>Fiscal Insights Dashboard</span>
          </h2>
          <p className="text-slate-400 text-sm">Visualizing milestones and structural shifts in national liability.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 text-sm font-medium transition-all group"
        >
          <Download className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          <span>Export Historical Data (.csv)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Historical Growth Area Chart */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
              Decade of Debt (Trillions USD)
            </h3>
            <div className="flex space-x-4">
              <div className="flex items-center text-[10px] text-slate-500">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-1 animate-pulse"></div>
                <span>Event Marker</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORICAL_DATA}>
                <defs>
                  <linearGradient id="colorPublic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIntragov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}T`} />
                <Tooltip content={<CustomTooltip />} />
                
                {DEBT_EVENTS.map(event => (
                  <ReferenceArea 
                    key={event.year}
                    x1={event.year} 
                    x2={event.year} 
                    stroke="rgba(251, 191, 36, 0.4)" 
                    strokeWidth={2}
                    label={{ 
                      position: 'top', 
                      value: '◈', 
                      fill: '#fbbf24', 
                      fontSize: 20 
                    }}
                  />
                ))}

                <Area type="monotone" dataKey="publicDebt" name="Public Debt" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPublic)" strokeWidth={3} />
                <Area type="monotone" dataKey="intragovDebt" name="Intragovernmental" stroke="#f472b6" fillOpacity={1} fill="url(#colorIntragov)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="flex items-start p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-400"><strong>Public Debt:</strong> Includes Treasury bonds and notes held by households, firms, and foreign governments.</p>
             </div>
             <div className="flex items-start p-3 bg-pink-500/5 rounded-xl border border-pink-500/10">
                <Info className="w-4 h-4 text-pink-500 mr-2 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-400"><strong>Intragov Debt:</strong> Primarily debt owed to federal trust funds like Social Security and Medicare.</p>
             </div>
          </div>
        </div>

        {/* Timeline Events Column */}
        <div className="glass-card p-6 rounded-3xl overflow-hidden flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Milestone className="w-5 h-5 text-amber-500 mr-3" />
            Debt Milestones
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {DEBT_EVENTS.slice().reverse().map((event, idx) => (
              <div 
                key={idx} 
                onMouseEnter={() => setHoveredEvent(event.year)}
                onMouseLeave={() => setHoveredEvent(null)}
                className={`relative pl-8 pb-4 border-l-2 transition-all group ${hoveredEvent === event.year ? 'border-amber-500' : 'border-slate-800'}`}
              >
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 transition-all ${hoveredEvent === event.year ? 'bg-amber-500 border-amber-500 scale-125' : 'bg-slate-900 border-slate-700'}`}></div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-tighter">
                    {event.year}
                  </span>
                  {event.impact === 'increase' && <TrendingUp className="w-3 h-3 text-red-500" />}
                </div>
                <h4 className={`text-sm font-bold transition-colors ${hoveredEvent === event.year ? 'text-white' : 'text-slate-300'}`}>
                  {event.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1 group-hover:text-slate-400">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
             <div className="flex items-center space-x-2 text-amber-500/80 mb-2">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[10px] uppercase font-bold tracking-tighter">Contextual Note</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-snug">
               Events marked with <TrendingUp className="inline w-2 h-2 mx-0.5" /> represent policy or economic shifts that significantly accelerated the debt trajectory.
             </p>
          </div>
        </div>

        {/* Ownership Distribution Pie Chart & Deep Dive */}
        <div className="glass-card p-6 rounded-3xl lg:row-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <span className="w-2 h-6 bg-amber-500 rounded-full mr-3"></span>
            Who Holds the Debt?
          </h3>
          <div className="h-[250px] w-full flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={OWNERSHIP_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {OWNERSHIP_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: number) => [`$${value}T`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Primary Categories</p>
            {OWNERSHIP_BREAKDOWN.map((item, idx) => {
              const hasDeepDive = item.name === 'Other Private' || item.name === 'Banks/Financials';
              const isActive = (item.name === 'Other Private' && activeDeepDive === 'private') || 
                               (item.name === 'Banks/Financials' && activeDeepDive === 'banks');

              return (
                <button 
                  key={idx} 
                  onClick={() => {
                    if (item.name === 'Other Private') setActiveDeepDive(isActive ? 'none' : 'private');
                    else if (item.name === 'Banks/Financials') setActiveDeepDive(isActive ? 'none' : 'banks');
                  }}
                  className={`w-full flex flex-col p-2.5 rounded-xl transition-all border text-left group ${
                    isActive ? 'bg-slate-800 border-slate-600' : 'hover:bg-slate-800/50 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] mono text-slate-400 font-bold">${item.value}T</span>
                      {hasDeepDive && (
                        <ChevronRight className={`w-3 h-3 text-slate-600 transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight group-hover:text-slate-400">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Deep Dive Modal Content Replacement (Inline) */}
          {activeDeepDive !== 'none' && (
            <div className="mt-8 p-4 bg-slate-900/80 border border-slate-700/50 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <PieIcon className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-amber-400">
                    {activeDeepDive === 'private' ? 'Other Private Deep Dive' : 'Banks Deep Dive'}
                  </h4>
                </div>
                <button onClick={() => setActiveDeepDive('none')} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold">Close</button>
              </div>
              <div className="space-y-3">
                {(activeDeepDive === 'private' ? OTHER_PRIVATE_BREAKDOWN : BANKS_FINANCIAL_BREAKDOWN).map((sub, i) => (
                  <div key={i} className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-200">{sub.name}</span>
                      <span className="text-xs mono font-bold text-amber-400">${sub.amount}T</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">{sub.description}</p>
                    {i < (activeDeepDive === 'private' ? OTHER_PRIVATE_BREAKDOWN : BANKS_FINANCIAL_BREAKDOWN).length - 1 && (
                      <div className="h-px bg-slate-800 mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Debt-to-GDP Ratio Bar Chart */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
            The Debt-to-GDP Ratio Evolution
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                   cursor={{fill: '#ffffff10'}}
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="gdpRatio" name="Debt-to-GDP %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
             <p className="text-sm text-slate-300 leading-relaxed">
               <strong className="text-emerald-400 uppercase text-xs mr-2">Economic Health:</strong> 
               A rising ratio indicates that the government's borrowing is growing faster than the economy. Historically, levels over 100% are associated with slowing long-term growth.
             </p>
          </div>
        </div>

        {/* Annual Outlays Section */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold flex items-center">
                <CreditCard className="w-6 h-6 text-pink-500 mr-3" />
                Annual Outlays: Where the Money Goes
              </h3>
              <p className="text-sm text-slate-500">Breakdown of major federal spending categories (2024 Estimates in Trillions)</p>
            </div>
            <div className="flex items-center space-x-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
               <div className="flex items-center space-x-1.5 px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mandatory</span>
               </div>
               <div className="flex items-center space-x-1.5 px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Discretionary</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-3 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={SPENDING_DATA}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <RechartsXAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}T`} />
                  <RechartsYAxis type="category" dataKey="name" stroke="#f8fafc" fontSize={11} width={130} tickLine={false} axisLine={false} />
                  <Tooltip content={<SpendingTooltip />} cursor={{fill: '#ffffff05'}} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
                    {SPENDING_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-pink-500">
                  <Activity className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Spending Insights</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-white block mb-1">Interest Avalanche</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic">
                      "Net Interest" is now approaching the total Defense budget. This represents payments on existing debt with no social return.
                    </p>
                  </div>
                  <div className="h-px bg-slate-800"></div>
                  <div>
                    <span className="text-xs font-bold text-white block mb-1">Mandatory vs Discretionary</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Over 70% of the budget is "Mandatory" (Social Security, Medicare, Interest), meaning it's paid automatically by law without annual congressional votes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-[10px] text-amber-500 leading-relaxed">
                  <strong>Did you know?</strong> Social Security and Health programs are the primary drivers of the long-term fiscal gap as the population ages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsBoard;
