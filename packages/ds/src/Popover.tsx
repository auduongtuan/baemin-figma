import React from "react";
import * as RPopover from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";
import { IconButton } from "./IconButton";
import { twMerge } from "tailwind-merge";

interface PopoverContentProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  width?: string;
}

const PopoverContent = ({
  title,
  children,
  width,
  ...rest
}: PopoverContentProps) => {
  return (
    <RPopover.Portal>
      <RPopover.Content
        sideOffset={2}
        collisionPadding={4}
        className={twMerge(
          `bg-default rounded-md border border-divider shadow-modal p-12 focus:outline-none `
        )}
        style={{
          width: width,
        }}
      >
        {title && (
          <header className="flex items-center mb-16">
            <div className="m-0 font-medium text-large grow">{title}</div>
            <RPopover.Close asChild>
              <IconButton>
                <Cross2Icon />
              </IconButton>
            </RPopover.Close>
          </header>
        )}
        {/* <RDialog.Description className="DialogDescription">
          Make changes to your profile here. Click save when you're done.
        </RDialog.Description> */}
        {children}
      </RPopover.Content>
    </RPopover.Portal>
  );
};

export default Object.assign(RPopover.Root, {
  Content: PopoverContent,
  Trigger: RPopover.Trigger,
});
