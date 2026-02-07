
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ShieldCheck, Loader2, AlertTriangle, TrendingUp } from 'lucide-react';
import { GeminiAnalyst } from '../services/geminiService';

export default function GeminiAnalystUI() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const analystRef = useRef(new GeminiAnalyst());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev: any) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await analystRef.current.analyzeTrade(userMsg);
      setMessages((prev: any) => [...prev, { role: 'assistant', content: response || "Strategist assessment complete." }]);
    } catch (err) {
      setMessages((prev: any) => [...prev, { role: 'assistant', content: "SYSTEM ERROR: Risk Core Offline. Please check API Key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto w-full">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-black text-sm tracking-tight text-white uppercase">AI Risk Manager</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Portfolio Strategy Core</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-black bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">4.53% TARGET MODE</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/40 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-50 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                <Bot size={32} className="text-slate-500" />
              </div>
              <div className="max-w-xs">
                <p className="text-sm font-bold text-slate-300">Standing by for Market Data</p>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">Please provide VIX level, QQQ trend, and your target tickers for weekly assessment.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm mt-4">
                 <button onClick={() => setInput("Evaluate market conditions for this week. VIX is at 14.5, QQQ is bullish above EMA20.")} className="p-2 bg-slate-800 rounded-lg text-[9px] font-bold text-slate-400 hover:bg-slate-700 transition-colors">QUICK MARKET EVAL</button>
                 <button onClick={() => setInput("Review NVDA setup for 4.53% weekly goal. Current price $142.")} className="p-2 bg-slate-800 rounded-lg text-[9px] font-bold text-slate-400 hover:bg-slate-700 transition-colors">NVDA RISK REVIEW</button>
              </div>
            </div>
          )}

          {messages.map((m: any, idx: number) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-5 rounded-2xl border shadow-lg ${
                m.role === 'user' 
                  ? 'bg-slate-800 text-slate-200 border-slate-700 rounded-tr-none' 
                  : 'bg-slate-950 text-slate-200 border-slate-800 rounded-tl-none'
              }`}>
                <div className="flex items-center space-x-2 mb-2 opacity-50">
                   {m.role === 'user' ? <User size={12} /> : <ShieldCheck size={12} className="text-emerald-500" />}
                   <p className="text-[10px] font-black uppercase tracking-widest">{m.role === 'user' ? 'Commander' : 'Risk Manager'}</p>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {m.content}
                </div>
                {m.role === 'assistant' && (
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-600 uppercase">Verification Alpha-7</span>
                    <TrendingUp size={14} className="text-emerald-500/50" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center space-x-3">
                <Loader2 className="animate-spin text-emerald-500" size={18} />
                <span className="text-xs font-bold text-slate-400 animate-pulse">CALCULATING PROBABILITIES...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="ป้อนข้อมูลตลาด หรือคำถามเพื่อประเมินความเสี่ยง..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-sm outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
              />
              <Bot size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            </div>
            <button 
              onClick={handleSend}
              disabled={loading}
              className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all shadow-lg ${
                loading ? 'bg-slate-800 text-slate-600' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:scale-105 active:scale-95'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-2 flex justify-center">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Powered by Gemini 3 Pro — Elite Risk Management Logic</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const User = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
