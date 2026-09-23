import { LoadingRegion, Skeleton } from '@/components/ui/skeleton/skeleton';

const ROWS = 10;

// Mirrors StocksList's layout so the page doesn't jump when data arrives.
export const StocksListSkeleton = () => (
  <LoadingRegion label="Loading stocks…" className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Skeleton className="h-9 w-full max-w-xs" />
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="bg-muted px-4 py-3">
        <Skeleton className="h-3 w-1/3 bg-secondary" />
      </div>
      <div className="divide-y">
        {Array.from({ length: ROWS }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="hidden h-4 w-24 md:block" />
          </div>
        ))}
      </div>
    </div>
  </LoadingRegion>
);
