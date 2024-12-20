'use client';

import Button from '@components/Button';
import Rhf from '@components/Form';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';

import useProductRegister from './useProductRegister';
import ProductForm from '../components/ProductForm';

const AdminProduct = () => {
  const { productForm, handleSubmit, isPending } = useProductRegister();

  return (
    <>
      <Title showBackButton>상품 등록</Title>
      <Rhf.Form {...productForm} onSubmit={handleSubmit}>
        <ProductForm />

        <div
          className={sprinkles({
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 'spacing-040',
          })}
        >
          <Button fill size="large" type="submit" disabled={isPending}>
            Submit
          </Button>
        </div>
      </Rhf.Form>
    </>
  );
};

export default AdminProduct;
