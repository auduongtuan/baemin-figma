import { useMemo } from "react";
import { Dialog, IconButton, Tooltip } from "ds";
import { Pencil2Icon } from "@radix-ui/react-icons";
import LocaleItemForm from "../form/LocaleItemForm";
import {
  closeCurrentDialog,
  setCurrentDialog,
} from "../../state/localeAppSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { LocaleItem, findItemById } from "../../../lib";
import EditInfo from "../atoms/EditInfo";
import { useLocaleItems } from "../../hooks/locale";

const EditDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  const items = useLocaleItems();
  const item = useMemo(
    () =>
      currentDialog.key && currentDialog.key != "__SELECTED_ITEMS"
        ? findItemById(currentDialog.key, items)
        : undefined,
    [currentDialog.key]
  );
  return (
    <Dialog
      open={currentDialog.type == "EDIT"}
      onOpenChange={(open) => {
        if (!open) dispatch(closeCurrentDialog());
      }}
    >
      <Dialog.Panel
        title="Edit locale item"
        buttons={<EditInfo localeItem={item} />}
      >
        {item ? (
          <LocaleItemForm
            key={item.key + "_edit"}
            item={item}
            showTitle={false}
            saveOnChange={false}
          />
        ) : null}
      </Dialog.Panel>
    </Dialog>
  );
};
export const EditDialogTrigger = ({ item }: { item: LocaleItem }) => {
  const dispatch = useAppDispatch();
  return (
    <Tooltip content="Edit locale item">
      <IconButton
        onClick={() =>
          dispatch(
            setCurrentDialog({
              type: "EDIT",
              key: [item.fromLibrary, item.key],
            })
          )
        }
      >
        <Pencil2Icon></Pencil2Icon>
      </IconButton>
    </Tooltip>
  );
};
export default EditDialog;
