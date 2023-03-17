import React from "react";
import { useEffect } from "react";
import {runCommand} from "../uiHelper";
import MatchedItem from "./MatchedItem";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setSelectedText, setLocaleData } from "../state/localeSlice";

import CurrentTextInfo from "./CurrentTextInfo";
import SheetManagement from "./SheetManagement";
import LocaleItems from "./LocaleItems";
import AddLocaleItem from "./AddLocaleItem";
import MultipleTextEditor from "./MultipleTextEditor";
import LocaleItemForm from "./LocaleItemForm";
const Locale = ({}) => {
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const selectedText = useAppSelector((state) => state.locale.selectedText);

  const dispatch = useAppDispatch();

  useEffect(() => {
    runCommand("get_locale_data");
    window.onmessage = async (event) => {
      if(event.data.pluginMessage && 'type' in event.data.pluginMessage) {
        const {type, ...data} = event.data.pluginMessage;
        switch(type) {
          case 'load_locale_data':
            if (data.localeData) {
              const localeData = JSON.parse(data.localeData);
              dispatch(setLocaleData(localeData));
            }
            break;
          case 'change_selected_text':
          
            if (data.selectedText) {
              dispatch(setSelectedText(data.selectedText));
            }
            if (data.selectedText == null) {
              dispatch(setSelectedText(null));
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
      <div
        css={`
          flex-shrink: 1;
          flex-grow: 1;
          width: 100%;
          overflow: scroll;
        `}
      >
        {selectedText && <CurrentTextInfo />}
        {selectedText && !selectedText.multiple && (
          <div className="p-16">
            {matchedItem ? <LocaleItemForm item={matchedItem} /> : <AddLocaleItem />}
          </div>
        )}
        {selectedText && selectedText.multiple && (
          <MultipleTextEditor />
        )}
        {!selectedText && <LocaleItems />}
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
