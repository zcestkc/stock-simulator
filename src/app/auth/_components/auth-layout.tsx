import { paths } from '@/config/paths';
import Link from 'next/link';
import { ReactNode } from 'react';

// Frame shared by the auth pages: background + logo. No logic; each page renders
// its own heading and form via AuthCard.
export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-muted py-12 sm:px-6 lg:px-8">
      <div className="flex justify-center sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={paths.home.getHref()}>
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
