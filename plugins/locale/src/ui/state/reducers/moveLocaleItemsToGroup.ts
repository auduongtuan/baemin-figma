import { LocaleData, LocaleItem, isItemInCollection } from "@lib";
import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { addDuplicatedPropToItems } from "@lib";
import { cloneDeep } from "lodash-es";
import { getItemKeyInNewGroup } from "@lib";

const moveLocaleItemsToGroupReducer: CaseReducer<
  LocaleData,
  PayloadAction<{
    items: LocaleItem[];
    groupName: string;
  }>
> = (state, action) => {
  const { items, groupName } = action.payload;

  const newLocalItems = cloneDeep(state.localeItems).reduce<LocaleItem[]>(
    (acc, item) => {
      // only change key or library at a time
      if (isItemInCollection(item, items)) {
        acc.push(
          cloneDeep({
            ...item,
            key: getItemKeyInNewGroup(item.key, groupName),
          })
        );
        return acc;
      }
      // not a item in items to move
      acc.push(item);
      return acc;
    },
    []
  );
  state.localeItems = addDuplicatedPropToItems(newLocalItems);
};

export default moveLocaleItemsToGroupReducer;
