import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';

import FindPostCodeModal from '@components/Modal/templates/FindPostCodeModal';
import { useCartListWhenNewOrderQuery } from '@services/queries/cart';
import { cartKeys } from '@services/queries/cart/keys';
import { useOrderListMutation } from '@services/queries/order';
import { orderKeys } from '@services/queries/order/keys';
import { useProductDetailWhenNewOrderQuery } from '@services/queries/product';
import { productKeys } from '@services/queries/product/keys';
import { resetQueries } from '@services/utils/helper';
import { OrderStatus, PaymentType } from '@utils/constants/order';
import useModals from '@utils/hooks/useModals';
import { PATH } from '@utils/path';
import { formatPhoneNumber } from '@utils/validation';

import type { CreateOrder } from '@api/order/types/dto';

type NewOrderUseFormType = Omit<
  CreateOrder,
  'products' | 'status' | 'fromCart'
>;

const useNewOrder = () => {
  const searchParams = useSearchParams();
  const fromCart = searchParams.get('fromCart') === 'true' ? true : false;

  const queryClient = useQueryClient();
  const { data: fromCartList } = useCartListWhenNewOrderQuery(
    searchParams.getAll('productId'),
    fromCart,
  );

  const { data: fromProductDetail } = useProductDetailWhenNewOrderQuery(
    String(searchParams.get('productId')),
    Number(searchParams.get('quantity')),
    fromCart,
  );

  const { mutate: orderRequest } = useOrderListMutation();

  const newOrderList = fromCart ? fromCartList : fromProductDetail;

  const router = useRouter();
  const orderForm = useForm<NewOrderUseFormType>({
    defaultValues: {
      paymentType: PaymentType.BANK_TRANSFER,
    },
  });
  const { setValue } = orderForm;
  const { openModal } = useModals();

  const handleFindPostCodeButtonClick = () => {
    openModal(FindPostCodeModal, {
      onSubmit: data => {
        setValue('postCode', data.zonecode);
        setValue('address', data.address);
        setValue('subAddress', '');
      },
    });
  };

  const handleTelephoneInput = (event: FormEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(event.currentTarget.value);
    setValue('telephone', formattedPhoneNumber);
  };

  const handleSubmitOrder = (data: NewOrderUseFormType) => {
    if (!newOrderList || isEmpty(newOrderList)) return;

    const requestData: CreateOrder = {
      ...data,
      products: newOrderList.items.map(({ product, quantity }) => ({
        _id: product._id,
        quantity,
        price: product.salePrice ?? product.price,
      })),
      status: OrderStatus.PAYMENT_PENDING,
      fromCart,
    };

    orderRequest(requestData, {
      onSuccess: (_, variables) => {
        router.push(PATH.ORDER);

        setTimeout(() => {
          const productQueriesToInvalidate = variables.products.flatMap(
            item => [
              productKeys.getDetail(item._id),
              productKeys.getAdminDetail(item._id),
            ],
          );

          resetQueries(queryClient, [
            ...productQueriesToInvalidate,
            orderKeys.getAdminAll(),
            cartKeys.getAll(),
          ]);
        }, 2000);
      },
    });
  };

  return {
    newOrderList,
    orderForm,
    handleFindPostCodeButtonClick,
    handleTelephoneInput,
    handleSubmitOrder,
  };
};

export default useNewOrder;
