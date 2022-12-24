import React, { useState, ComponentType } from "react";
import { forwardRef, useEffect } from "react";
import styled from "styled-components";

export interface TextBoxProps extends React.HTMLProps<HTMLInputElement> {}
export interface TextareaProps extends React.HTMLProps<HTMLTextAreaElement> {}

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
        <input
          id={id}
          placeholder={label}
          defaultValue={defaultValue}
          value={value}
          className="input__field show-border"
          type={type}
          ref={ref}
          {...rest}
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