import type {
  MouseEventHandler,
  PropsWithChildren,
  SetStateAction,
} from 'react';

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Select from '@components/Form/Select';

import * as css from './pagination.css';
import usePaginationLogic from './usePaginationLogic';

export type PaginationProsType = {
  totalCount: number;
  currentPage: number;
  currentLimit: number;
  onPageChange: (page: SetStateAction<number>) => void;
  onPageSizeChange: (size: SetStateAction<number>) => void;
};

const RangeButton = ({
  active,
  disabled,
  children,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & PropsWithChildren) => {
  return (
    <li className={css.rangeButton({ active, disabled })}>
      <button onClick={onClick}>{children}</button>
    </li>
  );
};

const Pagination = (props: PaginationProsType) => {
  const {
    startPage,
    endPage,
    hasPrevPage,
    hasNextPage,
    handlePageClick,
    handleSizeChange,
    handlePrevPageClick,
    handleNextPageClick,
  } = usePaginationLogic(props);

  const { currentLimit, currentPage } = props;

  return (
    <div className={css.pagination}>
      <div className={css.sizeSelectorWrapper}>
        <p className={css.sizeTitle}>Rows per page:</p>
        <Select
          defaultValue={currentLimit}
          className={css.sizeSelector}
          onChange={event => handleSizeChange(Number(event.target.value))}
        >
          <Select.Option value={10}>10</Select.Option>
          <Select.Option value={25}>25</Select.Option>
          <Select.Option value={50}>50</Select.Option>
          <Select.Option value={100}>100</Select.Option>
        </Select>
      </div>

      <ul className={css.range}>
        <RangeButton disabled={!hasPrevPage} onClick={handlePrevPageClick}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </RangeButton>

        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
          const page = startPage + index;

          return (
            <RangeButton
              key={page}
              active={currentPage === page}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </RangeButton>
          );
        })}

        <RangeButton disabled={!hasNextPage} onClick={handleNextPageClick}>
          <FontAwesomeIcon icon={faChevronRight} />
        </RangeButton>
      </ul>
    </div>
  );
};

export default Pagination;
