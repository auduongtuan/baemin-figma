import React from "react";
import * as RDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { keyframes } from "styled-components";
import { IconButton } from "./Button";

interface DialogProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
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
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const DialogContent = ({ title, children, ...rest }: DialogProps) => {
  return (
    <RDialog.Portal>
      <RDialog.Overlay
        css={`
          background: rgba(0, 0, 0, 0.6);
          position: fixed;
          inset: 0;
          animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
        `}
      />
      <RDialog.Content
        css={`
          background-color: white;
          border-radius: 6px;
          box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
            hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw;
          max-width: 450px;
          max-height: 85vh;
          padding: 16px;
          animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
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
            <RDialog.Title
              css={`
                font-size: var(--font-size-large);
                flex-grow: 1;
                margin: 0;
              `}
            >
              {title}
            </RDialog.Title>
            <RDialog.Close asChild>
              <IconButton>
                <Cross2Icon />
              </IconButton>
            </RDialog.Close>
          </header>
        )}
        {/* <RDialog.Description className="DialogDescription">
          Make changes to your profile here. Click save when you're done.
        </RDialog.Description> */}
        {children}
       
      </RDialog.Content>
    </RDialog.Portal>
  );
};

export default Object.assign(RDialog.Root, {
  Content: DialogContent,
  Trigger: RDialog.Trigger,
});
