// Mirrors HoldingDTO.
export type HoldingResponse = {
  symbol: string;
  quantity: number;
  averageCost: number; // per share, USD
  price: number; // latest quote (falls back to cost if market data is down)
  marketValue: number;
};

// Mirrors PortfolioDTO (GET /portfolio, POST /portfolio/deposit).
export type PortfolioResponse = {
  cash: number; // wallet balance, available to invest
  startingCash: number; // what the wallet started with
  totalDeposits: number; // everything topped up since
  investedValue: number; // market value of holdings
  totalValue: number; // cash + investedValue
  gain: number; // totalValue - (startingCash + totalDeposits)
  gainPercent: number; // gain as % of startingCash + totalDeposits
  holdings: HoldingResponse[];
};
