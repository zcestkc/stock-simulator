'use client';

import { Spinner } from '@/components/ui/spinner/spinner';
import { paths } from '@/config/paths';
import { STOCK_RANGES, StockRange } from '@/types/api';
import { cn } from '@/utils/cn';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useState } from 'react';
import { useStock } from '../api/get-stock';
import { useStockHistory } from '../api/get-stock-history';
import { ChartType, StockChart } from './stock-chart';

const RANGE_LABELS: Record<StockRange, string> = {
  '1d': '1D',
  '5d': '5D',
  '1mo': '1M',
  '6mo': '6M',
  '1y': '1Y',
  '5y': '5Y',
};

const formatPrice = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

const formatSigned = (value: number, suffix = '') =>
  `${value > 0 ? '+' : ''}${value.toFixed(2)}${suffix}`;

const directionClass = (value: number) =>
  value > 0
    ? 'text-positive'
    : value < 0
      ? 'text-negative'
      : 'text-muted-foreground';

export const StockView = ({ symbol }: { symbol: string }) => {
  const [range, setRange] = useState<StockRange>('1d');
  const [chartType, setChartType] = useState<ChartType>('line');

  const stockQuery = useStock({ symbol });
  const historyQuery = useStockHistory({ symbol, range });

  const stock = stockQuery.data;
  const history = historyQuery.data;
  const candles = history?.candles ?? [];

  // For 1D compare to yesterday's close; otherwise to the start of the range.
  const rangeChange = (() => {
    if (!stock || candles.length === 0) return null;
    const base = range === '1d' ? stock.previousClose : candles[0].open;
    const change = stock.price - base;
    return { change, percent: (change / base) * 100 };
  })();

  return (
    <div className="space-y-4">
      <Link
        href={paths.app.stocks.getHref()}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeftIcon /> Back to stocks
      </Link>

      {stock && (
        <div>
          <p className="text-muted-foreground">
            {stock.name} · {stock.exchange}
          </p>
          <p className="text-3xl font-semibold tabular-nums">
            {formatPrice(stock.price, stock.currency)}
          </p>
          {rangeChange && (
            <p
              className={cn('tabular-nums', directionClass(rangeChange.change))}
            >
              {formatSigned(rangeChange.change)} (
              {formatSigned(rangeChange.percent, '%')}){' '}
              <span className="text-muted-foreground">
                {range === '1d' ? 'today' : `past ${RANGE_LABELS[range]}`}
              </span>
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {STOCK_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-md px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-accent',
                r === range &&
                  'bg-primary text-primary-foreground hover:bg-primary',
              )}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(['line', 'candles'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={cn(
                'rounded-md px-3 py-1 text-sm font-medium capitalize text-muted-foreground hover:bg-accent',
                t === chartType && 'bg-secondary text-secondary-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          'relative rounded-lg border bg-card p-2',
          historyQuery.isPlaceholderData && 'opacity-60',
        )}
      >
        {historyQuery.isLoading ? (
          <div className="flex h-[300px] items-center sm:h-[420px] justify-center">
            <Spinner size="lg" />
          </div>
        ) : historyQuery.isError || !history ? (
          <div className="flex h-[300px] items-center sm:h-[420px] justify-center text-destructive">
            Couldn&apos;t load chart data.
          </div>
        ) : (
          <StockChart
            candles={candles}
            gmtOffset={history.gmtOffset}
            intraday={range === '1d' || range === '5d' || range === '1mo'}
            type={chartType}
            rising={(rangeChange?.change ?? 0) >= 0}
          />
        )}
      </div>

      {stock && (
        <dl className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4 text-sm sm:grid-cols-4">
          <Stat label="Previous close" value={stock.previousClose.toFixed(2)} />
          <Stat label="Day low" value={stock.dayLow?.toFixed(2) ?? '—'} />
          <Stat label="Day high" value={stock.dayHigh?.toFixed(2) ?? '—'} />
          <Stat
            label="Volume"
            value={stock.volume?.toLocaleString('en-US') ?? '—'}
          />
        </dl>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="font-medium tabular-nums">{value}</dd>
  </div>
);
