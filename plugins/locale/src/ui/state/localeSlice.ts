import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LocaleText
} from "../../lib/localeData";
import { MIXED_VALUE } from "../../constant/locale";
import { LocaleSelection, LocaleItem, LocaleData } from "../../lib/localeData";
import { cloneDeep } from "lodash";
type LocaleState = LocaleData & {localeSelection: LocaleSelection};
const initialState: LocaleState = {
  sheetName: null,
  sheetId: null,
  localeSelection: {
    texts: [],
    multiple: undefined,
    summary: {
      key: undefined,
      lang: undefined,
    },
  },
  localeItems: [],
  // matchedItem: null,
  modifiedTime: null,
};
function updateSummaryInLocaleSelection(state: LocaleState) {
  const isSameLang = state.localeSelection.texts.every(
    (text) => text && text.lang == state.localeSelection.texts[0].lang
  );
  const isSameKey = state.localeSelection.texts.every(
    (text) => text && text.formula == state.localeSelection.texts[0].formula && text.key == state.localeSelection.texts[0].key
  );
  state.localeSelection.multiple =
    state.localeSelection.texts.length > 1 ? true : false;
  state.localeSelection.summary = {
    lang: isSameLang ? state.localeSelection.texts[0]?.lang : MIXED_VALUE,
    key: isSameKey ? state.localeSelection.texts[0]?.key : MIXED_VALUE,
  };
}
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
      if ("localeItems" in action.payload)
        state.localeItems = action.payload.localeItems;
      if ("localeLibraries" in action.payload)
        state.localeLibraries = action.payload.localeLibraries;
    },
    setTextsInLocaleSelection: (state, action: PayloadAction<LocaleText[]>) => {
      state.localeSelection.texts = action.payload;
      updateSummaryInLocaleSelection(state);
    },
    updateLocaleSelection: (state, action: PayloadAction<LocaleSelection>) => {
      if (state.localeSelection) {
        state.localeSelection.texts = action.payload.texts;
        updateSummaryInLocaleSelection(state);
      }
    },
    updateTextInLocaleSelection: (state, action: PayloadAction<LocaleText>) => {
      state.localeSelection.texts = [
        ...state.localeSelection.texts.map((text) =>
          text.id != action.payload.id ? text : { ...text, ...action.payload }
        ),
      ];
      updateSummaryInLocaleSelection(state);
    },

    updateTextsInLocaleSelection: (
      state,
      action: PayloadAction<LocaleText[]>
    ) => {
      if (action.payload.length == 1) {
        state.localeSelection.texts = state.localeSelection.texts.map((text) =>
          text.id != action.payload[0].id ? text : action.payload[0]
        );
      } else {
        state.localeSelection.texts = state.localeSelection.texts.map((text) =>
          Object.assign(
            text,
            action.payload.find((updatedText) => updatedText.id === text.id)
          )
        );
      }
      updateSummaryInLocaleSelection(state);
    },

    addLocaleItem: (state, action: PayloadAction<LocaleItem>) => {
      state.localeItems = [...state.localeItems, action.payload];
    },
    removeLocaleItem: (state, action: PayloadAction<LocaleItem>) => {
      state.localeItems = [
        ...state.localeItems.filter(
          (localeItem) => localeItem.key != action.payload.key
        ),
      ];
    },
    updateLocaleItems: (state, action: PayloadAction<LocaleItem[]>) => {
      state.localeItems = [...action.payload];
    },
    updateLocaleItem: (
      state,
      action: PayloadAction<LocaleItem & { oldKey?: string }>
    ) => {
      const { oldKey, ...updatedItem } = action.payload;
      state.localeItems = cloneDeep(state.localeItems).map((item) => {
        if (
          (oldKey && item.key == oldKey) ||
          (!oldKey && item.key == updatedItem.key)
        ) {
          return cloneDeep(updatedItem);
        } else {
          return item;
        }
      });
    },
    // setmatchedItem: (state, action) => {
    //   state.matchedItem = action.payload;
    // }
  },
});

export const {
  setTextsInLocaleSelection,
  addLocaleItem,
  updateLocaleItem,
  updateLocaleSelection,
  setLocaleData,
  updateLocaleItems,
  updateTextInLocaleSelection,
  removeLocaleItem,
  updateTextsInLocaleSelection,
} = localeSlice.actions;
export default localeSlice.reducer;
