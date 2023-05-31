import React, { ComponentType } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
const Tooltip = ({
  children,
  content,
  contentProps,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  contentProps?: RadixTooltip.TooltipContentProps;
}) => {
  return (
    <RadixTooltip.Root delayDuration={50}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          css={`
              border-radius: 2px;
              padding: 6px 8px;
              font-size var(----font-size-xsmall);
              line-height: 1.2;
              color: var(--figma-color-text-onbrand);
              background-color: var(--black8);
              user-select: none;
              z-index: 60;
              /* animation-duration: 400ms;
              animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
              will-change: transform, opacity; */
            `}
          sideOffset={4}
          collisionPadding={4}
          {...contentProps}
        >
          {content}
          {/* <Tooltip.Arrow className="TooltipArrow" /> */}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
};

export default Object.assign(Tooltip, { Providier: RadixTooltip.Provider });
