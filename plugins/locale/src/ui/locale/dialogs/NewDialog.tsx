import React from "react";
import { setCurrentDialog } from "../../state/localeAppSlice";
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
      open={currentDialog.type == "NEW" && currentDialog.opened}
      onOpenChange={(open) =>
        dispatch(setCurrentDialog({ type: "NEW", opened: open }))
      }
    >
      <Dialog.Panel title="Add new locale item" buttons={"di dien"}>
        <Dialog.Content>
          <LocaleItemForm
            key="new-item-dialog"
            showTitle={false}
            onDone={(item) => {
              if (typeof currentDialog.onDone == "function")
                currentDialog.onDone(item);
              dispatch(setCurrentDialog({ opened: false }));
            }}
          />
        </Dialog.Content>
      </Dialog.Panel>
    </Dialog>
  );
};
export default NewDialog;
