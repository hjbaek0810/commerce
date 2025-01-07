'use client';

import NewOrderForm from '@app/new-order/NewOrderForm';

import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '주문하기 | MiniMall',
  description: 'MiniMall에서 원하는 상품을 쇼핑하세요.',
  robots: 'noindex, nofollow',
};

const NewOrder = () => <NewOrderForm />;

export default NewOrder;
