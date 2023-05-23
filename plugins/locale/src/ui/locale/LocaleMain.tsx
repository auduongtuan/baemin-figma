import React, { useState } from "react";
import { useEffect } from "react";
import { useAppDispatch } from "../hooks/redux";
import { setTextsInLocaleSelection, setLocaleData } from "../state/localeSlice";
import AppBar from "./atoms/AppBar";
import LocaleItemList from "./items/LocaleItemList";
import SelectionEditor from "./pages/SelectionEditor";
import NewDialog from "./dialogs/NewDialog";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import io from "figma-helpers/io";
import configsObj from "figma-helpers/configs";
import { useLocaleItems, useLocaleSelection } from "../hooks/locale";
import { Divider, Skeleton } from "ds";
TimeAgo.addDefaultLocale(en);
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
      configsObj.setAll(getConfigsData.configs);
      if (getLocaleData.localeData) {
        dispatch(setLocaleData(getLocaleData.localeData));
      }
      setIsReady(true);
    });
    io.on("change_locale_selection", (data) => {
      dispatch(setTextsInLocaleSelection(data.texts));
    });
  }, []);

  return isReady ? (
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
  ) : (
    <div
      className="flex flex-column"
      css={`
        height: 100vh;
      `}
    >
      <div className="py-10 px-16 flex align-content-between justify-between w-full">
        <Skeleton width="80px" height="20px" />
        <Skeleton width="100px" height="20px" />
      </div>
      <Divider />
      <div className="py-24 p-16 flex flex-column h-full gap-24 flex-grow-1">
        {[...Array(8)].map((_, i) => (
          <Skeleton
            height="20px"
            width={randomIntFromInterval(40, 100) + "%"}
          />
        ))}
      </div>
      <Divider />
      <div className="py-10 px-16 flex align-content-between justify-between w-full flex-grow-0 flex-shrink-0">
        <Skeleton width="40px" height="20px" />
        <Skeleton width="80px" height="20px" />
      </div>
    </div>
  );
};

export default Locale;
