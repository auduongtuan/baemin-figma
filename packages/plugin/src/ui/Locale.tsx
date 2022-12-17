import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import * as ui from "./uiHelper";
import { Field, Select } from "./uiComponents";
import axios from "axios";
import MatchedItem from "./locale/MatchedItem";
import { css } from '@emotion/react'


import { removeVietnameseAccent } from "../lib/helpers";
import { snakeCase } from "lodash";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import {
  setSelectedText,
  addLocaleItemsItem,
  updateSelectedText,
  setLocaleData
} from "./state/localeSlice";

import CurrentTextInfo from "./locale/CurrentTextInfo";
import SheetManagement from "./locale/SheetManagement";


const Locale = ({}) => {
  // const [selectedText, setSelectedText] = useState<{ [key: string]: string }>();
  // const [syncedlocaleItems, setSyncedlocaleItems] = useState<any[]>();
  // const [localeItems, setLocaleItems] = useState<any[]>();
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const selectedText = useAppSelector((state) => state.locale.selectedText);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const modifiedTime = useAppSelector((state) => state.locale.modifiedTime);
  const dispatch = useAppDispatch();

  console.log('re-render Locale');

  const addNewKey = useCallback(() => {
    const newKey = snakeCase(removeVietnameseAccent(selectedText.characters));
    dispatch(
      addLocaleItemsItem({
        key: newKey,
        en: selectedText.characters,
        vi: selectedText.characters,
      })
    );
    dispatch(
      updateSelectedText({key: newKey})
    )
  }, [selectedText, localeItems]);

 
  useEffect(() => {
    ui.postData({type: "get_locale_data"});
    window.onmessage = async (event) => {
      if (event.data.pluginMessage.localeData) {
        const localeData = JSON.parse(event.data.pluginMessage.localeData);
        dispatch(setLocaleData(localeData));
      }
      if (event.data.pluginMessage && event.data.pluginMessage.selectedText) {
        dispatch(setSelectedText(event.data.pluginMessage.selectedText));
      } else {
        dispatch(setSelectedText(null));
      }
    };
  }, []);

  return (
    <div className="p-16">
      <footer css={css`
        display: flex;
      `}>
        <button
          className="button button--secondary"
          onClick={() => {
            ui.postData({ type: "switch_lang", lang: "vi", localeItems });
          }}
        >
          To VI
        </button>
        <button
          className="button button--secondary ml-8"
          onClick={() => {
            ui.postData({ type: "switch_lang", lang: "en", localeItems });
          }}
        >
          To EN
        </button>
      </footer>
      <CurrentTextInfo />
      <MatchedItem />
      <SheetManagement />

      {selectedText && !matchedItem ? (
        
        <div className="mt-24">
          <Field
            label="Add new key to sheet?"
            id="key"
            defaultValue={
              selectedText && (selectedText.key ? selectedText.key :
              snakeCase(removeVietnameseAccent(selectedText.characters)))
            }
          />
          <button
            className="button button--secondary mt-12"
            onClick={addNewKey}
          >
            Add new key
          </button>
        </div>
    ) : null}
    </div>
  );
};

export default Locale;
