import { useState } from 'react';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import PromptModal from '@components/Modal/templates/PromptModal';
import { useCartListMutation } from '@services/queries/cart';
import { useProductDetailQuery } from '@services/queries/product';
import { useWishListMutation } from '@services/queries/wish-list';
import { ProductStatusType } from '@utils/constants/product';
import useModals from '@utils/hooks/useModals';
import { PATH } from '@utils/path';

const SHOW_REMAINING_QUANTITY_COUNT = 10;

const useProductInfo = (id: string) => {
  const { data: session } = useSession();

  const { data: product, isTop10, isWished } = useProductDetailQuery(id);
  const { mutate: updateWish } = useWishListMutation();
  const { mutate: updateCart } = useCartListMutation();

  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const productQuantity = product?.quantity || 0;

  const { openModal } = useModals();

  const soldOut =
    productQuantity <= 0 || product?.status === ProductStatusType.STOPPED;

  const showRemainingQuantity =
    productQuantity <= SHOW_REMAINING_QUANTITY_COUNT;

  const minusQuantityButtonDisabled = quantity === 1;
  const addQuantityButtonDisabled = productQuantity <= quantity;

  const handleWishButtonClick = () => {
    if (!session) {
      toast('세션이 만료되었습니다. 다시 로그인해주세요.');
      router.push(PATH.SIGN_IN);

      return;
    }

    updateWish({ productId: id });
  };

  const handleCartButtonClick = () => {
    if (!session) {
      toast('세션이 만료되었습니다. 다시 로그인해주세요.');
      router.push(PATH.SIGN_IN);

      return;
    }

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
  };

  const handleAddQuantityClick = () => setQuantity(prev => prev + 1);
  const handleMinusQuantityClick = () =>
    setQuantity(prev => (prev === 1 ? 1 : prev - 1));

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
    handleCartButtonClick,
    handleAddQuantityClick,
    handleMinusQuantityClick,
  };
};

export default useProductInfo;
