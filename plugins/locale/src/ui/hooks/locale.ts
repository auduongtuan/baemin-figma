import {
  DialogState,
  closeCurrentDialog,
  setCurrentDialog,
} from "@ui/state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDialogContext } from "ds";
import { useEffect } from "react";

export function useLocaleSelection() {
  return useAppSelector((state) => state.locale.localeSelection);
}
export function useLocaleItems() {
  return useAppSelector((state) => state.locale.localeItems);
}
export function useLocaleLibraries() {
  return useAppSelector((state) => state.locale.localeLibraries);
}
export function useConfigs() {
  return useAppSelector((state) => state.localeApp.configs);
}
export function useLanguages() {
  return useAppSelector((state) => state.localeApp.configs.languages);
}
export function useDialog(checkOpen: (state: DialogState) => boolean = null) {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  const context = useDialogContext();
  return {
    ...(checkOpen
      ? {
          dialogProps: {
            open: checkOpen(currentDialog),
            onOpenChange: (open: boolean) => {
              if (!open) {
                dispatch(closeCurrentDialog());
              }
            },
          },
        }
      : {}),
    /**
     * Redux state of current dialog
     */
    state: currentDialog,
    /**
     * Inner dialog context
     */
    context: context,
    openDialog: (state: DialogState) => {
      dispatch(
        setCurrentDialog({
          ...state,
        })
      );
    },
    closeDialog: (callback: Function = null) => {
      if (context && context.closeDialog) {
        context.closeDialog(callback);
      }
    },
  };
}
export function useDefaultLanguage() {
  return useAppSelector((state) => state.localeApp.configs.defaultLanguage);
}
export function useAltLanguage() {
  return useAppSelector((state) => state.localeApp.configs.altLanguage);
}
