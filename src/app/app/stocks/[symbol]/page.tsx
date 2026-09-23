import { ContentLayout } from '@/components/layouts/content-layout';
import { getStockQueryOptions } from '@/features/stocks/api/get-stock';
import { getStockHistoryQueryOptions } from '@/features/stocks/api/get-stock-history';
import { StockView } from '@/features/stocks/components/stock-view';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

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
}: {
  params: Promise<{ symbol: string }>;
}) => {
  const symbol = decodeURIComponent((await params).symbol).toUpperCase();

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
        <StockView symbol={symbol} />
      </HydrationBoundary>
    </ContentLayout>
  );
};

export default StockPage;
