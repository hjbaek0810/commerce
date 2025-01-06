import type { UseFormReturn } from 'react-hook-form';

import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import { sprinkles } from '@styles/sprinkles.css';
import { ProductSortType, ProductStatusType } from '@utils/constants/product';

import * as css from '../adminProduct.css';

import type {
  AdminCategoryVO,
  AdminSubCategoryVO,
} from '@api/admin/category/types/vo';
import type { SearchAdminProduct } from '@api/admin/product/types/dto';

type AdminProductSearchFilterPropsType = {
  categories: AdminCategoryVO[];
  subCategories: Omit<AdminSubCategoryVO, 'deletable'>[];
  searchForm: UseFormReturn<SearchAdminProduct>;
  handleAdminSearchProduct: (data: SearchAdminProduct) => void;
  handleFilterResetButtonClick: () => void;
  handleChangeCategory: () => void;
  handleSortChange: () => void;
};

const AdminProductSearchFilter = ({
  categories,
  subCategories,
  searchForm,
  handleAdminSearchProduct,
  handleFilterResetButtonClick,
  handleChangeCategory,
  handleSortChange,
}: AdminProductSearchFilterPropsType) => {
  return (
    <Rhf.Form
      {...searchForm}
      className={css.searchFilterWrapper}
      onSubmit={handleAdminSearchProduct}
    >
      <div className={css.resetWithFilterWrapper}>
        <Button size="small" onClick={handleFilterResetButtonClick}>
          Reset
        </Button>
        <Table>
          <Table.Body>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="category">카테고리</Rhf.Label>
              </Table.Th>
              <Table.Td>
                <Rhf.Select
                  name="category"
                  hiddenPlaceholder
                  onChange={handleChangeCategory}
                >
                  <Rhf.SelectOption value="">ALL</Rhf.SelectOption>
                  {categories.map(({ _id, name }) => (
                    <Rhf.SelectOption key={_id} value={_id}>
                      {name}
                    </Rhf.SelectOption>
                  ))}
                </Rhf.Select>
              </Table.Td>
              <Table.Td colSpan={2}>
                <Rhf.CheckboxGroup
                  options={subCategories.map(({ _id }) => _id)}
                  name="subCategory"
                >
                  <div
                    className={sprinkles({
                      display: 'flex',
                      gap: 'spacing-012',
                      flexWrap: 'wrap',
                    })}
                  >
                    {subCategories.map(sub => (
                      <Rhf.Checkbox
                        key={sub._id}
                        value={sub._id}
                        label={sub.name}
                      />
                    ))}
                  </div>
                </Rhf.CheckboxGroup>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="name">상품명</Rhf.Label>
              </Table.Th>
              <Table.Td>
                <Rhf.Input name="name" />
              </Table.Td>
              <Table.Th scope="row">
                <Rhf.Label isLegend>상품상태</Rhf.Label>
              </Table.Th>
              <Table.Td>
                <Rhf.CheckboxGroup
                  options={[
                    ProductStatusType.IN_PROGRESS,
                    ProductStatusType.STOPPED,
                    ProductStatusType.HIDDEN,
                  ]}
                  name="status"
                >
                  <Rhf.Checkbox
                    value={ProductStatusType.IN_PROGRESS}
                    label="판매"
                  />
                  <Rhf.Checkbox
                    value={ProductStatusType.STOPPED}
                    label="판매 중지"
                  />
                  <Rhf.Checkbox
                    value={ProductStatusType.HIDDEN}
                    label="상품 숨김"
                  />
                </Rhf.CheckboxGroup>
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>
      </div>

      <Button type="submit" size="large" fill>
        Search
      </Button>

      <div className={css.sortSelectWrapper}>
        <Rhf.Select name="sort" onChange={handleSortChange} hiddenPlaceholder>
          <Rhf.SelectOption value={ProductSortType.NEWEST}>
            최신 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={ProductSortType.OLDEST}>
            오래된 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={ProductSortType.POPULARITY}>
            인기 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={ProductSortType.PRICE_HIGH}>
            가격 높은 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={ProductSortType.PRICE_LOW}>
            가격 낮은 순
          </Rhf.SelectOption>
        </Rhf.Select>
      </div>
    </Rhf.Form>
  );
};

export default AdminProductSearchFilter;
