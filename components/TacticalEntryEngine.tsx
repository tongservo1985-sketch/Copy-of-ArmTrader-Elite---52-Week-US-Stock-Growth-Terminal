
import React, { useMemo } from 'react';
import { Target, ShieldAlert, Zap, Timer, CheckCircle2, XCircle } from 'lucide-react';
import { TRADING_PHASES } from '../constants';
import { StockTicker } from '../types';

interface TacticalEntryEngineProps {
  stock: StockTicker | undefined;
}

const TacticalEntryEngine: React.FC<TacticalEntryEngineProps> = ({ stock }) => {
  const currentPhase = useMemo(() => {
    const time = new Date();
    const hours = time.getHours();
    const mins = time.getMinutes();
    const decimalHour = hours + mins / 60;
    
    if (decimalHour >= 4 && decimalHour < 16) return TRADING_PHASES.find(p => p.id === 'closed');
    if (decimalHour >= 16 && decimalHour < 18) return TRADING_PHASES.find(p => p.id === 'warmup');
    if (decimalHour >= 18 && decimalHour < 20) return TRADING_PHASES.find(p => p.id === 'fakeout');
    if (decimalHour >= 21.5 && decimalHour < 23) return TRADING_PHASES.find(p => p.id === 'danger');
    if (decimalHour >= 23 || decimalHour < 1) return TRADING_PHASES.find(p => p.id === 'decision');
    if (decimalHour >= 1 && decimalHour < 4) return TRADING_PHASES.find(p => p.id === 'flow');
    return TRADING_PHASES.find(p => p.id === 'closed');
  }, [new Date().getMinutes()]);

  const decision = useMemo(() => {
    if (!currentPhase) return { status: 'STANDBY', color: 'text-slate-500', icon: <Timer /> };
    
    switch (currentPhase.id) {
      case 'warmup': return { status: 'OBSERVE', color: 'text-amber-500', icon: <Target /> };
      case 'fakeout': return { status: 'CAUTION', color: 'text-orange-500', icon: <ShieldAlert /> };
      case 'danger': return { status: 'HANDS OFF', color: 'text-rose-500', icon: <XCircle /> };
      case 'decision': return { status: 'ANALYZING', color: 'text-blue-500', icon: <Zap /> };
      case 'flow': return { status: 'EXECUTE GO', color: 'text-emerald-500', icon: <CheckCircle2 /> };
      default: return { status: 'CLOSED', color: 'text-slate-500', icon: <Timer /> };
    }
  }, [currentPhase]);

  const entryData = useMemo(() => {
    if (!stock?.price) return null;
    const atr = stock.price * 0.015; // Simulated ATR 1.5%
    return {
      entry: (stock.price * 1.002).toFixed(2),
      sl: (stock.price * 0.985).toFixed(2),
      tp: (stock.price * 1.0453).toFixed(2), // 4.53% target
      rr: '1:3.0'
    };
  }, [stock]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${decision.color}`}>
            {decision.icon}
          </div>
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Tactical Entry Engine</h3>
        </div>
        <div className={`text-xs font-black uppercase tracking-tighter ${decision.color} animate-pulse`}>
          {decision.status}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl">
            <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Entry Price</p>
            <p className="text-sm font-black font-mono text-emerald-400">${entryData?.entry || '---'}</p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl">
            <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Stop Loss (1.5%)</p>
            <p className="text-sm font-black font-mono text-rose-500">${entryData?.sl || '---'}</p>
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
             <p className="text-[8px] font-black text-slate-600 uppercase">Weekly Target (4.53%)</p>
             <p className="text-[8px] font-black text-emerald-500 uppercase">R/R {entryData?.rr}</p>
          </div>
          <p className="text-lg font-black font-mono text-white tracking-tighter">${entryData?.tp || '---'}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
         <button 
           disabled={decision.status !== 'EXECUTE GO'}
           className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${
             decision.status === 'EXECUTE GO' 
               ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95' 
               : 'bg-slate-800 text-slate-600 cursor-not-allowed'
           }`}
         >
           Place Order
         </button>
         <button className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
           <ShieldAlert size={16} />
         </button>
      </div>
    </div>
  );
};

export default TacticalEntryEngine;
