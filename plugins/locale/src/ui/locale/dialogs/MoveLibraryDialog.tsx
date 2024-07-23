import {
  closeCurrentDialog,
  setCurrentDialog,
} from "../../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Dialog } from "ds";
import MoveLibraryForm from "./MoveLibraryForm";
import { useDialog } from "@ui/hooks/locale";
const MoveLibraryDialog = () => {
  const { dialogProps } = useDialog((state) => state.type == "MOVE_LIBRARY");
  return (
    <Dialog {...dialogProps}>
      <Dialog.Panel title="Move items to another library">
        <MoveLibraryForm />
      </Dialog.Panel>
    </Dialog>
  );
};
export default MoveLibraryDialog;
