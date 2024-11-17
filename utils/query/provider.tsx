'use client';

import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import CustomQueryClient from './queryClient';

const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(CustomQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
