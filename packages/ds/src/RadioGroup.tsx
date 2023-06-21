import { CheckIcon } from "@radix-ui/react-icons";
import * as RRadioGroup from "@radix-ui/react-radio-group";
import { useId } from "react";
import { twMerge } from "tailwind-merge";
export interface RadioGroupProps extends RRadioGroup.RadioGroupProps {
  label?: string;
  options: { label: string; value: string }[];
}
const RadioGroup = ({
  label,
  options,
  className,
  ...rest
}: RadioGroupProps) => {
  const id = useId();
  return (
    <RRadioGroup.Root
      className={twMerge("flex flex-col gap-8", className)}
      aria-label={label}
      {...rest}
    >
      {options &&
        options.map(({ label, value }, i) => (
          <div className="flex items-center gap-8">
            <RRadioGroup.Item
              className={`bg-white border border-secondary rounded-full content-[""] h-13 w-13 transition-colors duration-200 line-height-0 padding-0 margin-0 block 
           data-checked:bg-brand data-checked:border-brand data-checked:text-icon-onbrand
           data-indeterminate:bg-brand data-indeterminate:border-brand data-indeterminate:text-icon-onbrand
           disabled:border-disabled`}
              value={value}
              id={id + i}
            >
              <RRadioGroup.Indicator className="invisible data-checked:visible">
                <CheckIcon className="text-white" width={11} height={11} />
              </RRadioGroup.Indicator>
            </RRadioGroup.Item>
            <label
              className="flex items-center h-full user-select-none text-action"
              htmlFor={id + i}
            >
              {label}
            </label>
          </div>
        ))}
    </RRadioGroup.Root>
  );
};

export default RadioGroup;
