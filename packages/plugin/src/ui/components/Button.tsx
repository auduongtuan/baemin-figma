import React, { useState, ComponentType } from "react";
import { forwardRef, useEffect } from "react";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  destructive?: boolean;
  type?: "button" | "submit" | "reset";
}
interface IconButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon?: string;
  type?: "button" | "submit" | "reset";
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className = "", children, ...rest }, forwardedRef) => {
    return (
      <button ref={forwardedRef} className={`icon-button--small ${className}`} {...rest}>
        {children ? children : <span className={`icon icon--${icon}`}></span>}
      </button>
    );
  }
);
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", destructive = false, ...rest }) => {
    return (
      <button
        className={`button button--${variant}${
          destructive ? "-destructive" : ""
        } ${className}`}
        {...rest}
      ></button>
    );
  }
);

export default Button;