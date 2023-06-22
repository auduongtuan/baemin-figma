import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
const Tag = forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ children, className, ...rest }, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className={twMerge(
          "text-component text-[7.5px] border-1 border-component px-2 py-1 rounded-sm",
          className
        )}
        {...rest}
      >
        {children}
      </span>
    );
  }
);
export default Tag;
