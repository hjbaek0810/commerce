'use client';

import {
  faCartShopping,
  faHeart,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import useHeader from '@components/Header/useHeader';

import * as css from './header.css';

import type { ParsedUrlQueryInput } from 'querystring';

export type HeaderListType = {
  title: string;
  href: {
    path: string;
    query?: ParsedUrlQueryInput | string;
  };
  fullMatch?: boolean;
};

type HeaderPropsType = {
  list: Array<HeaderListType>;
};

const Header = ({ list }: HeaderPropsType) => {
  const { selected } = useHeader();

  return (
    <header className={css.header}>
      {/* TODO : logo img */}
      <h1 className={css.logo}>
        <Link href="/">Logo</Link>
      </h1>

      <nav className={css.bar}>
        <ul className={css.menu}>
          {list.map(({ title, href, fullMatch }) => (
            <li
              key={title}
              className={css.menuItem({
                selected: selected(href.path, href?.query, fullMatch),
              })}
            >
              <Link
                href={{
                  pathname: href.path,
                  query: href.query,
                }}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>

        <ul className={css.menu}>
          <li>
            <Link href="/my-account">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </li>
          <li>
            <Link href="/cart">
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>
          </li>
          <li>
            <Link href="/like">
              <FontAwesomeIcon icon={faHeart} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
