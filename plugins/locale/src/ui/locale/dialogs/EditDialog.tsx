import { useMemo } from "react";
import { Dialog, IconButton, Tooltip } from "ds";
import { Pencil2Icon } from "@radix-ui/react-icons";
import LocaleItemForm from "../form/LocaleItemForm";
import { LocaleItem, findItemById } from "../../../lib";
import EditInfo from "../atoms/EditInfo";
import { useDialog, useLocaleItems } from "../../hooks/locale";

const EditDialog = () => {
  const { dialogProps, state } = useDialog((state) => state.type == "EDIT");
  const items = useLocaleItems();
  const item = useMemo(
    () =>
      state.key && state.key != "__SELECTED_ITEMS"
        ? findItemById(state.key, items)
        : undefined,
    [state.key]
  );
  return (
    <Dialog {...dialogProps}>
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
  const { openDialog } = useDialog();
  return (
    <Tooltip content="Edit locale item">
      <IconButton
        onClick={() =>
          openDialog({
            type: "EDIT",
            key: [item.fromLibrary, item.key],
          })
        }
      >
        <Pencil2Icon></Pencil2Icon>
      </IconButton>
    </Tooltip>
  );
};
export default EditDialog;
