import { LoadingRegion, Skeleton } from '@/components/ui/skeleton/skeleton';
import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthLayout as AuthLayoutComponent } from './_components/auth-layout';

export const metadata = {
  title: 'Stock Simulator',
  description: 'Welcome to Stock Simulator',
};

// The frame (background + logo) is static and renders straight away. The pages read
// ?redirectTo= (useSearchParams), which only resolves in the browser for prerendered
// pages, so only the heading + form sit behind Suspense.
const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthLayoutComponent>
      <ErrorBoundary fallback={<div>Something went wrong!</div>}>
        <Suspense fallback={<AuthCardSkeleton />}>{children}</Suspense>
      </ErrorBoundary>
    </AuthLayoutComponent>
  );
};

// Same shape as AuthCard with a form inside.
const AuthCardSkeleton = () => (
  <LoadingRegion className="flex flex-col items-center">
    <Skeleton className="mt-3 h-9 w-72" />
    <div className="mt-8 w-full sm:mx-auto sm:max-w-md">
      <div className="space-y-6 bg-card px-4 py-8 shadow-sm sm:rounded-lg sm:px-10">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  </LoadingRegion>
);

export default AuthLayout;
