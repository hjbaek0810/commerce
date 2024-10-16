import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

export type ProductUseFormType = {
  price: number;
  salePrice?: number;
  // category
};

const useProduct = () => {
  const productForm = useForm({
    reValidateMode: 'onChange',
  });
  const [saleRate, setSaleRate] = useState<number>(0);

  const priceValue = useWatch({
    name: 'price',
    control: productForm.control,
  });

  const salePriceValue = useWatch({
    name: 'salePrice',
    control: productForm.control,
  });

  const category = useWatch({
    name: 'category',
    control: productForm.control,
  });

  const calculateSaleRate = useCallback(() => {
    if (
      !priceValue ||
      !salePriceValue ||
      Number(priceValue) <= Number(salePriceValue)
    ) {
      setSaleRate(0);
    } else {
      const discountRate = ((priceValue - salePriceValue) / priceValue) * 100;
      setSaleRate(Math.round(discountRate));
    }
  }, [priceValue, salePriceValue]);

  useEffect(() => {
    calculateSaleRate();
  }, [calculateSaleRate]);

  return { productForm, saleRate };
};

export default useProduct;
