import React, { forwardRef } from "react";
import * as RCheckbox from "@radix-ui/react-checkbox";
import { uniqueId } from "lodash";
import { CheckIcon } from "@radix-ui/react-icons";

const Checkbox = forwardRef<HTMLButtonElement, RCheckbox.CheckboxProps & { label: React.ReactNode }>(({
  label,
  className,
  ...rest
}, forwardedRef) => {
  const id = uniqueId("Switch");
  return (
    <div
      className={`flex gap-8 items-center ${className}`}
    >
      <RCheckbox.Root
        id={id}
        css={`
          background-color: var(--white);
          border: 1px solid var(--black8-opaque);
          border-radius: 2px;
          content: "";
          display: block;
          height: 13px;
          transition: background-color 0 0.2s;
          width: 13px;
          line-height: 0;
          padding: 0;
          margin: 0;
          &[data-state="checked"] {
            background-color: var(--figma-color-bg-brand);
            border: 1px solid var(--figma-color-bg-brand);
            color: var(--figma-color-icon-onbrand);
          }
        `}
        ref={forwardedRef}
        {...rest}
      >
        <RCheckbox.Indicator className="p-0">
          <CheckIcon width={11} height={11} />
        </RCheckbox.Indicator>
      </RCheckbox.Root>
      <label
        htmlFor={id}
        css={`
          align-items: center;
          color: var(--black8);
          display: flex;
          height: 100%;
          line-height: var(--font-line-height);
          user-select: none;
        `}
      >
        {label}
      </label>
     
    </div>
  );
});

export default Checkbox;
