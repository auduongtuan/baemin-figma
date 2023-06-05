import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, IconButton, Dialog, Tooltip, Tag } from "ds";
import { removeLocaleItem } from "../../state/localeSlice";
import { Crosshair2Icon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import { setCurrentDialog } from "../../state/localeAppSlice";
import LocaleItemForm from "../form/LocaleItemForm";
import { LocaleItem, findItemByKey } from "../../../lib";
import { getLibraryName } from "../../state/helpers";
import { useLocaleItems } from "../../hooks/locale";
const DeleteDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const items = useLocaleItems();
  const item = findItemByKey(currentDialog.key, items);
  const deleteLocaleItemHandler = useCallback(() => {
    if (item) {
      dispatch(removeLocaleItem(item));
      dispatch(setCurrentDialog({ opened: false }));
      runCommand("show_figma_notify", { message: "Item removed" });
    }
  }, [item]);
  const dispatch = useAppDispatch();
  return item ? (
    <Dialog
      open={currentDialog.opened && currentDialog.type == "DELETE"}
      onOpenChange={(open) => {
        dispatch(
          setCurrentDialog({
            type: "DELETE",
            key: item.key,
            opened: open,
          })
        );
      }}
    >
      <Dialog.Panel title="Delete locale item">
        <Dialog.Content>
          Are you sure you want to delete <strong>{item.key}</strong>?
          <Button
            // variant="secondary"
            destructive
            className="mt-16"
            onClick={deleteLocaleItemHandler}
          >
            Delete item
          </Button>
        </Dialog.Content>
      </Dialog.Panel>
    </Dialog>
  ) : null;
};
export const DeleteDialogTrigger = ({ item }: { item: LocaleItem }) => {
  const dispatch = useAppDispatch();
  return (
    <Tooltip content="Delete this item">
      <IconButton
        onClick={() =>
          dispatch(
            setCurrentDialog({
              type: "DELETE",
              opened: true,
              key: item.key,
            })
          )
        }
      >
        <TrashIcon></TrashIcon>
      </IconButton>
    </Tooltip>
  );
};
export default DeleteDialog;
