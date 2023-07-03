import { IconButton, Dialog, Tooltip } from "ds";
import { TrashIcon } from "@radix-ui/react-icons";
import { LocaleItem } from "../../../lib";
import DeleteItemForm from "./DeleteItemForm";
import { useDialog } from "@ui/hooks/locale";
const DeleteDialog = () => {
  const { dialogProps } = useDialog((state) => state.type == "DELETE");
  return (
    <Dialog {...dialogProps}>
      <Dialog.Panel title="Delete locale item">
        <DeleteItemForm />
      </Dialog.Panel>
    </Dialog>
  );
};
export const DeleteDialogTrigger = ({ item }: { item: LocaleItem }) => {
  const { openDialog } = useDialog();
  return (
    <Tooltip content="Delete this item">
      <IconButton
        onClick={() =>
          openDialog({
            type: "DELETE",
            key: [item.fromLibrary, item.key],
          })
        }
      >
        <TrashIcon></TrashIcon>
      </IconButton>
    </Tooltip>
  );
};
export default DeleteDialog;
