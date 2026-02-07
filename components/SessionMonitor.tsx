
import React, { useState, useEffect } from 'react';
import { Activity, Shield, Zap, Lock } from 'lucide-react';
import { TRADING_PHASES } from '../constants';

const SessionMonitor: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getPhaseStatus = () => {
    const hours = currentTime.getHours();
    const mins = currentTime.getMinutes();
    const decimalHour = hours + mins / 60;

    // Handle early morning overlap (00:00 - 04:00)
    const normalizedHour = decimalHour < 12 ? decimalHour + 24 : decimalHour;

    const currentPhase = TRADING_PHASES.find(p => {
      const pStart = p.start >= 12 ? p.start : p.start + 24;
      const pEnd = p.end >= 12 ? p.end : p.end + 24;
      return normalizedHour >= pStart && normalizedHour < pEnd;
    });

    return currentPhase;
  };

  const phase = getPhaseStatus();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden relative shadow-lg">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Activity size={120} />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
            phase ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-500'
          }`}>
            {phase?.id === 'main' ? <Zap className="fill-current" /> : 
             phase?.id === 'open' ? <Shield /> : 
             phase?.id === 'settle' ? <Lock /> : <Activity />}
          </div>
          <div>
            <h3 className="font-black text-white uppercase tracking-tight">
              {phase ? phase.name : 'System Standby'}
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              {phase ? phase.activity : 'Monitoring Market Conditions'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TRADING_PHASES.map(p => {
            const isCurrent = phase?.id === p.id;
            return (
              <div key={p.id} className={`flex flex-col items-center px-3 py-2 rounded-xl border transition-all duration-300 ${
                isCurrent ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105 shadow-lg shadow-emerald-500/20' : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}>
                <span className="text-[8px] font-black uppercase leading-none mb-1">{p.id}</span>
                <span className="text-[10px] font-mono font-bold leading-none">
                  {p.start.toString().padStart(2, '0')}:00
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/50">
        <StatusPoint label="Risk Engine" status="Optimal" color="text-emerald-500" />
        <StatusPoint label="Game Fix" status="Armed" color="text-blue-500" />
        <StatusPoint label="Auto-Trader" status={phase ? 'Active' : 'Standby'} color={phase ? 'text-amber-500' : 'text-slate-600'} />
        <StatusPoint label="Drawdown Limit" status="3.0% Max" color="text-rose-500" />
      </div>
    </div>
  );
};

const StatusPoint = ({ label, status, color }: { label: string, status: string, color: string }) => (
  <div>
    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
    <p className={`text-xs font-bold uppercase mt-0.5 ${color}`}>{status}</p>
  </div>
);

export default SessionMonitor;
