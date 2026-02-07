
import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Zap, Compass, Moon } from 'lucide-react';
import { TRADING_PHASES } from '../constants';

const GoldenClockMonitor: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPhase = () => {
    const hours = time.getHours();
    const mins = time.getMinutes();
    const decimalHour = hours + mins / 60;
    
    // Milestones are strict
    if (decimalHour >= 4 && decimalHour < 16) return TRADING_PHASES.find(p => p.id === 'closed');
    if (decimalHour >= 16 && decimalHour < 18) return TRADING_PHASES.find(p => p.id === 'warmup');
    if (decimalHour >= 18 && decimalHour < 20) return TRADING_PHASES.find(p => p.id === 'fakeout');
    if (decimalHour >= 21.5 && decimalHour < 23) return TRADING_PHASES.find(p => p.id === 'danger');
    if (decimalHour >= 23 || decimalHour < 1) return TRADING_PHASES.find(p => p.id === 'decision');
    if (decimalHour >= 1 && decimalHour < 4) return TRADING_PHASES.find(p => p.id === 'flow');
    
    return TRADING_PHASES.find(p => p.id === 'closed'); // Default
  };

  const currentPhase = getPhase();
  const rotation = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10">
      {/* Background Decorative Circles */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Radial Clock Visual */}
      <div className="relative w-48 h-48 flex-shrink-0">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-dashed animate-[spin_20s_linear_infinite]"></div>
        
        {/* Phase Arcs (Simplified Visualization) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          {/* Warm Up Arc */}
          <circle cx="96" cy="96" r="88" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="100 552.9" strokeDashoffset="0" className="opacity-20" />
          {/* Danger Arc */}
          <circle cx="96" cy="96" r="88" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="40 552.9" strokeDashoffset="-280" className="opacity-30" />
          {/* Profit Arc */}
          <circle cx="96" cy="96" r="88" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="150 552.9" strokeDashoffset="-380" className="opacity-30" />
        </svg>

        {/* Center Clock Face */}
        <div className="absolute inset-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
          <div className="text-center">
             <p className="text-2xl font-black font-mono tracking-tighter text-white">
               {time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })}
             </p>
             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">BKK Time</p>
          </div>
          {/* Clock Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-transparent to-emerald-500 origin-bottom rounded-full -translate-x-1/2 -translate-y-full transition-transform duration-1000"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${rotation}deg)` }}
          ></div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500 ${
            currentPhase?.zone === 2 ? 'bg-rose-500 text-white shadow-rose-500/20' : 
            currentPhase?.zone === 3 ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20' : 
            'bg-slate-800 text-slate-400 shadow-black'
          }`}>
            {currentPhase?.zone === 2 ? <ShieldAlert /> : 
             currentPhase?.zone === 3 ? <Zap className="fill-current" /> : 
             currentPhase?.id === 'warmup' ? <Compass /> : <Moon />}
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              {currentPhase?.name}
              {currentPhase?.zone === 2 && <span className="bg-rose-500/10 text-rose-500 text-[10px] px-2 py-0.5 rounded-full border border-rose-500/20 animate-pulse">CRITICAL</span>}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              {currentPhase?.activity}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Tactical Strategy</p>
             <p className={`text-xs font-black mt-1 uppercase ${currentPhase?.zone === 3 ? 'text-emerald-500' : 'text-slate-400'}`}>
               {currentPhase?.id === 'warmup' ? 'Observe Only' : 
                currentPhase?.id === 'danger' ? 'Hands Off' : 
                currentPhase?.id === 'flow' ? 'Execute Wave 3' : 'Monitoring'}
             </p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">WDC Priority</p>
             <p className="text-xs font-black mt-1 text-blue-500 uppercase">Tracking 4.8% Vol</p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl hidden md:block">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">System Load</p>
             <p className="text-xs font-black mt-1 text-slate-400 uppercase">Optimal (Alpha-7)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldenClockMonitor;
