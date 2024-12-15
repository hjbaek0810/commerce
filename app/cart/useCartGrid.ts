import { useForm, useWatch } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { useRouter } from 'next/navigation';

import { SHOW_REMAINING_QUANTITY_COUNT } from '@app/product/[slug]/useProductInfo';
import {
  useCartListMutation,
  useCartListQuery,
  useDeleteCartListMutation,
} from '@services/queries/cart';
import { cartKeys } from '@services/queries/cart/keys';
import { ProductStatusType } from '@utils/constants/product';
import useSessionHandler from '@utils/hooks/useSessionHandler';
import { PATH } from '@utils/path';

import type { DeleteCartItems } from '@api/cart/types/dto';
import type { CartListVO } from '@api/cart/types/vo';

const useCartGrid = () => {
  const queryClient = useQueryClient();
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

  const handleUpdateQuantitySuccess = (productId: string, quantity: number) => {
    queryClient.setQueryData<CartListVO>(cartKeys.getAll(), previous => {
      if (!previous) return data;

      const updatedCartList = previous?.items.map(item =>
        item.product._id === productId
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item,
      );

      return {
        ...previous,
        items: updatedCartList,
      };
    });
  };

  const handleAddQuantityClick = (id: string) => {
    if (checkSession()) {
      updateCart(
        { productId: id, quantity: 1 },
        {
          onSuccess: () => handleUpdateQuantitySuccess(id, 1),
        },
      );
    }
  };

  const handleMinusQuantityClick = (id: string) => {
    if (checkSession()) {
      updateCart(
        { productId: id, quantity: -1 },
        {
          onSuccess: () => handleUpdateQuantitySuccess(id, -1),
        },
      );
    }
  };

  const handleDeleteCartList = (deleteData: DeleteCartItems) => {
    if (checkSession()) {
      deleteCart(deleteData, {
        onSuccess: () => {
          queryClient.setQueryData<CartListVO>(cartKeys.getAll(), oldData => {
            if (!oldData) return data;

            const filteredItems = oldData.items.filter(
              item => !deleteData.productIds.includes(item.product._id),
            );

            return {
              ...oldData,
              items: filteredItems,
            };
          });
        },
      });
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
