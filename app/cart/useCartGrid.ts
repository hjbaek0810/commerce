import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { isEmpty } from 'lodash-es';
import { useRouter } from 'next/navigation';

import { useCartListQuery } from '@services/queries/cart';
import { PATH } from '@utils/path';

const useCartGrid = () => {
  const { data } = useCartListQuery();

  const cartForm = useForm();
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();

  const minusQuantityButtonDisabled = quantity === 1;

  const handleAddQuantityClick = () => setQuantity(prev => prev + 1);
  const handleMinusQuantityClick = () =>
    setQuantity(prev => (prev === 1 ? 1 : prev - 1));

  const handleGoToWishListButtonClick = () => router.push(PATH.WISH_LIST);

  return {
    isEmptyCartList: data?.items && isEmpty(data?.items),
    cartList: data?.items || [],
    cartForm,
    quantity,
    minusQuantityButtonDisabled,
    handleMinusQuantityClick,
    handleAddQuantityClick,
    handleGoToWishListButtonClick,
  };
};

export default useCartGrid;
