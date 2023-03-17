import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  findItemByCharacters,
  findItemByKey,
  findItemByKeyOrCharacters,
} from "../../lib/localeData";
import { runCommand } from "../uiHelper";
import { LocaleSelection, LocaleItem, LocaleData } from "../../lib/localeData";
const initialState: LocaleData = {
  sheetName: null,
  sheetId: null,
  localeSelection: null,
  localeItems: [],
  matchedItem: null,
  modifiedTime: null,
};
export const localeAppSlice = createSlice({
  name: "localeApp",
  initialState: {
    newDialogOpened: false
  },
  reducers: {
    setNewDialogOpened: (state, action: PayloadAction<boolean>) => {
      state.newDialogOpened = action.payload;
    }
  }
});
export const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocaleData: (state, action: PayloadAction<LocaleData>) => {
      if ("sheetId" in action.payload) state.sheetId = action.payload.sheetId;
      if ("sheetName" in action.payload)
        state.sheetName = action.payload.sheetName;
      if ("modifiedTime" in action.payload)
        state.modifiedTime = action.payload.modifiedTime;
      if ("localeItems" in action.payload) state.localeItems = action.payload.localeItems;
    },
    setLocaleSelection: (state, action: PayloadAction<LocaleSelection>) => {
      state.localeSelection = action.payload;
      if (
        state.localeSelection &&
        state.localeItems &&
        !state.localeSelection.multiple
      ) {
        let finder = findItemByKeyOrCharacters(
          state.localeSelection.key,
          state.localeSelection.characters,
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
    updateLocaleSelection: (state, action: PayloadAction<LocaleSelection>) => {
      if (state.localeSelection) {
        if (action.payload.key) state.localeSelection.key = action.payload.key;
        if (action.payload.lang) state.localeSelection.lang = action.payload.lang;
      }
      if (state.localeItems) {
        const finder = findItemByKey(state.localeSelection.key, state.localeItems);
        if (finder) {
          state.matchedItem = finder;
        } else {
          state.matchedItem = null;
        }
      }
    },
    addLocaleItem: (state, action: PayloadAction<LocaleItem>) => {
      state.localeItems = [...state.localeItems, action.payload];
    },
    updateLocaleItems: (state, action: PayloadAction<LocaleItem[]>) => {
      state.localeItems = [...action.payload];
    },
    updateMatchedItem: (state, action: PayloadAction<LocaleItem>) => {
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
  setLocaleSelection,
  addLocaleItem,
  updateMatchedItem,
  updateLocaleSelection,
  setLocaleData,
  updateLocaleItems,
} = localeSlice.actions;
export const {
  setNewDialogOpened
} = localeAppSlice.actions;
export default localeSlice.reducer;
