import React, { forwardRef } from "react";
import * as RCollapsible from "@radix-ui/react-collapsible";
import { ChevronRightIcon } from "@radix-ui/react-icons";

// type AccordionProps = React.ComponentPropsWithoutRef<typeof RCollapsible.Root>;
// const MAccordion = forwardRef<
//   React.ElementRef<typeof RCollapsible.Root>,
//   AccordionProps
// >(({ children, ...rest }, ref) => {
//   return <RCollapsible.Root {...rest} ref={ref}>{children}</RCollapsible.Root>;
// });

const CollapsibleTrigger = ({ title, children, ...rest }: RCollapsible.CollapsibleTriggerProps) => {
  return (
        <RCollapsible.Trigger
          css={`
            border: none;
            background: none;
            display: flex;
            width: 100%;
            align-items: flex-start;
            gap: 4px;
            padding: 6px 4px;
            margin: 0 -4px;
            border-radius: var(--border-radius-large);
            &:hover {
              background: var(--figma-color-bg-hover);
            }
            .chevron-icon {
              transform-style: preserve-3d;
              transition: transform 100ms;
            }
            &[data-state="open"] .chevron-icon {
              transform: rotate(90deg);
            }
          `}
          {...rest}
        >
          <ChevronRightIcon
            width="12"
            height="12"
            className="flex-grow-0 flex-shrink-0 chevron-icon mt-2"
            css={`
              color: var(--figma-color-icon-secondary);
            `}
            aria-hidden
          />
          <span className="flex-grow-1 text-left">{children}</span>
        </RCollapsible.Trigger>
  );
};

export default Object.assign(RCollapsible.Root, { Trigger: CollapsibleTrigger, Content: RCollapsible.CollapsibleContent });
