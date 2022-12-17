import React from 'react';
import {LANGUAGES} from '../../constant/locale';
import { Field, Select } from "../uiComponents";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as ui from "../uiHelper";

import {
  setSelectedText,
  addLocaleItemsItem,
  updateSelectedText,
  setLocaleData
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
  return (
    <div>
    <h3>Current text info</h3>
    <div className="flex gap-12">
    <Field label='Key' value={selectedText ? selectedText.key : ''} onChange={(e) => {
      // ui.postData({type: 'update_text', data: {
      //   key: (e.target as HTMLInputElement).value,
      //   id: selectedText.id
      dispatch(updateSelectedText({
        key: (e.target as HTMLInputElement).value
      }));
    }}></Field>
    {console.log(selectedText)}
    <Select label={`Language`} id='lang' value={selectedText ? selectedText.lang : ''} onChange={value => {
      ui.postData({ type: "switch_lang", lang: value, localeItems });
    }} options={LANGUAGES} className="w-half">
      {/* {Object.keys(LANGUAGES).map(languageKey => <option value={languageKey}>{LANGUAGES[languageKey]}</option>)} */}
    </Select>
    </div>
    {selectedText &&  !selectedText.key ? 
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
      </div> : null}
    </div>
  )
}

export default CurrentTextInfo;