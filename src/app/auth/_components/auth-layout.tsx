import { paths } from '@/lib/paths';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-muted py-12 sm:px-6 lg:px-8">
      <div className="flex justify-center sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={paths.landing.getHref()}>
          <img
            className="h-24 w-auto dark:invert"
            src="/logo.svg"
            alt="Stock Simulator logo"
          />
        </Link>
      </div>
      {children}
    </div>
  );
};
