
import React from 'react';
import { StockTicker } from '../types';

interface BubbleMapProps {
  stocks: StockTicker[];
  onSelect?: (symbol: string) => void;
}

const BubbleMap: React.FC<BubbleMapProps> = ({ stocks, onSelect }) => {
  // Simple heuristic for bubble sizing based on market cap
  const getRadius = (cap?: number) => {
    if (!cap) return 60;
    // Scale logarithmic to handle massive gaps between mega-caps and others
    const scale = Math.log10(cap) * 25;
    return Math.max(50, Math.min(120, scale));
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-950/50 rounded-3xl border border-slate-800 overflow-hidden p-8 flex flex-wrap items-center justify-center gap-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-transparent to-transparent pointer-events-none"></div>
      
      {stocks.map((stock) => {
        const radius = getRadius(stock.marketCap);
        const isPositive = (stock.change || 0) >= 0;
        
        return (
          <div 
            key={stock.symbol}
            onClick={() => onSelect?.(stock.symbol)}
            style={{ 
              width: radius * 2, 
              height: radius * 2,
            }}
            className={`
              relative flex flex-col items-center justify-center rounded-full cursor-pointer
              transition-all duration-700 ease-out hover:scale-110 hover:z-10 group
              shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]
              ${isPositive 
                ? 'bg-gradient-to-br from-emerald-500/80 to-emerald-900/90 border-2 border-emerald-400/50 hover:shadow-emerald-500/30' 
                : 'bg-gradient-to-br from-rose-500/80 to-rose-900/90 border-2 border-rose-400/50 hover:shadow-rose-500/30'}
            `}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-2 bg-gradient-to-b from-white/10 to-transparent rounded-full pointer-events-none"></div>
            
            <span className="font-black text-white text-lg tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform">
              {stock.symbol}
            </span>
            <span className="font-mono font-bold text-white/90 text-sm">
              {stock.change !== undefined ? `${stock.change > 0 ? '+' : ''}${stock.change.toFixed(1)}%` : '--'}
            </span>
            
            {/* Market Cap Subtitle */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border border-slate-700 text-slate-400">
              MCAP: ${stock.marketCap ? stock.marketCap.toFixed(1) : '??'}B
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 left-4 flex space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Gainers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Losers</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase italic">Size = Market Cap</span>
        </div>
      </div>
    </div>
  );
};

export default BubbleMap;
