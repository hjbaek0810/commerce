import type { MouseEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { isEmpty } from 'lodash-es';
import { useRouter } from 'next/navigation';

import { SHOW_REMAINING_QUANTITY_COUNT } from '@app/product/[slug]/useProductInfo';
import {
  useCartListMutation,
  useCartListQuery,
  useDeleteCartListMutation,
} from '@services/queries/cart';
import { ProductStatusType } from '@utils/constants/product';
import useSessionHandler from '@utils/hooks/useSessionHandler';
import { PATH } from '@utils/path';

import type { DeleteCartItems } from '@api/cart/types/dto';

const useCartGrid = () => {
  const { checkSession } = useSessionHandler();
  const cartForm = useForm<DeleteCartItems>();
  const checkedCarts = useWatch({
    control: cartForm.control,
    name: 'productIds',
    defaultValue: [],
  });

  const { data } = useCartListQuery();
  const cartList = data?.items || [];

  const { mutate: updateCart } = useCartListMutation();
  const { mutate: deleteCart } = useDeleteCartListMutation();

  const router = useRouter();

  const isSoldOut = (status: ProductStatusType) =>
    status === ProductStatusType.STOPPED;

  const selectedCartItems = cartList.filter(
    ({ product }) =>
      checkedCarts.some(checkedCartId => checkedCartId === product._id) &&
      !isSoldOut(product.status),
  );

  const showRemainingQuantity = (quantity: number, status: ProductStatusType) =>
    quantity <= SHOW_REMAINING_QUANTITY_COUNT && !isSoldOut(status);

  const handleAddQuantityClick = (id: string) => {
    if (checkSession()) {
      updateCart({ productId: id, quantity: 1 });
    }
  };

  const handleMinusQuantityClick = (id: string) => {
    if (checkSession()) {
      updateCart({ productId: id, quantity: -1 });
    }
  };

  const handleDeleteCartList = (data: DeleteCartItems) => {
    if (checkSession()) {
      deleteCart(data);
    }
  };

  const handleGoToWishListButtonClick = () => router.push(PATH.WISH_LIST);

  const handleGoToProductDetailButtonClick = (id: string) =>
    router.push(PATH.PRODUCT.DETAIL(id));

  return {
    isEmptyCartList: data?.items && isEmpty(data?.items),
    cartList,
    cartForm,
    selectedCartIds: selectedCartItems.map(({ product }) => product._id),
    selectedCartItems,
    isSoldOut,
    showRemainingQuantity,
    handleMinusQuantityClick,
    handleAddQuantityClick,
    handleDeleteCartList,
    handleGoToWishListButtonClick,
    handleGoToProductDetailButtonClick,
  };
};

export default useCartGrid;
