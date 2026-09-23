import { ContentLayout } from '@/components/layouts/content-layout';
import { getStocksQueryOptions } from '@/features/stocks/api/get-stocks';
import { StocksList } from '@/features/stocks/components/stocks-list';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export const metadata = {
  title: 'Stocks',
  description: 'Stocks',
};

const StocksPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getStocksQueryOptions());

  return (
    <ContentLayout title="Stocks">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <StocksList />
      </HydrationBoundary>
    </ContentLayout>
  );
};

export default StocksPage;
