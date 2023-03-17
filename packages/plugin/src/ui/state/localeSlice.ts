import { createSlice } from "@reduxjs/toolkit";
import {
  findItemByCharacters,
  findItemByKey,
  findItemByKeyOrCharacters,
} from "../../lib/localeData";
import { runCommand } from "../uiHelper";
const initialState = {
  sheetName: null,
  sheetId: null,
  selectedText: null,
  localeItems: [],
  matchedItem: null,
  modifiedTime: null,
};
export const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocaleData: (state, action) => {
      if ("sheetId" in action.payload) state.sheetId = action.payload.sheetId;
      if ("sheetName" in action.payload)
        state.sheetName = action.payload.sheetName;
      if ("modifiedTime" in action.payload)
        state.modifiedTime = action.payload.modifiedTime;
      if ("items" in action.payload) state.localeItems = action.payload.items;
    },
    setSelectedText: (state, action) => {
      state.selectedText = action.payload;
      if (
        state.localeItems &&
        state.selectedText &&
        !state.selectedText.multiple
      ) {
        let finder = findItemByKeyOrCharacters(
          state.selectedText.key,
          state.selectedText.characters,
          state.localeItems
        );
        if (finder) {
          state.matchedItem = finder;
        } else {
          state.matchedItem = null;
        }
      } else {
        state.matchedItem = null;
      }
    },
    updateSelectedText: (state, action) => {
      if (state.selectedText) {
        if (action.payload.key) state.selectedText.key = action.payload.key;
        if (action.payload.lang) state.selectedText.lang = action.payload.lang;
      }
      if (state.localeItems) {
        const finder = findItemByKey(state.selectedText.key, state.localeItems);
        if (finder) {
          state.matchedItem = finder;
        } else {
          state.matchedItem = null;
        }
      }
      runCommand("update_text", {
        id: state.selectedText.id,
        ...action.payload,
        localeItem: state.matchedItem ? { ...state.matchedItem } : undefined,
      });
    },
    addLocaleItemsItem: (state, action) => {
      state.localeItems = [...state.localeItems, action.payload];
    },
    updateLocaleItems: (state, action) => {
      state.localeItems = [...action.payload];
    },
    updateMatchedItem: (state, action) => {
      state.matchedItem = action.payload;
      state.localeItems = [...state.localeItems].map((item) =>
        item.key == action.payload.key ? action.payload : item
      );
    },
    // setmatchedItem: (state, action) => {
    //   state.matchedItem = action.payload;
    // }
  },
});

export const {
  setSelectedText,
  addLocaleItemsItem,
  updateMatchedItem,
  updateSelectedText,
  setLocaleData,
  updateLocaleItems,
} = localeSlice.actions;
export default localeSlice.reducer;
