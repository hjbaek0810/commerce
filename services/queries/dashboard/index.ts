import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { getAdminDashboardUsersQueryOptions } from '@services/queries/dashboard/options';
import useQueryParams from '@utils/hooks/useQueryParams';
import { parseQueryParams } from '@utils/query/helper';

export const useAdminDashboardUserQuery = () => {
  const searchParams = useSearchParams();
  const queryParams = parseQueryParams(searchParams);

  const { changeSearchParams } = useQueryParams();

  const queries = useQuery(
    getAdminDashboardUsersQueryOptions({
      searchParams: queryParams,
    }),
  );

  return {
    ...queries,
    changeSearchParams,
  };
};
