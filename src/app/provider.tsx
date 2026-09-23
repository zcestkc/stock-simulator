'use client';

import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { queryConfig } from '@/lib/react-query';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      {/* Light/Dark/System, saved in localStorage ('theme'); toggles `dark` on <html>. */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        // React 19.2+ warns when a client component renders <script>. next-themes' theme
        // script only needs to run from the server HTML, so mark it inert on the client
        // (its suppressHydrationWarning covers the differing attribute).
        scriptProps={
          typeof window === 'undefined'
            ? undefined
            : { type: 'application/json' }
        }
      >
        <QueryClientProvider client={queryClient}>
          {process.env.NEXT_PUBLIC_DEV && <ReactQueryDevtools />}
          <Notifications />
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
