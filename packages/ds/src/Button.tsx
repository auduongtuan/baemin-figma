import React, { useState, ComponentType } from "react";
import { forwardRef, useEffect } from "react";
import WorkingIcon from "./WorkingIcon";
import { twMerge } from "tailwind-merge";
interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "tertiary";
  destructive?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      type = "button",
      variant = "primary",
      destructive = false,
      loading = false,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        className={twMerge(
          `flex items-center rounded-md text-onbrand shrink-0 font-sans text-xsmall leading-[16px] h-32 font-normal px-16 no-underline border-2 border-transparent select-none [&>svg]:mr-4 focus:outline-none`,
          variant == "primary" &&
            `bg-brand text-onbrand focus:border-focus active:border-focus`,
          variant == "primary" && destructive && `bg-danger`,
          variant == "secondary" &&
            `bg-transparent border-action color-action px-17 focus:border-brand active:border-brand disabled:border-disabed disabled:color-disabled`,
          variant == "secondary" && destructive && `border-danger text-danger`,
          className
        )}
        type={type}
        {...rest}
        ref={ref}
      >
        {loading && <WorkingIcon />}
        {children}
      </button>
    );
  }
);

export default Button;
