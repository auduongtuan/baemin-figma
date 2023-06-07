import React, { forwardRef } from "react";
import * as RAccordion from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "@radix-ui/react-icons";

type AccordionProps = React.ComponentPropsWithoutRef<typeof RAccordion.Root>;
const MAccordion = forwardRef<
  React.ElementRef<typeof RAccordion.Root>,
  AccordionProps
>(({ children, ...rest }, ref) => {
  return (
    <RAccordion.Root {...rest} ref={ref}>
      {children}
    </RAccordion.Root>
  );
});

const MAccordionItem = ({ title, children }) => {
  return (
    <RAccordion.Item value="item-1">
      <RAccordion.Header>
        <RAccordion.Trigger
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
              transition: transform 100ms;
            }
            &[data-state="open"] .chevron-icon {
              transform: rotate(90deg);
            }
          `}
        >
          <ChevronRightIcon
            width="12"
            height="12"
            className="grow-0 shrink-0 chevron-icon"
            css={`
              color: var(--figma-color-icon-secondary);
            `}
            aria-hidden
          />
          <div className="grow">{title}</div>
        </RAccordion.Trigger>
      </RAccordion.Header>
      <RAccordion.Content
        css={`
          padding-left: 16px;
        `}
      >
        {children}
      </RAccordion.Content>
    </RAccordion.Item>
  );
};

export default Object.assign(MAccordion, { Item: MAccordionItem });
