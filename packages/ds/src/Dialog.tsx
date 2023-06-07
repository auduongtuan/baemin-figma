import React, { createContext, useContext, useEffect } from "react";
import * as RDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { keyframes } from "styled-components";
import { IconButton } from "./Button";
import { Portal } from "@radix-ui/react-portal";

interface DialogProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  buttons?: React.ReactNode;
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
const DialogContent = ({ children }: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      css={`
        overflow: auto;
        flex-grow: 1;
        position: relative;
        padding: 16px;
      `}
    >
      {children}
    </div>
  );
};
const DialogFooter = ({ children }: React.ComponentPropsWithRef<"footer">) => {
  const { dialogContainerRef } = useDialogContext();
  return (
    <Portal container={dialogContainerRef?.current}>
      <footer
        css={`
          padding: 8px 16px;
          background: var(--figma-color-bg);
          border-top: 1px solid #eee;
          flex-shrink: 0;
          flex-grow: 0;
        `}
      >
        {children}
      </footer>
    </Portal>
  );
};
interface DialogContextType
  extends Pick<RDialog.DialogProps, "open" | "onOpenChange"> {
  holdEscape?: boolean;
  setHoldEscape?: React.Dispatch<React.SetStateAction<boolean>>;
  onEscapeKeyDown?: RDialog.DialogContentProps["onEscapeKeyDown"];
  setOnEscapeKeyDown?: React.Dispatch<
    React.SetStateAction<RDialog.DialogContentProps["onEscapeKeyDown"]>
  >;
  dialogContainerRef?: React.RefObject<HTMLDivElement>;
}
const DialogContext = createContext<DialogContextType>({});
export const useDialogContext = () => {
  return useContext(DialogContext);
};
const Dialog = ({ children, ...rest }: RDialog.DialogProps) => {
  const { open, onOpenChange } = rest;
  const [onEscapeKeyDown, setOnEscapeKeyDown] =
    React.useState<RDialog.DialogContentProps["onEscapeKeyDown"]>();
  const [holdEscape, setHoldEscape] = React.useState(false);
  const dialogContainerRef = React.useRef<HTMLDivElement>(null);
  return (
    <RDialog.Root {...rest}>
      <DialogContext.Provider
        value={{
          open,
          onOpenChange,
          onEscapeKeyDown,
          setOnEscapeKeyDown,
          holdEscape,
          setHoldEscape,
          dialogContainerRef,
        }}
      >
        {children}
      </DialogContext.Provider>
    </RDialog.Root>
  );
};
const DialogPanel = ({ title, children, buttons, ...rest }: DialogProps) => {
  const { holdEscape, dialogContainerRef } = useDialogContext();
  return (
    <RDialog.Portal>
      <RDialog.Overlay
        css={`
          background: rgba(0, 0, 0, 0.6);
          position: fixed;
          inset: 0;
          animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 40;
        `}
      />
      <RDialog.Content
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (holdEscape) {
            e.preventDefault();
          }
        }}
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
          z-index: 50;
          animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
          &:focus {
            outline: none;
          }
        `}
        ref={dialogContainerRef}
        {...rest}
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
                font-weight: var(--font-weight-medium);
                font-size: var(--font-size-large);
                flex-grow: 1;
                margin: 0;
              `}
            >
              {title}
            </RDialog.Title>
            <div className="flex items-center grow-0 shrink-0 gap-8">
              {buttons && buttons}
              <RDialog.Close asChild>
                <IconButton>
                  <Cross2Icon />
                </IconButton>
              </RDialog.Close>
            </div>
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

export default Object.assign(Dialog, {
  Panel: DialogPanel,
  Trigger: RDialog.Trigger,
  Content: DialogContent,
  Footer: DialogFooter,
});
