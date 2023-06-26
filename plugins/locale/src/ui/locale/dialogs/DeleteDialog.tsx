import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IconButton, Dialog, Tooltip } from "ds";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  closeCurrentDialog,
  setCurrentDialog,
} from "../../state/localeAppSlice";
import { LocaleItem } from "../../../lib";
import DeleteItemForm from "./DeleteItemForm";
const DeleteDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  return (
    <Dialog
      open={currentDialog.type == "DELETE"}
      onOpenChange={(open) => {
        if (!open) dispatch(closeCurrentDialog());
      }}
    >
      <Dialog.Panel title="Delete locale item">
        {currentDialog.type == "DELETE" && <DeleteItemForm />}
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
