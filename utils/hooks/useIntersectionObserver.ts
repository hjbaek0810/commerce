import { useCallback, useEffect, useState } from 'react';

import type { InfiniteQueryObserverResult } from '@tanstack/react-query';

type UseIntersectionObserverProps = {
  threshold?: number; //  대상 요소의 몇 %가 화면에 나타나야 하는지를 설정하는 값 0 ~ 1
  hasNextPage: boolean | undefined;
  fetchNextPage: () => Promise<InfiniteQueryObserverResult>;
};

const useIntersectionObserver = ({
  threshold = 0, // 0: 요소의 일부만 화면에 보이면 트리거
  hasNextPage,
  fetchNextPage,
}: UseIntersectionObserverProps) => {
  const [target, setTarget] = useState<HTMLDivElement | null | undefined>(null);

  const observerCallback: IntersectionObserverCallback = useCallback(
    entries => {
      entries.forEach(entry => {
        // 요소가 화면에 보이면서, 다음 페이지가 존재할 경우 fetchNextPage 호출
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
    },
    [fetchNextPage, hasNextPage],
  );

  useEffect(() => {
    if (!target) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
    });

    observer.observe(target);

    return () => observer.unobserve(target);
  }, [observerCallback, threshold, target]);

  return { setTarget };
};

export default useIntersectionObserver;
