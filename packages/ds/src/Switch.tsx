import React, { forwardRef } from "react";
import * as RSwitch from "@radix-ui/react-switch";
import { uniqueId } from "lodash-es";
import clsx from "clsx";
const Switch = forwardRef<
  HTMLButtonElement,
  RSwitch.SwitchProps & { label: React.ReactNode; align?: "left" | "right" }
>(({ label, align = "right", className, ...rest }, forwardedRef) => {
  const id = uniqueId("Switch");
  const labelRender = () => (
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
  );
  const switchRender = () => (
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
      ref={forwardedRef}
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
  );
  return (
    <div className={clsx("flex gap-8 items-center", className)}>
      {align == "right" ? (
        <>
          {labelRender()}
          {switchRender()}
        </>
      ) : (
        <>
          {switchRender()}
          {labelRender()}
        </>
      )}
    </div>
  );
});

export default Switch;
