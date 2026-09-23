'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/dropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle/theme-toggle';
import { paths } from '@/lib/paths';
import { useLogout, useUser } from '@/lib/auth';
import { cn } from '@/utils/cn';
import {
  Bitcoin,
  Home,
  PanelLeft,
  TrendingUp,
  User2,
  Users,
} from 'lucide-react';
import { default as Link } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { JSX, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const logout = useLogout({
    onSuccess: () => router.push(paths.landing.getHref()),
  });
  const navigation = [
    { name: 'Home', to: paths.main.home.getHref(), icon: Home },
    { name: 'Stocks', to: paths.main.stocks.getHref(), icon: TrendingUp },
    {
      name: 'Cryptos',
      to: paths.main.cryptos.getHref(),
      icon: Bitcoin,
    },
    { name: 'Account', to: paths.main.profile.getHref(), icon: Users },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-sidebar sm:flex">
        <nav className="flex flex-col gap-4 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.name}
                href={item.to}
                className={cn(
                  'group flex w-full flex-1 items-center rounded-md p-2 text-base font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-active-foreground',
                  isActive &&
                    'bg-sidebar-active text-sidebar-active-foreground',
                )}
              >
                <item.icon
                  className="mr-4 size-6 shrink-0 text-sidebar-muted group-hover:text-sidebar-foreground"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:justify-end sm:border-0 sm:bg-transparent sm:px-6">
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="size-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent
              side="left"
              className="bg-sidebar pt-10 text-sidebar-active-foreground sm:max-w-60"
            >
              <nav className="grid gap-6 text-lg font-medium">
                <DrawerHeader>
                  <DrawerTitle>Navigation</DrawerTitle>
                </DrawerHeader>
                {navigation.map((item) => {
                  const isActive = pathname === item.to;
                  return (
                    <Link
                      key={item.name}
                      href={item.to}
                      className={cn(
                        'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-active-foreground',
                        'group flex w-full flex-1 items-center rounded-md p-2 text-base font-medium',
                        isActive &&
                          'bg-sidebar-active text-sidebar-active-foreground',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'text-sidebar-muted group-hover:text-sidebar-foreground',
                          'mr-4 size-6 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </DrawerContent>
          </Drawer>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user.data ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <span className="sr-only">Open user menu</span>
                    <User2 className="size-6 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(paths.main.profile.getHref())}
                    className={cn(
                      'block px-4 py-2 text-sm text-popover-foreground',
                    )}
                  >
                    Your Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={cn(
                      'block w-full px-4 py-2 text-sm text-popover-foreground',
                    )}
                    onClick={() => logout.mutate()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !user.isLoading && (
                <Link href={paths.auth.login.getHref(pathname)}>
                  <Button variant="outline">Log in</Button>
                </Link>
              )
            )}
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function Fallback({ error }: { error: Error }) {
  return <p>Error: {error.message ?? 'Something went wrong!'}</p>;
}

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  return (
    <Layout>
      <ErrorBoundary key={pathname} FallbackComponent={Fallback}>
        {children}
      </ErrorBoundary>
    </Layout>
  );
};

export default HomeLayout;
