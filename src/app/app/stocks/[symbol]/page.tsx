import { ContentLayout } from '@/components/layouts/content-layout';
import { getStockQueryOptions } from '@/features/stocks/api/get-stock';
import { getStockHistoryQueryOptions } from '@/features/stocks/api/get-stock-history';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Stock } from './_components/stock';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) => {
  const symbol = decodeURIComponent((await params).symbol).toUpperCase();
  return { title: symbol, description: `${symbol} stock price and chart` };
};

const StockPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ invest?: string }>;
}) => {
  const symbol = decodeURIComponent((await params).symbol).toUpperCase();
  const autoOpenInvest = (await searchParams).invest === '1';

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(getStockQueryOptions(symbol)),
    queryClient.prefetchQuery(getStockHistoryQueryOptions(symbol, '1d')),
  ]);

  if (!queryClient.getQueryData(getStockQueryOptions(symbol).queryKey)) {
    return <ContentLayout title={symbol}>Stock not found</ContentLayout>;
  }

  return (
    <ContentLayout title={symbol}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Stock symbol={symbol} autoOpenInvest={autoOpenInvest} />
      </HydrationBoundary>
    </ContentLayout>
  );
};

export default StockPage;
