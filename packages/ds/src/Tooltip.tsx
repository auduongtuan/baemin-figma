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
    <RadixTooltip.Root delayDuration={30}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className="rounded-sm px-8 py-6 text-xsmall leading-tight text-onbrand bg-black/80 select-none max-w-[240px] z-[60] backdrop-blur-sm"
          sideOffset={4}
          collisionPadding={1}
          {...contentProps}
        >
          {content}
          <RadixTooltip.Arrow className="fill-black/80 backdrop-blur-sm" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
};

export default Object.assign(Tooltip, { Providier: RadixTooltip.Provider });
