import { LoadingRegion, Skeleton } from '@/components/ui/skeleton/skeleton';

/** Chart-area placeholder, same size as StockChart. */
export const StockChartSkeleton = () => (
  <Skeleton className="h-75 w-full sm:h-105" />
);

// Mirrors StockView's layout so the page doesn't jump when data arrives.
export const StockViewSkeleton = () => (
  <LoadingRegion label="Loading stock…" className="space-y-4">
    <Skeleton className="h-4 w-28" />
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-44" />
      </div>
      <Skeleton className="h-9 w-24" />
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="rounded-lg border bg-card p-2">
      <StockChartSkeleton />
    </div>
    <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4 sm:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  </LoadingRegion>
);
