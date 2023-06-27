import { Dialog } from "ds";
import LocaleItemForm from "../form/LocaleItemForm";
import { useDialog } from "@ui/hooks/locale";
const NewDialog = () => {
  const { dialogProps } = useDialog((state) => state.type == "NEW");
  return (
    <Dialog {...dialogProps}>
      <Dialog.Panel title="Add new item">
        <LocaleItemForm key="new-item-dialog" showTitle={false} />
      </Dialog.Panel>
    </Dialog>
  );
};
export default NewDialog;
