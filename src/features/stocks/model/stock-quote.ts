// Mirrors StockQuoteDTO (GET /stocks, GET /stocks/{symbol}).
export type StockQuoteResponse = {
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
