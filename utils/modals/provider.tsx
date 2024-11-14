'use client';

import type { ComponentProps } from 'react';
import { type PropsWithChildren, useMemo, useRef, useState } from 'react';

import Modals from '@utils/modals';
import {
  ModalsDispatchContext,
  ModalsStateContext,
} from '@utils/modals/context';

import type { ModalComponentType, ModalsState } from '@utils/modals/context';

const ModalsProvider = ({ children }: PropsWithChildren) => {
  const [openedModals, setOpenedModals] = useState<ModalsState>([]);
  const nextModalId = useRef<number>(0);

  const open = <T extends ModalComponentType>(
    Component: T,
    props?: ComponentProps<T>,
  ) => {
    const modalId = nextModalId.current;

    setOpenedModals(modals => {
      const modalIndex = modals.findIndex(
        modal => modal.Component === Component,
      );

      if (modalIndex !== -1) {
        modals[modalIndex].isOpen = true;
        modals[modalIndex].props = props;

        return [...modals];
      } else {
        nextModalId.current += 1;

        return [...modals, { Component, props, isOpen: true, id: modalId }];
      }
    });

    return modalId;
  };

  const close = (targetId: number) => {
    setOpenedModals(modals =>
      modals.map(modal =>
        modal.id === targetId ? { ...modal, isOpen: false } : modal,
      ),
    );
  };

  const dispatch = useMemo(() => ({ open, close }), []);

  return (
    <ModalsStateContext.Provider value={openedModals}>
      <ModalsDispatchContext.Provider value={dispatch}>
        {children}
        <Modals />
      </ModalsDispatchContext.Provider>
    </ModalsStateContext.Provider>
  );
};
export default ModalsProvider;
