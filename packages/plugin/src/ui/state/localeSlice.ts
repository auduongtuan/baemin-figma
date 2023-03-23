import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  findItemByCharacters,
  findItemByKey,
  findItemByKeyOrCharacters,
  LocaleText,
} from "../../lib/localeData";
import { runCommand } from "../uiHelper";
import { LocaleSelection, LocaleItem, LocaleData } from "../../lib/localeData";
import { cloneDeep } from "lodash";
const initialState: LocaleData = {
  sheetName: null,
  sheetId: null,
  localeSelection: null,
  localeItems: [],
  // matchedItem: null,
  modifiedTime: null,
};
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
      // if (
      //   state.localeSelection &&
      //   state.localeItems &&
      //   !state.localeSelection.multiple
      // ) {
      //   let finder = findItemByKeyOrCharacters(
      //     state.localeSelection.key,
      //     state.localeSelection.characters,
      //     state.localeItems
      //   );
      //   if (finder) {
      //     state.matchedItem = finder;
      //   } else {
      //     state.matchedItem = null;
      //   }
      // } else {
      //   state.matchedItem = null;
      // }
    },
    updateLocaleSelection: (state, action: PayloadAction<LocaleSelection>) => {
      if (state.localeSelection) {
        if (action.payload.key) state.localeSelection.summary.key = action.payload.key;
        if (action.payload.lang) state.localeSelection.summary.lang = action.payload.lang;
      }
      // if (state.localeItems) {
      //   const finder = findItemByKey(state.localeSelection.key, state.localeItems);
      //   if (finder) {
      //     state.matchedItem = finder;
      //   } else {
      //     state.matchedItem = null;
      //   }
      // }
    },
    updateTextInLocaleSelection: (state, action: PayloadAction<LocaleText>) => {
      // single case
      // if(!state.localeSelection.multiple && state.localeSelection.id == action.payload.id) {
      //   state.localeSelection = {...action.payload};
      // }  
      // multiple case
      // if(state.localeSelection.multiple && state.localeSelection.texts) {
        state.localeSelection.texts = state.localeSelection.texts.map(text => text.id != action.payload.id ? text : action.payload);
      // }
    },

    updateTextsInLocaleSelection: (state, action: PayloadAction<LocaleText[]>) => {
      if(state.localeSelection.multiple) state.localeSelection.texts = [...action.payload];
    },
 
    addLocaleItem: (state, action: PayloadAction<LocaleItem>) => {
      state.localeItems = [...state.localeItems, action.payload];
    },
    updateLocaleItems: (state, action: PayloadAction<LocaleItem[]>) => {
      state.localeItems = [...action.payload];
    },
    updateLocaleItem: (state, action: PayloadAction<LocaleItem>) => {
      state.localeItems = cloneDeep(state.localeItems).map((item) =>
        item.key == action.payload.key ? cloneDeep(action.payload) : item
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
  updateLocaleItem,
  updateLocaleSelection,
  setLocaleData,
  updateLocaleItems,
  updateTextInLocaleSelection,
  updateTextsInLocaleSelection
} = localeSlice.actions;
export default localeSlice.reducer;
