import React from "react";
import { useEffect } from "react";
import { runCommand } from "../uiHelper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setTextsInLocaleSelection, setLocaleData } from "../state/localeSlice";
import AppBar from "./atoms/AppBar";
import LocaleItemList from "./items/LocaleItemList";
import SelectionEditor from "./pages/SelectionEditor";
import NewDialog from "./dialogs/NewDialog";
import { isArray } from "lodash-es";
import { Divider } from "ds";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);
import io from "figma-helpers/io";
const timeAgo = new TimeAgo("en-US");
const Locale = ({}) => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    io.send("get_locale_data");
    io.once("get_locale_data", (data) => {
      if (data.localeData) {
        dispatch(setLocaleData(data.localeData));
      }
    });
    io.on("change_locale_selection", (data) => {
      dispatch(setTextsInLocaleSelection(data.texts));
    });
  }, []);
  return (
    <div
      css={`
        background: var(--white);
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;
      `}
    >
      <NewDialog />
      <section
        css={`
          flex-shrink: 1;
          flex-grow: 1;
          width: 100%;
          overflow: scroll;
        `}
      >
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
