'use client';

import Button from '@components/Button';
import Rhf from '@components/Form';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';

import useProductDetail from './useProductDetail';
import ProductForm from '../components/ProductForm';

const ProductDetail = () => {
  const {
    productForm,
    savedImages,
    editable,
    handleEditClick,
    handleCancelClick,
    handleSubmit,
  } = useProductDetail();

  return (
    <>
      <Title>상품 상세</Title>

      <Rhf.Form {...productForm} onSubmit={handleSubmit}>
        <div
          className={sprinkles({
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'spacing-004',
            marginBottom: 'spacing-008',
          })}
        >
          {editable ? (
            <>
              <Button color="secondary" onClick={handleCancelClick}>
                Cancel
              </Button>
              <Button fill type="submit">
                Save
              </Button>
            </>
          ) : (
            <Button fill onClick={handleEditClick}>
              Edit
            </Button>
          )}
        </div>

        <ProductForm savedImages={savedImages} editable={editable} />

        <div
          className={sprinkles({
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 'spacing-040',
          })}
         />
      </Rhf.Form>
    </>
  );
};

export default ProductDetail;
