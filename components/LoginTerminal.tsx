
import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Lock, ChevronRight, Zap, Play } from 'lucide-react';

interface LoginTerminalProps {
  onLogin: (username: string) => void;
}

const LoginTerminal: React.FC<LoginTerminalProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [isAccessing, setIsAccessing] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'INITIALIZING SECURE PROTOCOL...',
    'SYSTEM: ARMTRADER ELITE KERNEL v4.0.1',
    'LOCAL_AUTH: STANDBY'
  ]);

  const startLoginSequence = (targetUser: string) => {
    setIsAccessing(true);
    const newLines = [
      `REQUESTING ACCESS FOR USER: ${targetUser.toUpperCase()}`,
      'SEARCHING LOCAL REPOSITORY...',
      'ESTABLISHING ENCRYPTED SESSION...',
      'BYPASSING SECONDARY CHALLENGE...',
      'ACCESS GRANTED. REDIRECTING...'
    ];

    newLines.forEach((line, i) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
        if (i === newLines.length - 1) {
          setTimeout(() => onLogin(targetUser), 800);
        }
      }, i * 400);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    startLoginSequence(username);
  };

  const handleDemo = () => {
    startLoginSequence('DEMO_GUEST');
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md bg-slate-950 border border-emerald-500/30 rounded-xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] overflow-hidden">
        <div className="bg-slate-900 px-4 py-2 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure Login Terminal</span>
          </div>
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner group transition-all duration-500 hover:bg-emerald-500/20">
              <Shield className="text-emerald-500 transition-transform duration-500 group-hover:scale-110" size={32} />
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded-lg border border-slate-800 text-[10px] space-y-1 h-36 overflow-y-auto custom-scrollbar">
            {terminalLines.map((line, i) => (
              <p key={i} className="text-emerald-500/70">
                <span className="text-emerald-500 mr-2 opacity-50">&gt;</span>
                {line}
              </p>
            ))}
            {!isAccessing && <div className="w-2 h-4 bg-emerald-500 animate-pulse inline-block align-middle ml-1"></div>}
          </div>

          {!isAccessing && (
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="USERNAME_ID"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-emerald-400 placeholder:text-slate-700 outline-none focus:border-emerald-500/50 transition-all uppercase text-sm font-bold"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <span>INITIATE ACCESS</span>
                  <ChevronRight size={18} />
                </button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-800"></span>
                </div>
                <div className="relative flex justify-center text-[8px] uppercase font-black text-slate-600">
                  <span className="bg-slate-950 px-2">OR</span>
                </div>
              </div>

              <button 
                onClick={handleDemo}
                className="w-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/30 font-black py-3 rounded-lg flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Play size={14} className="fill-current" />
                <span>ENTER AS DEMO GUEST</span>
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
            <span>Auth v4.22</span>
            <span>ARMTRADER_ELITE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTerminal;
