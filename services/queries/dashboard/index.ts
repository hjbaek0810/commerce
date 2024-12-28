import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import {
  getAdminDashboardOrdersQueryOptions,
  getAdminUserDashboardQueryOptions,
} from '@services/queries/dashboard/options';

import type {
  SearchAdminOrderDashboard,
  SearchAdminUserDashboard,
} from '@api/admin/dashboard/types/dto';

export const useAdminUserDashboardQuery = (
  searchParams: SearchAdminUserDashboard,
) =>
  useQuery(
    getAdminUserDashboardQueryOptions({
      searchParams,
    }),
  );

export const useAdminDashboardOrderQuery = (
  queryParams: SearchAdminOrderDashboard,
) =>
  useQuery(
    getAdminDashboardOrdersQueryOptions({
      searchParams: queryParams,
    }),
  );
