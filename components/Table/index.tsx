import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import * as css from './table.css';

type TableThPropsType = {
  className?: string;
  scope?: 'col' | 'row'; // ++ colgroup | rowgroup
};

type TableTdPropsType = Pick<TableThPropsType, 'className'> & {
  rowSpan?: number;
  colSpan?: number;
};

const TableRoot = ({ children }: PropsWithChildren) => {
  return (
    <div className={css.root}>
      <table className={css.table}>{children}</table>
    </div>
  );
};

const TableHeader = ({ children }: PropsWithChildren) => (
  <thead className={css.header}>{children}</thead>
);

const TableTh = ({
  scope,
  className,
  children,
}: PropsWithChildren<TableThPropsType>) => (
  <th scope={scope} className={clsx(css.th, className)}>
    {children}
  </th>
);

const TableBody = ({ children }: PropsWithChildren) => (
  <tbody className={css.body}>{children}</tbody>
);

const TableTd = ({
  rowSpan,
  colSpan,
  className,
  children,
}: PropsWithChildren<TableTdPropsType>) => (
  <td rowSpan={rowSpan} colSpan={colSpan} className={clsx(css.td, className)}>
    {children}
  </td>
);

const TableTr = ({ children }: PropsWithChildren) => (
  <tr className={css.tr}>{children}</tr>
);

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Th: TableTh,
  Body: TableBody,
  Td: TableTd,
  Tr: TableTr,
});
