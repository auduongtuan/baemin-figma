import React, { forwardRef } from "react";
import * as RCollapsible from "@radix-ui/react-collapsible";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";

// type AccordionProps = React.ComponentPropsWithoutRef<typeof RCollapsible.Root>;
// const MAccordion = forwardRef<
//   React.ElementRef<typeof RCollapsible.Root>,
//   AccordionProps
// >(({ children, ...rest }, ref) => {
//   return <RCollapsible.Root {...rest} ref={ref}>{children}</RCollapsible.Root>;
// });

const CollapsibleTrigger = ({
  title,
  children,
  className,
  ...rest
}: RCollapsible.CollapsibleTriggerProps) => {
  return (
    <RCollapsible.Trigger
      className={twMerge(
        "flex items-start w-full gap-4 px-4 py-6 -mx-4 border-none rounded-lg bg-none hover:bg-hover group",
        className
      )}
      // css={`
      //   border: none;
      //   background: none;
      //   display: flex;
      //   width: 100%;
      //   align-items: flex-start;
      //   gap: 4px;
      //   padding: 6px 4px;
      //   margin: 0 -4px;
      //   border-radius: var(--border-radius-large);
      //   &:hover {
      //     background: var(--figma-color-bg-hover);
      //   }
      //   .chevron-icon {
      //     transform-style: preserve-3d;
      //     transition: transform 100ms;
      //   }
      //   &[data-state="open"] .chevron-icon {
      //     transform: rotate(90deg);
      //   }
      // `}
      {...rest}
    >
      <ChevronRightIcon
        width="12"
        height="12"
        className="mt-2 transition-transform duration-100 grow-0 shrink-0 chevron-icon text-secondary transform-style-preserve-3d group-data-open:rotate-90"
        aria-hidden
      />
      <span className="text-left grow">{children}</span>
    </RCollapsible.Trigger>
  );
};

export default Object.assign(RCollapsible.Root, {
  Trigger: CollapsibleTrigger,
  Content: RCollapsible.CollapsibleContent,
});
