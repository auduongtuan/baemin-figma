import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
const Tooltip = ({ children, content }) => {
  console.log(content);
  return (
      <RadixTooltip.Root
        delayDuration={50}
      >
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            css={`
              border-radius: 2px;
              padding: 4px 8px;
              font-size var(----font-size-xsmall);
              line-height: 1;
              color: var(--figma-color-text-onbrand);
              background-color: var(--figma-color-bg-brand);
              user-select: none;
              /* animation-duration: 400ms;
              animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
              will-change: transform, opacity; */
            `}
            sideOffset={2}
          >
            {content}
            {/* <Tooltip.Arrow className="TooltipArrow" /> */}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
  );
};

export default Tooltip;
