import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { TradeResultResponse } from '../model/trade';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getPortfolioQueryOptions } from './get-portfolio';

export type BuyStockInput = {
  symbol: string;
  amount: number; // USD to invest; the server sets the price
};

export const buyStock = (
  input: BuyStockInput,
): Promise<TradeResultResponse> => {
  return api.post('/portfolio/buy', input);
};

type UseBuyStockOptions = {
  mutationConfig?: MutationConfig<typeof buyStock>;
};

export const useBuyStock = ({ mutationConfig }: UseBuyStockOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: buyStock,
    ...restConfig,
    onSuccess: (result, ...args) => {
      queryClient.setQueryData(
        getPortfolioQueryOptions().queryKey,
        result.portfolio,
      );
      onSuccess?.(result, ...args);
    },
  });
};
