'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { isUnauthorized } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { formatCurrency, formatShares } from '@/utils/format';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBuyStock } from '../api/buy-stock';
import { usePortfolio } from '../api/get-portfolio';

export const INVEST_QUERY_PARAM = 'invest';

type InvestButtonProps = {
  symbol: string;
  price: number; // latest quote, for the estimate only — the server sets the real price
  autoOpen?: boolean; // e.g. returning from login with ?invest=1
};

export const InvestButton = ({
  symbol,
  price,
  autoOpen,
}: InvestButtonProps) => {
  const user = useUser();
  const isLoggedIn = !!user.data;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  const portfolio = usePortfolio({ queryConfig: { enabled: isLoggedIn } });
  const holding = portfolio.data?.holdings.find((h) => h.symbol === symbol);

  // Coming back from login to finish investing: open the dialog once...
  if (autoOpen && isLoggedIn && !autoOpened) {
    setAutoOpened(true);
    setOpen(true);
  }
  // ...and drop ?invest=1 from the URL so a refresh doesn't reopen it.
  useEffect(() => {
    if (autoOpen && isLoggedIn) router.replace(pathname, { scroll: false });
  }, [autoOpen, isLoggedIn, pathname, router]);

  if (user.isLoading) return <Button disabled>Invest</Button>;

  if (!isLoggedIn) {
    const returnTo = `${pathname}?${INVEST_QUERY_PARAM}=1`;
    return (
      <Link href={paths.auth.login.getHref(returnTo)}>
        <Button>Invest</Button>
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <Button onClick={() => setOpen(true)}>Invest</Button>
      {holding && (
        <span className="text-sm text-muted-foreground">
          You own {formatShares(holding.quantity)} shares
        </span>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <InvestForm
            symbol={symbol}
            price={price}
            cash={portfolio.data?.cash}
            onDone={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

type InvestFormProps = {
  symbol: string;
  price: number;
  cash: number | undefined;
  onDone: () => void;
};

const InvestForm = ({ symbol, price, cash, onDone }: InvestFormProps) => {
  const [input, setInput] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { addNotification } = useNotifications();

  const buy = useBuyStock({
    mutationConfig: {
      onSuccess: ({ trade }) => {
        addNotification({
          type: 'success',
          title: 'Order filled',
          message: `Bought ${formatShares(trade.quantity)} ${trade.symbol} at ${formatCurrency(trade.price)} for ${formatCurrency(trade.amount)}.`,
        });
        onDone();
      },
      onError: (error) => {
        // Session expired mid-way: log in again and come back here.
        if (isUnauthorized(error)) {
          router.push(
            paths.auth.login.getHref(`${pathname}?${INVEST_QUERY_PARAM}=1`),
          );
        }
      },
    },
  });

  const amount = Number(input);
  const error =
    !input || Number.isNaN(amount)
      ? null
      : amount < 1
        ? 'Minimum investment is $1.'
        : cash !== undefined && amount > cash
          ? 'Not enough cash.'
          : null;
  const canSubmit = !!input && amount >= 1 && !error && !buy.isPending;

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) buy.mutate({ symbol, amount });
      }}
    >
      <DialogHeader>
        <DialogTitle>Invest in {symbol}</DialogTitle>
        <DialogDescription>
          {cash !== undefined
            ? `${formatCurrency(cash)} available to invest.`
            : 'Loading your balance…'}
        </DialogDescription>
      </DialogHeader>

      <label className="grid gap-2 text-sm font-medium">
        Amount (USD)
        <input
          type="number"
          inputMode="decimal"
          min={1}
          step="0.01"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="100.00"
          className="h-10 rounded-md border border-input bg-card px-3 text-base tabular-nums shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </label>

      <div className="text-sm text-muted-foreground">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : amount >= 1 ? (
          <>
            ≈ {formatShares(amount / price)} shares at {formatCurrency(price)}.
            Final price is set when the order fills.
          </>
        ) : (
          <>Current price {formatCurrency(price)}. Fractional shares allowed.</>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit} isLoading={buy.isPending}>
          Buy {symbol}
        </Button>
      </DialogFooter>
    </form>
  );
};
