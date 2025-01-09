'use client';
import {
  Children,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import {
  SliderActionContext,
  SliderValueContext,
  type SliderValueContextType,
  useSliderActionContext,
  useSliderValueContext,
} from '@components/Slider/context';
import { passPropsToSingleChild } from '@utils/render';

import * as css from './slider.css';
import { heightVar, itemIndexVar } from './slider.css';

type SliderRootPropsType = Pick<
  SliderValueContextType,
  'hideDot' | 'autoPlay' | 'type' | 'height'
>;

type SliderItemPropsType = {
  itemIndex?: number;
  className?: string;
};

type SliderClickableImagePropsType = {
  src: string;
  alt?: string;
  redirectTo?: string;
  sizes?: string;
  className?: string;
};

const SliderRoot = ({
  hideDot = false,
  autoPlay = true,
  height,
  type,
  children,
}: PropsWithChildren<SliderRootPropsType>) => {
  const [showIndex, setShowIndex] = useState<number>(0);

  const values = useMemo(
    () => ({
      showIndex,
      hideDot,
      autoPlay,
      type,
      height,
    }),
    [autoPlay, height, hideDot, showIndex, type],
  );

  const actions = useMemo(
    () => ({
      updateShowIndex: setShowIndex,
    }),
    [],
  );

  return (
    <SliderActionContext.Provider value={actions}>
      <SliderValueContext.Provider value={values}>
        <div
          style={assignInlineVars({
            [heightVar]: height,
          })}
          className={css.sliderRoot}
        >
          {children}
        </div>
      </SliderValueContext.Provider>
    </SliderActionContext.Provider>
  );
};

const SliderList = ({ children }: PropsWithChildren) => {
  const { updateShowIndex } = useSliderActionContext();
  const { showIndex, hideDot, autoPlay } = useSliderValueContext();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const modifiedChildren = Children.map(children, (child, index) =>
    passPropsToSingleChild(child, {
      itemIndex: index,
    }),
  );

  const totalSliderItem = modifiedChildren?.length ?? 0;

  const startAutoPlay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      updateShowIndex(prevIndex =>
        prevIndex === totalSliderItem - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);
  }, [totalSliderItem, updateShowIndex]);

  const handleDotClick = (index: number) => {
    updateShowIndex(index);

    if (autoPlay) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      startAutoPlay();
    }
  };

  useEffect(() => {
    if (!autoPlay) return;

    startAutoPlay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, startAutoPlay]);

  return (
    <>
      <ul
        style={assignInlineVars({
          [itemIndexVar]: String(showIndex),
        })}
        className={css.sliderList}
      >
        {modifiedChildren}
      </ul>

      {!hideDot && (
        <ul className={css.sliderDotList}>
          {Array.from({ length: totalSliderItem }, (_, index) => {
            return (
              <li key={`dot-${index}`}>
                <button
                  aria-label={`move slider-${index}`}
                  className={css.sliderDotItem({ active: index === showIndex })}
                  onClick={() => handleDotClick(index)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

const SliderItem = ({
  itemIndex,
  children,
  className,
}: PropsWithChildren<SliderItemPropsType>) => {
  const { showIndex, type } = useSliderValueContext();

  return (
    <li
      className={clsx(
        css.sliderItem({ active: itemIndex === showIndex, type }),
        className,
      )}
    >
      {children}
    </li>
  );
};

const SliderClickableImage = ({
  src,
  alt,
  redirectTo,
  sizes,
  className,
}: SliderClickableImagePropsType) => {
  return (
    <Link
      className={clsx(css.sliderLink, className)}
      href={redirectTo || '/'}
      prefetch={false}
    >
      <Image
        src={src}
        alt={alt || src}
        fill
        priority
        style={{
          objectFit: 'cover',
        }}
        sizes={sizes}
        quality={75}
      />
    </Link>
  );
};

const Slider = Object.assign(SliderRoot, {
  List: SliderList,
  Item: SliderItem,
  ClickableImage: SliderClickableImage,
});

export default Slider;
