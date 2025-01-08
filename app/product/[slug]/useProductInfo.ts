import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import PromptModal from '@components/Modal/templates/PromptModal';
import { useCartListMutation } from '@services/queries/cart';
import { useProductDetailQuery } from '@services/queries/product';
import { useWishListMutation } from '@services/queries/wish-list';
import { wishListKeys } from '@services/queries/wish-list/keys';
import { ProductStatusType } from '@utils/constants/product';
import useModals from '@utils/hooks/useModals';
import useSessionHandler from '@utils/hooks/useSessionHandler';
import { PATH } from '@utils/path';
import { createQueryString } from '@utils/query/helper';

import type { WishListVO } from '@api/wish-list/types/vo';

export const SHOW_REMAINING_QUANTITY_COUNT = 10;

const useProductInfo = (id: string) => {
  const { checkSession, isAuthenticated } = useSessionHandler();

  const queryClient = useQueryClient();
  const { data: product, isWished } = useProductDetailQuery(
    id,
    isAuthenticated,
  );
  const { mutate: updateWish } = useWishListMutation();
  const { mutate: updateCart } = useCartListMutation(true);

  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const productQuantity = product?.quantity || 0;

  const { openModal } = useModals();

  const soldOut =
    productQuantity <= 0 || product?.status === ProductStatusType.STOPPED;

  const showRemainingQuantity =
    productQuantity <= SHOW_REMAINING_QUANTITY_COUNT && !soldOut;

  const minusQuantityButtonDisabled = quantity === 1;
  const addQuantityButtonDisabled = productQuantity <= quantity;

  const handleWishButtonClick = () => {
    if (checkSession()) {
      updateWish(
        { productId: id },
        {
          onSuccess: () => {
            queryClient.setQueryData<WishListVO>(
              wishListKeys.getAll(),
              previous => {
                if (!previous) return undefined;

                const exists = previous.items.some(item => item._id === id);

                if (exists) {
                  return {
                    ...previous,
                    items: previous.items.filter(item => item._id !== id),
                  };
                } else {
                  return {
                    ...previous,
                    items: [
                      {
                        _id: id,
                        name: product?.name || '',
                        images: product?.images || [],
                        price: product?.price || 0,
                        salePrice: product?.salePrice || null,
                      },
                      ...previous.items,
                    ],
                  };
                }
              },
            );
          },
        },
      );
    }
  };

  const handleBuyButtonClick = () => {
    if (checkSession()) {
      router.push(
        createQueryString(PATH.NEW_ORDER, {
          productId: id,
          quantity,
          fromCart: false,
        }),
      );
    }
  };

  const handleCartButtonClick = () => {
    if (checkSession()) {
      updateCart(
        { productId: id, quantity },
        {
          onSuccess: () => {
            openModal(PromptModal, {
              message: '장바구니 목록으로 이동하시겠습니까?',
              onSubmit: () => {
                router.push(PATH.CART);
              },
            });
          },
        },
      );
    }
  };

  const handleAddQuantityClick = () => setQuantity(prev => prev + 1);
  const handleMinusQuantityClick = () =>
    setQuantity(prev => (prev === 1 ? 1 : prev - 1));

  return {
    product,
    isWished,
    minusQuantityButtonDisabled,
    addQuantityButtonDisabled,
    soldOut,
    quantity,
    showRemainingQuantity,
    handleWishButtonClick,
    handleCartButtonClick,
    handleBuyButtonClick,
    handleAddQuantityClick,
    handleMinusQuantityClick,
  };
};

export default useProductInfo;
