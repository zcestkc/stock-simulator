import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { StockQuote } from '@/types/api';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getStocks = (): Promise<StockQuote[]> => {
  return api.get('/stocks');
};

export const getStocksQueryOptions = () => {
  return queryOptions({
    queryKey: ['stocks'],
    queryFn: getStocks,
    staleTime: 1000 * 60, // API caches quotes for 60s
    refetchInterval: 1000 * 60,
  });
};

type UseStocksOptions = {
  queryConfig?: QueryConfig<typeof getStocksQueryOptions>;
};

export const useStocks = ({ queryConfig }: UseStocksOptions = {}) => {
  return useQuery({
    ...getStocksQueryOptions(),
    ...queryConfig,
  });
};
