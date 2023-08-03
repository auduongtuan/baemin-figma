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
      className="items-center color-action flex h-full leading-[16px] user-select-none"
    >
      {label}
    </label>
  );
  const switchRender = () => (
    <RSwitch.Root
      id={id}
      className={`bg-default border-action border rounded-md content-[""] block h-12 w-24 transition-colors duration-200 data-checked:bg-brand data-checked:border-brand focus:outline-brand focus:outline-2`}
      ref={forwardedRef}
      {...rest}
    >
      <RSwitch.Thumb
        className={`bg-default border border-action rounded-full content-[""] block w-12 h-12 transition-transform duration-200 -m-1 data-checked:translate-x-12 data-checked:border-brand`}
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
