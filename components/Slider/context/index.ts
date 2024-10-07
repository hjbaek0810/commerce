'use client';

import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';

import type { SliderVariants } from '@components/Slider/slider.css';
import type { sizing } from '@styles/tokens';


export type SliderActionContextType = {
  updateShowIndex: Dispatch<SetStateAction<number>>;
};

export type SliderValueContextType = {
  showIndex: number;
  showDot?: boolean;
  autoPlay?: boolean;
  width?: keyof typeof sizing;
  height: keyof typeof sizing;
} & Required<Pick<SliderVariants, 'type'>>;

export const SliderActionContext =
  createContext<SliderActionContextType | null>(null);
export const SliderValueContext = createContext<SliderValueContextType | null>(
  null,
);

export const useSliderActionContext = () => {
  const context = useContext(SliderActionContext);

  if (!context) {
    throw new Error('This component must be used within Slider component');
  }

  return context;
};

export const useSliderValueContext = () => {
  const context = useContext(SliderValueContext);

  if (!context) {
    throw new Error('This component must be used within Slider component');
  }

  return context;
};
