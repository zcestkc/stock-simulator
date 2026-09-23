import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { PortfolioResponse } from '../model/portfolio';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getPortfolio = (): Promise<PortfolioResponse> => {
  return api.get('/portfolio');
};

export const getPortfolioQueryOptions = () => {
  return queryOptions({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
  });
};

type UsePortfolioOptions = {
  queryConfig?: QueryConfig<typeof getPortfolioQueryOptions>;
};

// Requires login — pass `queryConfig: { enabled: isLoggedIn }`.
export const usePortfolio = ({ queryConfig }: UsePortfolioOptions = {}) => {
  return useQuery({
    ...getPortfolioQueryOptions(),
    ...queryConfig,
  });
};
