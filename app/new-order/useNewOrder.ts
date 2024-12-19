import { type FormEvent, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

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
import { useMyAccountWhenNewOrder } from '@services/queries/user';
import { resetQueries } from '@services/utils/helper';
import { OrderStatus, PaymentType } from '@utils/constants/order';
import useModals from '@utils/hooks/useModals';
import { PATH } from '@utils/path';
import { formatPhoneNumber } from '@utils/validation';

import type { CreateOrder } from '@api/order/types/dto';

type NewOrderUseFormType = Omit<
  CreateOrder,
  'products' | 'status' | 'fromCart'
> & {
  isSameAsUserInfo: 'true' | 'false';
};

const useNewOrder = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

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

  const [isFetchUser, setIsFetchUser] = useState<boolean>(false);
  const { data: userInfo } = useMyAccountWhenNewOrder(isFetchUser);

  const { mutate: orderRequest } = useOrderListMutation();

  const newOrderList = fromCart ? fromCartList : fromProductDetail;

  const router = useRouter();

  const orderForm = useForm<NewOrderUseFormType>({
    defaultValues: {
      paymentType: PaymentType.BANK_TRANSFER,
      isSameAsUserInfo: 'false',
    },
  });

  const { setValue, control } = orderForm;

  const isSameAsUserInfoValue = useWatch({
    name: 'isSameAsUserInfo',
    control,
    defaultValue: 'false',
  });

  const { openModal } = useModals();

  useEffect(() => {
    if (!isSameAsUserInfoValue) return;

    const fields = ['postCode', 'address', 'subAddress', 'telephone'] as const;

    const updateFields = (
      values: Partial<Record<(typeof fields)[number], string>>,
    ) => {
      fields.forEach(field => {
        setValue(field, values[field] || '');
      });
    };

    if (isSameAsUserInfoValue === 'true') {
      setIsFetchUser(true);
      updateFields({
        postCode: userInfo?.postCode,
        address: userInfo?.address,
        subAddress: userInfo?.subAddress,
        telephone: userInfo?.telephone,
      });
    } else {
      updateFields({});
    }
  }, [
    isSameAsUserInfoValue,
    setValue,
    userInfo?.address,
    userInfo?.postCode,
    userInfo?.subAddress,
    userInfo?.telephone,
  ]);

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

    const { isSameAsUserInfo, ...restData } = data;

    const requestData: CreateOrder = {
      ...restData,
      products: newOrderList.items.map(({ product, quantity }) => ({
        _id: product._id,
        quantity,
        price: product.salePrice ?? product.price,
      })),
      status: OrderStatus.PAYMENT_PENDING,
      fromCart,
    };

    orderRequest(requestData, {
      onSuccess: () => {
        router.push(PATH.ORDER);
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
