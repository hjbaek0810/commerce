import { useState } from 'react';

import { isNil } from 'lodash-es';
import { useRouter } from 'next/navigation';

import { useProductDetailQuery } from '@services/queries/product';
import { useWishListMutation } from '@services/queries/wish-list';
import { ProductStatusType } from '@utils/constants/product';
import { PATH } from '@utils/path';

const SHOW_REMAINING_QUANTITY_COUNT = 10;

const useProductInfo = (id: string) => {
  const { data: product, isTop10, isWished } = useProductDetailQuery(id);
  const { mutate: updateWish } = useWishListMutation();

  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const productQuantity = product?.quantity || 0;

  const soldOut =
    productQuantity <= 0 || product?.status === ProductStatusType.STOPPED;

  const showRemainingQuantity = productQuantity > SHOW_REMAINING_QUANTITY_COUNT;

  const handleWishButtonClick = () => {
    if (isNil(isWished)) router.push(PATH.WISH_LIST);

    updateWish({ productId: id });
  };

  const handleAddQuantityClick = () => setQuantity(prev => prev + 1);
  const handleMinusQuantityClick = () =>
    setQuantity(prev => (prev === 1 ? 1 : prev - 1));

  const minusQuantityButtonDisabled = quantity === 1;
  const addQuantityButtonDisabled = productQuantity <= quantity;

  return {
    product,
    isWished,
    isTop10,
    minusQuantityButtonDisabled,
    addQuantityButtonDisabled,
    soldOut,
    quantity,
    showRemainingQuantity,
    handleWishButtonClick,
    handleAddQuantityClick,
    handleMinusQuantityClick,
  };
};

export default useProductInfo;
