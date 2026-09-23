export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<{
  username: string;
  role: string;
}>;

export type AuthResponse = User;

export type StockQuote = {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number | null;
  dayLow: number | null;
  volume: number | null;
  updatedAt: string;
};

export const STOCK_RANGES = ['1d', '5d', '1mo', '6mo', '1y', '5y'] as const;
export type StockRange = (typeof STOCK_RANGES)[number];

export type StockCandle = {
  time: number; // unix seconds, UTC
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type StockHistory = {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  range: StockRange;
  interval: string;
  gmtOffset: number; // exchange UTC offset, seconds
  candles: StockCandle[];
};

export type Holding = {
  symbol: string;
  quantity: number;
  averageCost: number; // per share, USD
};

export type Portfolio = {
  cash: number;
  holdings: Holding[];
};

export type Trade = {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  quantity: number;
  price: number;
  amount: number;
  executedAt: string;
};

export type TradeResult = {
  trade: Trade;
  portfolio: Portfolio;
};

export type Crypto = {
  ['Meta Data']: MetaData;
  ['Time Series (Digital Currency Daily)']: DailyTimeSeries;
  Information?: string;
};

interface MetaData {
  '1. Information': string;
  '2. Digital Currency Code': string;
  '3. Digital Currency Name': string;
  '4. Market Code': string;
  '5. Market Name': string;
  '6. Last Refreshed': string;
  '7. Time Zone': string;
}

type DailyTimeSeries = Record<string, TimeSeriesEntry>;

interface TimeSeriesEntry {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}
