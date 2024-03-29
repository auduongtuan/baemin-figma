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
  addDuplicatedPropToItems,
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
    moveLocaleItemsToLibrary: (
      state,
      action: PayloadAction<{
        itemsToMove: LocaleItem[];
        libraryId: string;
        skipDuplicated: boolean;
      }>
    ) => {
      const { itemsToMove, libraryId, skipDuplicated: skip } = action.payload;

      // destination library
      const libraryItems = state.localeItems.filter(
        (item) => item.fromLibrary == libraryId
      );
      // duplicated items
      const selectedItems = itemsToMove.reduce<{
        duplicated: LocaleItem[];
        nonDuplicated: LocaleItem[];
      }>(
        (acc, item) => {
          const found = libraryItems.find(
            (libraryItem) => libraryItem.key == item.key
          );
          if (found) {
            acc.duplicated.push(item);
          } else {
            acc.nonDuplicated.push(item);
          }
          return acc;
        },
        { duplicated: [], nonDuplicated: [] }
      );
      const duplicatedItemKeys = selectedItems.duplicated.map(
        (duplicatedItem) => duplicatedItem.key
      );

      function isItemInCollection(
        itemToCheck: LocaleItem,
        items: LocaleItem[]
      ) {
        const found = items.find(
          (item) =>
            item.key == itemToCheck.key &&
            item.fromLibrary == itemToCheck.fromLibrary
        );
        return found !== undefined && found !== null;
      }
      const newLocalItems = cloneDeep(state.localeItems).reduce<LocaleItem[]>(
        (acc, item) => {
          // only change key or library at a time
          if (isItemInCollection(item, selectedItems.nonDuplicated)) {
            acc.push(cloneDeep({ ...item, fromLibrary: libraryId }));
            return acc;
          }
          if (skip === false) {
            if (isItemInCollection(item, selectedItems.duplicated)) {
              acc.push(cloneDeep({ ...item, fromLibrary: libraryId }));
              return acc;
            }
            // delete original item
            if (
              item.fromLibrary === libraryId &&
              duplicatedItemKeys.includes(item.key)
            ) {
              return acc;
            }
          }
          // not a item in items to move
          acc.push(item);
          return acc;
        },
        []
      );
      state.localeItems = addDuplicatedPropToItems(newLocalItems);
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
} = localeSlice.actions;
export default localeSlice.reducer;
