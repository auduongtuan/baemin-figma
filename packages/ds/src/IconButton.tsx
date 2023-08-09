import React from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
interface IconButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  icon?: string;
  type?: "button" | "submit" | "reset";
  pressed?: boolean;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon, className = "", type = "button", children, pressed, ...rest },
    forwardedRef
  ) => {
    return (
      <button
        ref={forwardedRef}
        type={type}
        className={twMerge(
          "text-action bg-transparent p-4 -m-4 hover:bg-hover focus:outline-brand focus:outline-2",
          pressed && "text-brand bg-hover",
          className
        )}
        {...rest}
      >
        {children ? children : <span className={`icon icon--${icon}`}></span>}
      </button>
    );
  }
);
export default IconButton;
