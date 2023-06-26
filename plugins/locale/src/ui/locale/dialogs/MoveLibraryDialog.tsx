import {
  closeCurrentDialog,
  setCurrentDialog,
} from "../../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Dialog } from "ds";
import MoveLibraryForm from "./MoveLibraryForm";
const MoveLibraryDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  return (
    <Dialog
      open={currentDialog.type == "MOVE_LIBRARY"}
      onOpenChange={(open) => {
        if (!open) dispatch(closeCurrentDialog());
      }}
    >
      <Dialog.Panel title="Move items to other library">
        <MoveLibraryForm />
      </Dialog.Panel>
    </Dialog>
  );
};
export default MoveLibraryDialog;
