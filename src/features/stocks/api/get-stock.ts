import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { StockQuoteResponse } from '../model/stock-quote';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getStock = (symbol: string): Promise<StockQuoteResponse> => {
  return api.get(`/stocks/${encodeURIComponent(symbol)}`);
};

export const getStockQueryOptions = (symbol: string) => {
  return queryOptions({
    queryKey: ['stocks', symbol],
    queryFn: () => getStock(symbol),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
};

type UseStockOptions = {
  symbol: string;
  queryConfig?: QueryConfig<typeof getStockQueryOptions>;
};

export const useStock = ({ symbol, queryConfig }: UseStockOptions) => {
  return useQuery({
    ...getStockQueryOptions(symbol),
    ...queryConfig,
  });
};
