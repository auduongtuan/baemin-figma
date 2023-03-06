import React from "react";
import { LANGUAGES, MIXED_VALUE } from "../../constant/locale";
import { TextBox } from "../components/Field";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as ui from "../uiHelper";
import Select from "../components/Select";
import Combobox from "../components/Combobox";

import {
  setSelectedText,
  addLocaleItemsItem,
  updateSelectedText,
  setLocaleData,
} from "../state/localeSlice";

const CurrentTextInfo = () => {
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const selectedText = useAppSelector((state) => state.locale.selectedText);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const dispatch = useAppDispatch();
  const assignKey = () => {
    ui.postData({
      type: "update_text",
      data: { id: selectedText.id, key: matchedItem.key },
    });
  };
  // console.log({ selectedText });

  // console.log("Re-render Current Text Info");
  return (
    <div>
      <h4 className="mt-0">Current text info</h4>
      <div className="flex gap-12">
        {/* <TextBox
          label="Key"
          value={selectedText ? selectedText.key : undefined}
          onChange={(e) => {
            // ui.postData({type: 'update_text', data: {
            //   key: (e.target as HTMLInputElement).value,
            //   id: selectedText.id
            dispatch(
              updateSelectedText({
                key: (e.target as HTMLInputElement).value,
              })
            );
          }}
        ></TextBox> */}
        <Combobox
          label="Key"
          value={selectedText ? selectedText.key : undefined}
          placeholder="Select key"
          menuWidth={"300px"}
          options={(selectedText && selectedText.key === MIXED_VALUE
            ? [
                {
                  id: "mixed",
                  value: MIXED_VALUE,
                  name: "Mixed",
                  disabled: true,
                },
              ]
            : []
          ).concat(
            localeItems.map((item) => {
              return {
                id: item.key,
                value: item.key,
                name: item.key,
                disabled: false,
                content: item.vi,
                altContent: item.en,
              };
            })
          )}
          onChange={(value) => {
            // console.log(value);
            dispatch(
              updateSelectedText({
                key: value,
              })
            );
          }}
          disabled={
            selectedText && selectedText.key != MIXED_VALUE ? false : true
          }
          className="w-half"
        ></Combobox>
        <Select
          label={`Language`}
          placeholder="Select language"
          id="lang"
          value={
            selectedText && selectedText.lang ? selectedText.lang : undefined
          }
          // key={selectedText ? selectedText.id : 'select-lang-no-text'}
          onChange={(value) => {
            ui.postData({ type: "switch_lang", lang: value, localeItems });
          }}
          options={(selectedText && selectedText.lang === MIXED_VALUE
            ? [
                {
                  id: "mixed",
                  value: MIXED_VALUE,
                  name: "Mixed",
                  disabled: true,
                },
              ]
            : []
          ).concat(
            Object.keys(LANGUAGES).map((lang) => {
              return {
                id: lang,
                value: lang,
                name: LANGUAGES[lang],
                disabled: false,
              };
            })
          )}
          className="w-half"
          disabled={selectedText ? false : true}
        ></Select>
      </div>
      {selectedText && !selectedText.multiple && !selectedText.key ? (
        <div>
          {matchedItem && (
            <div className="mb-24">
              <p>
                Assign key <strong>{matchedItem.key}</strong> to this text.
              </p>
              <button
                className="button button--secondary mt-4"
                onClick={assignKey}
              >
                Assign key
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CurrentTextInfo;
