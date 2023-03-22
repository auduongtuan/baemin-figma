import React from "react";
import { useEffect } from "react";
import { runCommand } from "../uiHelper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setLocaleSelection, setLocaleData } from "../state/localeSlice";
import AppBar from "./AppBar";
import LocaleItems from "./LocaleItems";
import HasSelection from "./pages/HasSelection";
import NewDialog from "./NewDialog";
const Locale = ({}) => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    runCommand("get_locale_data");
    window.onmessage = async (event) => {
      if (event.data.pluginMessage && "type" in event.data.pluginMessage) {
        const { type, ...data } = event.data.pluginMessage;
        switch (type) {
          case "load_locale_data":
            if (data.localeData) {
              let localeData = JSON.parse(data.localeData);
              // migrate to new typed system
              if ("items" in localeData) {
                localeData["localeItems"] = localeData.items;
                delete localeData["items"];
              }
              dispatch(setLocaleData(localeData));
            }
            break;
          case "change_locale_selection":
            if (data.localeSelection) {
              dispatch(setLocaleSelection(data.localeSelection));
            }
            if (data.localeSelection == null) {
              dispatch(setLocaleSelection(null));
            }
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
        {localeSelection ? <HasSelection /> : <LocaleItems />}
      </section>
     
      <AppBar />

    </div>
  );
};

export default Locale;
