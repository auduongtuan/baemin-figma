import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LocaleText,
  MIXED_VALUE,
  LocaleSelection,
  LocaleItem,
  SavedLocaleData,
  LocaleData,
  isSameItem,
  LocaleItemId,
} from "@lib";
import { cloneDeep, pickBy, unionWith } from "lodash-es";
const initialState: LocaleData = {
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
  localeLibraries: [],
  localeItems: [],
  // matchedItem: null,
  modifiedTime: null,
};
function updateSummaryInLocaleSelection(state: LocaleData) {
  const isSameLang = state.localeSelection.texts.every(
    (text) => text && text.lang == state.localeSelection.texts[0].lang
  );
  const isSameKey = state.localeSelection.texts.every(
    (text) =>
      text &&
      text.formula == state.localeSelection.texts[0].formula &&
      text.key == state.localeSelection.texts[0].key
  );
  state.localeSelection.multiple =
    state.localeSelection.texts.length > 1 ? true : false;
  state.localeSelection.summary.lang = isSameLang
    ? state.localeSelection.texts[0]?.lang
    : MIXED_VALUE;
  state.localeSelection.summary.key = isSameKey
    ? state.localeSelection.texts[0]?.key
    : MIXED_VALUE;
}
export const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocaleData: (state, action: PayloadAction<SavedLocaleData>) => {
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
          text.id != action.payload.id
            ? text
            : { ...text, ...pickBy(action.payload, (v) => v !== undefined) }
        ),
      ];
      updateSummaryInLocaleSelection(state);
    },

    updateTextsInLocaleSelection: (
      state,
      action: PayloadAction<LocaleText[]>
    ) => {
      state.localeSelection.texts = state.localeSelection.texts.map((text) =>
        Object.assign(
          cloneDeep(text),
          pickBy(
            action.payload.find((updatedText) => updatedText.id === text.id),
            (v) => v !== undefined
          )
        )
      );
      updateSummaryInLocaleSelection(state);
    },

    addLocaleItem: (state, action: PayloadAction<LocaleItem>) => {
      state.localeItems = [...state.localeItems, action.payload];
    },
    removeLocaleItem: (state, action: PayloadAction<LocaleItem>) => {
      state.localeItems = [
        ...state.localeItems.filter(
          (localeItem) => !isSameItem(localeItem, action.payload)
        ),
      ];
    },
    removeLocaleItems: (state, action: PayloadAction<LocaleItem[]>) => {
      state.localeItems = [
        ...state.localeItems.filter(
          (localeItem) =>
            !action.payload.map((item) => item.key).includes(localeItem.key)
        ),
      ];
    },
    // gonna need to check again
    updateLocaleItems: (state, action: PayloadAction<LocaleItem[]>) => {
      state.localeItems = unionWith(
        { ...state.localeItems },
        { ...action.payload },
        (a, b) => a.key === b.key
      );
    },
    updateLocaleItem: (
      state,
      action: PayloadAction<LocaleItem & { id: LocaleItemId }>
    ) => {
      const { id, ...updatedItem } = action.payload;
      const [oldFromLibrary, oldKey] = id;
      const newLocalItems = cloneDeep(state.localeItems).map((item) => {
        // only change key or library at a time
        if (
          item.key == oldKey &&
          item.fromLibrary == oldFromLibrary
          // ||
          // (!oldKey &&
          //   item.key == updatedItem.key &&
          //   item.fromLibrary == updatedItem.fromLibrary)
        ) {
          return cloneDeep(updatedItem);
        }
        return item;
      });
      console.log("run update", action.payload.id);
      state.localeItems = newLocalItems;
    },
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
  removeLocaleItems,
  updateTextsInLocaleSelection,
} = localeSlice.actions;
export default localeSlice.reducer;
