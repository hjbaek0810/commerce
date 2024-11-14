import type { ComponentProps, ComponentType } from 'react';
import { createContext, useContext } from 'react';

export type ModalComponentType = ComponentType<any>;

type ModalPropsType = ComponentProps<ModalComponentType>;

export type ModalsState = Array<{
  Component: ModalComponentType;
  props: ModalPropsType;
  isOpen: boolean;
  id: number;
}>;

type ModalsDispatch = {
  open: <T extends ModalComponentType>(
    Component: T,
    props?: ComponentProps<T>,
  ) => number;
  close: (id: number) => void;
};

export const ModalsStateContext = createContext<ModalsState | null>(null);

export const ModalsDispatchContext = createContext<ModalsDispatch | null>(null);

export const useModalsStateContext = () => {
  const context = useContext(ModalsStateContext);

  if (!context) {
    throw new Error(
      'useModalsStateContext should be used within ModalsStateContext.Provider',
    );
  }

  return context;
};

export const useModalsDispatchContext = () => {
  const context = useContext(ModalsDispatchContext);

  if (!context) {
    throw new Error(
      'useModalsDispatchContext should be used within ModalsDispatchContext.Provider',
    );
  }

  return context;
};
