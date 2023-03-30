import React from "react";
import { setCurrentDialog } from "../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Dialog from "../components/Dialog";
import LocaleItemForm from "./form/LocaleItemForm";
const NewDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  return (
    <Dialog open={currentDialog.type == 'NEW' && currentDialog.opened} onOpenChange={(open) => dispatch(setCurrentDialog({type: 'NEW', opened: open}))}>
    <Dialog.Content title="Add new locale item">
      <LocaleItemForm showTitle={false} onDone={(item) => {
        dispatch(setCurrentDialog({opened: false}));
      }} />
    </Dialog.Content>
  </Dialog>
  )
}
export default NewDialog;