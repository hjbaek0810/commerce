'use client';

import {
  faCartShopping,
  faHeart,
  faRightFromBracket,
  faRightToBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import useHeader from '@components/Header/useHeader';
import { PATH } from '@utils/path';

import * as css from './header.css';

import type { ParsedUrlQueryInput } from 'querystring';

export type HeaderListType = {
  title: string;
  href: {
    path: string;
    query?: ParsedUrlQueryInput | string;
  };
  customSelected?: boolean;
};

type HeaderPropsType = {
  list: Array<HeaderListType>;
};

const Header = ({ list }: HeaderPropsType) => {
  const { selected, session, handleSignOutButtonClick } = useHeader();

  return (
    <header className={css.header}>
      {/* TODO : logo img */}
      <h1 className={css.logo}>
        <Link href="/">Logo</Link>
      </h1>

      <nav className={css.bar}>
        <ul className={css.menu}>
          {list.map(({ title, href, customSelected }) => (
            <li
              key={title}
              className={css.menuItem({
                selected: selected(href.path, href?.query, customSelected),
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
            {session ? (
              <div className={css.loginInfoWrapper}>
                <span>{session.user.name}</span>
                <button type="button" onClick={handleSignOutButtonClick}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              </div>
            ) : (
              <Link href={PATH.SIGN_IN}>
                <FontAwesomeIcon icon={faRightToBracket} />
              </Link>
            )}
          </li>
          <li>
            <Link href={PATH.MY_ACCOUNT}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </li>
          <li>
            <Link href={PATH.CART}>
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>
          </li>
          <li>
            <Link href={PATH.WISH_LIST}>
              <FontAwesomeIcon icon={faHeart} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
