import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import * as RDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { IconButton } from "./IconButton";
import { Portal } from "@radix-ui/react-portal";
import { Transition } from "@headlessui/react";
interface DialogPanelProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  buttons?: React.ReactNode;
}

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
  internalOpen?: boolean;
  onOpenChange?: RDialog.DialogProps["onOpenChange"];
  closeDialog?: (callback?: Function) => void;
  afterClose?: Function;
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
export interface DialogProps extends RDialog.DialogProps {
  afterClose?: Function;
}
const Dialog = ({
  children,
  open,
  onOpenChange,
  afterClose,
  ...rest
}: DialogProps) => {
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
      afterClose,
      closeDialog: (callback: Function = null) => {
        setContextValue({
          internalOpen: false,
        });
        if (callback) callback();
      },
    }
  );
  /**
   * Thank god
   * https://github.com/Andarist/react-textarea-autosize/issues/48
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setContextValue({
        internalOpen: open,
      });
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [open]);
  useEffect(() => {
    setContextValue({
      open,
      onOpenChange,
    });
  }, [open, onOpenChange]);
  return (
    <RDialog.Root
      open={contextValue.open}
      onOpenChange={(open) => {
        setContextValue({
          internalOpen: open,
        });
      }}
      {...rest}
    >
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
const DialogProvider = ({
  value,
  children,
}: {
  value: DialogContextType;
  children: React.ReactNode;
}) => {
  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};
const DialogPanel = ({
  title,
  children,
  buttons,
  ...rest
}: DialogPanelProps) => {
  const {
    open,
    internalOpen,
    onOpenChange,
    holdEscape,
    dialogContainerEl,
    setContextValue,
    afterClose,
  } = useDialogContext();

  const setDialogRef = useCallback((node: HTMLDivElement) => {
    setContextValue({
      dialogContainerEl: node,
    });
  }, []);
  return (
    <RDialog.Portal forceMount>
      {open && (
        <Transition
          show={internalOpen}
          afterLeave={() => {
            setTimeout(() => {
              onOpenChange(false);
              afterClose && afterClose();
            }, 0);
          }}
          unmount={false}
        >
          <RDialog.Overlay forceMount asChild>
            <Transition.Child
              className="fixed inset-0 z-40 transition-all ease-in duration-400 bg-black/60"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              unmount={false}
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
            forceMount
            // asChild
          >
            <div
              className={
                " z-50 fixed w-full h-full top-0 left-0 flex justify-center items-center"
              }
            >
              <Transition.Child
                className="transition-all duration-600 bg-white rounded-md overflow-hidden  shadow-xl w-[90vw] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] flex flex-col focus:outline-none"
                enterFrom="opacity-0 translate-y-40"
                enterTo="opacity-100 translate-y-0"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-40"
                unmount={false}
                ref={setDialogRef}
              >
                {title && (
                  <header className="flex items-center px-16 py-12 border-b grow-0 shrink-0 border-divider bg-default">
                    <RDialog.Title className="m-0 font-medium text-large grow">
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
                <div className="relative p-16 overflow-auto grow realtive">
                  {children}
                </div>
              </Transition.Child>
            </div>
          </RDialog.Content>
        </Transition>
      )}
    </RDialog.Portal>
  );
};

export default Object.assign(Dialog, {
  Panel: DialogPanel,
  Trigger: RDialog.Trigger,
  Footer: DialogFooter,
  Provider: DialogProvider,
});
