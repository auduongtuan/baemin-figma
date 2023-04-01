import React from "react";
import { useEffect } from "react";
import { runCommand } from "../uiHelper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setTextsInLocaleSelection, setLocaleData } from "../state/localeSlice";
import AppBar from "./atoms/AppBar";
import LocaleItemList from "./items/LocaleItemList";
import SelectionEditor from "./pages/SelectionEditor";
import NewDialog from "./dialogs/NewDialog";
import { isArray } from "lodash";
import { Divider } from "ds";
const Locale = ({}) => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    runCommand("get_locale_data");
    window.onmessage = async (event) => {
      console.log(event.data);
      if (event.data.pluginMessage && "type" in event.data.pluginMessage) {
        const { type, ...data } = event.data.pluginMessage;
        switch (type) {
          case "load_locale_data":
            if (data.localeData) {
              try {
                let localeData = JSON.parse(data.localeData);
                // migrate to new typed system
                if ("items" in localeData) {
                  localeData["localeItems"] = localeData.items;
                  delete localeData["items"];
                }
                if("localeItems" in localeData && isArray(localeData["localeItems"])) {
                  localeData.localeItems.forEach(localeItem => {
                    if('plurals' in localeItem) {
                      localeItem.en = {};
                      localeItem.en["one"] = localeItem.plurals.one.en;
                      localeItem.en["other"] = localeItem.plurals.other.en;
                      localeItem.vi = {};
                      localeItem.vi["one"] = localeItem.plurals.one.vi;
                      localeItem.vi["other"] = localeItem.plurals.other.vi;
                      delete localeItem["plurals"];
                    }
                  });
                }
                console.log(localeData);
                dispatch(setLocaleData(localeData));
              }
              catch(e) {
                console.error(e);
              }
            }
           
            break;
          case "change_locale_selection":
            dispatch(setTextsInLocaleSelection(data.texts));
            break;
        }
      }
    };
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
        {localeSelection && localeSelection.texts.length > 0 ? <SelectionEditor /> : <LocaleItemList />}
      </section>
      <AppBar />

    </div>
  );
};

export default Locale;
