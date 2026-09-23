import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Portfolio } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getPortfolioQueryOptions } from './get-portfolio';

export type DepositInput = {
  amount: number; // USD to add to the wallet
};

export const deposit = (input: DepositInput): Promise<Portfolio> => {
  return api.post('/portfolio/deposit', input);
};

type UseDepositOptions = {
  mutationConfig?: MutationConfig<typeof deposit>;
};

export const useDeposit = ({ mutationConfig }: UseDepositOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: deposit,
    ...restConfig,
    onSuccess: (portfolio, ...args) => {
      queryClient.setQueryData(getPortfolioQueryOptions().queryKey, portfolio);
      onSuccess?.(portfolio, ...args);
    },
  });
};
