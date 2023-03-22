import React, { useState, ComponentType } from "react";
import { forwardRef, useEffect } from "react";
import WorkingIcon from "./WorkingIcon";
interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "tertiary";
  destructive?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}
interface IconButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  icon?: string;
  type?: "button" | "submit" | "reset";
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className = "", children, ...rest }, forwardedRef) => {
    return (
      <button
        ref={forwardedRef}
        css={`
          color: var(--black8-opaque);
          background: transparent;
          padding: 4px;
          margin: -4px;
          &:hover {
            background: var(--figma-color-bg-hover);
          }
        `}
        className={className}
        {...rest}
      >
        {children ? children : <span className={`icon icon--${icon}`}></span>}
      </button>
    );
  }
);
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
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
        css={`
          display: flex;
          align-items: center;
          border-radius: var(--border-radius-large);
          color: var(--white);
          flex-shrink: 0;
          font-family: var(--font-stack);
          font-size: var(--font-size-xsmall);
          font-weight: var(--font-weight-medium);
          letter-spacing: var(--font-letter-spacing-neg-small);
          line-height: var(--font-line-height);
          height: var(--size-medium);
          padding: 0 var(--size-xsmall) 0 var(--size-xsmall);
          text-decoration: none;
          outline: none;
          border: 2px solid transparent;
          user-select: none;

          svg {
            margin-right: var(--size-xxxsmall);
          }

          // primary
          &.button--primary {
            background-color: var(--blue);

            &:enabled:active,
            &:enabled:focus {
              border: 2px solid var(--black3);
            }
            &:disabled {
              background-color: var(--black3);
            }
          }
          &.button--primary-destructive {
            background-color: var(--red);

            &:enabled:active,
            &:enabled:focus {
              border: 2px solid var(--black3);
            }

            &:disabled {
              opacity: 0.3;
            }
          }

          // secondary
          &.button--secondary {
            background-color: var(--white);
            border: 1px solid var(--black8);
            color: var(--black8);
            padding: 0 calc(var(--size-xsmall) + 1px) 0
              calc(var(--size-xsmall) + 1px);
            letter-spacing: var(--font-letter-spacing-pos-small);

            &:enabled:active,
            &:enabled:focus {
              border: 2px solid var(--blue);
              padding: 0 var(--size-xsmall) 0 var(--size-xsmall);
            }
            &:disabled {
              border: 1px solid var(--black3);
              color: var(--black3);
            }
          }
          &.button--secondary-destructive {
            @extend .button--secondary;
            border-color: var(--red);
            color: var(--red);

            &:disabled {
              background-color: var(--white);
            }
            &:enabled:active,
            &:enabled:focus {
              border: 2px solid var(--red);
              padding: 0 var(--size-xsmall) 0 var(--size-xsmall);
            }
            &:disabled {
              border: 1px solid var(--red);
              background-color: var(--white);
              color: var(--red);
              opacity: 0.4;
            }
          }

          // tertiary
          &.button--tertiary {
            border: 1px solid transparent;
            color: var(--blue);
            background-color: transparent;
            padding: 0;
            font-weight: var(--font-weight-normal);
            letter-spacing: var(--font-letter-spacing-pos-small);
            cursor: pointer;

            &:enabled:focus {
              text-decoration: underline;
            }
            &:disabled {
              cursor: default;
              color: var(--black3);
            }
          }
          &.button--tertiary-destructive {
            @extend .button--tertiary;
            color: var(--red);

            &:enabled:focus {
              text-decoration: underline;
            }
            &:disabled {
              opacity: 0.4;
            }
          }
        `}
        className={`button--${variant}${
          destructive ? "-destructive" : ""
        } ${className}`}
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
