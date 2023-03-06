import React, { useState, ComponentType, Ref, forwardRef, useEffect } from "react";
import styled from "styled-components";

export interface TextBoxProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: string
}
export interface TextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {}

const BaseInput = styled.input<TextBoxProps>`
  font-size: var(--font-size-xsmall);
  font-weight: var(--font-weight-normal);
  letter-spacing: var(--font-letter-spacing-neg-xsmall);
  line-height: var(--line-height);
  position: relative;
  display: flex;
  overflow: visible;
  align-items: center;
  width: 100%;
  height: 30px;
  margin: 1px 0 1px 0;
  padding: var(--size-xxsmall) var(--size-xxxsmall) var(--size-xxsmall)
    var(--size-xxsmall);
  color: var(--black8);
  border: 1px solid var(--black1);
  /* border-color: var(--black1); */
  border-radius: var(--border-radius-small);
  outline: none;
  background-color: var(--white);

  &:hover,
  &:placeholder-shown:hover {
    color: var(--black8);
    border: 1px solid var(--black1);
    background-image: none;
  }
  &::selection {
    color: var(--black);
    background-color: var(--blue3);
  }
  &::placeholder {
    color: var(--black3);
    border: 1px solid transparent;
  }
  &:placeholder-shown {
    border: 1px solid var(--black1);
  }
  &:focus:placeholder-shown {
    border: 1px solid var(--blue);
    outline: 1px solid var(--blue);
    outline-offset: -2px;
  }
  &:disabled:hover {
    border: 1px solid transparent;
  }
  &:active,
  &:focus {
    color: var(--black);
    border: 1px solid var(--blue);
    outline: 1px solid var(--blue);
    outline-offset: -2px;
  }
  &:disabled {
    position: relative;
    color: var(--black3);
    user-select: none;
  }
  &:disabled:active {
    outline: none;
  }
  .icon {
    position: absolute;
    top: 0px;
    left: 0;
    width: var(--size-medium);
    height: var(--size-medium);
    z-index: 1;
    opacity: 0.3;
  }
`;
export const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(
  (
    {
      label,
      id,
      defaultValue = "",
      value,
      type = "text",
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <div className={className && className}>
        <label htmlFor={id} className="mb-8">
          {label}
        </label>
        <BaseInput
          id={id}
          placeholder={label}
          defaultValue={defaultValue}
          value={value}
          type={type}
          {...rest}
          ref={ref}
        />
      </div>
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, defaultValue = "", className = "", ...rest }, ref) => {
    return (
      <div className={className && className}>
        <label htmlFor={id} className="mb-8">
          {label}
        </label>
        <textarea
          id={id}
          placeholder={label}
          defaultValue={defaultValue}
          className="textarea"
          ref={ref}
          {...rest}
        ></textarea>{" "}
        :
      </div>
    );
  }
);
