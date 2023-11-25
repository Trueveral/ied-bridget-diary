"use client";

// CREDIT: borrowed from https://github.com/langgenius/webapp-conversation

import { forwardRef, useCallback, useEffect, useRef } from "react";
import cn from "classnames";

type IProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  autoFocus?: boolean;
  controlFocus?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

// eslint-disable-next-line react/display-name
const AutoHeightTextarea = forwardRef(
  (
    {
      value,
      onChange,
      placeholder,
      className,
      minHeight = 36,
      maxHeight = 96,
      autoFocus,
      onKeyDown,
      onKeyUp,
    }: IProps,
    outerRef: any
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = outerRef || useRef<HTMLTextAreaElement>(null);

    return (
      <div className="relative w-full">
        <div
          className={cn(
            className,
            "invisible whitespace-pre-wrap break-all overflow-y-auto"
          )}
          style={{ minHeight, maxHeight }}
        >
          {!value ? placeholder : value.replace(/\n$/, "\n ")}
        </div>
        <textarea
          ref={ref}
          autoFocus={autoFocus}
          className={cn(
            className,
            "absolute inset-0 resize-none overflow-y-auto"
          )}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          value={value}
        />
      </div>
    );
  }
);

export default AutoHeightTextarea;
