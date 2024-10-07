import type { PropsWithChildren } from 'react';

import * as css from './table.css';

// 필요 시 colspan, rowspan 추가

type TableThPropsType = {
  scope?: 'col' | 'row'; // ++ colgroup | rowgroup
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

const TableTh = ({ scope, children }: PropsWithChildren<TableThPropsType>) => (
  <th scope={scope} className={css.th}>
    {children}
  </th>
);

const TableBody = ({ children }: PropsWithChildren) => (
  <tbody className={css.body}>{children}</tbody>
);

const TableTd = ({ children }: PropsWithChildren) => (
  <td className={css.td}>{children}</td>
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
