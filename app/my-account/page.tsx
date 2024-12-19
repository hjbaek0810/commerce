import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import AccountForm from '@app/my-account/AccountForm';
import { getMyAccountQueryOptions } from '@services/queries/user/options';
import { getQueryClient } from '@utils/query/queryClient';

const MyAccount = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getMyAccountQueryOptions(headers()));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountForm />
    </HydrationBoundary>
  );
};

export default MyAccount;
