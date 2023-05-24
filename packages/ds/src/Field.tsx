import React, {
  useState,
  ComponentType,
  Ref,
  forwardRef,
  useEffect,
} from "react";
import styled, { css } from "styled-components";
import { renderToString } from "react-dom/server";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

export interface TextBoxProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
  helpText?: React.ReactNode;
}
export interface TextareaProps extends TextareaAutosizeProps {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
  helpText?: React.ReactNode;
}

export const BaseInputStyle = css`
  font-size: var(--font-size-xsmall);
  font-weight: var(--font-weight-normal);
  letter-spacing: var(--font-letter-spacing-neg-xsmall);
  line-height: var(--line-height);
  position: relative;
  display: flex;
  overflow: visible;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 7px 8px;
  color: var(--black8);
  border: 1px solid var(--black1);
  /* border-color: var(--black1); */
  border-radius: var(--border-radius-small);
  outline: none;
  background-color: var(--white);
  --ring-color: var(--blue);
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
    /* border: 1px solid transparent; */
  }
  &:placeholder-shown {
    border: 1px solid var(--black1);
  }
  &:focus:placeholder-shown {
    border: 1px solid var(--ring-color);
    outline: 1px solid var(--ring-color);
    outline-offset: -2px;
  }
  &:disabled:hover {
    border: 1px solid transparent;
  }
  &:active,
  &:focus {
    color: var(--black);
    border: 1px solid var(--ring-color);
    outline: 1px solid var(--ring-color);
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
  &[aria-invalid="true"] {
    --ring-color: var(--figma-color-border-danger);
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
const StyledTextBox = styled.input<TextBoxProps>`
  ${BaseInputStyle};
`;
export const ErrorMessage = styled.p`
  color: var(--figma-color-text-danger);
  font-size: var(--font-size-xsmall);
  margin-top: 8px;
`;
export const HelpText = styled.p`
  color: var(--figma-color-text-secondary);
  font-size: var(--font-size-xsmall);
  margin-top: 8px;
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
      placeholder,
      errorText,
      helpText,
      ...rest
    },
    ref
  ) => {
    useEffect(() => {}, []);
    return (
      <div className={className && className}>
        {label && (
          <label htmlFor={id} className="mb-8 text-xsmall">
            {label}
          </label>
        )}
        <StyledTextBox
          id={id}
          placeholder={
            placeholder || (typeof label == "string" ? label : undefined)
          }
          defaultValue={defaultValue}
          value={value}
          type={type}
          {...rest}
          ref={ref}
          aria-invalid={errorText ? true : false}
        />
        {errorText && <ErrorMessage>{errorText}</ErrorMessage>}
        {helpText && (
          <p
            css={`
              color: var(--figma-color-text-secondary);
              font-size: var(--font-size-xsmall);
              margin-top: 8px;
            `}
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

const StyledTextarea = styled(TextareaAutosize)<TextareaProps>`
  ${BaseInputStyle};
  resize: none;
`;
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      id,
      defaultValue = "",
      placeholder,
      className = "",
      helpText,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={className && className}>
        {label && (
          <label htmlFor={id} className="mb-8 text-xsmall">
            {label}
          </label>
        )}
        <StyledTextarea
          id={id}
          placeholder={
            placeholder || (typeof label == "string" ? label : undefined)
          }
          defaultValue={defaultValue}
          className="textarea"
          {...rest}
          ref={ref}
        ></StyledTextarea>
        {helpText && <HelpText>{helpText}</HelpText>}
      </div>
    );
  }
);
