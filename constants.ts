
import { StockTicker } from './types';

export const STARTING_CAPITAL = 10000;
export const WEEKLY_TARGET_PERCENT = 4.53;
export const TOTAL_WEEKS = 52;

export const WATCHLIST: StockTicker[] = [
  // 🔴 กลุ่มที่ 1: AI Core / Semiconductor
  { symbol: 'NVDA', name: 'NVIDIA Corporation', volatility: 4.5, sector: 'AI & GPU', category: 'AI Core' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor', volatility: 3.5, sector: 'Foundry', category: 'AI Core' },
  { symbol: 'ASML', name: 'ASML Holding', volatility: 3.2, sector: 'EUV Equipment', category: 'AI Core' },
  { symbol: 'AMAT', name: 'Applied Materials', volatility: 3.8, sector: 'Semi Equipment', category: 'AI Core' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', volatility: 2.9, sector: 'Networking', category: 'AI Core' },
  { symbol: 'MU', name: 'Micron Technology', volatility: 4.2, sector: 'HBM Memory', category: 'AI Core' },
  { symbol: 'CLS', name: 'Celestica Inc.', volatility: 4.5, sector: 'AI EMS', category: 'AI Core' },

  // 🟠 กลุ่มที่ 2: Data / Storage / AI Infrastructure
  { symbol: 'WDC', name: 'Western Digital', volatility: 4.8, sector: 'Data Storage', category: 'Infrastructure' },
  { symbol: 'SNDK', name: 'SanDisk (Part of WDC)', volatility: 4.8, sector: 'Flash Memory', category: 'Infrastructure' },
  { symbol: 'STX', name: 'Seagate Technology', volatility: 4.0, sector: 'Storage Enterprise', category: 'Infrastructure' },
  { symbol: 'APLD', name: 'Applied Digital', volatility: 6.5, sector: 'AI Data Center', category: 'Infrastructure' },

  // 🔵 กลุ่มที่ 3: AI Platform / Software / Brain Layer
  { symbol: 'MSFT', name: 'Microsoft Corporation', volatility: 2.5, sector: 'Cloud & AI', category: 'Software' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', volatility: 2.8, sector: 'Model & Infra', category: 'Software' },
  { symbol: 'PLTR', name: 'Palantir Technologies', volatility: 5.5, sector: 'AI Analytics', category: 'Software' },
  { symbol: 'NOW', name: 'ServiceNow Inc.', volatility: 3.0, sector: 'AI Workflow', category: 'Software' },

  // 🟢 กลุ่มที่ 4: Energy / Power / Infrastructure
  { symbol: 'CEG', name: 'Constellation Energy', volatility: 3.5, sector: 'Nuclear AI Power', category: 'Energy' },
  { symbol: 'NEE', name: 'NextEra Energy', volatility: 2.2, sector: 'Renewable Power', category: 'Energy' },
  { symbol: 'XLE', name: 'Energy Select Sector', volatility: 1.8, sector: 'Energy ETF', category: 'Energy' },

  // 🟣 กลุ่มที่ 5: AI Adjacent / Future Tech
  { symbol: 'TSLA', name: 'Tesla, Inc.', volatility: 4.2, sector: 'Robotics & AI', category: 'Future Tech' },
  { symbol: 'RKLB', name: 'Rocket Lab USA', volatility: 5.8, sector: 'Space Infra', category: 'Future Tech' }
];

export const TRADING_PHASES = [
  { id: 'warmup', start: 16, end: 18, name: 'The Warm Up', activity: 'Premarket Open - ดูแนวโน้ม', color: '#f59e0b', zone: 1 },
  { id: 'fakeout', start: 18, end: 20, name: 'The Fake Out', activity: 'Futures / Leaks - ระวังหลอกออก', color: '#ea580c', zone: 1 },
  { id: 'danger', start: 21.5, end: 23, name: 'The Danger Zone', activity: 'ตลาดเดือด - เลี่ยงเทรด / ระวัง SL', color: '#ef4444', zone: 2 },
  { id: 'decision', start: 23, end: 1, name: 'The Decision', activity: 'ตลาดเลือกทาง - เริ่มหาจังหวะ', color: '#10b981', zone: 3 },
  { id: 'flow', start: 1, end: 4, name: 'The Flow (Golden Time)', activity: 'เทรนด์ชัด - ทำกำไรเน้นๆ', color: '#22c55e', zone: 3 },
  { id: 'closed', start: 4, end: 16, name: 'Market Closed', activity: 'จบวัน - พักผ่อนเพื่อวันใหม่', color: '#475569', zone: 0 }
];
