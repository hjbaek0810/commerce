import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';

import { useSearchParams } from 'next/navigation';

import FindPostCodeModal from '@components/Modal/templates/FindPostCodeModal';
import { useCartListWhenNewOrderQuery } from '@services/queries/cart';
import { useProductDetailWhenNewOrderQuery } from '@services/queries/product';
import useModals from '@utils/hooks/useModals';
import { formatPhoneNumber } from '@utils/validation';

import type { CartProductVO } from '@api/cart/types/vo';
import type { CreateOrder } from '@api/order/types/dto';

const useNewOrder = () => {
  const searchParams = useSearchParams();
  const fromCart = searchParams.get('fromCart') === 'true' ? true : false;

  const { data: fromCartList } = useCartListWhenNewOrderQuery(
    searchParams.getAll('productId'),
    fromCart,
  );

  const { data: fromProductDetail } = useProductDetailWhenNewOrderQuery(
    String(searchParams.get('productId')),
    Number(searchParams.get('quantity')),
    fromCart,
  );

  const newOrderList = fromCart ? fromCartList : fromProductDetail;

  const orderForm = useForm<CreateOrder>();
  const { setValue } = orderForm;
  const { openModal } = useModals();

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

  const handleFindPostCodeButtonClick = () => {
    openModal(FindPostCodeModal, {
      onSubmit: data => {
        setValue('postCode', data.zonecode);
        setValue('address', data.address);
      },
    });
  };

  const handleTelephoneInput = (event: FormEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(event.currentTarget.value);
    setValue('telephone', formattedPhoneNumber);
  };

  return {
    newOrderList,
    orderForm,
    calculatePrice,
    calculateTotalPrice,
    handleFindPostCodeButtonClick,
    handleTelephoneInput,
  };
};

export default useNewOrder;
