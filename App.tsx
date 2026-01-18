
import React, { useState } from 'react';
import DebtClock from './components/DebtClock';
import AnalyticsBoard from './components/AnalyticsBoard';
import AIAssistant from './components/AIAssistant';
import GlobalOwnershipMap from './components/GlobalOwnershipMap';
import { DollarSign, ShieldAlert, LineChart, MessageSquare, Info, Github, Globe, Map as MapIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'global'>('overview');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <DollarSign className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">DebtPulse <span className="text-amber-500">US</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Fiscal Intelligence Unit</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('global')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'global' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Global Map
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'analysis' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            AI Sage
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">Critical Alert</span>
            <span className="text-xs font-mono text-slate-400 underline decoration-red-500/50 underline-offset-4 cursor-help">Debt Ceiling: ~$31.4T (Suspended)</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Demystifying the <span className="gradient-text">Great Ledger</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            Every second, the United States financial obligation shifts. Explore the real-time breakdown of where the money comes from, where it goes, and what it means for the future.
          </p>
        </div>

        {/* Real-time Clock Section */}
        <DebtClock />

        {/* Dynamic Content */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AnalyticsBoard />
          </div>
        )}

        {activeTab === 'global' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlobalOwnershipMap />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
               <div className="lg:col-span-1 space-y-6">
                 <div className="glass-card p-6 rounded-3xl border-amber-500/20">
                   <h4 className="text-amber-500 font-bold mb-4 flex items-center">
                     <ShieldAlert className="w-4 h-4 mr-2" />
                     Why it Matters
                   </h4>
                   <p className="text-sm text-slate-400 leading-relaxed mb-4">
                     National debt affects interest rates, inflation, and future tax burdens. Understanding the breakdown is the first step in economic literacy.
                   </p>
                   <div className="space-y-3">
                     <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                        <span className="text-xs text-slate-300">Interest payments on debt are now over $1 Trillion annually.</span>
                     </div>
                     <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                        <span className="text-xs text-slate-300">Over 20% of debt is Intragovernmental (owed to ourselves).</span>
                     </div>
                     <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                        <span className="text-xs text-slate-300">Foreign ownership helps fund liquidity but introduces geopolitical risk.</span>
                     </div>
                   </div>
                 </div>

                 <div className="glass-card p-6 rounded-3xl border-blue-500/10">
                   <h4 className="text-blue-400 font-bold mb-4 flex items-center">
                     <Info className="w-4 h-4 mr-2" />
                     Debt Vocabulary
                   </h4>
                   <div className="space-y-4">
                     <div>
                       <span className="text-xs font-bold text-white block mb-1">Treasury Bills (T-Bills)</span>
                       <p className="text-[11px] text-slate-500">Short-term debt instruments (1 year or less) with high liquidity.</p>
                     </div>
                     <div>
                       <span className="text-xs font-bold text-white block mb-1">Fiscal Deficit</span>
                       <p className="text-[11px] text-slate-500">The yearly shortfall between spending and revenue that adds to total debt.</p>
                     </div>
                     <div>
                       <span className="text-xs font-bold text-white block mb-1">Quantitive Easing</span>
                       <p className="text-[11px] text-slate-500">When the Federal Reserve buys government bonds to inject money into the economy.</p>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="lg:col-span-2">
                 <AIAssistant />
               </div>
             </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm gap-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center hover:text-white transition-colors cursor-pointer"><Globe className="w-4 h-4 mr-1"/> Fiscal Data Agency</span>
            <span className="flex items-center hover:text-white transition-colors cursor-pointer"><LineChart className="w-4 h-4 mr-1"/> Treasury Reports</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-amber-500 transition-colors">Methodology</a>
            <a href="#" className="hover:text-amber-500 transition-colors">API Docs</a>
            <a href="#" className="flex items-center hover:text-white transition-colors"><Github className="w-4 h-4 mr-1"/> Source</a>
          </div>
        </footer>
      </main>

      {/* Mobile Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden">
        <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
          >
            <LineChart className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('global')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'global' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
          >
            <MapIcon className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'analysis' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
