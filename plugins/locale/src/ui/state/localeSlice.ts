import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LocaleText,
  MIXED_VALUE,
  LocaleSelection,
  LocaleItem,
  LocaleData,
  isSameItem,
  LocaleItemId,
  addDuplicatedPropToItems,
} from "@lib";
import { cloneDeep, pickBy, unionWith } from "lodash-es";
import moveLocaleItemsToLibraryReducer from "./reducers/moveLocaleItemsToLibrary";
import moveLocaleItemsToGroupReducer from "./reducers/moveLocaleItemsToGroup";

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
      state.localeItems = addDuplicatedPropToItems([
        ...state.localeItems,
        action.payload,
      ]);
    },
    removeLocaleItem: (state, action: PayloadAction<LocaleItem>) => {
      state.localeItems = addDuplicatedPropToItems([
        ...state.localeItems.filter(
          (localeItem) => !isSameItem(localeItem, action.payload)
        ),
      ]);
      // state.localeItems = cloneDeep(state.localeItems);
    },
    removeLocaleItems: (state, action: PayloadAction<LocaleItem[]>) => {
      state.localeItems = addDuplicatedPropToItems([
        ...state.localeItems.filter(
          (localeItem) =>
            !action.payload.map((item) => item.key).includes(localeItem.key)
        ),
      ]);
    },
    addLocaleItems: (
      state,
      action: PayloadAction<{
        itemsToAdd: LocaleItem[];
        skipDuplicated: boolean;
      }>
    ) => {
      const { itemsToAdd, skipDuplicated } = action.payload;
      const compareFn = (a: LocaleItem, b: LocaleItem) =>
        a.key == b.key && a.fromLibrary == b.fromLibrary;
      let newLocaleItems: LocaleItem[];
      if (skipDuplicated) {
        newLocaleItems = unionWith(state.localeItems, itemsToAdd, compareFn);
      } else {
        newLocaleItems = unionWith(itemsToAdd, state.localeItems, compareFn);
      }
      state.localeItems = addDuplicatedPropToItems(newLocaleItems);
    },
    moveLocaleItemsToLibrary: moveLocaleItemsToLibraryReducer,
    moveLocaleItemsToGroup: moveLocaleItemsToGroupReducer,
    updateLocaleItem: (
      state,
      action: PayloadAction<LocaleItem & { itemId: LocaleItemId }>
    ) => {
      const { itemId, ...updatedItem } = action.payload;
      const [oldFromLibrary, oldKey] = itemId;
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
      state.localeItems = addDuplicatedPropToItems(newLocalItems);
    },
  },
});

export const {
  setTextsInLocaleSelection,
  addLocaleItem,
  addLocaleItems,
  updateLocaleItem,
  updateLocaleSelection,
  setLocaleData,
  updateTextInLocaleSelection,
  removeLocaleItem,
  removeLocaleItems,
  updateTextsInLocaleSelection,
  moveLocaleItemsToLibrary,
  moveLocaleItemsToGroup,
} = localeSlice.actions;

export default localeSlice.reducer;
