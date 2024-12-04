import { useState } from 'react';
import { useForm } from 'react-hook-form';

const useCartGrid = () => {
  const cartForm = useForm();
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddQuantityClick = () => setQuantity(prev => prev + 1);
  const handleMinusQuantityClick = () =>
    setQuantity(prev => (prev === 1 ? 1 : prev - 1));

  const minusQuantityButtonDisabled = quantity === 1;

  return {
    cartForm,
    quantity,
    minusQuantityButtonDisabled,
    handleMinusQuantityClick,
    handleAddQuantityClick,
  };
};

export default useCartGrid;
