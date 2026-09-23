import type { PortfolioResponse } from './portfolio';

// Mirrors TradeDTO.
export type TradeResponse = {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  quantity: number;
  price: number;
  amount: number;
  executedAt: string;
};

// Mirrors TradeResultDTO (POST /portfolio/buy).
export type TradeResultResponse = {
  trade: TradeResponse;
  portfolio: PortfolioResponse;
};
