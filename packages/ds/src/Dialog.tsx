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
const DialogContent = ({children}: React.ComponentPropsWithRef<"div">) => {
  return <div
    css={`
      overflow: auto;
      flex-grow: 1;
      position: relative;
      padding: 16px;
    `}
  >
    {children}
  </div>
}
const DialogFooter = ({children}: React.ComponentPropsWithRef<"footer">) => {
  return (
    <footer css={`
      padding: 8px 16px;
      background: var(--figma-color-bg);
      border-top: 1px solid #eee;
      flex-shrink: 0;
      flex-grow: 0;
    `}>
    {children}
    </footer>
  )
}
const DialogPanel = ({ title, children, ...rest }: DialogProps) => {
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
          background-color: var(--figma-color-bg);
          border-radius: 6px;
          overflow: hidden;
          box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
            hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw;
          max-width: calc(100vw - 48px);
          max-height: calc(100vh - 48px);
          display: flex;
          flex-direction: column;
          animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
          &:focus {
            outline: none;
          }
        `}
      >
        {title && (
          <header
            css={`
              flex-grow: 0;
              flex-shrink: 0;
              display: flex;
              padding: 12px 16px;
              align-items: center;
              border-bottom: 1px solid #eee;
              background: var(--figma-color-bg);
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
  Panel: DialogPanel,
  Trigger: RDialog.Trigger,
  Content: DialogContent,
  Footer: DialogFooter
});
