import React from "react";
import { Dialog, IconButton, Tooltip } from "ds";
import { Pencil2Icon } from "@radix-ui/react-icons";
import LocaleItemForm from "../form/LocaleItemForm";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { LocaleItem, findItemByKey } from "../../../lib";
import EditInfo from "../atoms/EditInfo";
import { useLocaleItems } from "../../hooks/locale";
const EditDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  const items = useLocaleItems();
  const item = currentDialog.key
    ? findItemByKey(currentDialog.key, items)
    : undefined;
  return (
    item && (
      <Dialog
        open={currentDialog.type == "EDIT" && currentDialog.opened}
        onOpenChange={(open) => {
          dispatch(setCurrentDialog({ opened: open }));
        }}
      >
        <Dialog.Panel
          title="Edit locale item"
          buttons={<EditInfo localeItem={item} />}
        >
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
    )
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
              opened: true,
              key: item.key,
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
