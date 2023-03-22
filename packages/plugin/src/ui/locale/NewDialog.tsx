import React from "react";
import AddLocaleItemForm from "./AddLocaleItemForm";
import { setNewDialogOpened } from "../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Dialog from "../components/Dialog";
const NewDialog = () => {
  const newDialogOpened = useAppSelector(
    (state) => state.localeApp.newDialogOpened
  );
  const dispatch = useAppDispatch();
  return (
    <Dialog open={newDialogOpened} onOpenChange={(open) => dispatch(setNewDialogOpened(open))}>
    <Dialog.Content title="Add new locale item">
      <AddLocaleItemForm showTitle={false} />
    </Dialog.Content>
  </Dialog>
  )
}
export default NewDialog;