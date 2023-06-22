import React, { createContext, useContext, useEffect } from "react";
import * as RDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { keyframes } from "styled-components";
import { IconButton } from "./IconButton";
import { Portal } from "@radix-ui/react-portal";
import { Transition } from "@headlessui/react";
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
  const { dialogContainerEl } = useDialogContext();
  return (
    <Portal container={dialogContainerEl}>
      <footer className="px-16 py-8 bg-white border-t border-divider shrink-0 grow-0">
        {children}
      </footer>
    </Portal>
  );
};
interface DialogContextValue {
  holdEscape?: boolean;
  onEscapeKeyDown?: RDialog.DialogContentProps["onEscapeKeyDown"];
  // dialogContainerRef?: React.RefObject<HTMLDivElement | null>;
  dialogContainerEl?: HTMLDivElement | null;
  open?: boolean;
  onOpenChange?: RDialog.DialogProps["onOpenChange"];
}
interface DialogContextType
  extends Pick<RDialog.DialogProps, "open" | "onOpenChange">,
    DialogContextValue {
  setContextValue?: React.Dispatch<React.SetStateAction<DialogContextValue>>;
  // setOnEscapeKeyDown?: React.Dispatch<
  //   React.SetStateAction<RDialog.DialogContentProps["onEscapeKeyDown"]>
  // >;
}
const DialogContext = createContext<DialogContextType>({});
export const useDialogContext = () => {
  return useContext(DialogContext);
};
const Dialog = ({ children, ...rest }: RDialog.DialogProps) => {
  const { open, onOpenChange } = rest;
  const [contextValue, setContextValue] = React.useReducer(
    (state: DialogContextValue, action: Partial<DialogContextValue>) => {
      return {
        ...state,
        ...action,
      };
    },
    {
      onEscapeKeyDown: undefined,
      holdEscape: false,
      dialogContainerEl: null,
      open,
      onOpenChange,
    }
  );
  return (
    <RDialog.Root {...rest}>
      <DialogContext.Provider
        value={{
          ...contextValue,
          setContextValue,
        }}
      >
        {children}
      </DialogContext.Provider>
    </RDialog.Root>
  );
};
const DialogPanel = ({ title, children, buttons, ...rest }: DialogProps) => {
  const { open, holdEscape, dialogContainerEl, setContextValue } =
    useDialogContext();
  const dialogContainerRef = React.useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (dialogContainerRef.current) {
      setContextValue({
        dialogContainerEl: dialogContainerRef.current,
      });
    }
  }, [dialogContainerRef.current]);
  return (
    <RDialog.Portal>
      <Transition show={open}>
        <RDialog.Overlay
          asChild
          // css={`
          //   background: rgba(0, 0, 0, 0.6);
          //   position: fixed;
          //   inset: 0;
          //   animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
          //   z-index: 40;
          // `}
        >
          <Transition.Child
            className="fixed inset-0 z-40 transition-opacity duration-400 bg-black/60"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          ></Transition.Child>
        </RDialog.Overlay>
        <RDialog.Content
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (holdEscape) {
              e.preventDefault();
            }
          }}
          {...rest}
          asChild
        >
          <Transition.Child
            className="transition-all duration-300 bg-white rounded-md overflow-hidden shadow-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] flex flex-col z-50 focus:outline-none"
            // css={`
            //   background-color: var(--figma-color-bg);
            //   border-radius: 6px;
            //   overflow: hidden;
            //   /* box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
            //     hsl(206 22% 7% / 20%) 0px 10px 20px -15px; */
            //   position: fixed;
            //   top: 50%;
            //   left: 50%;
            //   transform: translate(-50%, -50%);
            //   width: 90vw;
            //   max-width: calc(100vw - 48px);
            //   max-height: calc(100vh - 48px);
            //   display: flex;
            //   flex-direction: column;
            //   z-index: 50;
            //   animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
            //   &:focus {
            //     outline: none;
            //   }
            // `}
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            ref={dialogContainerRef}
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
                <div className="flex items-center gap-8 grow-0 shrink-0">
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
          </Transition.Child>
        </RDialog.Content>
      </Transition>
    </RDialog.Portal>
  );
};

export default Object.assign(Dialog, {
  Panel: DialogPanel,
  Trigger: RDialog.Trigger,
  Content: DialogContent,
  Footer: DialogFooter,
});
