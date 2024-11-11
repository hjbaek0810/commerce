import type { PaginationProsType } from '.';

const usePaginationLogic = ({
  totalCount,
  currentPage,
  currentLimit,
  onPageChange,
  onPageSizeChange,
}: PaginationProsType) => {
  const PAGES_TO_SHOW = 5;
  const halfPagesToShow = Math.floor(PAGES_TO_SHOW / 2);

  const totalPages = Math.ceil(totalCount / currentLimit);

  let startPage = currentPage - halfPagesToShow;
  let endPage = currentPage + halfPagesToShow;

  if (startPage < 1) {
    startPage = 1;
    endPage = PAGES_TO_SHOW;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(totalPages - PAGES_TO_SHOW + 1, 1);
  }

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const handleSizeChange = (size: number) => {
    onPageSizeChange(size);
  };

  const handlePrevPageClick = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPageClick = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return {
    startPage,
    endPage,
    hasPrevPage,
    hasNextPage,
    handlePageClick,
    handleSizeChange,
    handlePrevPageClick,
    handleNextPageClick,
  };
};

export default usePaginationLogic;
