import { ContentLayout } from '@/components/layouts/content-layout';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { StockViewSkeleton } from '@/features/stocks/components/stock-view-skeleton';

// Prefetched by Next, so clicking a stock shows this instantly. loading.tsx doesn't get
// the route params, so the heading is a placeholder too.
const StockLoading = () => (
  <ContentLayout title={<Skeleton className="h-8 w-24" />}>
    <StockViewSkeleton />
  </ContentLayout>
);

export default StockLoading;
