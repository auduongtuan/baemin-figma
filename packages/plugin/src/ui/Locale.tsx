import React, { useCallback } from "react";
import { useEffect } from "react";
import * as ui from "./uiHelper";
import { TextBox } from "./components/Field";
import MatchedItem from "./locale/MatchedItem";
import Button from "./components/Button";
import { removeVietnameseAccent } from "../lib/helpers";
import { snakeCase } from "lodash";
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

  const addNewKey = useCallback(() => {
    const newKey = snakeCase(removeVietnameseAccent(selectedText.characters));
    dispatch(
      addLocaleItemsItem({
        key: newKey,
        en: selectedText.characters,
        vi: selectedText.characters,
      })
    );
    dispatch(updateSelectedText({ key: newKey }));
  }, [selectedText, localeItems]);

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

      {selectedText && !selectedText.multiple && !matchedItem ? (
        <div className="flex w-full gap-8 align-items-end mt-16">
          <TextBox
            label="Add new key to sheet?"
            id="key"
            className="flex-grow-1"
            defaultValue={
              selectedText &&
              (selectedText.key
                ? selectedText.key
                : snakeCase(removeVietnameseAccent(selectedText.characters)))
            }
          />
          <Button 
            // variant="secondary"
            // className="mt-12"
            onClick={addNewKey}
          >
            Add
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Locale;
