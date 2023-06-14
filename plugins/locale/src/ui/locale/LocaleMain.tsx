import React, { useState } from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setTextsInLocaleSelection, setLocaleData } from "../state/localeSlice";
import AppBar from "./atoms/AppBar";
import LocaleItemList from "./items/LocaleItemList";
import SelectionEditor from "./pages/SelectionEditor";
import NewDialog from "./dialogs/NewDialog";
import io from "figma-helpers/io";
import { useLocaleSelection } from "../hooks/locale";
import MainSekeleton from "./atoms/MainSkeleton";
import { setConfigs } from "../state/localeAppSlice";
import DeleteDialog from "./dialogs/DeleteDialog";
import EditDialog from "./dialogs/EditDialog";
const Locale = ({}) => {
  const localeSelection = useLocaleSelection();
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    Promise.all([
      io.sendAndReceive("get_configs"),
      io.sendAndReceive("get_locale_data"),
    ]).then((data) => {
      const [getConfigsData, getLocaleData] = data;
      if (getConfigsData.configs) {
        dispatch(setConfigs(getConfigsData.configs));
      }
      if (getLocaleData.localeData) {
        dispatch(setLocaleData(getLocaleData.localeData));
      }
      setIsReady(true);
    });
  }, []);
  useEffect(() => {
    io.on("change_locale_selection", (data) => {
      dispatch(setTextsInLocaleSelection(data.texts));
    });
  }, []);
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  return !isReady ? (
    <MainSekeleton />
  ) : (
    <div className="flex flex-col w-full h-screen bg-white">
      {currentDialog.type == "NEW" && <NewDialog />}
      {currentDialog.type == "DELETE" && <DeleteDialog />}
      {currentDialog.type == "EDIT" && <EditDialog />}
      <section className="flex flex-col w-full overflow-scroll shrink grow">
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

export default Locale;
