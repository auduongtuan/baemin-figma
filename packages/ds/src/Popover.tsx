import React from "react";
import * as RPopover from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";
import { keyframes } from "styled-components";
import { IconButton } from "./Button";

interface PopoverContentProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  width?: string;
}
const overlayShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const contentShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const PopoverContent = ({ title, children, width, ...rest }: PopoverContentProps) => {
  console.log(width);
  return (
    <RPopover.Portal>

      <RPopover.Content
        sideOffset={2}
        collisionPadding={4}
        css={`
          background-color: white;
          border-radius: 6px;
          border: 1px solid var(--black1);
          box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
            hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
          padding: 12px;
          animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
          width: ${width};
          &:focus {
            outline: none;
          }
        `}
      >
        {title && (
          <header
            css={`
              display: flex;
              margin-bottom: 16px;
              align-items: center;
            `}
          >
            <div
              css={`
                font-size: var(--font-size-size-medium);
                font-weight: var(--font-weight-medium);
                flex-grow: 1;
                margin: 0;
              `}
            >
              {title}
            </div>
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
