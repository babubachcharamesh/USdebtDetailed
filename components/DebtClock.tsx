
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  BASE_DEBT, 
  DEBT_GROWTH_PER_SECOND, 
  US_POPULATION, 
  US_TAXPAYERS, 
  US_MEDIAN_HOUSEHOLD_INCOME,
  HISTORICAL_DATA 
} from '../constants';
import { Scale, Users, Wallet, TrendingUp, AlertCircle } from 'lucide-react';

const DebtClock: React.FC = () => {
  const [currentDebt, setCurrentDebt] = useState(BASE_DEBT);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime.current) / 1000;
      setCurrentDebt(BASE_DEBT + (elapsedSeconds * DEBT_GROWTH_PER_SECOND));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const perCitizen = currentDebt / US_POPULATION;
  const perTaxpayer = currentDebt / US_TAXPAYERS;

  const citizenBurdenPercent = (perCitizen / US_MEDIAN_HOUSEHOLD_INCOME) * 100;
  const taxpayerBurdenPercent = (perTaxpayer / US_MEDIAN_HOUSEHOLD_INCOME) * 100;

  const getBurdenStatus = (percent: number) => {
    if (percent < 50) return { label: 'Moderate', color: 'text-emerald-400', bg: 'bg-emerald-500/20', bar: 'from-emerald-600 to-emerald-400' };
    if (percent < 100) return { label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/20', bar: 'from-amber-600 to-amber-400' };
    if (percent < 200) return { label: 'Severe', color: 'text-orange-500', bg: 'bg-orange-500/20', bar: 'from-orange-600 to-orange-400' };
    return { label: 'Critical', color: 'text-red-500', bg: 'bg-red-500/20', bar: 'from-red-600 to-red-400' };
  };

  const citizenStatus = getBurdenStatus(citizenBurdenPercent);
  const taxpayerStatus = getBurdenStatus(taxpayerBurdenPercent);

  // Prepare chart data: Debt per Capita (Total Debt * 1T / Population)
  const trendData = useMemo(() => {
    return HISTORICAL_DATA.map(point => ({
      year: point.date,
      perCapita: Math.round((Number(point.totalDebt) * 1000000000000) / US_POPULATION)
    }));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-3xl border border-amber-500/20 shadow-2xl shadow-amber-500/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      
      <h2 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">Live National Debt Estimate</h2>
      
      <div className="mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
        {formatCurrency(currentDebt)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-4xl">
        {/* Per Citizen Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col relative group overflow-hidden border-white/5 hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-12 h-12 text-blue-400" />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Debt Per Citizen</span>
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter ${citizenStatus.bg} ${citizenStatus.color}`}>
              {citizenStatus.label} Burden
            </div>
          </div>
          
          <div className="flex items-baseline space-x-2 mb-6">
            <span className="text-3xl font-bold text-white">{formatCurrency(perCitizen)}</span>
            <span className="text-xs font-mono text-slate-500">/ person</span>
          </div>
          
          <div className="mt-auto space-y-3">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Debt-to-Income Ratio</span>
                <span className="text-[9px] text-slate-600">vs Median Household Income</span>
              </div>
              <div className="text-right">
                <span className={`text-xl font-mono font-black ${citizenStatus.color}`}>{citizenBurdenPercent.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className={`h-full bg-gradient-to-r ${citizenStatus.bar} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${Math.min(citizenBurdenPercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Per Taxpayer Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col relative group overflow-hidden border-white/5 hover:border-amber-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-12 h-12 text-amber-400" />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Debt Per Taxpayer</span>
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter ${taxpayerStatus.bg} ${taxpayerStatus.color}`}>
              {taxpayerStatus.label} Burden
            </div>
          </div>

          <div className="flex items-baseline space-x-2 mb-6">
            <span className="text-3xl font-bold text-white">{formatCurrency(perTaxpayer)}</span>
            <span className="text-xs font-mono text-slate-500">/ taxpayer</span>
          </div>
          
          <div className="mt-auto space-y-3">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Debt-to-Income Ratio</span>
                <span className="text-[9px] text-slate-600">vs Median Household Income</span>
              </div>
              <div className="text-right">
                <span className={`text-xl font-mono font-black ${taxpayerStatus.color}`}>{taxpayerBurdenPercent.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className={`h-full bg-gradient-to-r ${taxpayerStatus.bar} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${Math.min(taxpayerBurdenPercent / 4, 100)}%` }} 
              ></div>
            </div>
            {taxpayerBurdenPercent > 100 && (
              <div className="flex items-center justify-end space-x-1.5 pt-1">
                <AlertCircle className="w-2.5 h-2.5 text-red-500" />
                <p className="text-[9px] text-red-400/80 font-bold uppercase">Exceeds annual median income</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Per Capita Trend Chart */}
      <div className="w-full max-w-4xl mt-8 glass-card p-6 rounded-3xl border-slate-700/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Historical Debt Per Capita</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">10-Year Growth Trajectory</p>
            </div>
          </div>
          <div className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-bold">
            +{( (trendData[trendData.length-1].perCapita / trendData[0].perCapita - 1) * 100 ).toFixed(1)}% Since 2014
          </div>
        </div>
        
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
              <XAxis 
                dataKey="year" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{fill: '#475569'}}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `$${Math.round(val/1000)}k`}
                tick={{fill: '#475569'}}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                formatter={(val: number) => [formatCurrency(val), 'Debt Per Capita']}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="perCapita" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#020617' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center gap-4 text-center">
        <div className="flex items-center space-x-2 text-red-400 text-xs animate-pulse-gold">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Increasing by approximately $45,000 every second</span>
        </div>
        <div className="hidden md:block h-4 w-px bg-slate-800"></div>
        <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
          <Scale className="w-3 h-3" />
          <span>Benchmark: US Median Household Income ({formatCurrency(US_MEDIAN_HOUSEHOLD_INCOME)})</span>
        </div>
      </div>
    </div>
  );
};

export default DebtClock;
