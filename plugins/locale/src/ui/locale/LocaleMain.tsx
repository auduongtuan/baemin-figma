import { useAppSelector } from "../hooks/redux";
import AppBar from "./atoms/AppBar";
import LocaleItemList from "./items/LocaleItemList";
import SelectionEditor from "./pages/SelectionEditor";
import NewDialog from "./dialogs/NewDialog";
import { useLocaleSelection } from "../hooks/locale";
import MainSekeleton from "./atoms/MainSkeleton";
import DeleteDialog from "./dialogs/DeleteDialog";
import EditDialog from "./dialogs/EditDialog";
import MoveLibraryDialog from "./dialogs/MoveLibraryDialog";
import ViewDialog from "./dialogs/ViewDialog";
const LocaleMain = ({}) => {
  const isReady = useAppSelector((state) => state.localeApp.isReady);
  const localeSelection = useLocaleSelection();
  return !isReady ? (
    <MainSekeleton />
  ) : (
    <div className="flex flex-col w-full h-screen bg-default">
      <NewDialog />
      <DeleteDialog />
      <EditDialog />
      <MoveLibraryDialog />
      <ViewDialog />
      <section className="flex flex-col w-full overflow-y-scroll shrink grow">
        {localeSelection && localeSelection.texts.length > 0 ? (
          <SelectionEditor />
        ) : (
          <LocaleItemList />
        )}
      </section>
      <AppBar />
    </div>
  );
};

export default LocaleMain;
