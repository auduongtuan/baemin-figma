import React from "react";
import { useEffect } from "react";
import { runCommand } from "../uiHelper";
import MatchedItem from "./MatchedItem";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setLocaleSelection, setLocaleData } from "../state/localeSlice";

import CurrentTextInfo from "./CurrentTextInfo";
import SheetManagement from "./SheetManagement";
import LocaleItems from "./LocaleItems";
import AddLocaleItem from "./AddLocaleItem";
import MultipleTextEditor from "./MultipleTextEditor";
import LocaleItemForm from "./LocaleItemForm";
import Dialog from "../components/Dialog";
import { setNewDialogOpened } from "../state/localeAppSlice";
const Locale = ({}) => {
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const newDialogOpened = useAppSelector(
    (state) => state.localeApp.newDialogOpened
  );
  const dispatch = useAppDispatch();
  console.log("newDialogOpened", newDialogOpened);
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
      <Dialog open={newDialogOpened} onOpenChange={(open) => dispatch(setNewDialogOpened(open))}>
        <Dialog.Content title="Add new locale item">
          <AddLocaleItem showTitle={false} />
        </Dialog.Content>
      </Dialog>
      <div
        css={`
          flex-shrink: 1;
          flex-grow: 1;
          width: 100%;
          overflow: scroll;
        `}
      >
        {localeSelection && <CurrentTextInfo />}
        {localeSelection && !localeSelection.multiple && (
          <div className="p-16">
            {matchedItem ? (
              <LocaleItemForm item={matchedItem} />
            ) : (
              <AddLocaleItem />
            )}
          </div>
        )}
        {localeSelection && localeSelection.multiple && <MultipleTextEditor />}
        {!localeSelection && <LocaleItems />}
      </div>
      <div
        css={`
          flex-grow: 0;
          flex-shrink: 0;
        `}
      >
        <SheetManagement />
      </div>
    </div>
  );
};

export default Locale;
