'use client';

import {
  faCartShopping,
  faHeart,
  faRightFromBracket,
  faRightToBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
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
  shallow?: boolean;
};

type HeaderPropsType = {
  list: Array<HeaderListType>;
};

const Header = ({ list }: HeaderPropsType) => {
  const { selected, session, handleSignOutButtonClick } = useHeader();

  return (
    <header className={css.header}>
      <h1 className={css.logo}>
        <Link href="/">MiniMall</Link>
      </h1>

      <nav className={css.bar}>
        <ul className={css.menu}>
          {list.map(({ title, href, customSelected, shallow }) => (
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
                shallow={shallow}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>

        <ul className={css.menu}>
          {session && (
            <>
              <li>
                {session.user.image ? (
                  <Image
                    style={{
                      borderRadius: '50%',
                    }}
                    width={24}
                    height={24}
                    src={session.user.image}
                    alt="avatar"
                    priority
                  />
                ) : (
                  session.user.name
                )}
              </li>
              <li>
                <button type="button" onClick={handleSignOutButtonClick}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              </li>
            </>
          )}
          {!session && (
            <li>
              <Link href={PATH.SIGN_IN} aria-label="Go to Login">
                <FontAwesomeIcon icon={faRightToBracket} />
              </Link>
            </li>
          )}

          {session && (
            <>
              <li>
                <Link href={PATH.MY_ACCOUNT} prefetch={false}>
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              </li>
              <li>
                <Link href={PATH.CART} prefetch={false}>
                  <FontAwesomeIcon icon={faCartShopping} />
                </Link>
              </li>
              <li>
                <Link href={PATH.WISH_LIST} prefetch={false}>
                  <FontAwesomeIcon icon={faHeart} />
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
