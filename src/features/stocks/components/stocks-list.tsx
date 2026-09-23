'use client';

import { Spinner } from '@/components/ui/spinner/spinner';
import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useStocks } from '../api/get-stocks';

const formatPrice = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

const formatVolume = (value: number | null) =>
  value == null
    ? '—'
    : new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value);

const formatSigned = (value: number, suffix = '') =>
  `${value > 0 ? '+' : ''}${value.toFixed(2)}${suffix}`;

const stockHref = (symbol: string) =>
  `${paths.app.stocks.getHref()}/${encodeURIComponent(symbol)}`;

export const StocksList = () => {
  const router = useRouter();
  const stocksQuery = useStocks();
  const [search, setSearch] = useState('');

  const stocks = useMemo(() => {
    const term = search.trim().toLowerCase();
    const all = stocksQuery.data ?? [];
    if (!term) return all;
    return all.filter(
      (s) =>
        s.symbol.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term),
    );
  }, [stocksQuery.data, search]);

  if (stocksQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (stocksQuery.isError) {
    return (
      <div className="text-red-600">
        Couldn&apos;t load stock prices. Is the API running?
      </div>
    );
  }

  const updatedAt = stocksQuery.data?.[0]?.updatedAt;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by symbol or name"
          className="h-9 w-full max-w-xs rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {updatedAt && (
          <span className="text-xs text-gray-500">
            Last trade {new Date(updatedAt).toLocaleString()}
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Change</th>
              <th className="px-4 py-3 text-right">Change %</th>
              <th className="hidden px-4 py-3 text-right md:table-cell">
                Day range
              </th>
              <th className="hidden px-4 py-3 text-right md:table-cell">
                Volume
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {stocks.map((stock) => {
              const direction =
                stock.change > 0
                  ? 'text-green-600'
                  : stock.change < 0
                    ? 'text-red-600'
                    : 'text-gray-500';
              return (
                <tr
                  key={stock.symbol}
                  onClick={() => router.push(stockHref(stock.symbol))}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-semibold">
                    <Link
                      href={stockHref(stock.symbol)}
                      className="hover:underline"
                    >
                      {stock.symbol}
                    </Link>
                  </td>
                  <td className="max-w-64 truncate px-4 py-3 text-gray-600">
                    {stock.name}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatPrice(stock.price, stock.currency)}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3 text-right tabular-nums',
                      direction,
                    )}
                  >
                    {formatSigned(stock.change)}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3 text-right tabular-nums',
                      direction,
                    )}
                  >
                    {formatSigned(stock.changePercent, '%')}
                  </td>
                  <td className="hidden px-4 py-3 text-right tabular-nums text-gray-600 md:table-cell">
                    {stock.dayLow != null && stock.dayHigh != null
                      ? `${stock.dayLow.toFixed(2)} – ${stock.dayHigh.toFixed(2)}`
                      : '—'}
                  </td>
                  <td className="hidden px-4 py-3 text-right tabular-nums text-gray-600 md:table-cell">
                    {formatVolume(stock.volume)}
                  </td>
                </tr>
              );
            })}
            {stocks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No stocks match &quot;{search}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
