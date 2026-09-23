import { getUserQueryOptions } from '@/lib/auth';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { ReactNode } from 'react';
import HomeLayout from './_components/home-layout';

// Load the logged-in user once on the server (proxy.ts has already refreshed the tokens),
// so the header and every page render the same logged-in/out state on the server as in the
// browser. Without this, useUser() starts "loading" on the server, and anything that depends
// on it (header, Invest button) mismatches when the page hydrates. getUser → null if logged out.
const AppLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  await queryClient.query(getUserQueryOptions()).catch(() => null);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeLayout>{children}</HomeLayout>
    </HydrationBoundary>
  );
};

export default AppLayout;
