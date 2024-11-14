import type { ComponentProps } from 'react';
import { useCallback } from 'react';

import { useModalsDispatchContext } from '@utils/modals/context';

import type { ModalComponentType } from '@utils/modals/context';

const useModals = () => {
  const { open, close } = useModalsDispatchContext();

  const openModal = useCallback(
    <T extends ModalComponentType>(Component: T, props?: ComponentProps<T>) =>
      open(Component, props),
    [open],
  );

  const closeModal = useCallback(
    (id: number) => {
      close(id);
    },
    [close],
  );

  return {
    openModal,
    closeModal,
  };
};

export default useModals;
