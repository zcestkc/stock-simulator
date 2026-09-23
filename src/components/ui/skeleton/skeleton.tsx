import { cn } from '@/utils/cn';

/**
 * A pulsing placeholder block. Size it with className (e.g. "h-4 w-32").
 * A block-level <span>, so it's also valid inside headings and paragraphs.
 */
export const Skeleton = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden="true"
    className={cn('block animate-pulse rounded-md bg-muted', className)}
    {...props}
  />
);

/** Wraps a group of skeletons so screen readers announce a single "Loading…". */
export const LoadingRegion = ({
  label = 'Loading…',
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <div role="status" aria-live="polite" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);
