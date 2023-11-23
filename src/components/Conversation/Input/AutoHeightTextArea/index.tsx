"use client";
import { forwardRef, useEffect, useRef } from "react";
import cn from "classnames";
import { conversationAIState } from "@/States/states";

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
      controlFocus,
      onKeyDown,
      onKeyUp,
    }: IProps,
    outerRef: any
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = outerRef || useRef<HTMLTextAreaElement>(null);

    const doFocus = () => {
      if (ref.current) {
        ref.current.setSelectionRange(value.length, value.length);
        ref.current.focus();
        return true;
      }
      return false;
    };

    const focus = () => {
      if (!doFocus()) {
        let hasFocus = false;
        const runId = setInterval(() => {
          hasFocus = doFocus();
          if (hasFocus) clearInterval(runId);
        }, 100);
      }
    };

    useEffect(() => {
      if (autoFocus) focus();
    }, []);
    useEffect(() => {
      if (controlFocus) focus();
    }, [controlFocus]);

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
          autoFocus={false}
          className={cn(
            className,
            "absolute inset-0 resize-none overflow-y-auto"
          )}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          value={value}
          // onFocus={() => {
          //   if (aiState.status === "idle") {
          //     aiState.status = "concentrating";
          //   }
          // }}
          // onBlur={() => {
          //   if (aiState.status === "concentrating") {
          //     aiState.status = "idle";
          //   }
          // }}
        />
      </div>
    );
  }
);

export default AutoHeightTextarea;
