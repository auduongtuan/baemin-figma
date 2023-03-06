import React, { useCallback } from "react";
import { useEffect, useState} from "react";
import * as ui from "./uiHelper";
import { TextBox } from "./components/Field";
import MatchedItem from "./locale/MatchedItem";
import Button from "./components/Button";

import { useAppDispatch, useAppSelector } from "./hooks/redux";
import {
  setSelectedText,
  addLocaleItemsItem,
  updateSelectedText,
  setLocaleData,
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



  console.log("re-render Locale");



  useEffect(() => {
    ui.postData({ type: "get_locale_data" });
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
    <div
      css={`
        background: var(--white);
        padding: 16px;
      `}
    >
 
      <CurrentTextInfo />
      <MatchedItem />
      <SheetManagement />
    </div>
  );
};

export default Locale;
