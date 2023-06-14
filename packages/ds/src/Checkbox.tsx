import React, { forwardRef } from "react";
import * as RCheckbox from "@radix-ui/react-checkbox";
import { uniqueId } from "lodash-es";
import { CheckIcon, DashIcon } from "@radix-ui/react-icons";
import type { CheckedState } from "@radix-ui/react-checkbox";
export type { CheckedState };

export function getCheckedState<T>(checkboxItems: T[], allItems: T[]) {
  return checkboxItems.reduce<CheckedState>((acc, curr, i) => {
    const included = allItems.includes(curr);
    if (acc === undefined) {
      acc = included;
    }
    if (acc === false && included) {
      acc = "indeterminate";
    }
    if (acc === true && !included) {
      acc = "indeterminate";
    }
    return acc;
  }, undefined);
}
const Checkbox = forwardRef<
  HTMLButtonElement,
  RCheckbox.CheckboxProps & { label?: React.ReactNode; id?: string }
>(({ label, className, id, checked, ...rest }, forwardedRef) => {
  const checkboxId = id || uniqueId("Checkbox");
  return (
    <div className={`flex gap-8 items-center ${className}`}>
      <RCheckbox.Root
        id={checkboxId}
        checked={checked}
        className={`
        bg-white border border-secondary rounded-sm content-[""] h-13 w-13 transition-colors duration-200 line-height-0 padding-0 margin-0 block 
        data-checked:bg-brand data-checked:border-brand data-checked:text-icon-onbrand
        data-indeterminate:bg-brand data-indeterminate:border-brand data-indeterminate:text-icon-onbrand
        disabled:border-disabled
        `}
        ref={forwardedRef}
        {...rest}
      >
        <RCheckbox.Indicator className="p-0">
          {checked != "indeterminate" ? (
            <CheckIcon width={11} height={11} />
          ) : (
            <DashIcon width={11} height={11} />
          )}
        </RCheckbox.Indicator>
      </RCheckbox.Root>
      {label && (
        <label
          htmlFor={checkboxId}
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
      )}
    </div>
  );
});

export default Checkbox;
