import { Dialog } from "ds";
import MoveGroupForm from "./MoveGroupForm";
import { useDialog } from "@ui/hooks/locale";
const MoveGroupDialog = () => {
  const { dialogProps } = useDialog((state) => state.type == "MOVE_GROUP");
  return (
    <Dialog {...dialogProps}>
      <Dialog.Panel title="Move items to another group">
        <MoveGroupForm />
      </Dialog.Panel>
    </Dialog>
  );
};
export default MoveGroupDialog;
