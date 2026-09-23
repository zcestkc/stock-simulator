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
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton/skeleton';
import { paths } from '@/lib/paths';
import { useUser } from '@/lib/auth';
import { cn } from '@/utils/cn';
import { formatCurrency, formatSigned } from '@/utils/format';
import Link from 'next/link';
import { useState } from 'react';
import { useDeposit } from '../api/deposit';
import { usePortfolio } from '../api/get-portfolio';

const MAX_DEPOSIT = 1_000_000; // matches DepositRequestDTO on the API

export const WalletSummary = () => {
  const user = useUser();
  const isLoggedIn = !!user.data;
  const portfolio = usePortfolio({
    queryConfig: { enabled: isLoggedIn, refetchInterval: 60_000 },
  });
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);

  if (user.isLoading || (isLoggedIn && portfolio.isLoading)) {
    return (
      <LoadingRegion
        label="Loading your wallet…"
        className="space-y-4 rounded-lg border bg-card p-6"
      >
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </LoadingRegion>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          Log in to get a wallet of virtual money to invest.
        </p>
        <Link href={paths.auth.login.getHref(paths.main.home.getHref())}>
          <Button>Log in</Button>
        </Link>
      </div>
    );
  }

  const data = portfolio.data;
  if (!data) {
    return (
      <div className="text-destructive">Couldn&apos;t load your wallet.</div>
    );
  }

  const direction =
    data.gain > 0
      ? 'text-positive'
      : data.gain < 0
        ? 'text-negative'
        : 'text-muted-foreground';

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Current value</p>
          <p className="text-3xl font-semibold tabular-nums">
            {formatCurrency(data.totalValue)}{' '}
            <span className={cn('text-lg font-medium', direction)}>
              ({formatSigned(data.gainPercent, '%')})
            </span>
          </p>
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatCurrency(data.cash)} cash ·{' '}
            {formatCurrency(data.investedValue)} invested
          </p>
        </div>
        <Button onClick={() => setAddMoneyOpen(true)}>Add money</Button>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Started with</dt>
          <dd className="font-medium tabular-nums">
            {formatCurrency(data.startingCash)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Topped up</dt>
          <dd className="font-medium tabular-nums">
            {formatCurrency(data.totalDeposits)}
          </dd>
        </div>
      </dl>

      <Dialog open={addMoneyOpen} onOpenChange={setAddMoneyOpen}>
        <DialogContent>
          <AddMoneyForm onDone={() => setAddMoneyOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AddMoneyForm = ({ onDone }: { onDone: () => void }) => {
  const [input, setInput] = useState('');
  const { addNotification } = useNotifications();

  const deposit = useDeposit({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Money added',
          message: `${formatCurrency(Number(input))} added to your wallet.`,
        });
        onDone();
      },
    },
  });

  const amount = Number(input);
  const error =
    !input || Number.isNaN(amount)
      ? null
      : amount < 1
        ? 'Minimum is $1.'
        : amount > MAX_DEPOSIT
          ? `Maximum is ${formatCurrency(MAX_DEPOSIT)} per top-up.`
          : null;
  const canSubmit = !!input && amount >= 1 && !error && !deposit.isPending;

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) deposit.mutate({ amount });
      }}
    >
      <DialogHeader>
        <DialogTitle>Add money</DialogTitle>
        <DialogDescription>
          Top up your wallet with virtual USD to invest.
        </DialogDescription>
      </DialogHeader>

      <label className="grid gap-2 text-sm font-medium">
        Amount (USD)
        <input
          type="number"
          inputMode="decimal"
          min={1}
          max={MAX_DEPOSIT}
          step="0.01"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1000.00"
          className="h-10 rounded-md border border-input bg-card px-3 text-base tabular-nums shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
        />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!canSubmit}
          isLoading={deposit.isPending}
        >
          Add money
        </Button>
      </DialogFooter>
    </form>
  );
};
