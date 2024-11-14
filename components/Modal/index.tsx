import type { PropsWithChildren } from 'react';

import * as css from './modal.css';
const ModalWrapper = ({ children }: PropsWithChildren) => (
  <section>{children}</section>
);

const ModalHeader = ({ children }: PropsWithChildren) => (
  <header className={css.header}>
    <h2 className={css.headerTitle}>{children}</h2>
  </header>
);

const ModalBody = ({ children }: PropsWithChildren) => (
  <article className={css.body}>{children}</article>
);

const ModalFooter = ({ children }: PropsWithChildren) => (
  <footer className={css.footer}>{children}</footer>
);

const Modal = Object.assign(ModalWrapper, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export default Modal;
