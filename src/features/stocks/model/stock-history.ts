// Ranges the API supports (StockRanges.All in the API).
export const STOCK_RANGES = ['1d', '5d', '1mo', '6mo', '1y', '5y'] as const;
export type StockRange = (typeof STOCK_RANGES)[number];

// Mirrors StockCandleDTO.
export type StockCandleResponse = {
  time: number; // unix seconds, UTC
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// Mirrors StockHistoryDTO (GET /stocks/{symbol}/history).
export type StockHistoryResponse = {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  range: StockRange;
  interval: string;
  gmtOffset: number; // exchange UTC offset, seconds
  candles: StockCandleResponse[];
};
