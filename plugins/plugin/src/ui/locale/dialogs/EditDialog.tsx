import React from "react";
import { Dialog, IconButton, Tooltip } from "ds";
import { Pencil2Icon } from "@radix-ui/react-icons";
import LocaleItemForm from "../form/LocaleItemForm";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { LocaleItem, LocaleText } from "../../../lib/localeData";
const EditDialog = ({ item, text }: { item: LocaleItem; text: LocaleText }) => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  return (
    <Dialog
      open={
        currentDialog.type == "EDIT" &&
        currentDialog.opened &&
        currentDialog.key === text.id
      }
      onOpenChange={(open) => {
        if (open) {
          dispatch(
            setCurrentDialog({ opened: true, type: "EDIT", key: text.id })
          );
        } else {
          dispatch(
            setCurrentDialog({ opened: false, type: "EDIT", key: text.id })
          );
        }
      }}
    >
      <Tooltip content="Edit locale item">
        <Dialog.Trigger asChild>
          <IconButton>
            <Pencil2Icon></Pencil2Icon>
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Panel title="Edit locale item">
        <Dialog.Content>
          <LocaleItemForm
            key={item.key + "_edit"}
            item={item}
            showTitle={false}
            saveOnChange={false}
          />
        </Dialog.Content>
      </Dialog.Panel>
    </Dialog>
  );
};
export default EditDialog;
