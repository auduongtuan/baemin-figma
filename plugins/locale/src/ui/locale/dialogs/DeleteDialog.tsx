import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, IconButton, Dialog, Tooltip } from "ds";
import { removeLocaleItem, removeLocaleItems } from "../../state/localeSlice";
import { TrashIcon } from "@radix-ui/react-icons";
import { runCommand } from "../../uiHelper";
import {
  clearSelectedItems,
  setCurrentDialog,
} from "../../state/localeAppSlice";
import { LocaleItem, findItemByKey, findItemById } from "../../../lib";
import { useLocaleItems } from "../../hooks/locale";
import { pluralize } from "@capaj/pluralize";
import { getLibraryName } from "@ui/state/helpers";
const DeleteDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const items = useLocaleItems();
  const { selectedItems } = useAppSelector((state) => state.localeApp.list);
  const item =
    currentDialog.key != "__SELECTED_ITEMS"
      ? findItemById(currentDialog.key, items)
      : undefined;
  const deleteSelectedItems = currentDialog.key == "__SELECTED_ITEMS";
  const deleteLocaleItemHandler = useCallback(() => {
    if (item) {
      dispatch(removeLocaleItem(item));
      dispatch(setCurrentDialog({ opened: false }));
      runCommand("show_figma_notify", { message: "Item deleted" });
    }
    if (deleteSelectedItems) {
      dispatch(removeLocaleItems(selectedItems));
      dispatch(setCurrentDialog({ opened: false }));
      dispatch(clearSelectedItems);
      runCommand("show_figma_notify", { message: "Items deleted" });
    }
  }, [item, selectedItems]);
  const dispatch = useAppDispatch();
  return (
    <Dialog
      open={currentDialog.opened && currentDialog.type == "DELETE"}
      onOpenChange={(open) => {
        dispatch(
          setCurrentDialog({
            opened: open,
          })
        );
      }}
    >
      <Dialog.Panel title="Delete locale item">
        <Dialog.Content>
          Are you sure you want to delete{" "}
          {!deleteSelectedItems && item && (
            <>
              <strong>{item.key}</strong> from{" "}
              {getLibraryName(item.fromLibrary)}
            </>
          )}
          {deleteSelectedItems &&
            selectedItems &&
            `${selectedItems.length} ${pluralize(
              "item",
              selectedItems.length
            )}`}
          ?
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
  );
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
              key: [item.fromLibrary, item.key],
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
