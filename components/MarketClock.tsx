
import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

const MarketClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const estTime = new Date(time.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const estHour = estTime.getHours();
  const isOpen = (estHour >= 9 && estHour < 16) || (estHour === 9 && estTime.getMinutes() >= 30);
  
  const isPreMarket = estHour >= 4 && estHour < 9.5;

  return (
    <div className="space-y-4 px-2">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : isPreMarket ? 'bg-amber-500' : 'bg-red-500'}`}></div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {isOpen ? 'Market Open' : isPreMarket ? 'Pre-Market' : 'Market Closed'}
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase">Thailand (BKK)</p>
          <p className="font-mono text-sm font-bold text-white">
            {time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase">New York (EST)</p>
          <p className="font-mono text-sm font-bold text-white">
            {estTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketClock;
