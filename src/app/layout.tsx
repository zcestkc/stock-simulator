import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppProvider } from '@/app/provider';

export const metadata: Metadata = {
  title: 'Stock Simulator',
  description: 'An investment simulator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes sets the `dark` class before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
