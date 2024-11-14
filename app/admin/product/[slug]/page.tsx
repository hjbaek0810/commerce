'use client';

import Button from '@components/Button';
import Rhf from '@components/Form';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';

import useProductDetail from './useProductDetail';
import ProductForm from '../components/ProductForm';

// TODO: 삭제, 뒤로가기 기능 , 로딩표시

const ProductDetail = () => {
  const {
    productForm,
    savedImages,
    editable,
    isPending,
    handleEditClick,
    handleCancelClick,
    handleBackClick,
    handleDeleteClick,
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
              <Button
                size="medium"
                color="secondary"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button size="medium" fill type="submit" disabled={isPending}>
                Save
              </Button>
            </>
          ) : (
            <Button size="medium" fill onClick={handleEditClick}>
              Edit
            </Button>
          )}
        </div>

        <ProductForm savedImages={savedImages} editable={editable} />

        <div
          className={sprinkles({
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'spacing-040',
          })}
        >
          <Button size="large" onClick={handleBackClick}>
            돌아가기
          </Button>
          <Button
            size="large"
            fill
            onClick={handleDeleteClick}
            disabled={isPending}
          >
            삭제
          </Button>
        </div>
      </Rhf.Form>
    </>
  );
};

export default ProductDetail;