'use client';

import { InvestButton } from '@/features/portfolio/components/invest-button';
import { StockView } from '@/features/stocks/components/stock-view';

// Composes the stocks and portfolio features for this route (features don't import each other).
export const Stock = ({
  symbol,
  autoOpenInvest,
}: {
  symbol: string;
  autoOpenInvest: boolean;
}) => (
  <StockView
    symbol={symbol}
    actions={(stock) => (
      <InvestButton
        symbol={stock.symbol}
        price={stock.price}
        autoOpen={autoOpenInvest}
      />
    )}
  />
);
