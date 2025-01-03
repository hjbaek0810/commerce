import { type FormEvent, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { isEmpty, isEqual } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';

import FindPostCodeModal from '@components/Modal/templates/FindPostCodeModal';
import { useCartListWhenNewOrderQuery } from '@services/queries/cart';
import { useOrderListMutation } from '@services/queries/order';
import { useProductDetailWhenNewOrderQuery } from '@services/queries/product';
import { useMyAccountWhenNewOrder } from '@services/queries/user';
import { OrderStatus, PaymentType } from '@utils/constants/order';
import useModals from '@utils/hooks/useModals';
import { PATH } from '@utils/path';
import { formatPhoneNumber } from '@utils/validation';

import type { CreateOrder } from '@api/order/types/dto';

type NewOrderUseFormType = Omit<
  CreateOrder,
  'products' | 'status' | 'fromCart'
> & { isSameAsUserInfo: ('true' | 'false')[] };

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

  const { data: userInfo } = useMyAccountWhenNewOrder();

  const { mutate: orderRequest } = useOrderListMutation();

  const newOrderList = fromCart ? fromCartList : fromProductDetail;

  const router = useRouter();

  const defaultValues: NewOrderUseFormType = useMemo(
    () => ({
      paymentType: PaymentType.BANK_TRANSFER,
      postCode: userInfo?.postCode || '',
      address: userInfo?.address || '',
      subAddress: userInfo?.subAddress || '',
      telephone: userInfo?.telephone || '',
      isSameAsUserInfo: ['true'],
    }),
    [userInfo],
  );

  const orderForm = useForm<NewOrderUseFormType>({
    values: defaultValues,
  });

  const { setValue, control, reset, getValues } = orderForm;

  const isSameAsUserInfoValue = useWatch({
    name: 'isSameAsUserInfo',
    control,
    defaultValue: ['true'],
  });

  const { openModal } = useModals();

  useEffect(() => {
    if (
      isSameAsUserInfoValue?.[0] === 'true' &&
      !isEqual(defaultValues, getValues())
    ) {
      reset(defaultValues);
    }
  }, [defaultValues, getValues, isSameAsUserInfoValue, reset]);

  const handleFindPostCodeButtonClick = () => {
    openModal(FindPostCodeModal, {
      onSubmit: data => {
        setValue('postCode', data.zonecode);
        setValue('address', data.address);
        setValue('subAddress', '');
        setValue('isSameAsUserInfo', ['false']);
      },
    });
  };

  const handleSubAddressChange = () => {
    setValue('isSameAsUserInfo', ['false']);
  };

  const handleTelephoneInput = (event: FormEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(event.currentTarget.value);
    setValue('telephone', formattedPhoneNumber);
    setValue('isSameAsUserInfo', ['false']);
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
    handleSubAddressChange,
    handleSubmitOrder,
  };
};

export default useNewOrder;
