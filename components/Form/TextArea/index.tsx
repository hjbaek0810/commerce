import type { ChangeEvent, TextareaHTMLAttributes } from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import clsx from 'clsx';

import * as inputCss from '@components/Form/Input/input.css';
import { sprinkles } from '@styles/sprinkles.css';
import useResizeObserver from '@utils/hooks/useResizeObserver';

import * as css from './textarea.css';
import { textareaHeightVar } from './textarea.css';

import type { InputVariants } from '@components/Form/Input/input.css';
import type { sizing } from '@styles/tokens';

export type TextAreaPropsType = TextareaHTMLAttributes<HTMLTextAreaElement> &
  InputVariants & {
    minHeight?: keyof typeof sizing;
    curLength?: number;
  };

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaPropsType>(
  (
    {
      error,
      hidden = false,
      minHeight = 'sizing-096',
      maxLength = 400,
      curLength,
      disabled,
      name,
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const [strLength, setStrLength] = useState<number>(0);

    useEffect(() => {
      setStrLength(curLength || 0);
    }, [curLength]);

    const handleTextAreaResize = useCallback((element: HTMLTextAreaElement) => {
      // 텍스트 입력 시 자동 높이 조절
      element.style.height = 'auto'; // height 초기화
      element.style.height = element.scrollHeight + 'px';
    }, []);

    const textAreaInputRef = useResizeObserver<HTMLTextAreaElement>({
      callback: handleTextAreaResize,
    });

    useImperativeHandle(
      ref,
      () => textAreaInputRef.current as HTMLTextAreaElement,
    );

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      handleTextAreaResize(e.target);
      onChange?.(e);
    };

    return (
      <div className={css.textareaWrapper}>
        <div className={inputCss.inputWrapper({ hidden })}>
          <textarea
            {...restProps}
            id={name}
            name={name}
            style={assignInlineVars({
              [textareaHeightVar]:
                textAreaInputRef.current?.scrollHeight + 'px',
            })}
            className={clsx(
              inputCss.input({ error }),
              css.textarea,
              sprinkles({
                minHeight,
              }),
            )}
            onChange={handleTextAreaChange}
            hidden={hidden}
            disabled={disabled}
            ref={textAreaInputRef}
          />
        </div>
        {!disabled && (
          <span className={css.strLengthWrapper}>
            {strLength} / {maxLength}
          </span>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
