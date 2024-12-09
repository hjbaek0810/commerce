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
import useSessionHandler from '@utils/hooks/useSessionHandler';
import { PATH } from '@utils/path';

import type { DeleteCartItems } from '@api/cart/types/dto';
import type { CartProductVO } from '@api/cart/types/vo';

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

  const showRemainingQuantity = (quantity: number) =>
    quantity <= SHOW_REMAINING_QUANTITY_COUNT;

  const calculatePrice = (
    price: number,
    salePrice: number | null,
    quantity: number,
  ) => {
    const realPrice = salePrice || price;

    return realPrice * quantity;
  };

  const calculateTotalPrice = (
    products: CartProductVO[],
    quantities: number[],
  ): number => {
    return products
      .map((product, index) => {
        const realPrice = product.salePrice ?? product.price;

        return realPrice * quantities[index];
      })
      .reduce((total, price) => total + price, 0);
  };

  const handleAddQuantityClick = (
    id: string,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    if (checkSession()) {
      updateCart({ productId: id, quantity: 1 });
    }
  };

  const handleMinusQuantityClick = (
    id: string,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

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
    checkedCarts,
    selectedCartItems: cartList.filter(({ product }) =>
      checkedCarts.some(checkedCartId => checkedCartId === product._id),
    ),
    calculatePrice,
    calculateTotalPrice,
    showRemainingQuantity,
    handleMinusQuantityClick,
    handleAddQuantityClick,
    handleDeleteCartList,
    handleGoToWishListButtonClick,
    handleGoToProductDetailButtonClick,
  };
};

export default useCartGrid;
