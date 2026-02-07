
export interface UserAccount {
  username: string;
  startingCapital: number;
  lastLogin: string;
}

export interface WeeklyProgress {
  week: number;
  targetEquity: number;
  actualEquity: number;
  profitPercentage: number;
  status: 'pending' | 'completed' | 'missed';
}

export type StockCategory = 'AI Core' | 'Infrastructure' | 'Software' | 'Energy' | 'Future Tech';

export interface StockTicker {
  symbol: string;
  name: string;
  volatility: number; 
  sector: string;
  category: StockCategory;
  price?: number;     
  change?: number;    
  marketCap?: number; 
}

export interface TradingSignal {
  id: string;
  timestamp: string;
  symbol: string;
  price: number;
  action: 'BUY' | 'SELL' | 'ALERT';
  condition: string;
  aiSummary?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MarketTime {
  est: string;
  th: string;
  isOpen: boolean;
  session: string;
}

export enum AnalysisPhase {
  COLLECTION = 'PHASE 1 — DATA COLLECTION',
  OPTIMIZATION = 'PHASE 2 — CONTENT OPTIMIZATION',
  QUANTIFYING = 'PHASE 3 — QUANTIFYING RESULTS',
  GRADING = 'PHASE 4 — GRADING & ACTIONABLE FEEDBACK'
}
