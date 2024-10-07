'use client';

import {
  faCartShopping,
  faHeart,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import * as css from './header.css';

type HeaderPropsType = {
  list: Array<{ path: string; label: string }>;
};

const Header = ({ list }: HeaderPropsType) => {
  const pathname = usePathname();
  const selected = (menuPath: string) => menuPath === pathname;

  return (
    <header className={css.header}>
      {/* TODO : logo img */}
      <h1 className={css.logo}>
        <Link href="/">Logo</Link>
      </h1>

      <nav className={css.bar}>
        <ul className={css.menu}>
          {list.map(({ label, path }) => (
            <li
              key={label}
              className={css.menuItem({ selected: selected(path) })}
            >
              <Link href={path}>{label}</Link>
            </li>
          ))}
        </ul>

        <ul className={css.menu}>
          <li>
            {/* TODO : search 기능 */}
            <button>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </li>
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
