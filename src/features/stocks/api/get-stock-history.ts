import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { StockHistoryResponse, StockRange } from '../model/stock-history';
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from '@tanstack/react-query';

const INTRADAY_RANGES: StockRange[] = ['1d', '5d'];

export const getStockHistory = (
  symbol: string,
  range: StockRange,
): Promise<StockHistoryResponse> => {
  return api.get(`/stocks/${encodeURIComponent(symbol)}/history`, {
    params: { range },
  });
};

export const getStockHistoryQueryOptions = (
  symbol: string,
  range: StockRange,
) => {
  const intraday = INTRADAY_RANGES.includes(range);
  return queryOptions({
    queryKey: ['stocks', symbol, 'history', range],
    queryFn: () => getStockHistory(symbol, range),
    staleTime: intraday ? 1000 * 60 : 1000 * 60 * 15,
    refetchInterval: intraday ? 1000 * 60 : false,
    placeholderData: keepPreviousData, // keep old chart visible while switching range
  });
};

type UseStockHistoryOptions = {
  symbol: string;
  range: StockRange;
  queryConfig?: QueryConfig<typeof getStockHistoryQueryOptions>;
};

export const useStockHistory = ({
  symbol,
  range,
  queryConfig,
}: UseStockHistoryOptions) => {
  return useQuery({
    ...getStockHistoryQueryOptions(symbol, range),
    ...queryConfig,
  });
};
