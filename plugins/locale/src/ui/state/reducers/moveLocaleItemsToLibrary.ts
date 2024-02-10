import { LocaleData, LocaleItem, isItemInCollection } from "@lib";
import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { addDuplicatedPropToItems } from "@lib";
import { cloneDeep } from "lodash-es";

const moveLocaleItemsToLibraryReducer: CaseReducer<
  LocaleData,
  PayloadAction<{
    itemsToMove: LocaleItem[];
    libraryId: string;
    skipDuplicated: boolean;
  }>
> = (state, action) => {
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
};

export default moveLocaleItemsToLibraryReducer;
