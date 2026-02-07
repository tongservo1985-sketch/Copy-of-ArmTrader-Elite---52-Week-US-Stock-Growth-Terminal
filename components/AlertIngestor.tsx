
import React, { useState } from 'react';
import { Bell, Zap, Terminal, Search, Loader2 } from 'lucide-react';
import { TradingSignal } from '../types';
import { GeminiAnalyst } from '../services/geminiService';

interface AlertIngestorProps {
  signals: TradingSignal[];
  onNewSignal: (signal: TradingSignal) => void;
}

const AlertIngestor: React.FC<AlertIngestorProps> = ({ signals, onNewSignal }) => {
  const [loading, setLoading] = useState(false);
  const analyst = new GeminiAnalyst();

  const simulateAlert = async () => {
    setLoading(true);
    const mockTickers = ['NVDA', 'ARM', 'TSLA', 'AAPL', 'AMD'];
    const ticker = mockTickers[Math.floor(Math.random() * mockTickers.length)];
    const price = 100 + Math.random() * 500;
    
    const mockJson = JSON.stringify({
      ticker,
      price: price.toFixed(2),
      action: Math.random() > 0.5 ? 'BUY' : 'SELL',
      condition: "Bollinger Band Squeeze Breakout",
      timestamp: new Date().toISOString()
    });

    try {
      const summary = await analyst.summarizeAlert(mockJson);
      const signal: TradingSignal = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        symbol: ticker,
        price: parseFloat(price.toFixed(2)),
        action: Math.random() > 0.5 ? 'BUY' : 'SELL',
        condition: "BB Squeeze / Elliott Wave 3",
        aiSummary: summary
      };
      onNewSignal(signal);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
            <Bell size={20} />
          </div>
          <h3 className="font-black text-lg uppercase tracking-tight">Signal Feed (Alert Connector)</h3>
        </div>
        <button 
          onClick={simulateAlert}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black py-2 px-4 rounded-lg flex items-center space-x-2 transition-all active:scale-95 text-xs"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
          <span>SIMULATE TRADINGVIEW ALERT</span>
        </button>
      </div>

      <div className="grid gap-4">
        {signals.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center opacity-50">
            <Terminal size={40} className="text-slate-700 mb-4" />
            <p className="text-sm font-bold text-slate-500 uppercase">Listening for TradingView Webhooks...</p>
            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">Connect your alerts to auto-summarize with AI Architect</p>
          </div>
        ) : (
          signals.map(signal => (
            <div key={signal.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs border ${
                    signal.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {signal.symbol}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        signal.action === 'BUY' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                      }`}>
                        {signal.action} SIGNAL
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{signal.timestamp}</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">{signal.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-black text-white">${signal.price.toLocaleString()}</p>
                </div>
              </div>

              {signal.aiSummary && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Search size={40} />
                  </div>
                  <div className="flex items-center space-x-2 mb-2 text-blue-400">
                    <Zap size={12} className="fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Strategist Insight</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {signal.aiSummary}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertIngestor;
