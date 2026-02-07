
import React, { useMemo } from 'react';
import { Target, Zap, Clock, ShieldAlert, TrendingUp, ChevronRight, Activity, CalendarCheck } from 'lucide-react';
import { StockTicker } from '../types';
import { TRADING_PHASES } from '../constants';

interface WeeklySelectionProps {
  stocks: StockTicker[];
}

const WeeklySelection: React.FC<WeeklySelectionProps> = ({ stocks }) => {
  // Sort by momentum and volatility to pick top 3 tactical candidates
  const topPicks = useMemo(() => {
    return [...stocks]
      .filter(s => s.momentum === 'Bullish')
      .sort((a, b) => b.volatility - a.volatility)
      .slice(0, 3);
  }, [stocks]);

  const currentTime = new Date();
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <CalendarCheck size={120} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Target className="text-emerald-500" /> คัดหุ้นเด่นประจำสัปดาห์ (Top Picks)
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              คัดกรองด้วย AI logic เน้น Wave 3 และความผันผวนสำหรับเป้าหมาย 4.53%
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl px-6 py-3">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Weekly Target Equity</span>
             <span className="text-lg font-black text-emerald-500 font-mono">+4.53% Compound</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {topPicks.map((stock, idx) => (
            <StockPickCard key={stock.symbol} stock={stock} rank={idx + 1} currentHour={currentHour} />
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-2">
           <Clock size={14} className="text-blue-500" /> Tactical Roadmap: 16:00 - 04:00 (BKK)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {TRADING_PHASES.filter(p => p.id !== 'closed').map(phase => (
            <div key={phase.id} className={`p-5 rounded-2xl border transition-all ${
              currentHour >= phase.start && currentHour < (phase.end === 1 ? 25 : phase.end)
                ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'bg-slate-950/50 border-slate-800 opacity-60'
            }`}>
               <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{phase.start}:00 - {phase.end}:00</span>
                  {phase.zone === 2 && <ShieldAlert size={12} className="text-rose-500" />}
                  {phase.zone === 3 && <Zap size={12} className="text-emerald-500 fill-current" />}
               </div>
               <h5 className="text-sm font-black text-white uppercase tracking-tight mb-1">{phase.name}</h5>
               <p className="text-[10px] font-bold text-slate-500 leading-tight">{phase.activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fix: Explicitly defining props type and using React.FC to handle the reserved 'key' prop in map iterators
const StockPickCard: React.FC<{ stock: StockTicker, rank: number, currentHour: number }> = ({ stock, rank, currentHour }) => {
  const targetPrice = (stock.price || 0) * 1.0453;
  
  const isDecisionTime = currentHour >= 23 || currentHour < 1;
  const isFlowTime = currentHour >= 1 && currentHour < 4;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-20">
         <span className="text-4xl font-black text-slate-800">#{rank}</span>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-emerald-500">
           {stock.symbol[0]}
        </div>
        <div>
          <h4 className="text-lg font-black text-white tracking-tighter">{stock.symbol}</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase">{stock.sector}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-3">
           <span className="text-[10px] font-black text-slate-500 uppercase">Live Price</span>
           <span className="text-lg font-black font-mono text-white">${stock.price?.toFixed(2) || '---'}</span>
        </div>
        <div className="flex justify-between items-end border-b border-slate-800 pb-3">
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Decision Target (4.53%)</span>
           <span className="text-lg font-black font-mono text-emerald-400 animate-pulse">${targetPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2">
         <div className={`p-3 rounded-xl border flex items-center justify-between ${
           isDecisionTime ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/50 border-slate-800 opacity-50'
         }`}>
            <span className="text-[9px] font-black uppercase text-slate-400">23:00 Decision Phase</span>
            <span className={`text-[9px] font-black uppercase ${isDecisionTime ? 'text-amber-500' : 'text-slate-600'}`}>
              {isDecisionTime ? 'Analyze Now' : 'Standby'}
            </span>
         </div>
         <div className={`p-3 rounded-xl border flex items-center justify-between ${
           isFlowTime ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800 opacity-50'
         }`}>
            <span className="text-[9px] font-black uppercase text-slate-400">01:00 Flow Phase (Entry)</span>
            <span className={`text-[9px] font-black uppercase ${isFlowTime ? 'text-emerald-500' : 'text-slate-600'}`}>
              {isFlowTime ? 'Execute Go' : 'Standby'}
            </span>
         </div>
      </div>

      <button className="w-full mt-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
         View Full Analysis <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default WeeklySelection;
