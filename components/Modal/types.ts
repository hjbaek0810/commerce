export type CustomModalPropsType<T = unknown> = {
  onClose?: () => void;
  onSubmit?: (data?: T) => void | Promise<void>;
};
