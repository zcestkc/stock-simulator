import { ContentLayout } from '@/components/layouts/content-layout';
import { getStockQueryOptions } from '@/features/stocks/api/get-stock';
import { getStockHistoryQueryOptions } from '@/features/stocks/api/get-stock-history';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Stock } from './_components/stock';

type Params = Promise<{ symbol: string }>;

const parseSymbol = async (params: Params) =>
  decodeURIComponent((await params).symbol).toUpperCase();

export const generateMetadata = async ({ params }: { params: Params }) => {
  const symbol = await parseSymbol(params);
  return { title: symbol, description: `${symbol} stock price and chart` };
};

// While this awaits, loading.tsx (next to this file) is shown automatically.
const StockPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ invest?: string }>;
}) => {
  const symbol = await parseSymbol(params);
  const autoOpenInvest = (await searchParams).invest === '1';

  const queryClient = new QueryClient();
  const [quote] = await Promise.all([
    queryClient.query(getStockQueryOptions(symbol)).catch(() => null),
    queryClient
      .query(getStockHistoryQueryOptions(symbol, '1d'))
      .catch(() => null), // chart can retry on the client
  ]);

  // loading.tsx has already started streaming, so this is a "soft 404" (200 + noindex),
  // which is Next's documented behaviour.
  if (!quote) notFound();

  return (
    <ContentLayout title={symbol}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Stock symbol={symbol} autoOpenInvest={autoOpenInvest} />
      </HydrationBoundary>
    </ContentLayout>
  );
};

export default StockPage;
