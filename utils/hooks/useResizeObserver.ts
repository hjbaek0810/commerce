import { useEffect, useRef } from 'react';

type UseResizeObserverPropsType<T> = {
  callback: (element: T, entry: ResizeObserverEntry) => void;
  options?: ResizeObserverOptions;
};

const useResizeObserver = <T extends Element>({
  callback,
  options,
}: UseResizeObserverPropsType<T>) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => callback(element, entry));
    });
    resizeObserver.observe(element, options);

    return () => resizeObserver.disconnect();
  }, [callback, options]);

  return ref;
};

export default useResizeObserver;
