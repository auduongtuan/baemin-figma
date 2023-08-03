import React, { forwardRef, useEffect, ComponentPropsWithRef } from "react";
import clsx from "clsx";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { twMerge } from "tailwind-merge";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export interface TextBoxProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
  helpText?: React.ReactNode;
  labelClass?: string;
  afterLabel?: React.ReactNode;
}
export interface TextareaProps extends TextareaAutosizeProps {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
  helpText?: React.ReactNode;
  labelClass?: string;
  afterLabel?: React.ReactNode;
  afterTextarea?: React.ReactNode;
}

export const baseInputStyle = "base-input";

export const ErrorMessage = ({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"div">) => {
  return (
    <div
      {...props}
      className={clsx(
        "text-danger text-xsmall",
        twMerge("mt-8 flex", className)
      )}
    >
      <ExclamationTriangleIcon className="w-[12px] h-[12px] mt-3 mr-6 grow-0 shrink-0" />
      <p className="m-0">{children}</p>
    </div>
  );
};

export const HelpText = ({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"p">) => {
  return (
    <p
      {...props}
      className={twMerge("text-secondary text-xsmall mt-8", className)}
    >
      {children}
    </p>
  );
};

export const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(
  (
    {
      label,
      labelClass,
      afterLabel,
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
          <div className="flex items-center mb-8">
            <label
              htmlFor={id}
              className={clsx("block grow text-xsmall", labelClass)}
            >
              {label}
            </label>
            {afterLabel && <div className="grow-0 shrink-0">{afterLabel}</div>}
          </div>
        )}
        <input
          className={baseInputStyle}
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
        {helpText && <HelpText>{helpText}</HelpText>}
      </div>
    );
  }
);

// const StyledTextarea = styled(TextareaAutosize)<TextareaProps>`
//   ${BaseInputStyle};
//   resize: none;
// `;
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      labelClass,
      id,
      defaultValue = "",
      placeholder,
      className = "",
      errorText,
      helpText,
      afterLabel,
      afterTextarea,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={className && className}>
        {label && (
          <div className="flex items-center mb-8">
            <label
              htmlFor={id}
              className={clsx("block grow text-xsmall", labelClass)}
            >
              {label}
            </label>
            {afterLabel && <div className="grow-0 shrink-0">{afterLabel}</div>}
          </div>
        )}
        <div className="relative">
          <TextareaAutosize
            rows={1}
            id={id}
            placeholder={
              placeholder || (typeof label == "string" ? label : undefined)
            }
            defaultValue={defaultValue}
            className={twMerge(baseInputStyle, "textarea resize-none")}
            {...rest}
            aria-invalid={errorText ? true : false}
            ref={ref}
          ></TextareaAutosize>
          {afterTextarea && afterTextarea}
        </div>
        {errorText && <ErrorMessage>{errorText}</ErrorMessage>}
        {helpText && <HelpText>{helpText}</HelpText>}
      </div>
    );
  }
);
