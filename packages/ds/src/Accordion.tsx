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
        <RAccordion.Trigger className="flex items-start w-full gap-4 px-4 py-6 -mx-4 border-none rounded-lg bg-none hover:bg-hover group">
          <ChevronRightIcon
            width="12"
            height="12"
            className={`grow-0 shrink-0 transition-transform duration-100 group-hover:data-open:rotate-90 text-secondary`}
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
