
import React, { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Target, BarChart3, MessageSquare, Activity, Zap, Calendar, RefreshCw, 
  RotateCcw, LayoutGrid, CheckCircle2, LogOut, Settings, Save, Bell, ShieldCheck, AlertCircle, Cpu, Layers
} from 'lucide-react';
import { 
  STARTING_CAPITAL as DEFAULT_STARTING_CAPITAL, WEEKLY_TARGET_PERCENT, TOTAL_WEEKS, WATCHLIST 
} from './constants';
import { WeeklyProgress, StockTicker, UserAccount, TradingSignal, StockCategory } from './types';
import MarketClock from './components/MarketClock';
import GeminiAnalystUI from './components/GeminiAnalystUI';
import BubbleMap from './components/BubbleMap';
import LoginTerminal from './components/LoginTerminal';
import AlertIngestor from './components/AlertIngestor';
import GoldenClockMonitor from './components/GoldenClockMonitor';
import StockVolatilityChart from './components/StockVolatilityChart';
import TacticalEntryEngine from './components/TacticalEntryEngine';
import { GeminiAnalyst } from './services/geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plan' | 'analyst' | 'bubbles' | 'alerts'>('dashboard');
  const [weeklyData, setWeeklyData] = useState<WeeklyProgress[]>([]);
  const [stocks, setStocks] = useState<StockTicker[]>(WATCHLIST);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState('NVDA');

  const analyst = useMemo(() => new GeminiAnalyst(), []);

  useEffect(() => {
    let interval: number;
    if (currentUser) {
      refreshMarketData();
      interval = window.setInterval(refreshMarketData, 60000); // Polling every minute
    }
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleLogin = (username: string) => {
    const userKey = `armtrader_user_${username.toLowerCase()}`;
    const savedUserData = localStorage.getItem(userKey);
    
    if (savedUserData) {
      const parsed = JSON.parse(savedUserData);
      setCurrentUser({
        username,
        startingCapital: parsed.startingCapital || DEFAULT_STARTING_CAPITAL,
        lastLogin: new Date().toISOString()
      });
      setWeeklyData(parsed.weeklyData || []);
    } else {
      const newUser: UserAccount = {
        username,
        startingCapital: DEFAULT_STARTING_CAPITAL,
        lastLogin: new Date().toISOString()
      };
      setCurrentUser(newUser);
      initializeProjections(DEFAULT_STARTING_CAPITAL);
    }
  };

  const handleLogout = () => setCurrentUser(null);

  const initializeProjections = (capital: number) => {
    const data: WeeklyProgress[] = [];
    let currentEquity = capital;
    for (let i = 1; i <= TOTAL_WEEKS; i++) {
      const target = currentEquity * (1 + WEEKLY_TARGET_PERCENT / 100);
      data.push({
        week: i,
        targetEquity: target,
        actualEquity: 0,
        profitPercentage: WEEKLY_TARGET_PERCENT,
        status: 'pending'
      });
      currentEquity = target;
    }
    setWeeklyData(data);
  };

  const updateActualEquity = (weekIndex: number, value: number) => {
    const updatedData = [...weeklyData];
    updatedData[weekIndex] = { ...updatedData[weekIndex], actualEquity: value, status: value > 0 ? 'completed' : 'pending' };
    setWeeklyData(updatedData);
  };

  const refreshMarketData = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      // Chunk symbols into groups of 10 to avoid payload limits and stabilize response
      const result = await analyst.fetchMarketData(stocks.map(s => s.symbol));
      setStocks(prev => prev.map(s => {
        const live = result.data[s.symbol];
        return live ? { ...s, price: live.price, change: live.change, marketCap: live.marketCap } : s;
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const completed = weeklyData.filter(w => w.status === 'completed');
    const lastActual = completed.length > 0 ? completed[completed.length - 1].actualEquity : (currentUser?.startingCapital || DEFAULT_STARTING_CAPITAL);
    const totalTargetFinal = weeklyData.length > 0 ? weeklyData[TOTAL_WEEKS - 1].targetEquity : 0;
    const progressPercent = ((lastActual / (currentUser?.startingCapital || DEFAULT_STARTING_CAPITAL) - 1) * 100);
    return { currentEquity: lastActual, totalTargetFinal, weekCount: completed.length, progressPercent };
  }, [weeklyData, currentUser]);

  const currentStock = useMemo(() => stocks.find(s => s.symbol === selectedTicker), [stocks, selectedTicker]);

  const categorizedStocks = useMemo(() => {
    const groups: Record<StockCategory, StockTicker[]> = {
      'AI Core': [],
      'Infrastructure': [],
      'Software': [],
      'Energy': [],
      'Future Tech': []
    };
    stocks.forEach(s => groups[s.category].push(s));
    return groups;
  }, [stocks]);

  if (!currentUser) return <LoginTerminal onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <nav className="w-full md:w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 space-y-8 sticky top-0 h-screen z-20">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="text-white fill-current" />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-bold text-lg tracking-tight text-white font-black uppercase">ArmTrader</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">AI Cluster v4.53</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <NavItem icon={<BarChart3 size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<LayoutGrid size={20} />} label="Market Map" active={activeTab === 'bubbles'} onClick={() => setActiveTab('bubbles')} />
          <NavItem icon={<Bell size={20} />} label="AI Signals" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} />
          <NavItem icon={<Calendar size={20} />} label="Compounder" active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} />
          <NavItem icon={<MessageSquare size={20} />} label="AI Strategist" active={activeTab === 'analyst'} onClick={() => setActiveTab('analyst')} />
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <MarketClock />
          <div className="flex flex-col space-y-1">
             <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all">
                <LogOut size={20} />
                <span className="hidden lg:block text-xs font-bold">Exit Session</span>
             </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8 overflow-y-auto relative">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {activeTab === 'dashboard' && 'Operations Terminal'}
                {activeTab === 'bubbles' && 'AI Sector Regime'}
                {activeTab === 'plan' && '52-Week Growth'}
                {activeTab === 'analyst' && 'AI Risk Architecture'}
                {activeTab === 'alerts' && 'Signal Processor'}
              </h2>
              {isRefreshing && <RefreshCw size={14} className="animate-spin text-emerald-500" />}
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Tactical Analysis — Monitor 20 AI-Infra Entities</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
               <Target size={14} className="text-rose-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 Next Goal: <span className="text-white">฿{(stats.currentEquity * (1 + WEEKLY_TARGET_PERCENT/100)).toLocaleString()}</span>
               </span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <GoldenClockMonitor />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div 
                onClick={() => setSelectedTicker('NVDA')}
                className={`p-6 rounded-3xl relative overflow-hidden group cursor-pointer border transition-all shadow-xl ${
                  selectedTicker === 'NVDA' ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                     <Cpu size={12} /> Target: {selectedTicker}
                   </span>
                   <div className="text-[8px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">Locked</div>
                </div>
                <div className="text-xl font-black font-mono text-white tracking-tighter">
                  ${currentStock?.price?.toFixed(2) || '---'}
                </div>
                <div className={`text-[10px] font-bold mt-1 uppercase ${currentStock?.change && currentStock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {currentStock?.change ? `${currentStock.change > 0 ? '+' : ''}${currentStock.change.toFixed(2)}%` : '--'}
                </div>
              </div>

              <StatCard title="Current Equity" value={`฿${stats.currentEquity.toLocaleString()}`} icon={<TrendingUp className="text-emerald-500" />} />
              <StatCard title="Total Target" value={`฿${stats.totalTargetFinal.toLocaleString()}`} icon={<Zap className="text-amber-500" />} />
              <StatCard title="Global Gain" value={`${stats.progressPercent.toFixed(2)}%`} icon={<Activity className="text-blue-500" />} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                 {/* Sector Monitoring Grid */}
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-lg overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                         <Layers size={14} /> AI Cluster Monitoring
                       </h3>
                       <div className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">20 Assets Tracked</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {(Object.keys(categorizedStocks) as StockCategory[]).map(category => (
                        <div key={category}>
                          <p className="text-[9px] font-black uppercase text-slate-600 mb-4 tracking-widest border-b border-slate-800 pb-2">{category}</p>
                          <div className="space-y-3">
                            {categorizedStocks[category].map(stock => (
                              <div 
                                key={stock.symbol}
                                onClick={() => setSelectedTicker(stock.symbol)}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                                  selectedTicker === stock.symbol ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${
                                    (stock.change || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                  }`}>
                                    {stock.symbol[0]}
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-black text-white">{stock.symbol}</p>
                                    <p className="text-[8px] font-bold text-slate-600 uppercase truncate max-w-[100px]">{stock.sector}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black font-mono text-white">${stock.price?.toFixed(1) || '--'}</p>
                                  <p className={`text-[9px] font-bold ${ (stock.change || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {stock.change ? `${stock.change > 0 ? '+' : ''}${stock.change.toFixed(1)}%` : '--'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-6">
                 <TacticalEntryEngine stock={currentStock} />
                 <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 min-h-[250px] shadow-lg">
                    <StockVolatilityChart symbol={selectedTicker} />
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bubbles' && <BubbleMap stocks={stocks} onSelect={(s) => { setSelectedTicker(s); setActiveTab('dashboard'); }} />}
        {activeTab === 'alerts' && <AlertIngestor signals={signals} onNewSignal={(s) => setSignals([s, ...signals])} />}
        {activeTab === 'analyst' && <GeminiAnalystUI />}
        {activeTab === 'plan' && (
           <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-950">
                      <tr>
                        <th className="p-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Wk Phase</th>
                        <th className="p-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Target Equity</th>
                        <th className="p-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Actual Closing</th>
                        <th className="p-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Verification</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                      {weeklyData.map((w, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-6 text-xs font-mono font-black text-slate-500">#{w.week.toString().padStart(2, '0')}</td>
                          <td className="p-6 text-sm font-bold text-white/90">฿{w.targetEquity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="p-6 text-center">
                            <input 
                              type="number" 
                              value={w.actualEquity || ''} 
                              onChange={(e) => updateActualEquity(idx, parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono font-bold text-emerald-400 w-28 text-right focus:border-emerald-500 outline-none"
                            />
                          </td>
                          <td className="p-6 text-[10px] font-black text-slate-700 uppercase">System Standby</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 p-3 rounded-xl transition-all ${active ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon}
    <span className="hidden lg:block font-bold text-sm tracking-tight">{label}</span>
  </button>
);

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-all shadow-lg">
    <div className="flex items-center justify-between mb-2">
       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
       <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">{icon}</div>
    </div>
    <div className="text-xl font-black font-mono text-white tracking-tighter">{value}</div>
  </div>
);

export default App;
