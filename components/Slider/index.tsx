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

// TODO: dot, arrow button type
type SliderRootPropsType = Pick<
  SliderValueContextType,
  'showDot' | 'autoPlay' | 'type' | 'height'
>;

type SliderItemPropsType = {
  itemIndex?: number;
};

type SliderClickableImagePropsType = {
  src: string;
  alt?: string;
  redirectTo: string;
};

const SliderRoot = ({
  showDot = true,
  autoPlay = true,
  height,
  type,
  children,
}: PropsWithChildren<SliderRootPropsType>) => {
  const [showIndex, setShowIndex] = useState<number>(0);

  const values = useMemo(
    () => ({
      showIndex,
      showDot,
      autoPlay,
      type,
      height,
    }),
    [autoPlay, showDot, showIndex, type],
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
  const { showIndex, showDot, autoPlay } = useSliderValueContext();
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

      {showDot && (
        <ul className={css.sliderDotList}>
          {Array.from({ length: totalSliderItem }, (_, index) => {
            return (
              <li key={`dot-${index}`}>
                <button
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
}: PropsWithChildren<SliderItemPropsType>) => {
  const { showIndex, type } = useSliderValueContext();

  return (
    <li className={css.sliderItem({ active: itemIndex === showIndex, type })}>
      {children}
    </li>
  );
};

const SliderClickableImage = ({
  src,
  alt,
  redirectTo,
}: SliderClickableImagePropsType) => {
  return (
    <Link className={css.sliderLink} href={redirectTo}>
      <Image
        src={src}
        alt={alt || src}
        fill
        height={0}
        priority
        style={{
          objectFit: 'cover',
        }}
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
