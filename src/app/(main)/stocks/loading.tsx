import { ContentLayout } from '@/components/layouts/content-layout';
import { StocksListSkeleton } from '@/features/stocks/components/stocks-list-skeleton';

// Prefetched by Next, so navigating to /stocks shows this instantly.
const StocksLoading = () => (
  <ContentLayout title="Stocks">
    <StocksListSkeleton />
  </ContentLayout>
);

export default StocksLoading;
