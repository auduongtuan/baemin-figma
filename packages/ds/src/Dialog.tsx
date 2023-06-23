import React, {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
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
      className="relative p-16 overflow-auto grow"
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
const Dialog = ({
  children,
  open,
  onOpenChange,
  ...rest
}: RDialog.DialogProps) => {
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
  console.log(open);
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange} {...rest}>
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
  // useEffect(() => {
  //   if (dialogContainerRef.current) {
  //     setContextValue({
  //       dialogContainerEl: dialogContainerRef.current,
  //     });
  //   }
  // }, [dialogContainerRef.current]);
  const setDialogRef = useCallback((node: HTMLDivElement) => {
    setContextValue({
      dialogContainerEl: node,
    });
  }, []);
  return (
    <RDialog.Portal>
      <RDialog.Overlay
        forceMount
        asChild
        // css={`
        //   background: rgba(0, 0, 0, 0.6);
        //   position: fixed;
        //   inset: 0;
        //   animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
        //   z-index: 40;
        // `}
      >
        <Transition
          show={open}
          appear={true}
          className="fixed inset-0 z-40 transition-all ease-in duration-400 bg-black/60"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        ></Transition>
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
        forceMount
        // asChild
      >
        <div
          className={
            " z-50 fixed w-full h-full top-0 left-0 flex justify-center items-center"
          }
        >
          <Transition
            show={open}
            appear={true}
            className="transition-all duration-400 bg-white rounded-md overflow-hidden  shadow-xl w-[90vw] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] flex flex-col focus:outline-none"
            enterFrom="opacity-0 translate-y-64"
            enterTo="opacity-100 translate-y-0"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-0 translate-y-64"
            ref={setDialogRef}
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
          </Transition>
        </div>
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
