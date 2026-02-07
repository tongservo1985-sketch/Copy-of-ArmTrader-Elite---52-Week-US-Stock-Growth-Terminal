
import React, { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Line } from 'recharts';
// Fix: Import Activity icon from lucide-react
import { Activity } from 'lucide-react';

interface StockVolatilityChartProps {
  symbol: string;
}

const StockVolatilityChart: React.FC<StockVolatilityChartProps> = ({ symbol }) => {
  const data = useMemo(() => {
    const points = [];
    let price = 150 + Math.random() * 100;
    let atr = 5 + Math.random() * 5;
    for (let i = 0; i < 30; i++) {
      const change = (Math.random() - 0.5) * 10;
      price += change;
      // Mock ATR Calculation: smoothed absolute change
      atr = atr * 0.9 + Math.abs(change) * 0.2; 
      points.push({
        name: `T-${30 - i}`,
        price: parseFloat(price.toFixed(2)),
        atrUpper: parseFloat((price + atr * 1.5).toFixed(2)),
        atrLower: parseFloat((price - atr * 1.5).toFixed(2)),
        volatility: parseFloat(atr.toFixed(2))
      });
    }
    return points;
  }, [symbol]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-blue-500/10 rounded text-blue-500">
            <Activity size={14} />
          </div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{symbol} Volatility Engine (ATR)</h4>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
             <div className="w-2.5 h-0.5 bg-blue-500"></div>
             <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Price</span>
          </div>
          <div className="flex items-center space-x-1.5">
             <div className="w-2.5 h-2.5 bg-blue-500/10 border border-blue-500/20 rounded-sm"></div>
             <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">ATR Range</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="atrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.5} />
            <XAxis dataKey="name" hide />
            <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={9} axisLine={false} tickLine={false} tickCount={6} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ color: '#94a3b8', padding: '2px 0' }}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="atrUpper" 
              stroke="transparent" 
              fill="url(#atrGrad)" 
              baseValue="atrLower"
              animationDuration={1000}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4, stroke: '#0f172a', strokeWidth: 2 }} 
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockVolatilityChart;
