import { Dialog } from "ds";
import { useDialog } from "@ui/hooks/locale";
import ImportItemForm from "../import/ImportItemForm";

const ImportDialog = () => {
  const { dialogProps } = useDialog((state) => state.type == "IMPORT");

  return (
    <Dialog {...dialogProps}>
      <Dialog.Panel title="Import items">
        <ImportItemForm />
      </Dialog.Panel>
    </Dialog>
  );
};
export default ImportDialog;
