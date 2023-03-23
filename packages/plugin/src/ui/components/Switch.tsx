import React from "react";
import * as RSwitch from "@radix-ui/react-switch";
import { uniqueId } from "lodash";

const Switch = ({
  label,
  ...rest
}: RSwitch.SwitchProps & { label: React.ReactNode }) => {
  const id = uniqueId("Switch");
  return (
    <div
      className="flex gap-8 align-items-center"
    >
      <RSwitch.Root
        id={id}
        css={`
          background-color: var(--white);
          border: 1px solid var(--black8-opaque);
          border-radius: 6px;
          content: "";
          display: block;
          height: 12px;
          transition: background-color 0 0.2s;
          width: 24px;
          &[data-state="checked"] {
            background-color: var(--figma-color-bg-brand);
            border: 1px solid var(--figma-color-bg-brand);
          }
        `}
        {...rest}
      >
        <RSwitch.Thumb
          css={`
            background-color: var(--white);
            border: 1px solid var(--black8-opaque);
            border-radius: 50%;
            content: "";
            display: block;
            transition: transform 0.2s;
            width: 12px;
            height: 12px;
            margin: -1px;
            &[data-state="checked"] {
              transform: translateX(12px);
              border: 1px solid var(--figma-color-bg-brand);
            }
          `}
        />
      </RSwitch.Root>
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
};

export default Switch;
