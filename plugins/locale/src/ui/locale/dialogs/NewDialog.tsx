import React from "react";
import {
  closeCurrentDialog,
  setCurrentDialog,
} from "../../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Dialog } from "ds";
import LocaleItemForm from "../form/LocaleItemForm";
const NewDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  return (
    <Dialog
      open={currentDialog.type == "NEW"}
      onOpenChange={(open) => {
        if (!open) dispatch(closeCurrentDialog());
      }}
    >
      <Dialog.Panel title="Add new item">
        <LocaleItemForm key="new-item-dialog" showTitle={false} />
      </Dialog.Panel>
    </Dialog>
  );
};
export default NewDialog;
