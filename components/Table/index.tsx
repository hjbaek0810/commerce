import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { sprinkles } from '@styles/sprinkles.css';

import * as css from './table.css';

import type { sizing } from '@styles/tokens';

type TableThPropsType = {
  className?: string;
  scope?: 'col' | 'row'; // ++ colgroup | rowgroup
  width?: keyof typeof sizing;
};

type TableTdPropsType = Pick<TableThPropsType, 'className'> & {
  rowSpan?: number;
  colSpan?: number;
};

type TableTrPropsType = {
  onClick?: () => void;
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
  scope = 'col',
  className,
  width,
  children,
}: PropsWithChildren<TableThPropsType>) => (
  <th scope={scope} className={clsx(css.th, className, sprinkles({ width }))}>
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

const TableTr = ({
  onClick,
  children,
}: PropsWithChildren<TableTrPropsType>) => (
  <tr onClick={onClick} className={css.tr({ clickable: !!onClick })}>
    {children}
  </tr>
);

export const TableBadge = ({ children }: PropsWithChildren) => (
  <span className={css.tableBadge}>{children}</span>
);

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Th: TableTh,
  Body: TableBody,
  Td: TableTd,
  Tr: TableTr,
});
