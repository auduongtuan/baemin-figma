import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, useDialogContext } from "ds";
import { removeLocaleItem, removeLocaleItems } from "../../state/localeSlice";
import { runCommand } from "../../uiHelper";
import { clearSelectedItems } from "../../state/localeAppSlice";
import { findItemById } from "../../../lib";
import { useLocaleItems } from "../../hooks/locale";
import { pluralize } from "@capaj/pluralize";
import { getLibraryName } from "@ui/state/helpers";
import { useMemo } from "react";
const DeleteItemForm = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const items = useLocaleItems();
  const { selectedItems } = useAppSelector((state) => state.localeApp.list);
  const item = useMemo(
    () =>
      currentDialog.key != "__SELECTED_ITEMS"
        ? findItemById(currentDialog.key, items)
        : undefined,
    []
  );
  const deleteSelectedItems = currentDialog.key == "__SELECTED_ITEMS";
  // if (!item && !deleteSelectedItems) return null;
  const { closeDialog } = useDialogContext();
  const dispatch = useAppDispatch();
  const deleteLocaleItemHandler = useCallback(() => {
    if (item) {
      dispatch(removeLocaleItem(item));
      closeDialog();
      runCommand("show_figma_notify", { message: "Item deleted" });
    }
    if (deleteSelectedItems) {
      dispatch(removeLocaleItems(selectedItems));
      dispatch(clearSelectedItems());
      closeDialog();
      runCommand("show_figma_notify", { message: "Items deleted" });
    }
  }, [item, selectedItems, dispatch]);
  return (
    <>
      Are you sure you want to delete{" "}
      {!deleteSelectedItems && item && (
        <>
          <strong>{item.key}</strong> from {getLibraryName(item.fromLibrary)}
        </>
      )}
      {deleteSelectedItems &&
        selectedItems &&
        `${selectedItems.length} ${pluralize("item", selectedItems.length)}`}
      ?
      <Button
        // variant="secondary"
        destructive
        className="mt-16"
        onClick={deleteLocaleItemHandler}
      >
        Delete
      </Button>
    </>
  );
};
export default DeleteItemForm;
